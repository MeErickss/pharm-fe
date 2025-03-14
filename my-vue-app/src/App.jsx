import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "antd/dist/reset.css";
import { LoginPage } from "./pages/LoginPage.jsx";
import { Pagina404 } from "./pages/Page404.jsx";
import { Layout } from "./pages/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { Production } from "./pages/Production.jsx";
import { Storage } from "./pages/Storage.jsx";
import { ParametersProduction } from "./pages/ParametersProduction.jsx";
import { ParametersStorage } from "./pages/ParametersStorage.jsx";
import { AdminProductionRegister } from "./pages/Admin/AdminProductionRegister.jsx";
import { AdminGreatnessRegister } from "./pages/Admin/AdminGreatnessRegister.jsx";
import { AdminStorageRegister } from "./pages/Admin/AdminStorageRegister.jsx";
import { AdminFunctionRegister } from "./pages/Admin/AdminFunctionRegister.jsx";
import { AdminUnitRegister } from "./pages/Admin/AdminUnitRegister.jsx";
import { AdminUsers } from "./pages/Admin/AdminUsers.jsx"
import { Status } from "./pages/Maintenance/status.jsx";
import { Functions } from "./pages/Maintenance/Functions.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rota de login */}
        <Route path="/" element={<LoginPage />} />

        {/* Rotas protegidas com layout */}
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="producao" element={<Production />} />
          <Route path="armazenamento" element={<Storage />} />
          <Route path="parametroproducao" element={<ParametersProduction />} />
          <Route path="parametroarmazem" element={<ParametersStorage />} />
          <Route path="usuarios" element={<AdminUsers />} />
          <Route path="adminparametrosproducao" element={<AdminProductionRegister />} />
          <Route path="adminparametrosarmazem" element={<AdminStorageRegister/>} />
          <Route path="adminparametrosfuncoes" element={<AdminFunctionRegister/>} />
          <Route path="adminparametrosunidade" element={<AdminUnitRegister/>} />
          <Route path="adminparametrosgrandeza" element={<AdminGreatnessRegister/>} />
          <Route path="maintencefunctions" element={<Functions/>} />
          <Route path="maintencestatus" element={<Status/>} />
        </Route>

        <Route path="*" element={<Pagina404 />} />
      </Routes>
    </Router>
  );
}