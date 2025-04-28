import base64
import os
import time
from flask import Flask, request, jsonify, send_from_directory
from caption_generator import generate_caption
from image_generator import generate_image
from image_caption import generate_caption_from_image
from PIL import Image
from flask_cors import CORS
from uuid import uuid4
from dotenv import load_dotenv
from werkzeug.utils import secure_filename


load_dotenv()

BASE_URL = os.getenv("BACKEND_BASE_URL", "http://localhost:5000")

app = Flask(__name__, static_folder='static')
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})


# ------------------------ Caption Generation ------------------------
@app.route('/generate-caption', methods=['POST'])
def get_caption():
    try:
        data = request.json

        # Extract data from the request body
        brand = data.get('brandName')
        tone = data.get('tone')
        keywords = data.get('keywords')
        platform = data.get('platform')
        prompt = data.get('prompt', None)  # New prompt field added
        existing_caption = data.get('existingCaption', None)  # Optional

        # If all inputs are blank, use prompt as primary input
        if not any([brand, tone, keywords, platform]) and prompt:
            caption = generate_caption(brand=None, tone=None, keywords=None, platform=None, prompt=prompt, existing_caption=existing_caption)
        else:
            # Generate the caption with available details
            caption = generate_caption(brand, tone, keywords, platform, existing_caption)

        return jsonify({'caption': caption}), 200
    except Exception as e:
        print(f"❌ Error generating caption: {e}")
        return jsonify({'error': str(e)}), 500


# ------------------------ Image Generation ------------------------
@app.route('/generate-image', methods=['POST'])
def get_image():
    try:
        data = request.json
        print("🚀 Received data:", data)
        prompt = data.get('prompt')
        platform_format = data.get('platform_format', 'instagram-post')
        style = data.get('style', 'realistic')
        platform_format = data.get('platform_format', 'instagram-post')
        print("👉 Platform format selected:", platform_format)
        result = generate_image(prompt, platform_format, style)

        if result:
            # Extract only the filename from the styled image path
            styled_filename = os.path.basename(result['styled'])

            # Construct the image URL relative to the /generated route
            styled_image_url = f"{BASE_URL}/generated/{styled_filename}"

            return jsonify({
                'success': True,
                'imageUrl': styled_image_url,
                'rawImage': f"{BASE_URL}/{result['raw'].replace(os.sep, '/')}",
                'styledImage': styled_image_url  # optional if you're using just imageUrl
            }), 200
        else:
            return jsonify({'error': 'Image generation failed.'}), 500

    except Exception as e:
        print(f"❌ Error generating image: {e}")
        return jsonify({'error': str(e)}), 500



# ------------------------ Image Caption ------------------------
@app.route('/image-caption', methods=['POST'])
def image_caption():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image_file = request.files['image']
    brand = request.form.get('brandName', 'Unknown Brand')  # Get brand name from form
    style = request.form.get('style', 'realistic')
    platform_format = request.form.get('platform_format', 'instagram-post')

    if image_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Secure filename
        filename = secure_filename(image_file.filename)
        upload_path = os.path.join('generated', f"input_{int(time.time())}_{filename}")
        image_file.save(upload_path)

        # 🛠️ Open the saved file as PIL image
        input_image = Image.open(upload_path).convert("RGB")  # Convert to RGB in case it's in different format

        # 🔥 Call the function to generate captions for the uploaded image
        captions = generate_caption_from_image(upload_path, brand)
        
        return jsonify({
            'originalImageUrl': f"{BASE_URL}/generated/{os.path.basename(upload_path)}",
            'captions': captions,
            }), 200

    except Exception as e:
        print("❌ Error in transform-image route:", e)
        return jsonify({'error': 'Image captioning failed'}), 500



# ------------------------ Serve Generated Images ------------------------
@app.route('/generated/<filename>')
def serve_generated_image(filename):
    return send_from_directory(os.path.join(os.getcwd(), 'generated'), filename)


# ------------------------ Health Check Route ------------------------
@app.route('/health')
def health():
    return "✅ Server is running", 200


# ------------------------ Run the App ------------------------

if __name__ == '__main__':
    app.run(debug=True)
