import os
import time
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted, GoogleAPIError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("❌ Gemini API key not found in .env")

# Configure Gemini client
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-pro')

def generate_caption(brand=None, tone=None, keywords=None, platform=None, existing_caption=None, retries=3, delay=10):
    """
    Generate or rephrase social media captions using Gemini Pro.
    Retries on quota errors with dynamic backoff using retry_delay.
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

    attempt = 0
    while attempt < retries:
        try:
            response = model.generate_content(prompt.strip())
            result = response.text.strip()
            result = result.replace("<br/>", "\n").replace("<br>", "\n")
            print("✅ Captions generated successfully:")
            print(result)
            return result

        except ResourceExhausted as e:
            # Try to extract retry delay if available
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
            print(f"❌ Unexpected error: {e}")
            return "Failed to generate caption. Please try again."

    return "❌ Quota exceeded. Try again later or upgrade your plan."

# # Example usage
# if __name__ == "__main__":
#     caption = generate_caption(
#         brand="TechVerse",
#         tone="Professional",
#         keywords="AI, innovation, future",
#         platform="Instagram"
#     )
#     print("\n🎯 Final Generated Caption:\n", caption)

# import os
# from openai import OpenAI
# from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()
# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# if not OPENAI_API_KEY:
#     raise ValueError("❌ OpenAI API key not found in .env")

# # Initialize OpenAI client
# client = OpenAI(api_key=OPENAI_API_KEY)

# def generate_caption(brand=None, tone=None, keywords=None, platform=None, existing_caption=None):
#     if existing_caption:
#         prompt = f"""
#         Rephrase the following social media caption for the brand "{brand or 'the brand'}":

#         EXISTING CAPTION: {existing_caption}

#         INSTRUCTIONS:
#         {f"- Rephrase in a {tone} tone." if tone else "- Rephrase naturally."}
#         {f"- Include these keywords and relevant hashtags: {keywords}." if keywords else ""}
#         {f"- Optimize for {platform}." if platform else ""}
#         - Provide 3–5 rephrased variations.
#         - Separate each version with a blank line.
#         - Return only the rephrased captions.
#         """
#     else:
#         prompt = f"""
#         Generate 3–5 catchy and creative social media captions:
#         {f"- Brand: {brand}" if brand else ""}
#         {f"- Platform: {platform}" if platform else ""}
#         {f"- Tone: {tone}" if tone else ""}
#         {f"- Keywords: {keywords}" if keywords else ""}

#         INSTRUCTIONS:
#         - Each caption should include relevant hashtags.
#         - Keep captions concise and engaging.
#         - Separate each caption with a blank line.
#         - Do not add any explanations or extra text.
#         """

#     try:
#         response = client.chat.completions.create(
#             model="gpt-3.5-turbo",
#             messages=[
#                 {"role": "system", "content": "You are a social media marketing assistant."},
#                 {"role": "user", "content": prompt.strip()}
#             ],
#             temperature=0.7,
#             max_tokens=500
#         )
#         result = response.choices[0].message.content.strip()
#         print("✅ Captions generated successfully:")
#         print(result)
#         return result

#     except Exception as e:
#         print(f"❌ Error generating caption: {e}")
#         return "Failed to generate caption. Please try again."
