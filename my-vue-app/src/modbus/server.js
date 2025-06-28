import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import {
  connect,
  close,
} from "./modbusClient.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conecta ao Modbus
app.post("/api/modbus/connect", async (req, res) => {
  try {
    const { host, port, slaveId } = req.body;
    await connect(host, port, slaveId);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota única para múltiplos tipos de leitura
app.post("/api/modbus/read", async (req, res) => {
  const { type, address, length } = req.body;
  // Mapeamento de funções de leitura
  const leitura = {
    holding: () => client.readHoldingRegisters(address, length),
    coil:    () => client.readCoils(address, length),
    discrete:() => client.readDiscreteInputs(address, length),
    input:   () => client.readInputRegisters(address, length)
  };

  if (!leitura[type]) {
    return res.status(400).json({ error: `Tipo de leitura inválido: ${type}` });
  }

  try {
    const data = await leitura[type]();
    res.json({ data });
  } catch (err) {
    console.error(`⚠️ Erro em /api/modbus/read [${type}]:`, err);
    res.status(500).json({ error: err.message });
  }
});

// Escreve em registrador
app.post("/api/modbus/write", async (req, res) => {
  const { type = "holding", address, value } = req.body;
  // mapeia cada tipo no método de escrita correspondente
  const writers = {
    holding:    () => client.writeRegister(address, value),      // registrador (holding register)
    coil:       () => client.writeCoil(address, value),   // coil (escreve um bit)
  };

  const writer = writers[type];
  if (!writer) {
    return res.status(400).json({ error: `Tipo inválido: ${type}` });
  }

  try {
    await writer();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fecha a conexão
app.post("/api/modbus/close", (req, res) => {
  close();
  res.json({ ok: true });
});

app.listen(3001, () => console.log("API Modbus rodando em http://localhost:3001"));
