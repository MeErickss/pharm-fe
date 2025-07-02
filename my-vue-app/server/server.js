// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { client, connect, close } from "./modBusClient.js";

const app = express();

// CORS configurado para permitir credenciais e origem específica
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET","POST","PUT","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));
app.use(bodyParser.json());

// Permitir preflight
app.options("/*", cors({
  origin: "http://localhost:5173",
  credentials: true
}));

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

// Leitura Modbus
app.post("/api/modbus/read", async (req, res) => {
  const { type, address, length } = req.body;
  const handlers = {
    holding: () => client.readHoldingRegisters(address, length),
    coil:    () => client.readCoils(address, length),
    discrete:() => client.readDiscreteInputs(address, length),
    input:   () => client.readInputRegisters(address, length)
  };
  const fn = handlers[type];
  if (!fn) return res.status(400).json({ error: `Tipo inválido: ${type}` });
  try {
    const resp = await fn();
    const data = Array.isArray(resp) ? resp : resp.data || resp.payload || [];
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Escrita Modbus
app.post("/api/modbus/write", async (req, res) => {
  const { type = "holding", address, value } = req.body;
  const writers = {
    holding: () => client.writeRegister(address, value),
    coil:    () => client.writeCoil(address, value)
  };
  const fn = writers[type];
  if (!fn) return res.status(400).json({ error: `Tipo inválido: ${type}` });
  try {
    await fn();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fecha conexão
app.post("/api/modbus/close", (req, res) => {
  close();
  res.json({ ok: true });
});

app.listen(3001, () => console.log("API Modbus rodando em http://localhost:3001"));