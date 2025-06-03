import { useState, useEffect } from "react";

export function LogProducao({
  fetchLogProducao,
  pageProd,
  totalPagesProd,
  dadosProd,
}) {
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [filteredDados, setFilteredDados] = useState(dadosProd);

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
      <div className="w-full flex flex-col items-center p-4">
        {(filteredDados || []).map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-2 grid-rows-2 w-[47rem] h-[3.5rem] bg-gray-200 my-1 p-2 rounded"
            onClick={() => console.log(item)}
          >
            <p className="text-sm font-medium">{item.descricao}</p>
            <p className="text-xs text-gray-600">{item.dataHora}</p>
            <p className="text-xs text-gray-800">Status: {item.status}</p>
            <p className="text-xs text-gray-800">Usuário: {item.user.login}</p>
          </div>
        ))}

        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => fetchLogProducao(pageProd - 1)}
            disabled={pageProd === 0}
            className="bg-blue-500 hover:bg-blue-600 text-white h-12 px-3 py-1 rounded disabled:opacity-50"
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
            className="bg-blue-500 hover:bg-blue-600 text-white h-12 px-3 py-1 rounded disabled:opacity-50"
          >
            Próxima
          </button>

          <div className="my-4 flex">
            <select
              name="filter"
              id="filter"
              value={filter}
              onChange={handleFilterChange}
              className="w-4 h-10 bg-neutral-100 rounded-l-sm outline-none absolute ml-[12rem]"
            >
              <option value="">Selecione um filtro</option>
              {dadosProd.length > 0 &&
                Object.keys(dadosProd[0]).map((key) => (
                  <option key={key} value={key}>
                    {key.toLocaleUpperCase()}
                  </option>
                ))}
            </select>

            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              className="p-2 rounded-r-sm outline-none"
              placeholder="Digite o valor"
              disabled={filter === ""}
            />

            <button
              onClick={() => {
                setFilter("");
                setQuery("");
                setFilteredDados(dadosProd);
              }}
              className="bg-red-500 hover:brightness-125 text-white mx-4 px-4 py-2 rounded"
            >
              Limpar Filtro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
