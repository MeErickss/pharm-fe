import { useState } from "react";


export function Cabecalho({ dados, nivel, setshowModalAdd, setDados, tabela }) {
      const [query, setQuery] = useState("")
      const [filter, setFilter] = useState("");

    const handleQuery = (event) => {
        setQuery(event);
      
        const filteredData = dados.filter((item) => {
          const value = item[filter];
            return value.toString().toLowerCase().includes(event.toLowerCase());
        });
      
        setDados(filteredData);
      };
  
      const handleFilter = (event) => {
        setFilter(event.target.value);
      };


  return (
        <>
            <article className="flex flex-row justify-between pr-4">
              <h2 className="text-lg"><strong>Parâmetros de {tabela || "Produção"}</strong></h2>
            { nivel==1 && <button onClick={()=>setshowModalAdd(true)} className="flex flex-row bg-blue-600 hover:brightness-125 text-white px-4 py-2 gap-2 rounded">
              Adicionar
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" className="fill-white">
                  <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/>
                </svg>
              </button>}
            </article>
            <div className="my-4 flex">
            <input
              type="text"
              value={query}
              onChange={(e) => filter == "" ?alert("Defina um Filtro"):handleQuery(e.target.value, filter)} // Pegando o valor do input e passando a key
              className="p-2 rounded-r-sm outline-none"
              placeholder="Digite o valor"
            />
              {dados.length > 0 && (
                <select name="filter" id="filter" value={filter} onChange={handleFilter} className="p-2 mr-1 rounded-l-sm outline-none">
                  <option value="">Selecione um filtro</option>
                  {Object.keys(dados[0]).map((key) => (
                  <option
                    key={key}
                    value={key}>{key.toLocaleUpperCase()}
                  </option>
                ))}
                </select>
              )}
              <button
                onClick={query != "" && (() => window.location.reload())}
                className="bg-red-500 hover:brightness-125 text-white mx-4 px-4 py-2 rounded"
              >
                Limpar Filtro
              </button>
            </div>
        </>
  );
}
