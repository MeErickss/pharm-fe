// SelectInputGeneric.jsx
import { useState, useEffect } from "react";
import api from "../../api";

export function SelectInputGeneric({
  resource,
  displayField = "descricao",
  valueField = "id",
  parentValue,
  parentResourceKey,
  optionsOverride,
  onChange,
  selected
}) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (optionsOverride) {
      setOptions(optionsOverride);
      return;
    }
    const fetchOptions = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        };
        if (parentValue && parentResourceKey) {
          config.params = { [parentResourceKey]: parentValue };
        }
        const response = await api.get(`/${resource}`, config);
        setOptions(response.data);
      } catch (error) {
        console.error(`Erro ao buscar opções para ${resource}:`, error);
      }
    };
    fetchOptions();
  }, [resource, parentValue, parentResourceKey, optionsOverride]);

  // Render options list, suportando objetos e primitivas
  return (
    <select
      className="w-full border p-1 rounded"
      value={selected ?? ""}
      onChange={(e) => {
        const val = e.target.value;
        let obj;
        const item = options.find((opt, idx) => {
          if (typeof opt === 'object') {
            return String(opt[valueField]) === val;
          }
          return String(opt) === val;
        });
        if (typeof item === 'object') {
          obj = item;
        } else if (item !== undefined) {
          // item is primitive, repassa como string
          obj = item;
        }
        onChange(obj);
      }}
    >
      <option value="">Selecione...</option>
      {options.map((opt, idx) => {
        const val = typeof opt === 'object' ? opt[valueField] : opt;
        const disp = typeof opt === 'object' ? opt[displayField] : opt;
        return (
          <option key={String(val) + "-" + idx} value={String(val)}>
            {disp}
          </option>
        );
      })}
    </select>
  );
}
