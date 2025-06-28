import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export function LogAlarme({
  fetchLogAlarme,
  pageAlarme,
  totalPagesAlarme,
  dadosAlarme,
}) {
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [filteredDados, setFilteredDados] = useState(dadosAlarme);
  const [modalParametro, setModalParametro] = useState({ bool: false, item: "" });

  useEffect(() => {
    setFilteredDados(dadosAlarme);
  }, [dadosAlarme]);

  useEffect(() => {
    if (filter === "" || query === "") {
      setFilteredDados(dadosAlarme);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const novoArray = dadosAlarme.filter((item) => {
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
  }, [query, filter, dadosAlarme]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setQuery("");
  };

  const handleQueryChange = (e) => {
    console.log(e.target.value)
    setQuery(e.target.value);
  };

  return (
    <div className="col-span-2 row-span-2 bg-neutral-400 rounded-2xl">
      {modalParametro.bool && (() => {
        const itemWrapper = modalParametro.item;

        const fields = ["valor", "vlMin", "vlMax", "funcao", "grandeza", "unidade"];
        const dadosLen = fields.length;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-[50rem] bg-white rounded-lg shadow overflow-hidden">
              {/* Botão de fechar no topo-direito */}
              <button
                onClick={() => setModalParametro({ bool: false, item: "" })}
                className="absolute top-2 right-2 p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="16" className="fill-red-500 hover:fill-red-900">
                  <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                </svg>
              </button>

              <div>

                <div className="flex flex-col justify-center items-center p-4 text-center gap-2">
                <h1 className= {itemWrapper.descricao == "Ignorado" ? "flex flex-col border-b-2 w-1/2 border-red-500 ml-2 justify-center items-center text-black font-bold text-center" : itemWrapper.descricao == "Reconhecido" ? "flex flex-col border-b-2 w-1/2 border-green-400 ml-2 justify-center items-center text-black font-bold text-center" : "flex flex-col border-b-2 w-1/2 border-blue-400 ml-2 justify-center items-center text-black font-bold text-center"}>
                  Alarme {itemWrapper.descricao}
                </h1>
                  <h1 className="text-xs font-semibold text-black">Data: {itemWrapper.dataHora}</h1>
                  <h1 className="text-xs font-semibold text-black">Status: {itemWrapper.status}</h1>
                  {localStorage.getItem('nivel') === "ADMIN" ? (
                    <NavLink to="/usuarios" className="hover:cursor-pointer border-b-2 border-green-400 text-xs font-semibold text-black">
                      Usuário: {itemWrapper.user.login}
                    </NavLink>
                  ) : (
                    <h1 className="text-xs font-semibold text-black">
                      Usuário: {itemWrapper.user.login}
                    </h1>
                  )}
                </div>
              </div>
                  <div className="flex justify-center items-center">Acontecimento: </div>
            </div>
          </div>
        );
      })()}

      <div className="w-full flex flex-col items-center pt-2">
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchLogAlarme(pageAlarme - 1)}
            disabled={pageAlarme === 0}
            className="bg-blue-500 hover:bg-blue-600 text-white h-8 px-3 py-1 rounded disabled:opacity-50"
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
            className="bg-blue-500 hover:bg-blue-600 text-white h-8 px-3 py-1 rounded disabled:opacity-50"
          >
            Próxima
          </button>

          <div className="my-4 flex flex-nowrap items-center gap-2">
            <select
              name="filter"
              id="filter"
              value={filter}
              onChange={handleFilterChange}
              className={filter == "dataHora" ? "hidden" :"w-4 h-10 bg-neutral-100 rounded-r outline-none absolute ml-[13rem]"}
            >
              <option value="">Selecione um filtro</option>
              {dadosAlarme.length > 0 &&
                Object.keys(dadosAlarme[0]).map((key) => (
                  <option key={key} value={key}>
                    {key.toLocaleUpperCase()}
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
                setFilteredDados(dadosAlarme);
              }}
              className="bg-red-500 hover:brightness-125 text-white mx-6 h-8 px-3 py-1 rounded"
            >
              Limpar Filtro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
