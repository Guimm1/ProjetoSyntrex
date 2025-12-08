import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Status from "../Status/Status";
import computeStatus from "../../utils/computeStatus";
import styles from "./Relatorios.module.css";

const Relatorios = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [exames, setExames] = useState([]);
  const [treinamentos, setTreinamentos] = useState([]);
  const [busca, setBusca] = useState("");
  const [activeFilter, setActiveFilter] = useState("todos"); // 'todos' | 'ativos' | 'desativados'

  // ==== CARREGAR DADOS ===================================================
  useEffect(() => {
    axios.get("http://localhost:5000/funcionarios")
      .then(res => setFuncionarios(res.data));

    axios.get("http://localhost:5000/exames")
      .then(res => setExames(res.data));

    axios.get("http://localhost:5000/treinamentos")
      .then(res => setTreinamentos(res.data));
  }, []);

  // ==== MONTAR TABELA =====================================================
  const dados = useMemo(() => {
    let combinado = [];

    // --- Exames ---
    exames.forEach(exame => {
      if (!exame.colaborador) return; // Pular exames sem colaborador
      const funcionario = funcionarios.find(
        f => f.nome?.toLowerCase() === exame.colaborador?.toLowerCase()
      );

        // calcular status e, se concluído, anexar data de conclusão
        const st = computeStatus(exame);
        // ignorar registros marcados 'CONCLUIDO' sem completedAt
        if (st === "CONCLUIDO" && !exame.completedAt) return;
        let statusDisplay = st;
        if (st === "CONCLUIDO" && exame.completedAt) {
          const d = new Date(exame.completedAt);
          const dd = String(d.getDate()).padStart(2, "0");
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const yyyy = d.getFullYear();
          statusDisplay = `CONCLUIDO em ${dd}/${mm}/${yyyy}`;
        }

        combinado.push({
          nome: exame.colaborador || "—",
          funcao: funcionario?.funcao || "—",
          treinamento: "—",
          exame: exame.nomeExame,
          validade: exame.validade,
          status: statusDisplay,
          active: exame.active === undefined ? true : exame.active
        });
    });

    // --- Treinamentos ---
    treinamentos.forEach(trein => {
      if (!trein.colaborador) return; // Pular treinamentos sem colaborador
      const funcionario = funcionarios.find(
        f => f.nome?.toLowerCase() === trein.colaborador?.toLowerCase()
      );

        const st = computeStatus(trein);
        // ignorar registros marcados 'CONCLUIDO' sem completedAt
        if (st === "CONCLUIDO" && !trein.completedAt) return;
        let statusDisplay = st;
        if (st === "CONCLUIDO" && trein.completedAt) {
          const d = new Date(trein.completedAt);
          const dd = String(d.getDate()).padStart(2, "0");
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const yyyy = d.getFullYear();
          statusDisplay = `CONCLUIDO em ${dd}/${mm}/${yyyy}`;
        }

        combinado.push({
          nome: trein.colaborador || "—",
          funcao: funcionario?.funcao || "—",
          treinamento: trein.nomeTreinamento,
          exame: "—",
          validade: trein.validade,
          status: statusDisplay,
          active: trein.active === undefined ? true : trein.active
        });
    });

    return combinado;
  }, [funcionarios, exames, treinamentos]);

  // ==== FILTRO ============================================================
  const filtrado = dados.filter(item => {
    const q = (busca || "").trim().toLowerCase();

    // se não houver query, passa por todos (aplica apenas filtro active)
    const matchQuery = !q || [
      item.nome,
      item.funcao,
      item.exame,
      item.treinamento,
    ].some((f) => String(f || "").toLowerCase().includes(q));

    if (!matchQuery) return false;

    if (activeFilter === "todos") return true;
    if (activeFilter === "ativos") return item.active !== false;
    if (activeFilter === "desativados") return item.active === false;
    return true;
  });

  // ==== EXPORTAR CSV ======================================================
  const exportarExcel = () => {
    const cabecalho = ["Nome", "Função", "Treinamento", "Exame", "Validade"];
    const linhas = filtrado.map(item =>
      [item.nome, item.funcao, item.treinamento, item.exame, item.validade]
        .map(v => `"${v}"`).join(",")
    );

    const conteudo = [cabecalho.join(","), ...linhas].join("\n");
    const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "relatorio.csv";
    a.click();
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <h1 className={styles.title}>Relatório de treinamentos e exames</h1>

        <div className={styles.topRow}>
          <input
            type="text"
            className={styles.search}
            placeholder="Buscar por nome, função, exame ou treinamento..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          <div style={{ marginLeft: 12 }}>
            <label style={{ marginRight: 8, color: '#223773', fontWeight: 600 }}>Mostrar:</label>
            <select value={activeFilter} onChange={e => setActiveFilter(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
              <option value="todos">Todos</option>
              <option value="ativos">Apenas Ativos</option>
              <option value="desativados">Desativados</option>
            </select>
          </div>
        </div>

        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>NOME</th>
                <th>FUNÇÃO</th>
                <th>TREINAMENTO</th>
                <th>EXAME</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {filtrado.map((item, index) => (
                <tr key={index}>
                  <td>{item.nome}</td>
                  <td>{item.funcao}</td>
                  <td>{item.treinamento}</td>
                  <td>{item.exame}</td>
                    <td><Status value={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.bottomRow}>
          <button className={styles.exportBtn} onClick={exportarExcel}>
             Exportar para Excel
          </button>
        </div>

      </div>
    </div>
  );
};

export default Relatorios;
