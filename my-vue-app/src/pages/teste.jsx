import React, { useState } from "react";
import modbusApi from "../modbusApi";

export function Teste() {
  const [host, setHost] = useState("192.168.1.11");
  const [port, setPort] = useState(502);
  const [slaveId, setSlaveId] = useState(1);
  const [type, setType] = useState("holding");
  const [address, setAddress] = useState(0);
  const [length, setLength] = useState(1);
  const [value, setValue] = useState(0);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  const handleConnect = async () => {
    try {
      await modbusApi.post("/connect", { host, port, slaveId });
      setConnected(true);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleRead = async () => {
    try {
      const resp = await modbusApi.post("/read", { type, address, length });
      setData(resp.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleWrite = async () => {
    try {
      await modbusApi.post("/write", { type, address, value });
      setError(null);
      // Optionally refresh read
      handleRead();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleClose = async () => {
    try {
      await modbusApi.post("/close");
      setConnected(false);
      setData(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Teste Modbus TCP/IP</h2>
      <section className="space-y-2">
        <h3 className="font-semibold">Conexão</h3>
        <div className="flex space-x-2">
          <input
            type="text"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="Host"
            className="border rounded p-1"
          />
          <input
            type="number"
            value={port}
            onChange={(e) => setPort(Number(e.target.value))}
            placeholder="Porta"
            className="border rounded p-1 w-24"
          />
          <input
            type="number"
            value={slaveId}
            onChange={(e) => setSlaveId(Number(e.target.value))}
            placeholder="ID Escravo"
            className="border rounded p-1 w-24"
          />
          {connected ? (
            <button onClick={handleClose} className="bg-red-500 text-white px-3 py-1 rounded">
              Desconectar
            </button>
          ) : (
            <button onClick={handleConnect} className="bg-green-500 text-white px-3 py-1 rounded">
              Conectar
            </button>
          )}
        </div>
      </section>

      {connected && (
        <>
          <section className="space-y-2">
            <h3 className="font-semibold">Leitura</h3>
            <div className="flex space-x-2 items-center">
              <select value={type} onChange={(e) => setType(e.target.value)} className="border rounded p-1">
                <option value="holding">Holding Registers</option>
                <option value="coil">Coils</option>
                <option value="discrete">Discrete Inputs</option>
                <option value="input">Input Registers</option>
              </select>
              <input
                type="number"
                value={address}
                onChange={(e) => setAddress(Number(e.target.value))}
                placeholder="Endereço"
                className="border rounded p-1 w-24"
              />
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                placeholder="Quantidade"
                className="border rounded p-1 w-24"
              />
              <button onClick={handleRead} className="bg-blue-500 text-white px-3 py-1 rounded">
                Ler
              </button>
            </div>
            {data && (
              <pre className="bg-gray-100 p-2 rounded overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
            )}
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold">Escrita</h3>
            <div className="flex space-x-2 items-center">
              <select value={type} onChange={(e) => setType(e.target.value)} className="border rounded p-1">
                <option value="holding">Holding Registers</option>
                <option value="coil">Coils</option>
              </select>
              <input
                type="number"
                value={address}
                onChange={(e) => setAddress(Number(e.target.value))}
                placeholder="Endereço"
                className="border rounded p-1 w-24"
              />
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                placeholder="Valor"
                className="border rounded p-1 w-24"
              />
              <button onClick={handleWrite} className="bg-yellow-500 text-white px-3 py-1 rounded">
                Escrever
              </button>
            </div>
          </section>
        </>
      )}

      {error && <div className="text-red-600">Erro: {error}</div>}
    </div>
  );
}