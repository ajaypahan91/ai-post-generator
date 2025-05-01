import os
import time
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

from caption_generator import generate_caption
from image_generator import generate_image
from image_caption import generate_caption_from_image

# Load environment variables
load_dotenv()
BASE_URL = os.getenv("BACKEND_BASE_URL", "http://localhost:5000")

# Initialize Flask app
app = Flask(__name__, static_folder='static')
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# ------------------------ Caption Generation ------------------------
@app.route('/generate-caption', methods=['POST'])
def generate_caption_route():
    try:
        data = request.get_json()
        print("🚀 Received data for caption generation:", data)

        brand = data.get('brandName', '').strip()
        tone = data.get('tone', '').strip()
        keywords = data.get('keywords', '').strip()
        platform = data.get('platform', '').strip()
        prompt = data.get('prompt', '').strip()
        existing_caption = data.get('caption', '').strip()

        # 🧠 If brand, tone, platform, keywords are empty but prompt exists, use prompt
        if not any([brand, tone, keywords, platform]) and prompt:
            print("🛠 Using prompt directly to generate caption...")
            caption = generate_caption(None, None, None, None, existing_caption=prompt)
        else:
            # Normal case
            caption = generate_caption(brand, tone, keywords, platform, existing_caption if existing_caption else None)

        return jsonify({'caption': caption}), 200

    except Exception as e:
        print(f"❌ Error generating caption: {e}")
        return jsonify({'error': str(e)}), 500

# ------------------------ Image Generation ------------------------
@app.route('/generate-image', methods=['POST'])
def generate_image_route():
    try:
        data = request.get_json()
        print("🚀 Received data for image generation:", data)

        prompt = data.get('prompt')
        style = data.get('style', 'realistic')
        platform_format = data.get('platform_format', 'instagram-post')
        print(f"👉 Platform format selected: {platform_format}")

        result = generate_image(prompt, platform_format, style)

        if result:
            # Construct styled image URL
            styled_filename = os.path.basename(result['styled'])
            styled_image_url = f"{BASE_URL}/generated/{styled_filename}"

            return jsonify({
                'success': True,
                'imageUrl': styled_image_url,
                'rawImage': f"{BASE_URL}/{result['raw'].replace(os.sep, '/')}",
                'styledImage': styled_image_url
            }), 200
        else:
            return jsonify({'error': 'Image generation failed.'}), 500

    except Exception as e:
        print(f"❌ Error generating image: {e}")
        return jsonify({'error': str(e)}), 500

# ------------------------ Image Captioning from Upload ------------------------
@app.route('/image-caption', methods=['POST'])
def generate_image_caption():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image uploaded'}), 400

        image_file = request.files['image']
        brand = request.form.get('brandName', 'Unknown Brand')
        style = request.form.get('style', 'realistic')
        platform_format = request.form.get('platform_format', 'instagram-post')

        if image_file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # Save uploaded file securely
        filename = secure_filename(image_file.filename)
        upload_path = os.path.join('generated', f"input_{int(time.time())}_{filename}")
        image_file.save(upload_path)

        # Load the image safely
        input_image = Image.open(upload_path).convert("RGB")

        # Generate caption
        captions = generate_caption_from_image(upload_path, brand)

        return jsonify({
            'originalImageUrl': f"{BASE_URL}/generated/{os.path.basename(upload_path)}",
            'captions': captions
        }), 200

    except Exception as e:
        print(f"❌ Error in image-caption route: {e}")
        return jsonify({'error': 'Image captioning failed'}), 500

# ------------------------ Serve Generated Images ------------------------
@app.route('/generated/<filename>')
def serve_generated(filename):
    return send_from_directory(os.path.join(os.getcwd(), 'generated'), filename)

# ------------------------ Health Check ------------------------
@app.route('/health')
def health_check():
    return "✅ Server is running", 200

# ------------------------ Run Server ------------------------
if __name__ == '__main__':
    app.run(debug=True)
