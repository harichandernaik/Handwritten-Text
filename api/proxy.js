import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 🔹 Log the request body to verify what frontend sends
    console.log("Proxy received request:", req.body);

    // 🔹 Send the request to your Hugging Face Space backend
    const response = await axios.post(
      "https://hcn369-handwritten-text-recognition.hf.space/run/predict", // ✅ Gradio endpoint
      req.body,
      {
        headers: {
          "Content-Type": req.headers["content-type"] || "multipart/form-data",
        },
        timeout: 60000, // optional: 60 sec timeout
      }
    );

    // 🔹 Log backend response
    console.log("Backend responded:", response.data);

    // 🔹 Return Hugging Face response to frontend
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Proxy error:", error.response?.data || error.message || error);
    return res.status(500).json({
      error: "Failed to connect to backend",
      detail: error.message,
    });
  }
}


