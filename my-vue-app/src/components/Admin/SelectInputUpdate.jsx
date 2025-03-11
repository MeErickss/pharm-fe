import { useState, useEffect } from "react";
import axios from "axios";

export function SelectInputUpdate({ table, value, onChange }) {
  const [options, setOptions] = useState([]);
  const [unidadeOptions, setUnidadeOptions] = useState([]);
  const [medida, setMedida] = useState(value || "");
  const [unidade, setUnidade] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/select?table=${table}`);
        setOptions(response.data);
      } catch (error) {
        console.error(`Erro ao buscar opções para ${table}:`, error);
      }
    };
    fetchOptions();
  }, [table]);

  useEffect(() => {
    const fetchUnidade = async () => {
      if (table === "MEDIDA" && medida !== "") {
        console.log(`Buscando unidades para medida: ${medida}`);
        try {
          const response = await axios.get(`http://localhost:5000/api/selectunidade?value=${medida}`);
          setUnidadeOptions(response.data);
        } catch (error) {
          console.error(`Erro ao buscar unidades para ${medida}:`, error);
        }
      } else {
        setUnidadeOptions([]);
        setUnidade("");
      }
    };
    fetchUnidade();
  }, [medida]);

  return (
    <div>
      {table !== "UNIDADE" && (
        <select
          className="w-11/12 border p-1 rounded"
          value={medida}
          onChange={(e) => {
            const selectedValue = e.target.value;
            setMedida(selectedValue);
            setUnidade("");
            onChange(selectedValue); // Agora passando apenas a medida
          }}
        >
          <option value="">Selecione</option>
          {options.map((item, index) => (
            <option key={index} value={item.NOME}>
              {item.NOME || item.DESCRICAO}
            </option>
          ))}
        </select>
      )}

      {table === "MEDIDA" && unidadeOptions.length > 0 && (
        <select
          className="w-11/12 border p-1 rounded mt-2"
          value={unidade}
          onChange={(e) => {
            const selectedUnidade = e.target.value;
            setUnidade(selectedUnidade);
            onChange(selectedUnidade); // Agora passando apenas a unidade
          }}
        >
          <option value="">Selecione a Unidade</option>
          {unidadeOptions.map((item, index) => (
            <option key={index} value={item.UNIDADE}>
              {item.UNIDADE}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}