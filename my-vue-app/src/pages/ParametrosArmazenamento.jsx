  import { useState, useEffect } from "react";
  import api from "../api"
  import { Cabecalho } from "../components/Cabecalho";
  import { Grid } from "../components/Grid";



  export function ParametrosArmazenamento() {
    const [error, setError] = useState("");
    const [dados, setDados] = useState([]);
    const [dadosLen, setDadosLen] = useState(0);
    const [dell, setDell] = useState(0);
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
    

    
    return (
      <div className="w-full h-full bg-gray-100 p-4">

        <Cabecalho dados={dados} nivel={2} setDados={setDados} tabela={tabela}/>

        <Grid
          dados={dados}
          dadosLen={dadosLen}
          funcao={"ARMAZENAMENTO"}
          tooltipVisible={tooltipVisible}
          setTooltipVisible={setTooltipVisible}
        />
      </div>
    );
    }
