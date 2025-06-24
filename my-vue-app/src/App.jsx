import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "antd/dist/reset.css";
import { PaginaLogin } from "./pages/PaginaLogin.jsx";
import { Pagina404 } from "./pages/Page404.jsx";
import { Layout } from "./pages/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { Producao } from "./pages/Producao.jsx";
import { Armazenamento } from "./pages/Armazenamento.jsx";
import { ParametrosProducao } from "./pages/ParametrosProducao.jsx";
import { ParametrosArmazenamento } from "./pages/ParametrosArmazenamento.jsx";
import { AdminRegistroProducao } from "./pages/Admin/AdminRegistroProducao.jsx";
import { AdminRegistroGrandeza } from "./pages/Admin/AdminRegistroGrandeza.jsx";
import { AdminRegistroArmazenamento } from "./pages/Admin/AdminRegistroArmazenamento.jsx";
import { AdminRegistroUnidade } from "./pages/Admin/AdminRegistroUnidade.jsx";
import { AdminRegistroUsuarios } from "./pages/Admin/AdminRegistroUsuarios.jsx"
import { Status } from "./pages/Maintenance/Status.jsx";
import { ManutencaoFuncao } from "./pages/Maintenance/ManutencaoFuncao.jsx";
import { Teste } from "./pages/teste.jsx";
import { LogSistema } from "./pages/Admin/LogSistema.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rota de login */}
        <Route path="/" element={<PaginaLogin />} />

        {/* Rotas protegidas com layout */}
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="producao" element={<Producao />} />
          <Route path="armazenamento" element={<Armazenamento />} />
          <Route path="parametroproducao" element={<ParametrosProducao />} />
          <Route path="parametroarmazem" element={<ParametrosArmazenamento />} />
          <Route path="usuarios" element={<AdminRegistroUsuarios />} />
          <Route path="adminparametrosproducao" element={<AdminRegistroProducao />} />
          <Route path="adminparametrosarmazem" element={<AdminRegistroArmazenamento/>} />
          <Route path="adminparametrosunidade" element={<AdminRegistroUnidade/>} />
          <Route path="adminparametrosgrandeza" element={<AdminRegistroGrandeza/>} />
          <Route path="adminlogs" element={<LogSistema/>} />
          <Route path="maintencefunctions" element={<ManutencaoFuncao/>} />
          <Route path="maintencestatus" element={<Status/>} />
          <Route path="teste" element={<Teste/>} />
        </Route>

        <Route path="*" element={<Pagina404 />} />
      </Routes>
    </Router>
  );
}