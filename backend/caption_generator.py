import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("❌ Google API key not found in .env")

# Configure Gemini
genai.configure(api_key=GOOGLE_API_KEY)
MODEL_NAME = "models/gemini-1.5-pro-latest"
model = genai.GenerativeModel(model_name=MODEL_NAME)

def generate_caption(brand, tone, keywords, platform, existing_caption=None):
    """
    Generate multiple social media captions using Gemini AI.

    Args:
        brand (str): Brand or business name
        tone (str): Tone of the caption (e.g., casual, professional)
        keywords (str): Comma-separated keywords
        platform (str): Social media platform
        existing_caption (str, optional): A caption to rephrase

    Returns:
        str: Generated captions with hashtags, separated by newlines
    """
    print(f"🧠 Generating caption for {brand} with tone: {tone}")

    if existing_caption:
        prompt = f"""
        Rephrase the following social media caption for the brand "{brand}" and include hashtags:

        EXISTING CAPTION: {existing_caption}

        INSTRUCTIONS:
        - Rephrase in a {tone} tone
        - Include these keywords and relevant hashtags: {keywords}
        - Optimize for {platform}
        - Provide 3–5 rephrased versions
        - Separate each version with a blank line
        - Return only the rephrased captions
        """
    else:
        prompt = f"""
        Generate 3–5 creative and catchy social media captions for:

        - Brand: {brand}
        - Platform: {platform}
        - Tone: {tone}
        - Keywords: {keywords}

        INSTRUCTIONS:
        - Each caption must include relevant keywords and 1–3 matching hashtags
        - Keep captions short and engaging, optimized for {platform}
        - Avoid unnecessary commentary
        - Separate each caption clearly with a blank line
        - Return only the captions
        """

    try:
        response = model.generate_content(prompt)
        raw_output = response.text.strip()

        # Clean up formatting and ensure proper newlines
        captions = [cap.strip() for cap in raw_output.split('\n') if cap.strip()]
        final_output = "\n\n".join(captions)

        print("✅ Captions generated successfully: ")
        print(final_output)
        return final_output
    except Exception as e:
        print(f"❌ Error generating caption: {e}")
        return "Failed to generate caption. Please try again."

# # Main execution
# if __name__ == "__main__":
#     print("🔍 Generating caption (Gemini Pro)...")

#     # Example input values
#     brand = "TechVerse"
#     tone = "Professional"
#     keywords = "AI, innovation, future"
#     platform = "Instagram"

#     try:
#         caption = generate_caption(brand, tone, keywords, platform)
#         print("\n🎯 Generated Caption:")
#         print(caption)
#     except Exception as e:

#         print("❌ Error:", str(e))
