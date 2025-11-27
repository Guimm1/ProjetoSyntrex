import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import {
  useCadastrarFuncionario,
  useEditarFuncionario,
} from "../../hooks/useFuncionarios";
import { useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const CadastroFuncionarios = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { CadastrarFuncionario } = useCadastrarFuncionario();
  const { EditarFuncionario } = useEditarFuncionario();

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
          maxWidth: "900px",
          textAlign: "left",
          padding: "40px 50px",
        }}
      >
        <h2
          style={{
            fontWeight: "bold",
            fontSize: "36px",
            marginBottom: "50px",
            textAlign: "center",
          }}
        >
          {id ? "Editar Funcionário" : "Cadastrar Funcionário"}
        </h2>

        <Form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            alignItems: "center",
          }}
        >
          <div style={{
              display: "flex",
              alignItems: "center",
              width: "130%",
              maxWidth: "900px",
              gap: "20px",
            }}>

           <Form.Label style={{
                flex: "0 0 230px",
                textAlign: "right",
                fontWeight: "500",
                fontSize: "18px",
                whiteSpace: "nowrap",}}>
                Nome do funcionário
                </Form.Label>    


          <Form.Control
            type="text"
            {...register("nome")}
            style={{ width: "130%", height: "50px" }}
          />
          </div>

          
          <div style={{
              display: "flex",
              alignItems: "center",
              width: "130%",
              maxWidth: "900px",
              gap: "20px",
            }}>
          <Form.Label style={{
                flex: "0 0 230px",
                textAlign: "right",
                fontWeight: "500",
                fontSize: "18px",
                whiteSpace: "nowrap",}}>
                Matrícula
                </Form.Label>    


          <Form.Control
            type="text"
            {...register("matricula")}
            style={{ width: "130%", height: "50px" }}
          />
          </div>
          <div style={{
              display: "flex",
              alignItems: "center",
              width: "130%",
              maxWidth: "900px",
              gap: "20px",
            }}>
          <Form.Label style={{
                flex: "0 0 230px",
                textAlign: "right",
                fontWeight: "500",
                fontSize: "18px",
                whiteSpace: "nowrap",}}>
                Função
                </Form.Label>    


          <Form.Control
            type="text"
            {...register("funcao")}
            style={{ width: "130%", height: "50px" }}
          />
         </div>
         
          <Button
            type="submit"
            style={{
              backgroundColor: "#15966B",
              border: "none",
              width: "180px",
              height: "48px",
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
