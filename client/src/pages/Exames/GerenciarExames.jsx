import { useEffect, useState } from "react";
import { useListaAtribuirExames, useExcluirExames } from "../../hooks/useExames";
import { useNavigate } from "react-router-dom";
import styles from "./GerenciarExames.module.css";

export default function GerenciarExames() {
  const navigate = useNavigate();

  const listaAtribuirExames = useListaAtribuirExames();
  const { ExcluirExame } = useExcluirExames();

  const [atribuirexames, setAtribuirExames] = useState([]);
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState(null);

  // quando a lista mudar, atualiza
  useEffect(() => {
    setAtribuirExames(listaAtribuirExames);
  }, [listaAtribuirExames]);

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

    setAtribuirExames(atribuirexames.filter((e) => e.id !== selecionado));
    setSelecionado(null);
  };

  const filtrados = atribuirexames.filter((e) =>
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
              <td>{e.descricao || "—"}</td>
              <td>{e.nomeTreinamento || "—"}</td>
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
