// Importando o componente de formulário
import CadastroTreinamento from "../../components/CadastroTreinamento/CadastroTreinamento";

// Importando o componente do bootstrap
import Container from "react-bootstrap/Container";

const CadastrarTreinamentos = () => {
  return (
    <div>
      <Container>

       <CadastroTreinamento page="treinamentos/cadastrar" />
      </Container>
    </div>
  );
};

export default CadastrarTreinamentos;