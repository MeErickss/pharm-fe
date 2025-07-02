// modbusApi.js  — nova instância para chamadas Modbus
import axios from "axios";

const modbusApi = axios.create({
  baseURL: "http://localhost:3001/api/modbus",
  withCredentials: true
});

export default modbusApi;