export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method is allowed" });
  }

  try {
    const response = await fetch("https://hcn369-handwritten-text-recognition.hf.space/api/predict/", {
      method: "POST",
      headers: {
        // Hugging Face Space expects multipart/form-data — we'll forward directly
      },
      body: req, // forward the image data stream directly
    });

    const result = await response.json();
    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Proxy error:", error);
    return res.status(500).json({ error: "Failed to connect to Hugging Face Space backend." });
  }
}

