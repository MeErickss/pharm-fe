import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export function LogProducao({
  fetchLogProducao,
  pageProd,
  totalPagesProd,
  dadosProd,
}) {
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [filteredDados, setFilteredDados] = useState(dadosProd);
  const [modalParametro, setModalParametro] = useState({ bool: false, item: "" });

  console.log(dadosProd)

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
    console.log(e.target.value)
    setQuery(e.target.value);
  };

  return (
    <div className="col-span-2 row-span-2 bg-neutral-400 rounded-2xl">
      {modalParametro.bool && (() => {
        const itemWrapper = modalParametro.item;
        const parametro = itemWrapper.parametro;
        const parametroAnterior = itemWrapper.parametroAnterior;
        // quando faltar parametro, mostramos fallback
        if (!parametro) {
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="relative w-[50rem] bg-white rounded-lg shadow overflow-hidden p-6 flex flex-col items-center justify-center">
                {/* Botão de fechar no topo-direito */}
                <button
                  onClick={() => setModalParametro({ bool: false, item: "" })}
                  className="absolute top-2 right-2 p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="16" className="fill-red-500 hover:fill-red-900">
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                  </svg>
                </button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-yellow-500 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M4.93 19.07a10 10 0 1114.14 0 10 10 0 01-14.14 0z"
                  />
                </svg>
                <p className="text-lg font-semibold text-gray-700">Dados não disponíveis</p>
              </div>
            </div>
          );
        }

        // conteúdo original quando há dados
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

              <div className="grid grid-cols-2 grid-rows-1">
                <h1 className="flex flex-col border-r-2 border-gray-200 justify-center items-center text-black font-bold text-center p-6">
                  {itemWrapper.descricao}
                  <span className="w-full border-b-2 border-blue-400 ml-2">
                    Parâmetro: {parametro.descricao}
                  </span>
                </h1>

                <div className="p-4 text-center">
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

              <div
                className="grid bg-gray-200 text-base font-semibold text-gray-700 p-3 border-b"
                style={{
                  gridTemplateColumns: `minmax(10rem, auto) ${Array.from({ length: dadosLen - 1 })
                    .map(() => "minmax(4rem, 1fr)")
                    .join(" ")}`,
                }}
              >
                {fields.map((key) => (
                  <div key={key} className="px-2">
                    {key === "vlMin" ? "MÍNIMO" : key === "vlMax" ? "MÁXIMO" : key.toUpperCase()}
                  </div>
                ))}
              </div>

              <div
                className="grid text-sm p-3 px-2 border-b"
                style={{
                  gridTemplateColumns: `minmax(10rem, auto) ${Array.from({ length: dadosLen - 1 })
                    .map(() => "minmax(4rem, 1fr)")
                    .join(" ")}`,
                }}
              >
                {fields.map((key, idx) => {
                  let value = parametro[key];
                  if (key === "grandeza") value = parametro.grandeza?.descricao;
                  if (key === "unidade") value = parametro.unidade?.unidade;
                  return (
                    <div key={idx} className="px-2">
                      {value ?? "—"}
                    </div>
                  );
                })}
              </div>

              {/* Se existir parametroAnterior, renderiza outra grid */}
              
              {parametroAnterior && (
                <div className="w-full h-full">
                <div className="text-center"><span className="text-center p-4 font-bold text-black">Parametro Anterior a Alterações: </span></div>
                  <div
                    className="grid bg-gray-200 text-base font-semibold text-gray-700 p-3 border-b"
                    style={{
                      gridTemplateColumns: `minmax(10rem, auto) ${Array.from({ length: dadosLen - 1 })
                        .map(() => "minmax(4rem, 1fr)")
                        .join(" ")}`,
                    }}
                  >
                    {fields.map((key) => (
                      <div key={key} className="px-2">
                        {key === "vlMin" ? "ANTIGO MÍNIMO" : key === "vlMax" ? "ANTIGO MÁXIMO" : key.toUpperCase()}
                      </div>
                    ))}
                  </div>

                  <div
                    className="grid text-sm p-3 px-2 border-b"
                    style={{
                      gridTemplateColumns: `minmax(10rem, auto) ${Array.from({ length: dadosLen - 1 })
                        .map(() => "minmax(4rem, 1fr)")
                        .join(" ")}`,
                    }}
                  >
                    {fields.map((key, idx) => {
                      let value = parametroAnterior[key.toLowerCase()];
                      console.log(key)
                      if (key === "grandeza") {value = parametroAnterior.grandezaDesc; console.log(key);console.log("a")}
                      if (key === "unidade") value = parametroAnterior.unidadeDesc;
                      return (
                        <div key={idx} className="px-2">
                          {value ?? "—"}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      <div className="w-full flex flex-col items-center p-4">
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

          <div className="my-4 flex flex-nowrap items-center gap-2">
            <select
              name="filter"
              id="filter"
              value={filter}
              onChange={handleFilterChange}
              className={filter == "dataHora" ? "hidden" :"w-4 h-10 bg-neutral-100 rounded-l-sm outline-none absolute ml-[12rem]"}
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
              type={filter === "dataHora" ? "date" : "text"}
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
