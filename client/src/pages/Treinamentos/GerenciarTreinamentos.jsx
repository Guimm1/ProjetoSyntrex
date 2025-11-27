import { useEffect, useState } from "react";
import { useListaTreinamentos, useExcluirTreinamentos } from "../../hooks/useTreinamentos";
import { useNavigate } from "react-router-dom";
import styles from "./GerenciarTreinamentos.module.css";

export default function GerenciarTreinamentos() {
  const navigate = useNavigate();

  const listaTreinamentos = useListaTreinamentos();
  const { ExcluirTreinamento } = useExcluirTreinamentos();

  const [treinamentos, setTreinamentos] = useState([]);
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState(null);

  // quando a lista mudar, atualiza
  useEffect(() => {
    setTreinamentos(listaTreinamentos);
  }, [listaTreinamentos]);

  const editar = () => {
    if (!selecionado) {
      alert("Selecione um item para editar.");
      return;
    }

    navigate(`/treinamentos/editar/${selecionado}`);
  };

  const excluir = async () => {
    if (!selecionado) {
      alert("Selecione um item para excluir.");
      return;
    }

    if (!confirm("Tem certeza que quer excluir este treinamento?")) return;

    await ExcluirTreinamento(selecionado);

    setTreinamentos(treinamentos.filter((t) => t.id !== selecionado));
    setSelecionado(null);
  };

  const filtrados = treinamentos.filter((t) =>
    t.colaborador?.toLowerCase()?.includes(busca.toLowerCase())
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

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Gerenciar treinamentos Oi</h1>

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
              <td>{t.descricao || "—"}</td>
              <td>{t.nomeTreinamento || "—"}</td>
              <td>
                <span className={`${styles.status} ${getStatusColor(t.status)}`}>
                  {t.status || "EM ABERTO"}
                </span>
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
