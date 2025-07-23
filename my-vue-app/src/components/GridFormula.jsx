import { Steps } from "antd"
import correcoes from "./dicionario";

export function GridFormula({ setShowModalEmergencia, formula, iniciar, step, fetchParametrosFormula }){
      const { Step } = Steps;

    return(
        <div className="grid items-center grid-cols-4 grid-rows-2 col-span-2 bg-neutral-400 w-full h-[15.7rem] text-white p-4 rounded-2xl gap-4">
          <div className="grid grid-cols-4 grid-rows-2 w-full h-full col-span-4 bg-neutral-200 text-black rounded">
            <span className="text-red-500">Alarme: ATIVADO</span>
            <span>Abertura Valvula V2</span>
            <span>Detetização</span>
            <span>Fechado Valuvla 2</span>
                  <div className="col-span-4 -mt-[1.5rem]" style={{ padding: 24 }}>
                    <Steps current={step}>
                      <Step title="Inicio"/>
                      <Step title="Processo"/>
                      <Step title="Concluído"/>
                    </Steps>
                  </div>
          </div>
          {!iniciar && formula.map((f) => (
            <button
              key={f}
              onClick={() => fetchParametrosFormula(f)}
              className="bg-blue-500 hover:brightness-90 text-white mx-6 h-8 px-3 py-1 rounded-lg"
            >
              Fórmula {correcoes[f]}
            </button>
          ))}

          <button
            className="bg-blue-500 hover:brightness-90 text-white mx-6 h-8 px-3 py-1 rounded-lg"
            onClick={() => setShowModalEmergencia((p) => !p)}
          >
            EMERGÊNCIA
          </button>

          {localStorage.getItem('nivel') === "MANUTENCAO" && <button
            className="bg-blue-500 m-auto w-36 h-16 p-4 rounded-lg"
          >
            Modo Manutenção
          </button>}
        </div>
    )
}