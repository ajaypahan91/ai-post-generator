import base64
import os
import time
from dotenv import load_dotenv
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted, GoogleAPIError

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("❌ Google API key not found in .env")

# Configure Gemini
genai.configure(api_key=GOOGLE_API_KEY)
MODEL_NAME = "models/gemini-1.5-pro-latest"
model = genai.GenerativeModel(model_name=MODEL_NAME)

def generate_caption_from_image_bytes(image_bytes, mime_type, brand, retries=3, delay=10):
    """
    Generate 3–5 catchy captions from an in-memory image using Gemini Pro.
    Automatically retries on quota errors.
    """
    print("🔍 Preparing to generate caption from image...")

    encoded_image = base64.b64encode(image_bytes).decode('utf-8')
    prompt = f"""Analyze the uploaded product image carefully and generate 3–5 creative, catchy social media captions for:

- Brand: {brand}
- Platform: Instagram
- Tone: Friendly and professional

Instructions:
- Each caption should include relevant hashtags (1–3).
- Keep captions short, engaging, and fun.
- Return only the captions without extra commentary.
- Separate each caption clearly with a blank line."""

    attempt = 0
    while attempt < retries:
        try:
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

            print("✅ Captions generated successfully:\n", final_output)
            return final_output

        except ResourceExhausted as e:
            try:
                retry_info = getattr(e, 'response', {}).get('retry_delay', {})
                dynamic_delay = int(retry_info.get('seconds', delay))
            except Exception:
                dynamic_delay = delay

            print(f"⚠️ Quota error: {e}. Retrying in {dynamic_delay} seconds... ({attempt + 1}/{retries})")
            time.sleep(dynamic_delay)
            attempt += 1

        except GoogleAPIError as e:
            print(f"❌ Google API error: {e}")
            return "Google API error. Try again later."

        except Exception as e:
            print(f"❌ Unexpected error generating image caption: {e}")
            return "Failed to generate image caption. Please try again."

    return "❌ Quota exceeded. Try again later!"


# # Main execution
# if __name__ == "__main__":
#     image_path = "sample.jpg"  # Replace with the image path you want
#     brand = " "

#     captions = generate_caption_from_image(image_path, brand)

#     print("\n🎯 Generated Captions:")
#     print(captions)
