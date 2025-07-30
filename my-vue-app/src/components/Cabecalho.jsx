import { useState, useEffect } from "react";
import { PdfMakerModal } from "./PdfMaker";
import correcoes from "./dicionario";

export function Cabecalho({ dados: dadosIniciais, nivel, setshowModalAdd, setDados, tabela }) {
  const [dadosOriginais] = useState(dadosIniciais);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [relatorio, setRelatorio] = useState(false);

  useEffect(() => {
    if (query === "") {
      setDados(dadosOriginais);
      return;
    }
    if (!filter) {
      alert("Defina um filtro primeiro");
      return;
    }
    const filtered = dadosOriginais.filter(item => {
      const valor = item[filter];
      return valor
        .toString()
        .toLowerCase()
        .includes(query.toLowerCase());
    });
    setDados(filtered);
  }, [query, filter, dadosOriginais, setDados]);

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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" className="fill-white">
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/>
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
          className="p-2 mr-1 h-10 w-44 rounded-r-lg outline-none"
        >
          <option value="">Selecione um filtro</option>
          {dadosOriginais[0] &&
            Object.keys(dadosOriginais[0])
              .filter(key => key !== "parametros" && key !== "unidades")
              .map(key => (
                <option key={key} value={key}>
                  {correcoes[key]}
                </option>
              ))}
        </select>


        <button
          onClick={() => setRelatorio(prev => !prev)}
          className="bg-indigo-600 hover:brightness-90 text-white px-4 py-2 mx-2 rounded"
        >
          Gerar Relatório
        </button>

        {relatorio && <PdfMakerModal setShowModalPdf={setRelatorio} dados={dadosOriginais.filter(item => {
          return query
            ? item[filter]
                .toString()
                .toLowerCase()
                .includes(query.toLowerCase())
            : true;
        })} />}
      </div>
    </>
  );
}
