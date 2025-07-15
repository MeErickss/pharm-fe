import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import html2pdf from "html2pdf.js";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

// Aponte para o worker estático em public/libs/pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = "/libs/pdfjs/pdf.worker.js";

export function PdfMakerModal({ setShowModalPdf, setStep, dados }) {
  const textoGerado = dados
    .map(item => 
  `
  Data: ${new Date()}
  Descrição: ${item.descricao}
  Valor atual: ${item.valor}
  Min: ${item.vlMin} | Max: ${item.vlMax}
  Unidade: ${item.unidade.unidade}
  Clp: ${item.pontoControle == null ? "—" : `Clp: ${item.pontoControle.pontoControle}`}
  `)
  .join("\n\n");

  const [texto, setTexto] = useState(textoGerado || "");
  const [error, setError] = useState(null);
  const previewRef = useRef();

  // Baixar PDF via html2pdf.js
  const baixarPdf = () => {
    const options = {
      margin:       2,
      filename:     "conteudo.pdf",
      image:        { type: "jpeg", quality: 1 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: "in", format: "a4", orientation: "portrait" }
    };
    html2pdf().set(options).from(previewRef.current).save();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[50rem] max-h-[90vh] overflow-y-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Editor Markdown ↔ PDF</h2>
          <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>{setShowModalPdf(false);setStep(1)}} viewBox="0 0 384 512" width="16" className="cursor-pointer text-gray-500 hover:text-gray-800 fill-red-500 hover:fill-red-900">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
          </svg>
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
            onClick={()=> {baixarPdf();setStep(3)}}
            className="px-4 py-2 bg-green-600 text-white rounded hover:brightness-90"
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
