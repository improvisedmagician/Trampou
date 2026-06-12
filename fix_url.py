import os
import glob

# Hardcode the Render API URL everywhere
TARGET_URL = "https://trampou-api.onrender.com"

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacing various injected URL patterns that we had used
    content = content.replace("process.env.NEXT_PUBLIC_API_URL || (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')", f"'{TARGET_URL}'")
    content = content.replace("((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'))", f"'{TARGET_URL}'")
    content = content.replace("process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'", f"'{TARGET_URL}'")
    content = content.replace("process.env.NEXT_PUBLIC_API_URL", f"'{TARGET_URL}'")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for d, _, _ in os.walk('frontend/src'):
    for f in glob.glob(os.path.join(d, '*.js')):
        replace_in_file(f)
        print(f"Fixed {f}")
