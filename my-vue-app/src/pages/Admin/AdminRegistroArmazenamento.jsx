import { useState, useEffect } from "react";
import api from "../../api"
import { Cabecalho } from "../../components/Cabecalho";
import { Grid } from "../../components/Admin/Grid";
import { AdicionarParametro } from "../../components/Admin/AdicionarParametro"; // Importando o novo componente
import { EditarParametro } from "../../components/Admin/EditarParametro"; // Importando o novo componente



export function AdminRegistroArmazenamento() {
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

  useEffect(() => {
    api.get("/parametro", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      params: {
        funcaoEnum: tabela  
      }
  })
  .then(response => setDados(response.data))
  .catch(err => {        if (err.response?.status === 401) {
          navigator('/login'); 
        }
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
          const response = await api.delete(`/parametro/${dell}`)
    
          if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
          }
    
          console.log("Registro deletado com sucesso");
            setDados((prevDados) => prevDados.filter((item) => item.id !== dell));
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
    console.log(editId)
  };

  const handleReset = () => {
    setQuery("");
    setFilter("");
    api.get("/parametro", {
      withCredentials: true,
      params: { 
        funcao: tabela 
      }})
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

      <Cabecalho dados={dados} nivel={1} setshowModalAdd={setShowModalAdd}/>


      {showModalAdd && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[50rem] h-auto bg-white p-6 rounded-lg shadow-lg">
            <AdicionarParametro dados={dados} param={true} closeModal={() => setShowModalAdd(false)} /> {/* Componente JSX dentro do modal */}
          </div>
        </div>
      )}

      {showModalEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[50rem] h-auto bg-white p-6 rounded-lg shadow-lg">
            <EditarParametro id={editId} param={true} dados={dados} closeModal={() => setShowModalEdit(false)} />
          </div>
        </div>
      )}

      <Grid
        dados={dados}
        dadosLen={dadosLen}
        tooltipVisible={tooltipVisible}
        setTooltipVisible={setTooltipVisible}
        onEdit={toggleEditar}
        onDelete={handleDelete}
      />
    </div>
  );
  }
