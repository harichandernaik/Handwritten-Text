import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // send form-data from frontend to Hugging Face backend
    const response = await axios.post(
      "https://hcn369-handwritten-text-recognition.hf.space/run/predict",
      req.body,
      {
        headers: {
          "Content-Type": req.headers["content-type"] || "multipart/form-data",
        },
        timeout: 60000,
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Proxy error:",
      error.response?.data || error.message || error
    );
    return res
      .status(500)
      .json({ error: "Failed to connect to backend", detail: error.message });
  }
}

