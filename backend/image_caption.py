import base64
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("❌ Google API key not found in .env")

# Configure Gemini
genai.configure(api_key=GOOGLE_API_KEY)
MODEL_NAME = "models/gemini-1.5-pro-latest"
model = genai.GenerativeModel(model_name=MODEL_NAME)

def generate_caption_from_image_bytes(image_bytes, mime_type, brand):
    """
    Generate captions from image bytes without saving to disk.
    :param image_bytes: Raw image bytes (from upload or other source)
    :param mime_type: MIME type of the image (e.g., "image/jpeg" or "image/png")
    :param brand: Brand name for the caption prompt
    :return: String of generated captions
    """
    try:
        print("🔍 Generating caption from in-memory image (Gemini Pro)...")

        # Encode image to base64 string
        encoded_image = base64.b64encode(image_bytes).decode('utf-8')

        # Prompt for Gemini
        prompt = f"""Analyze the uploaded product image carefully and generate 3–5 creative, catchy social media captions for:

- Brand: {brand}
- Platform: Instagram
- Tone: Friendly and professional

Instructions:
- Each caption should include relevant hashtags (1-3 hashtags).
- Keep captions short, engaging, and fun.
- Return only the captions without any extra commentary.
- Separate each caption clearly with a blank line."""

        # Send to Gemini
        response = model.generate_content(
            contents=[
                {"role": "user", "parts": [
                    {"text": prompt},
                    {"inline_data": {
                        "mime_type": mime_type,
                        "data": encoded_image,
                    }}
                ]}
            ]
        )

        raw_output = response.text.strip()
        captions = [cap.strip() for cap in raw_output.split('\n') if cap.strip()]
        final_output = "\n\n".join(captions)

        print("✅ Captions generated:\n", final_output)
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
