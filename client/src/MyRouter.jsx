import { createBrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import PaginaErro from "./pages/PaginaErro.jsx";
import Login from "./pages/Login.jsx";
import RotasProtegidas from "./pages/RotasProtegidas.jsx";
import Home from "./pages/Home.jsx";

import CadastrarExames from "./pages/Exames/CadastrarExames.jsx";
import GerenciarExames from "./pages/Exames/GerenciarExames.jsx";
import CadastrarFuncionarios from "./pages/Funcionarios/CadastrarFuncionarios.jsx";
import GerenciarTreinamentos from "./pages/Treinamentos/GerenciarTreinamentos.jsx";
import CadastrarTreinamentos from "./pages/Treinamentos/CadastrarTreinamentos.jsx";
import GerenciarFuncionarios from "./pages/Funcionarios/GerenciarFuncionarios.jsx";
import Relatorios from "./components/Relatorios/Relatorios.jsx";

const router = createBrowserRouter([
  // ROTAS PÚBLICAS
  {
    path: "/",
    element: <App />,
    errorElement: <PaginaErro />,
    children: [
      { index: true, element: <Login /> },
      { path: "login", element: <Login /> },
    ],
  },

  // ROTAS PROTEGIDAS
  {
    path: "/",
    element: <RotasProtegidas />,
    errorElement: <PaginaErro />,
    children: [
      { path: "home", element: <Home /> },

      // EXAMES
      { path: "exames/cadastrar", element: <CadastrarExames /> },
      { path: "exames/gerenciar", element: <GerenciarExames /> },
      { path: "exames/editar/:id", element: <CadastrarExames /> },

      // TREINAMENTOS
      { path: "treinamentos/cadastrar", element: <CadastrarTreinamentos /> },
      { path: "treinamentos/gerenciar", element: <GerenciarTreinamentos /> },
      { path: "treinamentos/editar/:id", element: <CadastrarTreinamentos /> },


      // FUNCIONÁRIOS
      { path: "funcionarios/cadastrar", element: <CadastrarFuncionarios /> },
      { path: "funcionarios/editar/:id", element: <CadastrarFuncionarios /> },
      { path: "funcionarios/gerenciar", element: <GerenciarFuncionarios /> },

      // RELATÓRIOS
      { path: "relatorios", element: <Relatorios /> },
    ],
  },
]);

export default router;
