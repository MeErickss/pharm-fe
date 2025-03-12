import { useState, useEffect } from "react";
import axios from "axios";

export function SelectInputInsert({ table, onChange }) {
  const [options, setOptions] = useState([]);
  const [unidadeOptions, setUnidadeOptions] = useState([]);
  const [grandeza, setGrandeza] = useState("");
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
      if (table === "GRANDEZA" && grandeza !== "") {
        console.log(`Buscando unidades para grandeza: ${grandeza}`);
        try {
          const response = await axios.get(`http://localhost:5000/api/selectunidade?value=${grandeza}`);
          setUnidadeOptions(response.data);
        } catch (error) {
          console.error(`Erro ao buscar unidades para ${grandeza}:`, error);
        }
      } else {
        setUnidadeOptions([]);
        setUnidade("");
      }
    };
    fetchUnidade();
  }, [grandeza]);

  return (
    <div>
      {table !== "UNIDADE" && (
        <select
          className="w-11/12 border p-1 rounded"
          defaultValue={""}
          onChange={(e) => {
            const selectedValue = e.target.value;
            setGrandeza(selectedValue);
            setUnidade("");
            onChange({ grandeza: selectedValue, unidade: "" }); // Passando um objeto válido sempre
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

      {table === "GRANDEZA" && unidadeOptions.length > 0 && (
        <select
          className="w-11/12 border p-1 rounded mt-2"
          value={unidade}
          onChange={(e) => {
            const selectedUnidade = e.target.value;
            setUnidade(selectedUnidade);
            onChange({ grandeza, unidade: selectedUnidade }); // Passa { grandeza, unidade } sempre
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
