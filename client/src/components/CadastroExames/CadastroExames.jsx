import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useAtribuirExame, useEditarExames} from "../../hooks/useExames";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const CadastroExames = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { AtribuirExame } = useAtribuirExame();
  const { EditarExame } = useEditarExames();

  const [carregando, setCarregando] = useState(false);
  const [exame, setExame] = useState(null);  // <<< ADICIONADO


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

   // Buscar dados do treinamento ANTES de montar o form
   async function buscarExamePorId(id) {
    try {
      setCarregando(true);
      const res = await fetch(`http://localhost:5000/atribuicaoexames/${id}`);
      if (!res.ok) throw new Error("Erro ao buscar exame");
      const dados = await res.json();
      setExame(dados); // <<< SALVA O TREINAMENTO
    } catch (error) {
      alert("Erro ao carregar dados do exame para edição");
    } finally {
      setCarregando(false);
    }
  }

  // Se existir ID → buscar dados para edição
  useEffect(() => {
    if (id) {
      buscarExamePorId(id);
    }
  }, [id]);

  // Quando os dados chegarem → preencher o form
  useEffect(() => {
    if (exame) {
      reset(exame);
    }
  }, [exame, reset]);

  // Ao salvar
  const onSubmit = async (data) => {
    if (id) {
      const res = await EditarExame(id, data);
      if (res) {
        alert("Exame atualizado com sucesso!");
        navigate("/exames/gerenciar");
      } else {
        alert("Erro ao atualizar exame");
      }
    } else {
      const res = await AtribuirExame(data);
      if (res) {
        alert("Exame atribuido com sucesso!");
        navigate("/exames/gerenciar");
      } else {
        alert("Erro ao Atribuir exame");
      }
    }
  };

  if (carregando) {
    return (
      <div
        style={{
          color: "white",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#223773",
          fontSize: "26px",
        }}
      >
        Carregando...
      </div>
    );
  }

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
            marginLeft:"100px",
            marginBottom:"50px"
           
          }}

        >
        Atribuir Exame
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
          {/* Campo: Nome do colaborador */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "130%",
              maxWidth: "900px",
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
              Nome do colaborador
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Buscar colaborador ou Matrícula"
              {...register("colaborador", { required: true })}
              style={{
                flex: "1",
                height: "50px",
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

          {/* Campo: Nome do Exame */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "130%",
              maxWidth: "900px",
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
              Nome do Exame
            </Form.Label>
            <Form.Control
              type="text"
              {...register("nomeExame", { required: true })}
              style={{
                flex: "1",
                height: "50px",
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

          {/* Campo: Descrição */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "130%",
              maxWidth: "900px",
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
              Descrição
            </Form.Label>
            <Form.Control
              type="text"
              {...register("descricao", { required: true })}
              style={{
                flex: "1",
                height: "50px",
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

          {/* Campo: Validade */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "130%",
              maxWidth: "900px",
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
              Validade (em meses)
            </Form.Label>
            <Form.Control
              type="number"
              {...register("validade", { required: true, min: 1 })}
              style={{
                flex: "1",
                height: "50px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #fff",
                padding: "10px 14px",
                backgroundColor: "white",
                color: "#000",
                width: "130%",
              }}
            />
          </div>

          {/* Botão SALVAR */}
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

export default CadastroExames;
