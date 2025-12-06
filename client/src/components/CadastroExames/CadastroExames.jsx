import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useCadastrarExame, useEditarExames, useListaCategoriaExames, useListaExames } from "../../hooks/useExames";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useListaFuncionarios } from "../../hooks/useFuncionarios";

const CadastroExames = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { CadastrarExame } = useCadastrarExame();
  const { EditarExame } = useEditarExames();

  const [carregando, setCarregando] = useState(false);
  const [exame, setExame] = useState(null);
  const funcionarios = useListaFuncionarios();
  const categoriasExames = useListaCategoriaExames();
  const examesListados = useListaExames();
  const [funcaoSelecionada, setFuncaoSelecionada] = useState("");


  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const colaboradorSelecionado = watch("colaborador");

   // Buscar dados do treinamento ANTES de montar o form
   async function buscarExamePorId(id) {
    try {
      setCarregando(true);
      const res = await fetch(`http://localhost:5000/exames/${id}`);
      if (!res.ok) throw new Error("Erro ao buscar exame");
      const dados = await res.json();
      // Garantir que o campo nomeExame corresponda ao ID da categoria
      if (dados && dados.nomeExame) {
        const cat = categoriasExames.find((c) => String(c.nome) === String(dados.nomeExame));
        if (cat) {
          dados.nomeExame = String(cat.id);
        }
      }

      setExame(dados); // <<< SALVA O EXAME
    } catch (error) {
      alert("Erro ao carregar dados do exame para edição");
    } finally {
      setCarregando(false);
    }
  }
  useEffect(() => {
    if (id) {
      buscarExamePorId(id);
    }
  }, [id]);

  // Quando os dados chegarem → preencher o form
  useEffect(() => {
    if (exame) {
      reset(exame);
      setFuncaoSelecionada(exame.funcao || "");
    }
  }, [exame, reset]);

  // Se as categorias chegarem depois do exame, garantir que o select
  // mostre a opção correta (converter nome -> id)
  useEffect(() => {
    if (exame && categoriasExames && categoriasExames.length) {
      const atual = exame;
      const found = categoriasExames.find((c) => String(c.nome) === String(atual.nomeExame));
      if (found && String(atual.nomeExame) !== String(found.id)) {
        atual.nomeExame = String(found.id);
        reset(atual);
      }
    }
  }, [categoriasExames, exame, reset]);

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
    // Validar se colaborador foi selecionado
    if (!data.colaborador) {
      alert("Por favor, selecione um colaborador!");
      return;
    }

    // Converter ID para nome do exame (comparar como string)
    const exameSelecionado = categoriasExames.find(e => String(e.id) === String(data.nomeExame));
    
    // Validar se exame foi selecionado
    if (!exameSelecionado) {
      alert("Por favor, selecione um exame válido!");
      return;
    }
    
    // Validar duplicidade: mesmo funcionário não pode ter o mesmo exame
    if (!id) {
      const existe = examesListados.some(
        ex => ex.colaborador === data.colaborador && ex.nomeExame === exameSelecionado.nome
      );
      
      if (existe) {
        alert(`O exame "${exameSelecionado.nome}" já está atribuido para o funcionário ${data.colaborador}!`);
        return;
      }
    }

    // Substituir ID pelo nome do exame
    data.nomeExame = exameSelecionado.nome;

    // Adicionar a função ao objeto de dados
    data.funcao = funcaoSelecionada;
    
    // Se for novo, definir status inicial e createdAt
    if (!id) {
      data.status = data.status || "EM ABERTO";
      data.createdAt = new Date().toISOString();
    }
    
    if (id) {
      const res = await EditarExame(id, data);
      if (res) {
        alert("Exame atualizado com sucesso!");
        navigate("/exames/gerenciar");
      } else {
        alert("Erro ao atualizar exame");
      }
    } else {
      const res = await CadastrarExame(data);
      if (res) {
        alert("Exame atribuido com sucesso!");
        navigate("/exames/gerenciar");
      } else {
        alert("Erro ao cadastrar exame");
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
          {id ? "Editar Exame" : "Atribuir Exame"}
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

          {/* Campo: Nome do Exame */}
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
              Nome do Exame
            </Form.Label>
            <Form.Select
              {...register("nomeExame", { required: true })}
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
              <option value="">Selecionar exame</option>
              {categoriasExames.map((cat) => (
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

          {/* Botão SALVAR */}
          {id && (
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
                Status
              </Form.Label>
              <Form.Select
                {...register("status")}
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
                <option value="EM ABERTO">EM ABERTO</option>
                <option value="PRÓX DO VENCIMENTO">PRÓX DO VENCIMENTO</option>
                <option value="PENDENTE">PENDENTE</option>
                <option value="CONCLUIDO">CONCLUIDO</option>
              </Form.Select>
            </div>
          )}
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
