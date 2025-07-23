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
import { AdminPontoControle } from "./pages/Admin/AdminPontoControle.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rota de login */}
        <Route path="/" element={<PaginaLogin />} />

        {/* Rotas protegidas com layout */}
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="producao/monitoramento" element={<Producao />} />
          <Route path="armazenagem/monitoramento/:id" element={<Armazenamento />} />
          <Route path="producao/parametros" element={<ParametrosProducao />} />
          <Route path="armazenagem/parametros/:id" element={<ParametrosArmazenamento />} />
          <Route path="admin/usuarios" element={<AdminRegistroUsuarios />} />
          <Route path="admin/producao" element={<AdminRegistroProducao />} />
          <Route path="admin/armazem" element={<AdminRegistroArmazenamento/>} />
          <Route path="admin/unidade" element={<AdminRegistroUnidade/>} />
          <Route path="admin/pontocontrole" element={<AdminPontoControle/>} />
          <Route path="admin/grandezas" element={<AdminRegistroGrandeza/>} />
          <Route path="manutencao" element={<ManutencaoFuncao/>} />
          <Route path="maintencestatus" element={<Status/>} />
        </Route>

        <Route path="*" element={<Pagina404 />} />
      </Routes>
    </Router>
  );
}