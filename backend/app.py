from flask import Flask, request, jsonify
from flask_cors import CORS
import easyocr
from PIL import Image
import numpy as np

app = Flask(__name__)
CORS(app)  # allow frontend requests

# Initialize EasyOCR reader (English only)
reader = easyocr.Reader(['en'])

@app.route('/')
def home():
    return "Handwritten Text Recognition Backend is running!"

@app.route('/upload', methods=['POST'])
def upload_image():
    try:
        if 'image' not in request.files:
            return jsonify({'error': "No image part in the request!"}), 400

        file = request.files['image']

        if file.filename == '':
            return jsonify({'error': "No file selected!"}), 400

        # Open image
        img = Image.open(file.stream)
        img_array = np.array(img)

        # Perform OCR using EasyOCR
        result = reader.readtext(img_array)

        # Combine all detected text
        text = " ".join([res[1] for res in result])

        return jsonify({'text': text})

    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("✅ Handwritten Text Recognition Backend is running!")
    app.run(debug=True)
