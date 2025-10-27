// api/proxy.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/microsoft/trocr-base-handwritten", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
      },
      body: req.body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HF API error: ${errorText}`);
    }

    const result = await response.json();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({ error: "Failed to fetch from Hugging Face API" });
  }
}

