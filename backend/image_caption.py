import os
import base64
from dotenv import load_dotenv
from PIL import Image
import google.generativeai as genai

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("❌ Google API key not found in .env")

# Configure Gemini
genai.configure(api_key=GOOGLE_API_KEY)
MODEL_NAME = "models/gemini-1.5-pro-latest"  # or "gemini-1.5-flash" if you prefer
model = genai.GenerativeModel(model_name=MODEL_NAME)

def encode_image(image_path):
    """Encode the image to base64."""
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode('utf-8')

def generate_caption_from_image(image_path, brand):
    """
    Generate social media captions from an uploaded image using Gemini AI.
    """
    print("🔍 Generating caption from image (Gemini Pro)...")

    try:
        # Encode the image
        encoded_image = encode_image(image_path)

        # Create a prompt
        prompt = f"""Analyze the uploaded product image carefully and generate 3–5 creative, catchy social media captions for:

- Brand: {brand}
- Platform: Instagram
- Tone: Friendly and professional

Instructions:
- Each caption should include relevant hashtags (1-3 hashtags).
- Keep captions short, engaging, and fun.
- Return only the captions without any extra commentary.
- Separate each caption clearly with a blank line."""

        # Send the image as base64 along with the prompt
        response = model.generate_content(
            contents=[
                {"role": "user", "parts": [
                    {"text": prompt},
                    {"inline_data": {
                        "mime_type": "image/jpeg",  # Use "image/png" if PNG image
                        "data": encoded_image,
                    }}
                ]}
            ]
        )

        raw_output = response.text.strip()
        captions = [cap.strip() for cap in raw_output.split('\n') if cap.strip()]
        final_output = "\n\n".join(captions)

        print("✅ Captions generated successfully:\n")
        print(final_output)
        return final_output

    except Exception as e:
        print(f"❌ Error generating image caption: {e}")
        return "Failed to generate image caption. Please try again."


# # Main execution
# if __name__ == "__main__":
#     image_path = "sample.jpg"  # Replace with the image path you want
#     brand = " "

#     captions = generate_caption_from_image(image_path, brand)

#     print("\n🎯 Generated Captions:")
#     print(captions)
