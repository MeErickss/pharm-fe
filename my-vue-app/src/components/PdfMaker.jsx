import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import html2pdf from "html2pdf.js";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

// Aponte para o worker estático em public/libs/pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = "/libs/pdfjs/pdf.worker.js";

export function PdfMakerModal({ setShowModalPdf }) {
  const [texto, setTexto] = useState("");
  const [error, setError] = useState(null);
  const previewRef = useRef();


  // Baixar Markdown
  const baixarMd = () => {
    const blob = new Blob([texto], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "conteudo.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Baixar PDF via html2pdf.js
  const baixarPdf = () => {
    const options = {
      margin:       0.5,
      filename:     "conteudo.pdf",
      image:        { type: "jpeg", quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: "in", format: "a4", orientation: "portrait" }
    };
    html2pdf().set(options).from(previewRef.current).save();
  };

  // Upload e extração de texto de PDF
  const handlePdfUpload = async (e) => {
    setError(null);
    const file = e.target.files[0];
    if (!file) return;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let extracted = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        extracted += strings.join(" ") + "\n\n";
      }
      setTexto(extracted.trim());
    } catch (err) {
      console.error(err);
      setError("Falha ao processar PDF");
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[50rem] max-h-[90vh] overflow-y-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Editor Markdown ↔ PDF</h2>
          <button onClick={()=>setShowModalPdf(false)} className="text-gray-600 hover:text-gray-800">✕</button>
        </div>

        {/* Envio de PDF */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Enviar PDF:</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfUpload}
            className="border rounded p-1"
          />
          {error && <p className="text-red-600 mt-1">{error}</p>}
        </div>

        {/* Editor Markdown */}
        <textarea
          className="w-full h-48 p-2 border rounded mb-4"
          placeholder="Digite ou cole texto Markdown aqui..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />

        {/* Botões de Ações */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={baixarMd}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Baixar .md
          </button>
          <button
            onClick={baixarPdf}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Baixar .pdf
          </button>
        </div>

        {/* Preview Markdown */}
        <div
          ref={previewRef}
          className="prose max-w-none p-4 border rounded bg-gray-50"
        >
          <ReactMarkdown>{texto}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
