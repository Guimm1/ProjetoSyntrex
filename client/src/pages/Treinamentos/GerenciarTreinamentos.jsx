import { useEffect, useState } from "react";
import { useListaTreinamentos, useExcluirTreinamentos, useListaTreinamentosTodos, useReativarTreinamentos } from "../../hooks/useTreinamentos";
import { useNavigate } from "react-router-dom";
import styles from "./GerenciarTreinamentos.module.css";
import computeStatus from "../../utils/computeStatus";

export default function GerenciarTreinamentos() {
  const navigate = useNavigate();

  const listaTreinamentos = useListaTreinamentos();
  const listaTreinamentosTodos = useListaTreinamentosTodos();
  const { ExcluirTreinamento } = useExcluirTreinamentos();
  const { ReativarTreinamento } = useReativarTreinamentos();

  const [treinamentos, setTreinamentos] = useState([]);
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState(null);
  const [viewMode, setViewMode] = useState("ativos"); // 'ativos' | 'desativados'

  // quando a lista mudar, atualiza dependendo do modo
  useEffect(() => {
    if (viewMode === "ativos") setTreinamentos(listaTreinamentos);
    else {
      // filtrar apenas os desativados
      setTreinamentos((listaTreinamentosTodos || []).filter((t) => t.active === false));
    }
    setSelecionado(null);
  }, [listaTreinamentos, listaTreinamentosTodos, viewMode]);

  const editar = () => {
    if (!selecionado) {
      alert("Selecione um item para editar.");
      return;
    }

    navigate(`/treinamentos/editar/${selecionado}`);
  };

  const excluir = async () => {
    if (!selecionado) {
      alert(`Selecione um item para ${viewMode === "ativos" ? "desativar" : "reativar"}.`);
      return;
    }

    if (viewMode === "ativos") {
      if (!confirm("Tem certeza que quer desativar este treinamento?")) return;

      await ExcluirTreinamento(selecionado);

      // Remover da lista de gerenciamento (mantém no banco para relatórios)
      setTreinamentos(treinamentos.filter((t) => t.id !== selecionado));
      setSelecionado(null);
    } else {
      // reativar
      if (!confirm("Deseja reativar este treinamento?")) return;
      await ReativarTreinamento(selecionado);
      // remover da lista de desativados para não aparecer mais
      setTreinamentos(treinamentos.filter((t) => t.id !== selecionado));
      setSelecionado(null);
    }
  };

    const filtrados = treinamentos.filter((t) => {
    const q = (busca || "").trim().toLowerCase();
    if (!q) return true;

    return [
      t.colaborador,
      t.funcao,
      t.nomeTreinamento,
      t.descricao
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

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Gerenciar treinamentos</h1>

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
            <th>TREINAMENTO</th>
            <th>STATUS</th>
          </tr>
        </thead>

        <tbody>
          {filtrados.map((t) => (
            <tr key={t.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selecionado === t.id}
                  onChange={() => setSelecionado(t.id)}
                />
              </td>
              <td>{t.colaborador || "—"}</td>
              <td>{t.funcao || "—"}</td>
              <td>{t.nomeTreinamento || "—"}</td>
              <td>
                {(() => {
                  const statusAtual = computeStatus(t, 30);
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
          onClick={() => navigate("/treinamentos/cadastrar")}
        >
          Atribuir Novo
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
