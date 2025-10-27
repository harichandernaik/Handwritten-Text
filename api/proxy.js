import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await axios.post(
      "https://hcn369-handwritten-text-recognition.hf.space/api/predict/",
      req.body,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Proxy error:", error?.response?.data || error);
    res.status(500).json({ error: "Failed to connect to backend" });
  }
}
