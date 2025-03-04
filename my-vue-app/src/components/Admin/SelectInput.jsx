import { useState, useEffect } from "react";
import axios from "axios";

export function SelectInput({ table, onChange, value }) {
  const [options, setOptions] = useState([]);

  const verify = {
    UNID: "SELECT * FROM unidades",
    STATUS: "SELECT * FROM status",
    MEDID: "SELECT * FROM medidas",
  };

  useEffect(() => {
    const fetchOptions = async () => {
      if (verify[table]) {
        try {
          const response = await axios.get(`http://localhost:5000/api/select?table=${table}`);
          setOptions(response.data);
        } catch (error) {
          console.error(`Erro ao buscar opções para ${table}:`, error);
        }
      }
    };
    fetchOptions();
  }, [table]);

  return (
    <select
      className="w-11/12 border p-1 rounded"
      value={value}
      onChange={(e) => onChange(e, options.length > 0 ? Object.keys(options[0]) : [])}
    >
      <option value="">Selecione</option>
      {options.map((item, index) => (
        <option key={index} value={item.NOME}>
          {item.NOME || item.UNIDADE || item.TIPO_PARAMETRO}
        </option>
      ))}
    </select>
  );
}
