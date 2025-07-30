import { useState, useEffect } from "react";
import { ModalParametro } from "./ModalParametro"; // ajuste o caminho conforme sua estrutura
import correcoes from "./dicionario";

export function LogProducao({
  fetchLogProducao,
  pageProd,
  totalPagesProd,
  dadosProd,
}) {
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [filteredDados, setFilteredDados] = useState(dadosProd);
  const [modalParametro, setModalParametro] = useState({ bool: false, item: null });

  useEffect(() => {
    setFilteredDados(dadosProd);
  }, [dadosProd]);

  useEffect(() => {
    if (filter === "" || query === "") {
      setFilteredDados(dadosProd);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const novoArray = dadosProd.filter((item) => {
      if (filter === "user") {
        return item.user.login
          ?.toString()
          .toLowerCase()
          .includes(lowerQuery);
      }
      const value = item[filter];
      return value
        ?.toString()
        .toLowerCase()
        .includes(lowerQuery);
    });

    setFilteredDados(novoArray);
  }, [query, filter, dadosProd]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setQuery("");
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="col-span-2 row-span-2 bg-neutral-400 rounded-2xl">
      {/* Modal */}
      {modalParametro.bool && (
        <ModalParametro
          itemWrapper={modalParametro.item}
          onClose={() => setModalParametro({ bool: false, item: null })}
        />
      )}

      {/* Lista de itens */}
      <div className="w-full flex flex-col items-center scale-95">
        {(filteredDados || []).map((item, index) => (
          <div
            key={index}
            className="grid cursor-pointer grid-cols-2 grid-rows-2 w-11/12 bg-gray-200 my-1 p-2 rounded"
            onClick={() => setModalParametro({ bool: true, item })}
          >
            <p className="text-sm font-medium">{item.descricao}</p>
            <p className="text-xs text-gray-600">{item.dataHora}</p>
            <p className="text-xs text-gray-800">Status: {item.status}</p>
            <p className="text-xs text-gray-800">Usuário: {item.user.login}</p>
          </div>
        ))}

        {/* Paginação */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchLogProducao(pageProd - 1)}
            disabled={pageProd === 0}
            className="bg-blue-500 hover:brightness-90 text-white h-8 px-3 py-1 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm mt-1">
            <strong>
              Página {pageProd + 1} de {totalPagesProd}
            </strong>
          </span>
          <button
            onClick={() => fetchLogProducao(pageProd + 1)}
            disabled={pageProd + 1 >= totalPagesProd}
            className="bg-blue-500 hover:brightness-90 text-white h-8 px-3 py-1 rounded disabled:opacity-50"
          >
            Próxima
          </button>

          {/* Filtros */}
          <div className="my-4 flex flex-nowrap items-center gap-2">
            <select
              name="filter"
              id="filter"
              value={filter}
              onChange={handleFilterChange}
              className={filter === "dataHora" ? "hidden" : "w-4 h-10 bg-neutral-100 rounded-r outline-none absolute ml-[13rem]"}
            >
              <option value="">Selecione um filtro</option>
              {dadosProd.length > 0 &&
                Object.keys(dadosProd[0]).map((key) => (
                  <option key={key} value={key}>
                    {correcoes[key.toLocaleUpperCase()]}
                  </option>
                ))}
            </select>

            <input
              type={filter === "dataHora" ? "date" : "text"}
              value={query}
              onChange={handleQueryChange}
              className="flex-1 w-[12rem] p-2 mx-8 outline-none border border-gray-300 rounded"
              placeholder="Digite o valor"
              disabled={filter === ""}
            />

            <button
              onClick={() => {
                setFilter("");
                setQuery("");
                setFilteredDados(dadosProd);
              }}
              className="bg-red-500 hover:brightness-90 text-white mx-6 h-8 px-3 py-1 rounded"
            >
              Limpar Filtro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
