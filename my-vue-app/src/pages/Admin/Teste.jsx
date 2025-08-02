import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";


export function Teste() {
  const navigate = useNavigate();
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Conecta ao Modbus usando sua API
  const connectModbus = async () => {
    try {
      const { data: resp } = await api.post("/modbus/connect", {
        host: "192.168.1.33",
        port: 502,
        slaveId: 1
      });
      if (resp.ok) {
        setConnected(true);
      } else {
        throw new Error(resp.error || "Falha ao conectar");
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  // Lê registradores holding
  const readRegisters = async () => {
    if (!connected) return;
    try {
      const { data: resp } = await api.post("/modbus/read", {
        type: "holding",
        slaveId: 1,
        address: 0,
        length: 10
      });
      setData(resp.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  // Fecha conexão Modbus
  const closeModbus = async () => {
    try {
      await api.post("/modbus/close");
    } catch (err) {
      console.warn("Erro ao fechar Modbus:", err);
    } finally {
      setConnected(false);
    }
  };

  // Efeito de mount/unmount
  useEffect(() => {
    connectModbus();
    return () => { closeModbus(); };
  }, []);

  // Efeito para leitura após conexão
  useEffect(() => {
    if (connected) readRegisters();
  }, [connected]);

  return (
    <div className="flex flex-col justify-center items-center bg-neutral-200 min-h-screen">
      <div className="bg-neutral-300 text-neutral-700 p-8 rounded-lg shadow-lg">
        {!connected && !error && <p>Conectando ao Modbus...</p>}
        {error && <p className="text-red-500">Erro: {error}</p>}
        {connected && !error && (
          <>
            <h2 className="text-xl mb-4">Dados de Registradores Holding:</h2>
            <ul className="list-disc list-inside">
              {data.map((value, idx) => (
                <li key={idx}>Endereço {idx}: {value}</li>
              ))}
            </ul>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => navigate('/')}
            >
              Voltar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
