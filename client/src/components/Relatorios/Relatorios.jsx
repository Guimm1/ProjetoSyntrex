import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Status from "../Status/Status";
import styles from "./Relatorios.module.css";

const Relatorios = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [exames, setExames] = useState([]);
  const [treinamentos, setTreinamentos] = useState([]);
  const [busca, setBusca] = useState("");

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
      const funcionario = funcionarios.find(
        f => f.nome?.toLowerCase() === exame.colaborador?.toLowerCase()
      );

      combinado.push({
        nome: exame.colaborador || "—",
        funcao: funcionario?.funcao || "—",
        treinamento: "—",
        exame: exame.nomeExame,
        validade: exame.validade
      });
    });

    // --- Treinamentos ---
    treinamentos.forEach(trein => {
      const funcionario = funcionarios.find(
        f => f.nome?.toLowerCase() === trein.colaborador?.toLowerCase()
      );

      combinado.push({
        nome: trein.colaborador || "—",
        funcao: funcionario?.funcao || "—",
        treinamento: trein.nomeTreinamento,
        exame: "—",
        validade: trein.validade
      });
    });

    return combinado;
  }, [funcionarios, exames, treinamentos]);

  // ==== FILTRO ============================================================
  const filtrado = dados.filter(item =>
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

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
            placeholder="Buscar colaborador..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
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
                  <td><Status validade={item.validade} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.bottomRow}>
          <button className={styles.exportBtn} onClick={exportarExcel}>
            📥 Exportar para Excel
          </button>
        </div>

      </div>
    </div>
  );
};

export default Relatorios;
