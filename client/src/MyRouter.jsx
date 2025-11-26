import { createBrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import PaginaErro from "./pages/PaginaErro.jsx";
import Login from "./pages/Login.jsx";
import RotasProtegidas from "./pages/RotasProtegidas.jsx";
import Home from "./pages/Home.jsx";

import CadastrarExames from "./pages/Exames/CadastrarExames.jsx";
import CadastrarFuncionarios from "./pages/Funcionarios/CadastrarFuncionarios.jsx";
import CadastrarTreinamentos from "./pages/Treinamentos/CadastrarTreinamentos.jsx";
import GerenciarFuncionarios from "./pages/Funcionarios/GerenciarFuncionarios.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <PaginaErro />,
    children: [
      { index: true, element: <Login /> },
      { path: "login", element: <Login /> },
    ],
  },
  {
    path: "/",
    element: <RotasProtegidas />,
    errorElement: <PaginaErro />,
    children: [
      { path: "home", element: <Home /> },
      { path: "exames/cadastrar", element: <CadastrarExames /> },
      { path: "treinamentos/cadastrar", element: <CadastrarTreinamentos /> },

   
      { path: "funcionarios/cadastrar", element: <CadastrarFuncionarios /> },
      { path: "funcionarios/editar/:id", element: <CadastrarFuncionarios /> },
      { path: "funcionarios/gerenciar", element: <GerenciarFuncionarios /> },
    ],
  },
]);

export default router;
