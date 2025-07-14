import React from "react";
import { ConfigProvider, Steps } from "antd";
import "antd/dist/reset.css";

const { Step } = Steps;

export function Teste() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#f5222d"  // por exemplo, vermelho
        },
      }}
    >
      <div className="bg-white" style={{ padding: 24 }}>
        <Steps current={1}>
          <Step title="Login"       description="Entre com suas credenciais" />
          <Step title="Verificação" description="Confirme seu e‑mail" />
          <Step title="Concluído"    description="Cadastro finalizado" />
        </Steps>
      </div>
    </ConfigProvider>
  );
}
