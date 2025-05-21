import { useState, useEffect } from "react";
import api from "../api"



export function ParametrosArmazenamento() {
  const [error, setError] = useState("");
  const [dados, setDados] = useState([]);
  const [dadosLen, setDadosLen] = useState(0);
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("");
  const [dell, setDell] = useState(0);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState({ edit: null, delete: null });
  const tabela = "ARMAZENAMENTO"

  const handleMouseEnter = (type, id) => {
    setTooltipVisible((prev) => ({ ...prev, [type]: id }));
  };

  const handleMouseLeave = (type) => {
    setTooltipVisible((prev) => ({ ...prev, [type]: null }));
  };

  useEffect(() => {
    api.get("/parametro/funcao", {
      withCredentials: true,
      params: { 
        funcao: tabela 
      }
    })
    .then((response) => {
      setDados(response.data);
    })
    .catch((err) => {
      if (err.response?.status === 401) {
        navigator('/'); 
      }
      console.error("Erro ao buscar dados", err);
      setError("Não foi possível carregar os dados");
    });
  }, [navigator]);

  useEffect(() => {
    if (dados.length > 0) {
      setDadosLen(Object.keys(dados[0]).length);
    }
  }, [dados]);

  useEffect(() => {
    if (!dell) return;
  
    const fetchData = async () => {
      try {
        var option = ""
        var question=confirm(`Deseja excluir o Registro ${dell}`);
        if (question==true)
          {
          option="Opção de exclusão selecionada";
          const response = await api.delete(`/parametro/${dell}`)
    
          if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
          }
    
          console.log("Registro deletado com sucesso");
            setDados((prevDados) => prevDados.filter((item) => item.ID !== dell));
          }
        else
          {
          option="You pressed Cancel!";
          }
      } catch (error) {
        console.error("Erro ao deletar dados:", error);
      }
    };
  
    fetchData();
  }, [dell]);
  
  
  const handleDelete = (id) => {
    setDell(id);
  };
  
  const handleQuery = (event) => {
    setQuery(event);
  
    const filteredData = dados.filter((item) => {
      const value = item[filter];
        return value.toString().toLowerCase().includes(event.toLowerCase());
    });
  
    setDados(filteredData);
  };

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  const toggleEditar = (id) => {
    setEditId(id);
    setShowModalEdit(true);
  };

  // const handleReset = () => {
  //   setQuery("");
  //   setFilter("");
  //   axios
  //     .get(`http://localhost:5000/api/table?table=${tabela}`)
  //     .then((response) => {
  //       console.log("Dados restaurados:", response.data);
  //       setDados(response.data);
  //     })
  //     .catch((err) => {
  //       console.error("Erro ao buscar dados", err);
  //       setError("Não foi possível carregar os dados");
  //     });
  // };
  
  return (
    <div className="w-full h-full bg-gray-100 p-4">
      <article className="flex flex-row justify-between pr-4">
        <h2 className="text-lg"><strong>Parâmetros de Produção</strong></h2>
        <button onClick={()=>setShowModalAdd(true)} className="flex flex-row bg-blue-600 hover:brightness-125 text-white px-4 py-2 gap-2 rounded">
        Adicionar
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" className="fill-white">
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/>
          </svg>
        </button>
      </article>

      <div className="my-4 flex">
      <input
        type="text"
        value={query}
        onChange={(e) => filter == "" ?alert("Defina um Filtro"):handleQuery(e.target.value, filter)} // Pegando o valor do input e passando a key
        className="p-2 rounded-r-sm outline-none"
        placeholder="Digite o valor"
      />

        {dados.length > 0 && (
          <select name="filter" id="filter" value={filter} onChange={handleFilter} className="p-2 mr-1 rounded-l-sm outline-none">
            <option value="">Selecione um filtro</option>
            {Object.keys(dados[0]).map((key) => (
            <option
              key={key}
              value={key}>{key}
            </option>
          ))}
          </select>
        )}
        <button
          //onClick={handleReset}
          className="bg-red-500 hover:brightness-125 text-white mx-4 px-4 py-2 rounded"
        >
          Limpar Filtro
        </button>
      </div>

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
                {key}
              </div>
            ))}
          </div>
        )}

        {dados.map((tabelas) => (
          <div
          key={tabelas.ID}
          className="grid text-sm p-3 px-2 border-b"
          style={{
            gridTemplateColumns: `minmax(3rem, auto) minmax(25rem, 1fr) ${Array.from({ length: dadosLen - 2 })
              .map(() => 'minmax(4rem, 1fr)')
              .join(' ')}`
          }}
          >

            {Object.values(tabelas).map((value, index) => (
              <div key={index} className="px-2">
                {value}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
  }
