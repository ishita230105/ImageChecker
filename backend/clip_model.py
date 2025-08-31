import clip
import torch
from PIL import Image
import sys
import json

# Choose device
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load CLIP model
model, preprocess = clip.load("ViT-B/32", device=device)

def get_clip_predictions(image_path):
    # Preprocess the image
    image = preprocess(Image.open(image_path)).unsqueeze(0).to(device)

    # Define candidate text labels (extend this list as needed)
    text = [
        "sneakers", "shoes", "shirt", "jeans", "t-shirt",
        "jacket", "computer", "phone", "bag", "product"
    ]
    text_inputs = clip.tokenize(text).to(device)

    with torch.no_grad():
        image_features = model.encode_image(image)
        text_features = model.encode_text(text_inputs)

    # Normalize
    image_features /= image_features.norm(dim=-1, keepdim=True)
    text_features /= text_features.norm(dim=-1, keepdim=True)

    # Similarity
    similarity = (100.0 * image_features @ text_features.T).softmax(dim=-1)
    values, indices = similarity[0].topk(3)  # Top 3

    # Collect results
    predictions = [
        {"label": text[idx], "score": float(values[i].item())}
        for i, idx in enumerate(indices)
    ]

    return predictions


# ✅ Run when script is called from Node.js
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps([]))   # return empty list if no path
        sys.exit(1)

    image_path = sys.argv[1]
    try:
        results = get_clip_predictions(image_path)
        print(json.dumps(results))   # ✅ only one JSON print
        sys.stdout.flush()
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
