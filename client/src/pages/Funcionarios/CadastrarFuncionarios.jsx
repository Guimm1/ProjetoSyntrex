// Importando o componente de formulário
import CadastroFuncionarios from "../../components/CadastroFuncionarios/CadastroFuncionarios";

// Importando o componente do bootstrap
import Container from "react-bootstrap/Container";

const CadastrarFuncionarios = () => {
  return (
    <div>
      <Container>

       <CadastroFuncionarios page="funcionarios/cadastrar" />
      </Container>
    </div>
  );
};

export default CadastrarFuncionarios;