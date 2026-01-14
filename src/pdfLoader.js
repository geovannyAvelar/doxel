"use client";

import { useState } from "react";

export default function PdfLoader({ onPdfLoad }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (! file) return;

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file");
      return;
    }

    const url = URL.createObjectURL(file);
    setPdfUrl(url);
    setFileName(file.name);

    if (onPdfLoad) {
      onPdfLoad(url);
    }
  };

  const handleClear = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
    setFileName("");
    if (onPdfLoad) {
      onPdfLoad(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-2 cursor-pointer px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
        <span>📄 Load PDF</span>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      {fileName && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{fileName}</span>
          <button
            onClick={handleClear}
            className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}