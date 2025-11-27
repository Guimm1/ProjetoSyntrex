import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useCadastrarTreinamentos, useEditarTreinamentos } from "../../hooks/useTreinamentos";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const CadastroTreinamento = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { CadastrarTreinamento } = useCadastrarTreinamentos();
  const { EditarTreinamento } = useEditarTreinamentos();

  const [carregando, setCarregando] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Função para buscar dados do treinamento pelo ID (fetch simples)
  async function buscarTreinamentoPorId(id) {
    try {
      setCarregando(true);
      const res = await fetch(`http://localhost:5000/treinamentos/${id}`);
      if (!res.ok) throw new Error("Erro ao buscar treinamento");
      const dados = await res.json();
      reset(dados); // preenche o form com os dados
    } catch (error) {
      alert("Erro ao carregar dados do treinamento para edição");
    } finally {
      setCarregando(false);
    }
  }

  // Ao montar o componente, se tiver id, buscar dados para preencher
  useEffect(() => {
    if (id) {
      buscarTreinamentoPorId(id);
    }
  }, [id]);

  // Função executada ao salvar (editar ou cadastrar)
  const onSubmit = async (data) => {
    if (id) {
      // editar
      const res = await EditarTreinamento(id, data);
      if (res) {
        alert("Treinamento atualizado com sucesso!");
        navigate("/treinamentos/gerenciar");
      } else {
        alert("Erro ao atualizar treinamento");
      }
    } else {
      // cadastrar
      const res = await CadastrarTreinamento(data);
      if (res) {
        alert("Treinamento cadastrado com sucesso!");
        navigate("/treinamentos/gerenciar");
      } else {
        alert("Erro ao cadastrar treinamento");
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
            marginBottom: "50px",
            marginLeft: "90px",
          }}
        >
          {id ? "Editar Treinamento" : "Cadastrar Treinamento"}
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

          {/* Campo: Nome do Treinamento */}
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
              Nome do Treinamento
            </Form.Label>
            <Form.Control
              type="text"
              {...register("nomeTreinamento", { required: true })}
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

export default CadastroTreinamento;
