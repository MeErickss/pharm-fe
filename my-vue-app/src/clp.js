import ModbusTcp from 'react-native-modbus-tcp';

// Connect to Modbus TCP Master (parameters [ip, port])
const modBus = ModbusTcp.connectToModbusMaster('192.168.137.32', 502, (res) => {
  if (res.error) {
    console.error('Erro ao se conectar com o clp: ', res.error);
  } else {
    console.log('Conectado: ', res);
  }
});

    // Read Coil (parameters [slaveid, start, length])
    //modBus.readCoil(248, 1, 2, (res) => {
      // Do something with the response
      // If Success response ==> [false,false] etc...
      // if response is not success ==> Modbus master is not inited successfully...
    //});

    // Read Discrete Input (parameters [slaveid, start, length])
    //modBus.readDiscreteInput(248, 1, 5, (res) => {
      // Do something with the response
      // If Success response ==> [false,false,false,true,true] etc...
      // if response is not success ==> Modbus master is not inited successfully...
    //});

    // Read Holding Registers (parameters [slaveid, start, length])
    //modBus.readHoldingRegisters(248, 2, 8, (res) => {
      // Do something with the response
      // If Success response ==> [0,0,0,0,0,0,0,0] etc...
      // if response is not success ==> Modbus master is not inited successfully...
    //});

  // Read Input Registers (parameters [slaveid, start, length])
    //modBus.readInputRegisters(248, 2, 8, (res) => {
      // Do something with the response
      // If Success response ==> [0,0,0,0,0,0,0,0] etc...
      // if response is not success ==> Modbus master is not inited successfully...
    //});

  // Write Coil (parameters [slaveid, offset, value])
    //modBus.writeCoil(248, 1, true, (res) => {
      // Do something with the response
      // If Success response ==> Success
      // if response is not success ==> Modbus master is not inited successfully...
    //});

  // Write Register (parameters [slaveid, offset, value])
    //modBus.writeRegister(248, 1, 150, (res) => {
      // Do something with the response
      // If Success response ==> Success
      // if response is not success ==> Modbus master is not inited successfully...
    //});

  // Write Registers (parameters [slaveid, start, values])
    //modBus.writeRegisters(248, 2, [500,505,304,1004,600], (res) => {
      // Do something with the response
      // If Success response ==> Success
      // if response is not success ==> Modbus master is not inited successfully...
    //});

  // Destroy Connection
      //modBus.destroyConnection((res) => {
        
        // Do something with the response
        // response ==> Connection destroyed
        //});

export default modBus;