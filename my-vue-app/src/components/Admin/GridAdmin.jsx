import { Tooltip } from "antd";
import React from "react";
import correcoes from "../dicionario"

export function GridAdmin({
  dados,
  dadosLen,
  tooltipVisible,
  setTooltipVisible,
  onEdit,
  onDelete,
}) {

  const style = {
    "UM":"w-10/12 text-white text-center font-bold rounded-lg bg-cyan-300 px-2",
    "DOIS":"w-10/12 text-white text-center font-bold rounded-lg bg-teal-600 px-2",
    "TRES":"w-10/12 text-white text-center font-bold rounded-lg bg-violet-600 px-2",
    "ATIVO":"w-10/12 text-white text-center font-bold rounded-lg bg-green-400 px-2",
    "BLOQUEADO":"w-10/12 text-white text-center font-bold rounded-lg bg-red-600 px-2",
    "INATIVO":"w-10/12 text-white text-center font-bold rounded-lg bg-yellow-400 px-2",
    "PRODUCAO":"w-10/12 text-white text-center font-bold rounded-lg bg-gray-300 px-2",
    "ARMAZENAMENTO":"w-full text-[0.72rem] text-white text-center font-bold rounded-lg bg-amber-950 px-2",
  }

  const handleMouseEnter = (type, id) => {
    setTooltipVisible((prev) => ({ ...prev, [type]: id }));
  };

  const handleMouseLeave = (type) => {
    setTooltipVisible((prev) => ({ ...prev, [type]: null }));
  };

  return (
    <div className="w-full border border--300 rounded-lg bg-white shadow">
      {dados.length > 0 && (
        <div
          className="grid bg-gray-200 text-base font-semibold text-gray-700 p-3 border-b"
          style={{
            gridTemplateColumns: `minmax(3rem, auto) minmax(28rem, 1fr) ${Array.from({ length: dadosLen - 1 })
              .map(() => 'minmax(4rem, 1fr)')
              .join(' ')}`
          }}
        >
          {Object.keys(dados[0]).map((key) => (
            <div key={key} className="px-2">
              {correcoes[key[0].toUpperCase() + key.substring(1)] || key[0].toUpperCase() + key.substring(1)}
            </div>
          ))}
          <div className="px-2">Ações</div>
        </div>
      )}

      {dados.map((row) => (
        <div
          key={row.id}
          className="grid text-sm p-3 px-2 border-b"
          style={{
            gridTemplateColumns: `minmax(4rem, auto) minmax(28rem, 1fr) ${Array.from({ length: dadosLen - 1 })
              .map(() => 'minmax(4rem, 1fr)')
              .join(' ')}`
          }}
        >
          {Object.values(row).map((value, idx) => (
            <div key={idx} className={value in style ? style[value] : "px-2 w-full"}>
              {value}
            </div>
          ))}

          <div className="flex gap-4 pl-4">
            <Tooltip title={`Editar registro: ${row.id}`} open={tooltipVisible.edit === row.id}>
              <button
                onMouseEnter={() => handleMouseEnter("edit", row.id)}
                onMouseLeave={() => handleMouseLeave("edit")}
                onClick={() => onEdit(row.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" className="fill-blue-600 hover:fill-orange-500">
                    <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                </svg>
              </button>
            </Tooltip>

            <Tooltip title={`Excluir registro: ${row.id}`} open={tooltipVisible.delete === row.id}>
              <button
                onMouseEnter={() => handleMouseEnter("delete", row.id)}
                onMouseLeave={() => handleMouseLeave("delete")}
                onClick={() => onDelete(row.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" className="fill-red-500">
                    <path d="M135.2 17.8l9.8 22H312l9.8-22c5.4-12 17.3-17.8 28.2-17.8h32c13.3 0 24 10.7 24 24V56H16V24c0-13.3 10.7-24 24-24h32c10.9 0 22.8 5.8 28.2 17.8zM32 96h384l-20.4 368c-1.5 26.5-24 48-50.5 48H102.9c-26.5 0-49-21.5-50.5-48L32 96zm80 48v288c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16zm96 0v288c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16zm96 0v288c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16z" />
                </svg>
              </button>
            </Tooltip>
          </div>
        </div>
      ))}
    </div>
  );
}
