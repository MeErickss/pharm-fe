import { useState, useEffect } from "react";
import axios from "axios";


export function Teste() {
  const [log, setLog] = useState([]);
  const [data, setData] = useState(null);
  const append = msg => setLog(l => [...l, msg]);

  useEffect(() => {
    async function run() {
      try {
        append("Conectando…");
        await axios.post("http://localhost:3001/api/modbus/connect", {
          host: "192.168.1.9",
          port: 502,
          slaveId: 1
        });
        append("Conectado");

        append("Lendo registradores");
        const readRes = await axios.post("http://localhost:3001/api/modbus/read", {
          address: 1,
          length: 10,
          type:"holding"
        });
        append("Dados: " + readRes.data.data.join(", "));
        setData(readRes.data.data);

        append("Escrevendo registrador 5 = 123");
        await axios.post("http://localhost:3001/api/modbus/write", {
          address: 6,
          value: 12,
          type:"holding"
        });
        append("Escrito com sucesso");

        append("Fechando conexão");
        await axios.post("http://localhost:3001/api/modbus/close");
        append("Conexão fechada");
      } catch (e) {
        append("Erro: " + e.message);
      }
    }
    run();
  }, []);
  

  return (
    <div className="p-12">
      <h2>Teste Modbus via HTTP</h2>
      <pre style={{ background: "#f5f5f5", padding: 10, minHeight: 100 }}>
        {log.map((l,i) => <div key={i}>{l}</div>)}
      </pre>
      {data && (
        <>
          <h3>Valores Lidos:</h3>
          <ul>
            {data.map((v,i) => <li key={i}>[{i}] = {v}</li>)}
          </ul>
        </>
      )}
    </div>
  );
}
