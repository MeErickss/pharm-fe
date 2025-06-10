import { useState, useEffect } from "react";

export function LogAlarme({
  dadosAlarme,       // array original vindo do pai
  pageAlarme,
  fetchLogAlarme,
  totalPagesAlarme,
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [filteredDados, setFilteredDados] = useState(dadosAlarme);

  // Sempre que os dados originais mudarem, resetamos o filteredDados
  useEffect(() => {
    setFilteredDados(dadosAlarme);
  }, [dadosAlarme]);

  // Sempre que query ou filter mudarem, aplicamos o filtro
  useEffect(() => {
    if (filter === "" || query === "") {
      // se não há filtro selecionado ou nenhuma query, mostra tudo
      setFilteredDados(dadosAlarme);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const novoArray = dadosAlarme.filter((item) => {
      // Se o filtro for "user", usamos item.user.login
      if (filter === "user") {
        return item.user.login
          ?.toString()
          .toLowerCase()
          .includes(lowerQuery);
      }

      // Para os outros campos, acessamos diretamente item[filter]
      const value = item[filter];
      return value
        ?.toString()
        .toLowerCase()
        .includes(lowerQuery);
    });

    setFilteredDados(novoArray);
  }, [query, filter, dadosAlarme]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setQuery(""); // limpa a query quando trocamos o filtro
    console.log(filter)
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="flex flex-wrap items-center justify-center col-span-2 row-span-2 p-4 bg-neutral-400 rounded-2xl">
      <div className="flex flex-col items-center">
        {(filteredDados || []).map((item, index) => (
          <div
            key={index}
            className="grid cursor-pointer grid-cols-2 grid-rows-2 w-[47rem] h-[3.5rem] bg-gray-200 my-1 p-2 rounded"
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
            onClick={() => fetchLogAlarme(pageAlarme - 1)}
            disabled={pageAlarme === 0}
            className="bg-blue-500 hover:bg-blue-600 text-white h-12 px-3 py-1 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm mt-1">
            <strong>
              Página {pageAlarme + 1} de {totalPagesAlarme}
            </strong>
          </span>
          <button
            onClick={() => fetchLogAlarme(pageAlarme + 1)}
            disabled={pageAlarme + 1 >= totalPagesAlarme}
            className="bg-blue-500 hover:bg-blue-600 text-white h-12 px-3 py-1 rounded disabled:opacity-50"
          >
            Próxima
          </button>
          <div className="my-4 flex flex-nowrap items-center gap-2">
            <select
              name="filter"
              id="filter"
              value={filter}
              onChange={handleFilterChange}
              className="w-4 h-10 bg-neutral-100 rounded outline-none absolute ml-auto"
            >
              <option value=""></option>
              {dadosAlarme.length > 0 &&
                Object.keys(dadosAlarme[0]).map((key) => (
                  <option key={key} value={key}>
                    {key.toLocaleUpperCase()}
                  </option>
                ))}
            </select>
            <input
              type={filter == "dataHora" ? "date" : "text"}
              value={query}
              onChange={handleQueryChange}
              className="flex-1 min-w-0 p-2 outline-none border border-gray-300 rounded"
              placeholder="Digite o valor"
              disabled={filter === ""}
            />
            <button
              onClick={() => {
                setFilter("");
                setQuery("");
                setFilteredDados(dadosAlarme);
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
