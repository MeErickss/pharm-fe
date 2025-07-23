import { useState } from "react"
import api from "../api"
import { CheckOutlined, CloseOutlined } from "@ant-design/icons"

export function ModalEmergencia( { Motivos }){
    const [dados, setDados] = useState()
    const [error, setError] = useState()


    const usuario = localStorage.getItem('login')

    const handleReconhecer = async (e) => {

        const resposta = {
            userLogin:usuario,
            descricao:e
        }

        console.log(resposta)

        api.post(
            "/logalarme",
            resposta, 
            {headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }}
          ).then((response) => {
            setDados(response.data);
            console.log(response.data)
          })
          .catch((err) => {
            if (err.response?.status === 401) {
              // Redirecionar para login se não autenticado
              navigator('/login'); 
            }
            console.error("Erro ao buscar dados", err);
            setError("Não foi possível carregar os dados");
          })
          .finally(
            window.location.reload()
          )
      }

    return(
        <div className="fixed inset-0 flex items-center text-center justify-center bg-black bg-opacity-50">
        <div className="w-[50rem] h-auto bg-white p-6 rounded-lg shadow-lg flex flex-wrap justify-center items-center">
        <h1 className="text-red-600 my-2 text-lg w-full text-center"><strong>ALARME DE EMERGENCIA ACIONADO</strong></h1>
        <div className="grid grid-cols-4 gap-4">
          {Motivos.map(motivo => 
            <span className="border-b-2 border-red-500">{motivo}</span>
          )
          
          }
        </div>
        <h1 className="text-black text-lg w-full"><strong>Reconhecer alarme de emergência <span className="border-b-2 border-blue-500">{usuario}</span> ? </strong></h1>
            <div className="flex flex-row gap-20 p-2 m-4">
                <button onClick={() => handleReconhecer("Reconhecido")} className="flex flex-row w-42 bg-blue-600 hover:brightness-90 text-white px-4 py-2 gap-2 rounded">
                  Reconhecer   <CheckOutlined />
                  </button>
                  <button onClick={() => handleReconhecer("Ignorado")} className="flex flex-row w-42 text-center bg-red-600 hover:brightness-90 text-white px-4 py-2 gap-2 rounded">
                  Ignorar <CloseOutlined />
                  </button>
            </div>
        </div>
      </div>
    )
}