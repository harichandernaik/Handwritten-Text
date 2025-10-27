import gradio as gr
import easyocr

reader = easyocr.Reader(['en'])

def predict(image):
    result = reader.readtext(image)
    text = ' '.join([res[1] for res in result])
    return text

interface = gr.Interface(
    fn=predict,
    inputs=gr.Image(type="numpy", label="Upload Image"),
    outputs="text",
    title="Handwritten Text Recognition",
    description="Upload a handwritten image to extract text using EasyOCR."
)

interface.launch()