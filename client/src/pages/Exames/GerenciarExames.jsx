import { useEffect, useState } from "react";
import { useListaExames, useExcluirExames, useListaExamesTodos, useReativarExames } from "../../hooks/useExames";
import { useListaFuncionarios } from "../../hooks/useFuncionarios";
import { useNavigate } from "react-router-dom";
import styles from "./GerenciarExames.module.css";
import computeStatus from "../../utils/computeStatus";

export default function GerenciarExames() {
  const navigate = useNavigate();

  const listaExames = useListaExames();
  const listaExamesTodos = useListaExamesTodos();
  const funcionarios = useListaFuncionarios();
  const { ExcluirExame } = useExcluirExames();
  const { ReativarExame } = useReativarExames();

  const [exames, setExames] = useState([]);
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState(null);
  const [viewMode, setViewMode] = useState("ativos");

  // quando a lista mudar, atualiza dependendo do modo
  useEffect(() => {
    if (viewMode === "ativos") setExames(listaExames);
    else setExames((listaExamesTodos || []).filter((e) => e.active === false));
    setSelecionado(null);
  }, [listaExames, listaExamesTodos, viewMode]);

  const editar = () => {
    if (!selecionado) {
      alert("Selecione um item para editar.");
      return;
    }

    navigate(`/exames/editar/${selecionado}`);
  };

  const excluir = async () => {
    if (!selecionado) {
      alert(`Selecione um item para ${viewMode === "ativos" ? "desativar" : "reativar"}.`);
      return;
    }

    if (viewMode === "ativos") {
      if (!confirm("Tem certeza que quer desativar este exame?")) return;
      await ExcluirExame(selecionado);
      setExames(exames.filter((e) => e.id !== selecionado));
      setSelecionado(null);
    } else {
      if (!confirm("Deseja reativar este exame?")) return;
      await ReativarExame(selecionado);
      setExames(exames.filter((e) => e.id !== selecionado));
      setSelecionado(null);
    }
  };

    const filtrados = exames.filter((e) => {
    const q = (busca || "").trim().toLowerCase();
    if (!q) return true;

    const funcaoDoRegistro = obterFuncao(e.colaborador, e.funcao);

    return [
      e.colaborador,
      funcaoDoRegistro,
      e.nomeExame,
      e.descricao,
      e.funcao
    ].some((f) => String(f || "").toLowerCase().includes(q));
  });

      const getStatusColor = (status) => {
    switch (status) {
      case "VENCIDO":
        return styles.statusVencido;      // vermelho
      case "PENDENTE":
        return styles.statusPendente;     // cinza
      case "PRÓX DO VENCIMENTO":
        return styles.statusProximo;      // amarelo
      case "CONCLUIDO":
        return styles.statusConcluido;    // verde
      case "EM DIA":
        return styles.statusEmDia;        // azul claro
      default:
        return styles.statusAberto;       // cinza
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
        placeholder="Buscar"
        className={styles.busca}
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div style={{ marginTop: 12, marginBottom: 18 }}>
        <label style={{ color: "white", marginRight: 8 }}>Ver:</label>
        <select value={viewMode} onChange={(e) => setViewMode(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
          <option value="ativos">Apenas Ativos</option>
          <option value="desativados">Desativados</option>
        </select>
      </div>

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
                {(() => {
                  const statusAtual = computeStatus(e, 30);
                  return (
                    <span className={`${styles.status} ${getStatusColor(statusAtual)}`}>
                      {statusAtual}
                    </span>
                  );
                })()}
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
          Atribuir Novo
        </button>

        <button className={styles.editar} onClick={editar}>
          Editar
        </button>

        <button className={styles.excluir} onClick={excluir}>
          Desativar
        </button>
      </div>
    </div>
  );
}
