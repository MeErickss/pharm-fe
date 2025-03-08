import { useState, useEffect } from "react";
import axios from "axios";

export function SelectInput({ table, onChange }) {
  const [options, setOptions] = useState([]);
  const [unidadeOptions, setUnidadeOptions] = useState([]);
  const [medida, setMedida] = useState("");
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
          defaultValue={""}
          onChange={(e) => {
            const selectedValue = e.target.value;
            setMedida(selectedValue);
            setUnidade("");
            onChange({ medida: selectedValue, unidade: "" }); // Passando um objeto válido sempre
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
            onChange({ medida, unidade: selectedUnidade }); // Passa { medida, unidade } sempre
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
