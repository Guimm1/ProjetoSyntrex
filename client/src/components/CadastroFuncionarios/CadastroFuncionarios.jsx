import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import {
  useCadastrarFuncionario,
  useEditarFuncionario,
} from "../../hooks/useFuncionarios";
import { useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useListaFuncionarios } from "../../hooks/useFuncionarios";

const CadastroFuncionarios = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { CadastrarFuncionario } = useCadastrarFuncionario();
  const { EditarFuncionario } = useEditarFuncionario();

  const funcionarios = useListaFuncionarios();

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/funcionarios/${id}`)
        .then((r) => r.json())
        .then((f) => {
          setValue("nome", f.nome);
          setValue("matricula", f.matricula);
          setValue("funcao", f.funcao);
        });
    }
  }, [id]);

  const onSubmit = async (data) => {
    // Verificar duplicidade de matrícula
    const matriculaTrim = (data.matricula || "").toString().trim();
    const existente = funcionarios.find((f) => f.matricula === matriculaTrim);

    if (existente && (!id || existente.id !== id)) {
      alert("Matrícula já existe. Escolha outra matrícula ou edite o funcionário existente.");
      return;
    }

    if (id) await EditarFuncionario(id, data);
    else await CadastrarFuncionario(data);

    alert("Salvo com sucesso!");
    navigate("/funcionarios/gerenciar");
  };

  return (
    <div
      style={{
        color: "white",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#223773",
        padding: "40px 0",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          textAlign: "left",
          backgroundColor: "#223773",
          padding: "40px 50px",
        }}
      >
        <h2
          style={{
            fontWeight: "bold",
            fontSize: "36px",
            marginBottom: "50px",
            marginLeft: "90px",
          }}
        >
          {id ? "Editar Funcionário" : "Cadastrar Funcionário"}
        </h2>

        <Form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "25px",
            alignItems: "center",
          }}
        >
          {/* Campo: Nome do funcionário */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: "600px",
              gap: "20px",
            }}
          >
            <Form.Label
              style={{
                flex: "0 0 230px",
                textAlign: "right",
                fontWeight: "500",
                fontSize: "18px",
                whiteSpace: "nowrap",
              }}
            >
              Nome do funcionário
            </Form.Label>
            <Form.Control
              type="text"
              {...register("nome")}
              style={{
                flex: "1",
                height: "50px",
                minWidth: "350px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #fff",
                padding: "10px 14px",
                backgroundColor: "white",
                color: "#000",
                width: "100%",
              }}
            />
          </div>

          {/* Campo: Matrícula */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: "600px",
              gap: "20px",
            }}
          >
            <Form.Label
              style={{
                flex: "0 0 230px",
                textAlign: "right",
                fontWeight: "500",
                fontSize: "18px",
                whiteSpace: "nowrap",
              }}
            >
              Matrícula
            </Form.Label>
            <Form.Control
              type="text"
              {...register("matricula")}
              style={{
                flex: "1",
                height: "50px",
                minWidth: "350px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #fff",
                padding: "10px 14px",
                backgroundColor: "white",
                color: "#000",
                width: "100%",
              }}
            />
          </div>

          {/* Campo: Função */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: "600px",
              gap: "20px",
            }}
          >
            <Form.Label
              style={{
                flex: "0 0 230px",
                textAlign: "right",
                fontWeight: "500",
                fontSize: "18px",
                whiteSpace: "nowrap",
              }}
            >
              Função
            </Form.Label>
            <Form.Control
              type="text"
              {...register("funcao")}
              style={{
                flex: "1",
                height: "50px",
                minWidth: "350px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #fff",
                padding: "10px 14px",
                backgroundColor: "white",
                color: "#000",
                width: "100%",
              }}
            />
          </div>

          <Button
            type="submit"
            style={{
              backgroundColor: "#15966B",
              border: "none",
              width: "220px",
              height: "50px",
              fontSize: "18px",
              fontWeight: "600",
              marginTop: "40px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            }}
          >
            SALVAR
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CadastroFuncionarios;
