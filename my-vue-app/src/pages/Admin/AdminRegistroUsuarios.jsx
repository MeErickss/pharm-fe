import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../api"
import { GridAdmin } from "../../components/Admin/GridAdmin";
import { AdicionarDado } from "../../components/Admin/AdicionarDado"; 
import { EditarDado } from "../../components/Admin/EditarDado";
import { Cabecalho } from "../../components/Cabecalho";



export function AdminRegistroUsuarios() {
  const [error, setError] = useState("");
  const [dados, setDados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [dadosLen, setDadosLen] = useState(0);
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("");
  const [dell, setDell] = useState(0);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState({ edit: null, delete: null });
  const table = "usuario"

  useEffect(() => {
    api
      .get("/usuario", { token: localStorage.getItem("cookie") })
      .then((response) => {
        const raw = response.data;
        setDados(raw);
        // remove password de cada objeto
        setUsuarios(
          raw.map(({ password, ...rest }) => rest)
        );
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          // Redirecionar para login se não autenticado
          navigator('/login'); 
        }
        console.error("Erro ao buscar dados", err);
        setError("Não foi possível carregar os dados");
      })
      console.log(usuarios)
  }, [navigator]); // Adicione nav como dependência

  useEffect(() => {
    if (dados.length > 0) {
      setDadosLen(Object.keys(dados[0]).length);
    }
  }, [dados, usuarios]);

  useEffect(() => {
    if (!dell) return;
  
    const fetchData = async () => {
      try {
        var option = ""
        var question=confirm(`Deseja excluir o Registro ${dell}`);
        if (question==true)
          {
          option="Opção de exclusão selecionada";
          const response = await api.delete(`/usuario/${dell}`)
    
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
    window.location.reload();
  };

  const toggleEditar = (id) => {
    setEditId(id);
    setShowModalEdit(true);
  };
  
  return (
    <div className="w-full rounded h-full bg-gray-100 p-4 overflow-y-visible overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-indigo-500 hover:scrollbar-thumb-indigo-700">

      <Cabecalho dados={usuarios} setDados={setDados} nivel={1} setshowModalAdd={setShowModalAdd} tabela={"Usuários"}/>

      {showModalAdd && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[50rem] h-auto bg-white p-6 rounded-lg shadow-lg">
            <AdicionarDado dados={usuarios} param={false} table={table} closeModal={() => setShowModalAdd(false)} /> {/* Componente JSX dentro do modal */}
          </div>
        </div>
      )}

      {showModalEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[50rem] h-auto bg-white p-6 rounded-lg shadow-lg">
            <EditarDado id={editId} param={false} table={table} dados={usuarios} closeModal={() => setShowModalEdit(false)} />
          </div>
        </div>
      )}

      <GridAdmin
        dados={usuarios}
        dadosLen={dadosLen}
        tooltipVisible={tooltipVisible}
        setTooltipVisible={setTooltipVisible}
        onEdit={toggleEditar}
        onDelete={handleDelete}
      />
    </div>
  );
}
