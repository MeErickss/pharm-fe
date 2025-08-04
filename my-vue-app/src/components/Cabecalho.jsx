import { useState, useEffect, useRef } from "react";
import api from "../api";
import correcoes from "./dicionario";

export function Cabecalho({
  dados: dadosIniciais,
  nivel,
  setshowModalAdd,
  setDados,
  tabela,
}) {
  const originalData = useRef([]);      
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [baixando, setBaixando] = useState(false);


  useEffect(() => {
    if (
      originalData.current.length === 0 &&    
      (dadosIniciais || []).length > 0        
    ) {
      originalData.current = dadosIniciais;
      setDados(dadosIniciais);
    }
  }, [dadosIniciais, setDados]);

  useEffect(() => {
    const base = originalData.current;
    if (base.length === 0) return;          

    if (query.trim() === "") {
      setDados(base);
      return;
    }

    if (!filter) return;

    const txt = query.toLowerCase();
    const filtered = base.filter(item =>
      String(item[filter]).toLowerCase().includes(txt)
    );
    setDados(filtered);
  }, [query, filter, setDados]);


  ///////////////////////////////////////////////////////////

  const handleDownload = async () => {
    setBaixando(true);
    try {

      const response = await api.post(`/pdf/dto?tabela=${tabela}`, dadosIniciais, {responseType: "blob"}, {params: tabela});

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
    <>
      <article className="flex justify-between pr-4">
        <h2 className="text-lg font-semibold">
          Parâmetros de {tabela[0] + tabela.slice(1).toLowerCase()}
        </h2>
        {nivel === 1 && (
          <button
            onClick={() => setshowModalAdd(true)}
            className="flex items-center bg-blue-600 hover:brightness-90 text-white px-4 py-2 gap-2 rounded"
          >
            Adicionar
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              width="16"
              className="fill-white"
            >
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
            </svg>
          </button>
        )}
      </article>

      <div className="my-4 flex items-center">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="p-2 rounded-l-lg outline-none"
          placeholder="Digite o valor"
        />

        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          disabled={originalData.current.length === 0}
          className={`p-2 mr-1 h-10 w-44 rounded-r-lg outline-none ${
            originalData.current.length === 0
              ? "bg-gray-100 cursor-not-allowed"
              : ""
          }`}
        >
          <option value="">Selecione um filtro</option>
          {originalData.current[0] &&
            Object.keys(originalData.current[0])
              .filter(key => key !== "parametros" && key !== "unidades")
              .map(key => (
                <option key={key} value={key}>
                  {correcoes[key] || key}
                </option>
              ))}
        </select>

        <button
          onClick={handleDownload}
          disabled={baixando}
          className="bg-indigo-600 hover:brightness-90 text-white px-4 py-2 mx-2 rounded"
        >
          Gerar Relatório
        </button>
      </div>
    </>
  );
}
