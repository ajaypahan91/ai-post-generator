import time
import requests
from io import BytesIO
from pathlib import Path
from PIL import Image, ImageOps, ImageFilter
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
HF_TOKEN = os.getenv("HF_API_TOKEN")
if not HF_TOKEN:
    raise ValueError("❌ Hugging Face API token not found in .env")

# Hugging Face API details
API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
HEADERS = {"Authorization": f"Bearer {HF_TOKEN}"}


# Supported formats and styles
VALID_FORMATS = {
    "instagram-post": (1080, 1080),
    "instagram-story": (1080, 1920),
    "twitter-post": (1600, 900),
    "facebook-post": (1200, 630)
}

STYLE_PROMPTS = {
    "realistic": "ultra-detailed, photo-realistic, natural colors, realistic shadows",
    "fantasy": "magical, fantasy art, vivid colors, epic scenery",
    "cyberpunk": "cyberpunk cityscape, neon lights, futuristic, dark aesthetic",
    "anime": "anime character, cel shading, Japanese art style, soft lighting",
    "sketch": "hand-drawn, pencil sketch, black and white, paper texture",
    "oil-painting": "oil painting, thick brush strokes, textured canvas, renaissance style"
}

# Output directory
OUTPUT_DIR = Path("generated")
OUTPUT_DIR.mkdir(exist_ok=True)

def build_prompt(prompt, style, platform_format):
    style_description = STYLE_PROMPTS.get(style.lower(), "photo-realistic")
    return (
        f"{prompt}, {style_description}, centered composition, "
        f"optimized for {platform_format.replace('-', ' ')}"
    )

def generate_image(prompt, platform_format="instagram-post", style="realistic"):
    print(f"🧠 Generating image for {platform_format} in style: {style}")

    if platform_format not in VALID_FORMATS:
        print(f"⚠️ Unknown format '{platform_format}', defaulting to 'instagram-post'.")
        platform_format = "instagram-post"

    size = VALID_FORMATS[platform_format]
    timestamp = int(time.time())
    full_prompt = build_prompt(prompt, style, platform_format)

    try:
        response = requests.post(API_URL, headers=HEADERS, json={"inputs": full_prompt})
        content_type = response.headers.get("content-type", "")

        if response.status_code == 200 and content_type.startswith("image"):
            original_img = Image.open(BytesIO(response.content)).convert("RGB")
            resized_img = ImageOps.contain(original_img, size)
            background = original_img.resize(size).filter(ImageFilter.GaussianBlur(radius=12))

            background.paste(resized_img, (
                (size[0] - resized_img.width) // 2,
                (size[1] - resized_img.height) // 2
            ))

            base_name = f"{platform_format.replace('-', '_')}_{timestamp}_{style}"
            raw_path = OUTPUT_DIR / f"raw_{base_name}.png"
            styled_path = OUTPUT_DIR / f"styled_{base_name}.png"

            original_img.save(raw_path)
            background.save(styled_path)

            print(f"✅ Raw image saved: {raw_path}")
            print(f"✅ Styled image saved: {styled_path}")

            return {
                "raw": str(raw_path).replace("\\", "/"),
                "styled": str(styled_path).replace("\\", "/"),
                "timestamp": timestamp,
                "size": size,
                "style": style,
                "format": platform_format
            }

        else:
            try:
                error_info = response.json()
            except Exception:
                error_info = response.text
            print(f"❌ API Error: {response.status_code} - {error_info}")
            return None

    except Exception as e:
        print(f"❌ Exception during image generation: {e}")
        return None

# Test block
# if __name__ == "__main__":
#     result = generate_image("A futuristic city skyline at dusk", platform_format="twitter-post", style="cyberpunk")
#     if result:
#         print("🎉 Image generation complete!")
