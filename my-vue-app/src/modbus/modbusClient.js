import ModbusSerial from "modbus-serial";

// Cria instância compartilhada
const client = new ModbusSerial();
let isConnected = false;

/**
 * Conecta ao escravo Modbus/TCP
 * @param {string} host - IP ou hostname do servidor Modbus (e.g. "192.168.1.9")
 * @param {number} port - Porta TCP do Modbus (default: 502)
 * @param {number} slaveId - ID do escravo Modbus (default: 1)
 */
export async function connect(host = "172.17.0.1", port = 502, slaveId = 1) {
  if (isConnected) {
    console.warn("Já conectado ao Modbus");
    return;
  }

  try {
    await client.connectTCP(host, { port });
    client.setID(slaveId);
    client.setTimeout(1000);
    isConnected = true;
    console.log(`🔌 Conectado a ${host}:${port} (ID=${slaveId})`);
  } catch (err) {
    console.error("❌ Erro na conexão Modbus:", err);
    throw err;
  }
}

/**
 * Fecha a conexão Modbus
 */
export function close() {
  if (!isConnected) return;
  client.close();
  isConnected = false;
  console.log("🔒 Conexão Modbus fechada");
}

// Exporta instância e status para casos especiais
export default {
  connect,
  close,
};
