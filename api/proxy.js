import axios from "axios";
import FormData from "form-data";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ✅ Create a new FormData object
    const formData = new FormData();
    formData.append("data", req.body); // Forward the uploaded file

    // ✅ Send to Hugging Face API
    const response = await axios.post(
      "https://hcn369-handwritten-text-recognition.hf.space/run/predict",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Proxy error:", error.message);
    return res.status(500).json({ error: "Failed to connect to backend" });
  }
}