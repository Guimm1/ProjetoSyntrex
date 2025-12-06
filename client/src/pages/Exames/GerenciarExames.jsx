import { useEffect, useState } from "react";
import { useListaExames, useExcluirExames } from "../../hooks/useExames";
import { useListaFuncionarios } from "../../hooks/useFuncionarios";
import { useNavigate } from "react-router-dom";
import styles from "./GerenciarExames.module.css";

export default function GerenciarExames() {
  const navigate = useNavigate();

  const listaExames = useListaExames();
  const funcionarios = useListaFuncionarios();
  const { ExcluirExame } = useExcluirExames();

  const [exames, setExames] = useState([]);
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState(null);

  // quando a lista mudar, atualiza
  useEffect(() => {
    setExames(listaExames);
  }, [listaExames]);

  const editar = () => {
    if (!selecionado) {
      alert("Selecione um item para editar.");
      return;
    }

    navigate(`/exames/editar/${selecionado}`);
  };

  const excluir = async () => {
    if (!selecionado) {
      alert("Selecione um item para excluir.");
      return;
    }

    if (!confirm("Tem certeza que quer excluir este exame?")) return;

    await ExcluirExame(selecionado);

    setExames(exames.filter((e) => e.id !== selecionado));
    setSelecionado(null);
  };

  const filtrados = exames.filter((e) =>
    e.colaborador?.toLowerCase()?.includes(busca.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "VENCIDO":
        return styles.statusVencido;
      case "PRÓX DO VENCIMENTO":
        return styles.statusProximo;
      default:
        return styles.statusAberto;
    }
  };

  // Função para obter a função do colaborador
  const obterFuncao = (colaborador, funcaoExame) => {
    // Se já tem função no exame, usar
    if (funcaoExame) return funcaoExame;
    
    // Caso contrário, buscar do funcionário
    const func = funcionarios.find((f) => f.nome === colaborador);
    return func?.funcao || "—";
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Gerenciar exames</h1>

      <input
        type="text"
        placeholder="Buscar colaborador..."
        className={styles.busca}
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <table className={styles.tabela}>
        <thead>
          <tr>
            <th></th>
            <th>NOME</th>
            <th>FUNÇÃO</th>
            <th>EXAME</th>
            <th>STATUS</th>
          </tr>
        </thead>

        <tbody>
          {filtrados.map((e) => (
            <tr key={e.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selecionado === e.id}
                  onChange={() => setSelecionado(e.id)}
                />
              </td>
              <td>{e.colaborador || "—"}</td>
              <td>{obterFuncao(e.colaborador, e.funcao)}</td>
              <td>{e.nomeExame || "—"}</td>
              <td>
                <span className={`${styles.status} ${getStatusColor(e.status)}`}>
                  {e.status || "EM ABERTO"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.botoes}>
        <button
          className={styles.cadastrar}
          onClick={() => navigate("/exames/cadastrar")}
        >
          Cadastrar Novo
        </button>

        <button className={styles.editar} onClick={editar}>
          Editar
        </button>

        <button className={styles.excluir} onClick={excluir}>
          Excluir
        </button>
      </div>
    </div>
  );
}
