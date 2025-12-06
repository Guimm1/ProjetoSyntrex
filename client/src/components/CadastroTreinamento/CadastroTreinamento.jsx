import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useCadastrarTreinamentos, useEditarTreinamentos, useListaCategoriaTrainamentos } from "../../hooks/useTreinamentos";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useListaFuncionarios } from "../../hooks/useFuncionarios";

const CadastroTreinamento = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { CadastrarTreinamento } = useCadastrarTreinamentos();
  const { EditarTreinamento } = useEditarTreinamentos();

  const [carregando, setCarregando] = useState(false);
  const [treinamento, setTreinamento] = useState(null);
  const funcionarios = useListaFuncionarios();
  const categoriasTrainamentos = useListaCategoriaTrainamentos();
  const [funcaoSelecionada, setFuncaoSelecionada] = useState("");
  const [erroValidacao, setErroValidacao] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const colaboradorSelecionado = watch("colaborador");

  // Buscar dados do treinamento ANTES de montar o form
  async function buscarTreinamentoPorId(id) {
    try {
      setCarregando(true);
      const res = await fetch(`http://localhost:5000/treinamentos/${id}`);
      if (!res.ok) throw new Error("Erro ao buscar treinamento");
      const dados = await res.json();
      setTreinamento(dados); // <<< SALVA O TREINAMENTO
    } catch (error) {
      alert("Erro ao carregar dados do treinamento para edição");
    } finally {
      setCarregando(false);
    }
  }

  // Se existir ID → buscar dados para edição
  useEffect(() => {
    if (id) {
      buscarTreinamentoPorId(id);
    }
  }, [id]);

  // Quando os dados chegarem → preencher o form
  useEffect(() => {
    if (treinamento) {
      reset(treinamento);
      setFuncaoSelecionada(treinamento.funcao || "");
    }
  }, [treinamento, reset]);

  // Quando o colaborador mudar, atualizar a função
  useEffect(() => {
    if (colaboradorSelecionado) {
      const funcSelecionada = funcionarios.find(
        (f) => f.nome === colaboradorSelecionado
      );
      if (funcSelecionada) {
        setFuncaoSelecionada(funcSelecionada.funcao);
      }
    }
  }, [colaboradorSelecionado, funcionarios]);

  // Ao salvar
  const onSubmit = async (data) => {
    // Converter ID para nome do treinamento
    const treinamentoSelecionado = categoriasTrainamentos.find(t => t.id === parseInt(data.nomeTreinamento));
    
    // Validar duplicidade: mesmo funcionário não pode ter o mesmo treinamento
    if (!id && data.colaborador && treinamentoSelecionado) {
      const existe = treinamento?.some(
        t => t.colaborador === data.colaborador && t.nomeTreinamento === treinamentoSelecionado.nome
      );
      
      if (existe) {
        alert("Este colaborador já possui este treinamento cadastrado!");
        return;
      }
    }

    // Substituir ID pelo nome do treinamento
    data.nomeTreinamento = treinamentoSelecionado?.nome || data.nomeTreinamento;

    // Adicionar a função ao objeto de dados
    data.funcao = funcaoSelecionada;
    
    if (id) {
      const res = await EditarTreinamento(id, data);
      if (res) {
        alert("Treinamento atualizado com sucesso!");
        navigate("/treinamentos/gerenciar");
      } else {
        alert("Erro ao atualizar treinamento");
      }
    } else {
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
              Nome do colaborador
            </Form.Label>
            <Form.Select
              {...register("colaborador", { required: true })}
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
            >
              <option value="">Selecionar colaborador</option>
              {funcionarios.map((func) => (
                <option key={func.id} value={func.nome}>
                  {func.nome}
                </option>
              ))}
            </Form.Select>
          </div>

          {/* Campo: Nome do Treinamento */}
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
              Nome do Treinamento
            </Form.Label>
            <Form.Select
              {...register("nomeTreinamento", { required: true })}
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
            >
              <option value="">Selecionar treinamento</option>
              {categoriasTrainamentos.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </Form.Select>
          </div>

          {/* Campo: Descrição */}
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
              Descrição
            </Form.Label>
            <Form.Control
              type="text"
              {...register("descricao", { required: true })}
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

          {/* Campo: Validade */}
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
              Validade (em meses)
            </Form.Label>
            <Form.Control
              type="number"
              {...register("validade", { required: true })}
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

export default CadastroTreinamento;
