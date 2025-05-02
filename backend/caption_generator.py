import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("❌ Gemini API key not found in .env")

# Configure Gemini client
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-pro')

def generate_caption(brand=None, tone=None, keywords=None, platform=None, existing_caption=None):
    """
    Generate or rephrase social media captions using Gemini Pro.
    """
    if existing_caption:
        prompt = f"""
        Rephrase the following social media caption for the brand "{brand or 'the brand'}":

        EXISTING CAPTION: {existing_caption}

        INSTRUCTIONS:
        {f"- Rephrase in a {tone} tone." if tone else "- Rephrase naturally."}
        {f"- Include these keywords and relevant hashtags: {keywords}." if keywords else ""}
        {f"- Optimize for {platform}." if platform else ""}
        - Provide 3–5 rephrased variations.
        - Separate each version with a blank line.
        - Return only the rephrased captions.
        """
    else:
        prompt = f"""
        Generate 3–5 catchy and creative social media captions:
        {f"- Brand: {brand}" if brand else ""}
        {f"- Platform: {platform}" if platform else ""}
        {f"- Tone: {tone}" if tone else ""}
        {f"- Keywords: {keywords}" if keywords else ""}

        INSTRUCTIONS:
        - Each caption should include relevant hashtags.
        - Keep captions concise and engaging.
        - Separate each caption with a blank line.
        - Do not add any explanations or extra text.
        """

    try:
        response = model.generate_content(prompt.strip())
        result = response.text.strip()

        result = result.replace("<br/>", "\n").replace("<br>", "\n")  # Replace HTML with newlines

        print("✅ Captions generated successfully:")
        print(result)
        return result

    except Exception as e:
        print(f"❌ Error generating caption: {e}")
        return "Failed to generate caption. Please try again."


# # Example usage
# if __name__ == "__main__":
#     caption = generate_caption(
#         brand="TechVerse",
#         tone="Professional",
#         keywords="AI, innovation, future",
#         platform="Instagram"
#     )
#     print("\n🎯 Final Generated Caption:\n", caption)
