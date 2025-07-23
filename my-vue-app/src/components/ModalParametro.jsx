import { NavLink } from "react-router-dom";

export function ModalParametro({ itemWrapper, onClose }) {
  const parametro = itemWrapper.parametro;
  const parametroAnterior = itemWrapper.parametroAnterior;

  if (!parametro) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative w-[70rem] bg-white rounded-lg shadow overflow-hidden p-6 flex flex-col items-center justify-center">
          <button onClick={onClose} className="absolute top-2 right-2 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="16" className="fill-red-500 hover:fill-red-900">
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
            </svg>
          </button>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M4.93 19.07a10 10 0 1114.14 0 10 10 0 01-14.14 0z" />
          </svg>
          <p className="text-lg font-semibold text-gray-700">Dados não disponíveis</p>
        </div>
      </div>
    );
  }

  const fields = ["valor", "vlMin", "vlMax", "funcao", "grandeza", "unidade", "formulaEnum"];

  return (
    <div className="fixed inset-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <button onClick={onClose} className="w-full flex justify-end p-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="16" className="fill-red-500 hover:fill-red-900">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
          </svg>
        </button>

        <div className="p-4 text-center">
          <h1 className="flex flex-col border-gray-200 justify-center items-center text-black font-bold text-center p-6">
            {itemWrapper.descricao}
            <span className="w-full border-b-2 border-blue-400 ml-2">
              Parâmetro: {parametro.descricao}
            </span>
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

        {/* Parametro Atual */}
        <div className="grid bg-gray-200 text-base font-semibold text-gray-700 p-3 border-b"
          style={{
            gridTemplateColumns: `minmax(10rem, auto) ${Array.from({ length: fields.length - 1 }).map(() => "minmax(4rem, 1fr)").join(" ")}`,
          }}
        >
          {fields.map((key) => (
            <div key={key} className="px-2">
              {key === "vlMin" ? "MÍNIMO" : key === "vlMax" ? "MÁXIMO" : key.toUpperCase()}
            </div>
          ))}
        </div>

        <div className="grid text-sm p-3 px-2 border-b"
          style={{
            gridTemplateColumns: `minmax(10rem, auto) ${Array.from({ length: fields.length - 1 }).map(() => "minmax(4rem, 1fr)").join(" ")}`,
          }}
        >
          {fields.map((key, idx) => {
            let value = parametro[key];
            if (key === "grandeza") value = parametro.grandeza?.descricao;
            if (key === "unidade") value = parametro.unidade?.unidade;
            return <div key={idx} className="px-2">{value ?? "—"}</div>;
          })}
        </div>

        {/* Parametro Anterior */}
        {parametroAnterior && (
          <>
            <div className="text-center">
              <span className="text-center p-4 font-bold text-black">Parametro Anterior a Alterações:</span>
            </div>
            <div className="grid bg-gray-200 text-base font-semibold text-gray-700 p-3 border-b"
              style={{
                gridTemplateColumns: `minmax(10rem, auto) ${Array.from({ length: fields.length - 1 }).map(() => "minmax(4rem, 1fr)").join(" ")}`,
              }}
            >
              {fields.map((key) => (
                <div key={key} className="px-2">
                  {key === "vlMin" ? "ANTIGO MÍNIMO" : key === "vlMax" ? "ANTIGO MÁXIMO" : key.toUpperCase()}
                </div>
              ))}
            </div>
            <div className="grid text-sm p-3 px-2 border-b"
              style={{
                gridTemplateColumns: `minmax(10rem, auto) ${Array.from({ length: fields.length - 1 }).map(() => "minmax(4rem, 1fr)").join(" ")}`,
              }}
            >
              {fields.map((key, idx) => {
                let value = parametroAnterior[key.toLowerCase()];
                if (key === "grandeza") value = parametroAnterior.grandezaDesc;
                if (key === "unidade") value = parametroAnterior.unidadeDesc;
                if (key === "formulaEnum") value = parametroAnterior.formulaEnum;
                return <div key={idx} className="px-2">{value ?? "—"}</div>;
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
