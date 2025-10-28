import React, { useState } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
      setRecognizedText("");
    }
  };

  // Handle file upload — use proxy on Vercel
  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select an image!");

    const formData = new FormData();
    formData.append("data", selectedFile); // Hugging Face expects 'data' key

    try {
      setLoading(true);

      // ✅ Changed: use Vercel proxy route instead of direct Hugging Face URL
      const response = await axios.post("/api/proxy", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Safety check: response.data may vary depending on backend output
      const result =
        response?.data?.data?.[0] ||
        response?.data?.text ||
        "No text detected. Try a clearer image.";

      setRecognizedText(result);
    } catch (err) {
      console.error("Error:", err);
      alert("Error connecting to backend. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-900 dark:to-gray-800 transition-all duration-700 p-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 px-4 py-2 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-600 transition-all font-medium shadow-md"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Header */}
        <header className="flex flex-col w-full max-w-3xl items-center mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
            ✍️ Handwritten Text Recognition
          </h1>
          <p className="mt-2 text-gray-700 dark:text-gray-300 text-lg">
            Upload your handwritten image and get the text instantly!
          </p>
        </header>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-xl p-6 flex flex-col items-center w-full max-w-lg transition-all duration-500">
          {/* File Input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-6 text-gray-700 dark:text-gray-200"
          />

          {/* Image Preview */}
          {preview && (
            <div className="mb-6 w-full flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg max-h-64 object-contain"
              />
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={loading}
            className="mb-6 w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-blue-500 transition-all shadow-lg disabled:opacity-60"
          >
            {loading ? "Recognizing..." : "Upload & Recognize"}
          </button>

          {/* Recognized Text Output */}
          {recognizedText && (
            <div className="w-full bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-inner border border-gray-300 dark:border-gray-600">
              <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
                Recognized Text:
              </h2>
              <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                {recognizedText}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-1">
            © 2025 | Handwriting-Text Recognition PBL
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Your data is safe with us — no images are stored permanently.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
