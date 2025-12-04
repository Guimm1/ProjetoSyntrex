import { Outlet, Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Syntrex from "../assets/Syntrex.svg";
import { AuthContext } from "../contexts/UserContexts.jsx";
import { useContext } from "react";
import BarraNavegacao from "../components/BarraNavegacao/BarraNavegacao.jsx";

const RotasProtegidas = () => {
  const { usuarioNome } = useContext(AuthContext);

  if (usuarioNome === "Visitante") {
    return <Navigate to="/login" />;
  }

  return (
    <div className="App d-flex">
      {/* Barra de navegação fixa na lateral */}
      <div className="position-fixed top-0 start-0 min-vh-100 bg-danger">
        <BarraNavegacao />
      </div>

      {/* Conteúdo principal */}
      <div
        className="d-flex flex-column min-vh-100 flex-grow-1 p-2 justify-content-center align-items-center"
        style={{
          backgroundColor: "#223773",
          marginLeft: "250px", // espaço para a barra lateral
        }}
      >
        {/* Aqui entra o conteúdo da rota atual */}
        <Outlet />
      </div>
    </div>
  );
};

export default RotasProtegidas;
