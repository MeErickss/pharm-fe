import { AiOutlineCloseCircle, AiOutlineReload, AiOutlineDatabase, AiOutlineCheckCircle } from "react-icons/ai";


export function Parameters({ onClose }) {
    return (
      <div className="fixed top-1 left-1/4 w-[72rem] h-[60rem] bg-slate-200 p-4 rounded shadow-lg">
          <table className="border-2 border-collapse border-black text-xs mb-3 w-[67rem]">
            <thead>
              <tr className="border-2 border-collapse border-black">
                <th className="border-2 border-collapse border-black bg-green-800">TEMPOS PRODUÇÃO ÁCIDO</th>
                <th className="border-2 border-collapse border-black bg-green-800">UNID</th>
                <th className="border-2 border-collapse border-black bg-green-800">VALOR</th>
                <th className="border-2 border-collapse border-black bg-green-800">VL.MIN</th>
                <th className="border-2 border-collapse border-black bg-green-800">VL.MAX</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="border-2 border-collapse border-black">TEMPO PARA DRENAGEM DO TANQUE DE MISTURA [TQ-100]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="seg">SEG</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">TEMPO PARA DRENAGEM DO TANQUE DE ADIÇÃO [TQ-200]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="seg">SEG</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">TEMPO PARA HOMOGENIZAÇÃO NO TANQUE DE MISTURA [TQ-100]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="min">MIN</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">CICLOS PARA LIMPEZA DO TANQUE DE ADIÇÃO [TQ-200]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="ciclos">CICLOS</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">CICLOS PARA ENXÁGUE DO EQUIPAMENTO  [TQ-200]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="ciclos">CICLOS</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
            </tbody>
          </table>


          <table className="border-2 border-collapse border-black text-xs mb-3 w-[67rem]">
            <thead>
              <tr className="border-2 border-collapse border-black">
                <th className="border-2 border-collapse border-black bg-green-800">PARÂMETROS PRODUÇÃO ÁCIDO</th>
                <th className="border-2 border-collapse border-black bg-green-800">UNID</th>
                <th className="border-2 border-collapse border-black bg-green-800">VALOR</th>
                <th className="border-2 border-collapse border-black bg-green-800">VL.MIN</th>
                <th className="border-2 border-collapse border-black bg-green-800">VL.MAX</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="border-2 border-collapse border-black">PRESSÃO DE RECALQUE BOMBA  [PT-100]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="psi">PSI</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">VOLUME DE ÁGUA PARA ENXÁGUE [TQ-100]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="litros">LITROS</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">CONDUTIVIDADE MÁXIMA DE ENTRADA [CI-100]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="us">US</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
            </tbody>
          </table>
        

          <table className="border-2 border-collapse border-black text-xs mb-3 w-[67rem]">
            <thead>
              <tr className="border-2 border-collapse border-black">
                <th className="border-2 border-collapse border-black bg-green-800">TEMPOS PRODUÇÃO BICARBONATO</th>
                <th className="border-2 border-collapse border-black bg-green-800">UNID</th>
                <th className="border-2 border-collapse border-black bg-green-800">VALOR</th>
                <th className="border-2 border-collapse border-black bg-green-800">VL.MIN</th>
                <th className="border-2 border-collapse border-black bg-green-800">VL.MAX</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="border-2 border-collapse border-black">TEMPO PARA DRENAGEM DO TANQUE DE MISTURA [TQ-100]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="seg">SEG</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">TEMPO PARA DRENAGEM DO TANQUE DE ADIÇÃO [TQ-200]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="seg">SEG</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">TEMPO PARA HOMOGENIZAÇÃO DO TANQUE DE MISTURA [TQ-100]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="min">MIN</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">CICLOS PARA LIMPEZA DO TANQUE DE ADIÇÃO [TQ-200]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="ciclos">CICLOS</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">CICLOS PARA ENXÁGUE DO EQUIPAMENTO </th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="ciclos">CICLOS</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">TEMPO PARA CONCENTRAÇÃO DE OZÔNIO [OZ-100]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="min">MIN</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">CICLOS PARA SANITIZAÇÃO DO TANQUE DE ADIÇÃO [TQ-200]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="ciclos">CICLOS</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">TEMPO DE SANITIZAÇÃO COM SPRAY-BALL TANQUE DE MISTURA [TQ-100]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="min">MIN</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
            </tbody>
          </table>


          <table className="border-2 border-collapse border-black text-xs mb-3 w-[67rem]">
            <thead>
              <tr className="border-2 border-collapse border-black">
                <th className="border-2 border-collapse border-black bg-green-800">PARÂMETROS PRODUÇÃO BICARBONATO</th>
                <th className="border-2 border-collapse border-black bg-green-800">UNID</th>
                <th className="border-2 border-collapse border-black bg-green-800">VALOR</th>
                <th className="border-2 border-collapse border-black bg-green-800">VL.MIN</th>
                <th className="border-2 border-collapse border-black bg-green-800">VL.MAX</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="border-2 border-collapse border-black">PRESSÃO DE RECALQUE BOMBA  [PT-100]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="psi">PSI</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">VOLUME DE ÁGUA PARA ENXÁGUE [TQ-100]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="litros">LITROS</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">VOLUME DE ÁGUA PARA SANITIZAÇÃO [TQ-100]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="litros">LITROS</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">CONDUTIVIDADE MÁXIMA DE ENTRADA [CI-100]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="us">US</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
            </tbody>
          </table>


          <table className="border-2 border-collapse border-black text-xs mb-3 w-[67rem]">
            <thead>
              <tr className="border-2 border-collapse border-black">
                <th className="border-2 border-collapse border-black bg-green-800">SETUP DE INSTRUMENTOS</th>
                <th className="border-2 border-collapse border-black bg-green-800">UNID</th>
                <th className="border-2 border-collapse border-black bg-green-800">VALOR</th>
                <th className="border-2 border-collapse border-black bg-green-800">VL.MIN</th>
                <th className="border-2 border-collapse border-black bg-green-800">VL.MAX</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="border-2 border-collapse border-black">CONDUTIVIMETRO DE ENTRADA uS   [CI-100]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="us">US</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">MEDIDOR DE PH ENTRADA [PH-100]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="ph">PH</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">MEDIDOR PH DA SOLUÇÃO   [PH-101]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="ph">PH</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">TRANSMISSOR DE PRESSÃO DE RECALQUE BOMBA  [PT-100]</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="psi">PSI</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
            </tbody>
          </table>


          <table className="border-2 border-collapse border-black text-xs mb-3 w-[67rem]">
            <thead>
              <tr className="border-2 border-collapse border-black">
                <th className="border-2 border-collapse border-black bg-green-800">TEMPO PARA FALHA DE VÁLVULAS</th>
                <th className="border-2 border-collapse border-black bg-green-800">UNID</th>
                <th className="border-2 border-collapse border-black bg-green-800">VALOR</th>
                <th className="border-2 border-collapse border-black bg-green-800">VL.MIN</th>
                <th className="border-2 border-collapse border-black bg-green-800">VL.MAX</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="border-2 border-collapse border-black">TEMPO PARA FALHA DE VÁLVULA XV - 100</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="seg">SEG</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">TEMPO PARA FALHA DE VÁLVULA XV - 101</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="seg">SEG</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">TEMPO PARA FALHA DE VÁLVULA XV - 102</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="seg">SEG</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">TEMPO PARA FALHA DE VÁLVULA XV - 103</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="seg">SEG</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">TEMPO PARA FALHA DE VÁLVULA XV - 104</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="seg">SEG</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">TEMPO PARA FALHA DE VÁLVULA XV - 105</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="seg">SEG</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">TEMPO PARA FALHA DE VÁLVULA XV - 106</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="seg">SEG</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">TEMPO PARA FALHA DE VÁLVULA XV - 107</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="seg">SEG</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
              <tr>
                <th className="border-2 border-collapse border-black">TEMPO PARA FALHA DE VÁLVULA XV - 108</th>
                <td className="border-2 border-collapse border-black"><select name="" id=""><option value="seg">SEG</option></select></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
                <td className="border-2 border-collapse border-black"><input className="w-full" type="number"/></td>
              </tr>
            </tbody>
          </table>
          <button className="bg-red-500 text-white w-8 h-8 rounded-full absolute top-4 right-4 flex items-center justify-center shadow-md hover:brightness-125" onClick={onClose}><AiOutlineCloseCircle />
          </button>
          <button className="bg-green-500 text-white w-8 h-8 rounded-full absolute bottom-4 right-4 flex items-center justify-center shadow-md hover:brightness-125" onClick={onClose}><AiOutlineCheckCircle />
          </button>
      </div>
    );
  }
  