import { useState } from "react";
import api from "../../api";

export function Teste() {
  const [baixando, setBaixando] = useState(false);

  const handleDownload = async () => {
    setBaixando(true);
    try {
      const dto = {
        descricao: "TQ-100",
        valor: 20,
        vlMin: 10,
        vlMax: 30,
        unidade: "HORA",
        pontoControle: "TAG_ENDERECO_0"
      };

      const response = await api.post("/pdf/dto", dto, {
        responseType: "blob"
      });

      // cria o blob e dispara o download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dto.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erro ao baixar PDF:", err);
      alert("Falha ao gerar o PDF.");
    } finally {
      setBaixando(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-neutral-200 min-h-screen">
      <button
        onClick={handleDownload}
        disabled={baixando}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {baixando ? "Gerando PDF..." : "Gerar e Baixar PDF"}
      </button>
    </div>
  );
}
