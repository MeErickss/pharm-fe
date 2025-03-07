import { useState, useEffect } from "react";
import axios from "axios";

export function SelectInput({ table, onChange, value }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
        try {
          console.log(table)
          const response = await axios.get(`http://localhost:5000/api/select?table=${table}`);
          setOptions(response.data);
          console.log(options)
        } catch (error) {
          console.error(`Erro ao buscar opções para ${table}:`, error);
        }
    };
    fetchOptions();
  }, []);

  return (
    <select
      className="w-11/12 border p-1 rounded"
      defaultValue={""}
      onChange={(e) => onChange(e, options.length > 0 ? Object.keys(options[0]) : [])}
    >
      <option value="">Selecione</option>
      {options.map((item, index) => (
        <option key={index} value={item.NOME}>
          {item.NOME || item.UNIDADE || item.DESCRICAO}
        </option>
      ))}
    </select>
  );
}
