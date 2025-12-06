// Importando o componente de formulário
import CadastroExames from "../../components/CadastroExames/CadastroExames.jsx";

// Importando o componente do bootstrap
import Container from "react-bootstrap/Container";

const CadastrarExames = () => {
  return (
    <div>
      <Container>

       <CadastroExames page="exames/cadastrar" />
      </Container>
    </div>
  );
};

export default CadastrarExames;