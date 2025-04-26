import os
import time
from dotenv import load_dotenv
from PIL import Image
from diffusers import StableDiffusionImg2ImgPipeline

# Load environment variables
load_dotenv()

# Output directory
OUTPUT_DIR = "generated"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Supported output sizes by platform
VALID_FORMATS = {
    "instagram-post": (1080, 1080),
    "instagram-story": (1080, 1920),
    "twitter-post": (1600, 900),
    "facebook-post": (1200, 630)
}

# Prompt templates per style
STYLE_PROMPTS = {
    "realistic": "high quality photo of a product on a minimal background, realistic lighting",
    "fantasy": "a magical product display in a fantasy forest, glowing lights, dreamy atmosphere",
    "cyberpunk": "futuristic product in a neon-lit cyberpunk city, vibrant lighting",
    "oil-painting": "still life oil painting of the product, canvas texture, brush strokes",
    "sketch": "pencil sketch of the product, detailed line art, monochrome"
}

# Load the Stable Diffusion pipeline (once)
model_id = "stabilityai/stable-diffusion-2-1"
pipe = StableDiffusionImg2ImgPipeline.from_pretrained(model_id)
pipe = pipe.to("cpu")  # Use CPU

def resize_to_format(image: Image.Image, platform_format="instagram-post") -> Image.Image:
    """
    Resize an image to the required platform format.
    """
    size = VALID_FORMATS.get(platform_format, VALID_FORMATS["instagram-post"])
    return image.resize(size)

def generate_stylized_image(input_image_path: str, style: str = "realistic", platform_format: str = "instagram-post") -> str:
    """
    Generate a stylized image using Stable Diffusion and save it to the 'generated' directory.
    Returns the path to the styled image.
    """
    print(f"🎨 Applying style '{style}' using Stable Diffusion...")

    # Handle unknown styles
    if style not in STYLE_PROMPTS:
        print(f"⚠️ Unknown style '{style}', defaulting to 'realistic'")
        style = "realistic"

    prompt = STYLE_PROMPTS[style]

    # Load the input image
    init_image = Image.open(input_image_path).convert("RGB")

    # Generate image from prompt and input
    result = pipe(prompt=prompt, init_image=init_image, strength=0.75, guidance_scale=7.5)

    # Get the first generated image
    generated_image = result.images[0]

    # Resize to platform-specific format
    final_image = resize_to_format(generated_image, platform_format)

    # Save to output path
    timestamp = int(time.time())
    filename = f"styled_{style}_{timestamp}.png"
    output_path = os.path.join(OUTPUT_DIR, filename)
    final_image.save(output_path)

    print(f"✅ Styled image saved at: {output_path}")
    return output_path

# # Test function
# def test():
#     input_path = r"C:\Users\Ajay\Desktop\Major Project\backend\styled_instagram_post_1745413736_.png"
#     style = "fantasy"
#     platform_format = "instagram-post"

#     result = generate_stylized_image(input_path, style=style, platform_format=platform_format)
#     if result:
#         print("\n📸 Test Result:")
#         print("Styled Image Path:", result)
#     else:
#         print("❌ Transformation failed.")

# if __name__ == "__main__":
#     test()
