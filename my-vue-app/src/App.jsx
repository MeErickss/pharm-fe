import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { LoginPage } from "./pages/LoginPage.jsx";
import { Pagina404 } from "./pages/Page404.jsx";
import { Layout } from "./pages/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { Production } from "./pages/Production.jsx";
import { Storage } from "./pages/Storage.jsx";
import { ParametersProduction } from "./pages/ParametersProduction.jsx";
import { ParametersStorage } from "./pages/ParametersStorage.jsx";

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
        </Route>

        <Route path="*" element={<Pagina404 />} />
      </Routes>
    </Router>
  );
}