// Importando o componente de formulário
import AtribuirExame from "../../components/CadastroExames/CadastroExames.jsx";

// Importando o componente do bootstrap
import Container from "react-bootstrap/Container";

const AtribuirExames = () => {
  return (
    <div>
      <Container>

       <AtribuirExame page="exames/atribuir" />
      </Container>
    </div>
  );
};

export default AtribuirExames;