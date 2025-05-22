import { useState, useEffect } from "react";
import axios from "axios";
import { Tooltip } from "antd"
import { RegisterData } from "../../components/Admin/RegisterData"; // Importando o novo componente
import { UpdateData } from "../../components/Admin/UpdateData"; // Importando o novo componente



export function AdminFunctionRegister() {
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
  const tabela = "funcoes"

  const handleMouseEnter = (type, id) => {
    setTooltipVisible((prev) => ({ ...prev, [type]: id }));
  };

  const handleMouseLeave = (type) => {
    setTooltipVisible((prev) => ({ ...prev, [type]: null }));
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/table?table=${tabela}`)
      .then((response) => {
        console.log("Dados recebidos aa:", response.data);
        setDados(response.data);
        console.log(dados)
      })
      .catch((err) => {
        console.error("Erro ao buscar dados", err);
        setError("Não foi possível carregar os dados");
      });
  }, []);

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
          const response = await fetch(
            `http://localhost:5000/api/delete?table=${tabela}&value=${dell}`,
            { method: "DELETE" }
          );
    
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

  const handleReset = () => {
    setQuery("");
    setFilter("");
    axios
      .get(`http://localhost:5000/api/table?table=${tabela}`)
      .then((response) => {
        console.log("Dados restaurados:", response.data);
        setDados(response.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados", err);
        setError("Não foi possível carregar os dados");
      });
  };
  
  return (
    <div className="w-full h-full bg-gray-100 p-4">
      <article className="flex flex-row justify-between pr-4">
        <h2 className="text-lg"><strong>Registro de Funções</strong></h2>
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
          onClick={handleReset}
          className="bg-red-500 hover:brightness-125 text-white mx-4 px-4 py-2 rounded"
        >
          Limpar Filtro
        </button>
      </div>

      {showModalAdd && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[50rem] h-auto bg-white p-6 rounded-lg shadow-lg">
            <RegisterData dados={dados} param={false} table={"funcoes"} closeModal={() => setShowModalAdd(false)} /> {/* Componente JSX dentro do modal */}
          </div>
        </div>
      )}

      {showModalEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[50rem] h-auto bg-white p-6 rounded-lg shadow-lg">
            <UpdateData id={editId} param={false} table={"funcoes"} dados={dados} closeModal={() => setShowModalEdit(false)} />
          </div>
        </div>
      )}

      <div className="w-full border border-gray-300 rounded-lg bg-white shadow">
        {dados.length > 0 && (
          <div
          className="grid bg-gray-200 text-base font-semibold text-gray-700 p-3 border-b"
          style={{
            gridTemplateColumns: `minmax(3rem, auto) minmax(24.5rem, 1fr) ${Array.from({ length: dadosLen - 1 })
              .map(() => 'minmax(4rem, 1fr)')
              .join(' ')}`
          }}
        >

            {Object.keys(dados[0]).map((key) => (
              <div key={key} className="px-2">
                {key}
              </div>
            ))}
            <div className="px-2">AÇÕES</div>
          </div>
        )}

        {dados.map((tabelas) => (
          <div
          key={tabelas.ID}
          className="grid text-sm p-3 px-2 border-b"
          style={{
            gridTemplateColumns: `minmax(3rem, auto) minmax(25rem, 1fr) ${Array.from({ length: dadosLen - 1 })
              .map(() => 'minmax(4rem, 1fr)')
              .join(' ')}`
          }}
          >

            {Object.values(tabelas).map((value, index) => (
              <div key={index} className="px-2">
                {value}
              </div>
            ))}

            <div className="flex gap-4 pl-4">
              <Tooltip title={"Editar registro: "+tabelas.ID} open={tooltipVisible.edit === tabelas.ID}>
                <button
                  onMouseEnter={() => handleMouseEnter("edit", tabelas.ID)}
                  onMouseLeave={() => handleMouseLeave("edit")}
                  onClick={() => toggleEditar(tabelas.ID)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" className="fill-blue-600 hover:fill-orange-500">
                    <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                  </svg>
                </button>
              </Tooltip>

              <Tooltip title={"Excluir registro: "+tabelas.ID} open={tooltipVisible.delete === tabelas.ID}>
                <button
                  onMouseEnter={() => handleMouseEnter("delete", tabelas.ID)}
                  onMouseLeave={() => handleMouseLeave("delete")}
                  onClick={() => handleDelete(tabelas.ID)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" className="fill-red-500 hover:fill-red-500">
                    <path d="M135.2 17.8l9.8 22H312l9.8-22c5.4-12 17.3-17.8 28.2-17.8h32c13.3 0 24 10.7 24 24V56H16V24c0-13.3 10.7-24 24-24h32c10.9 0 22.8 5.8 28.2 17.8zM32 96h384l-20.4 368c-1.5 26.5-24 48-50.5 48H102.9c-26.5 0-49-21.5-50.5-48L32 96zm80 48v288c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16zm96 0v288c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16zm96 0v288c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16z" />
                  </svg>
                </button>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
