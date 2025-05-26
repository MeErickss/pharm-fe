import { Tooltip } from "antd";
import React from "react";

export function Grid({
  dados,
  dadosLen,
  tooltipVisible,
  setTooltipVisible,
  onEdit,
  onDelete,
}) {
  const handleMouseEnter = (type, id) => {
    setTooltipVisible((prev) => ({ ...prev, [type]: id }));
  };

  const handleMouseLeave = (type) => {
    setTooltipVisible((prev) => ({ ...prev, [type]: null }));
  };


  return (
    <div className="w-full border border-gray-300 rounded-lg bg-white shadow">
      {dados.length > 0 && (
        <div
          className="grid bg-gray-200 text-base font-semibold text-gray-700 p-3 border-b"
          style={{
            gridTemplateColumns: `minmax(3rem, auto) minmax(24.5rem, 1fr) ${Array.from({ length: dadosLen - 2 })
              .map(() => 'minmax(4rem, 1fr)')
              .join(' ')}`
          }}
        >
          {Object.keys(dados[0]).map((key) => (
            <div key={key} className="px-2">
              {key[0].toUpperCase() + key.substring(1)}
            </div>
          ))}
        </div>
      )}

      {dados.map((row) => (
        <div
          key={row.ID}
          className="grid text-sm p-3 px-2 border-b"
          style={{
            gridTemplateColumns: `minmax(3rem, auto) minmax(25rem, 1fr) ${Array.from({ length: dadosLen - 2 })
              .map(() => 'minmax(4rem, 1fr)')
              .join(' ')}`
          }}
        >
          {Object.values(row).map((value, idx) => (
            <div key={idx} className="px-2">
              {idx == 2 ? (value + " editar"): value}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
