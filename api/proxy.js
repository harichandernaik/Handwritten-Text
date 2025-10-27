export default async function handler(req, res) {
  console.log("Proxy received request:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const backendUrl =
      process.env.BACKEND_URL || "https://hcn369-handwritten-text-recognition.hf.space";

    console.log("Proxy forwarding to:", backendUrl + "/run/predict");

    const response = await fetch(`${backendUrl}/run/predict`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: req.body, // send image/formData as is
    });

    const data = await response.text();
    console.log("Response from backend:", data.slice(0, 200));

    res.status(response.status).send(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Error connecting to backend", details: error.message });
  }
}