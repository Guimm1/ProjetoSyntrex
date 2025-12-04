import { useEffect, useState } from "react";
import { useListaFuncionarios, useDeletarFuncionario } from "../../hooks/useFuncionarios";
import { useNavigate } from "react-router-dom";
import styles from "./GerenciarFuncionarios.module.css";

export default function GerenciarFuncionarios() {
  const navigate = useNavigate();

  const listaFuncionarios = useListaFuncionarios();
  const { DeletarFuncionario } = useDeletarFuncionario();

  const [funcionarios, setFuncionarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState(null);

  // quando a lista mudar, atualiza
  useEffect(() => {
    setFuncionarios(listaFuncionarios);
  }, [listaFuncionarios]);

  const editar = () => {
    if (!selecionado) {
      alert("Selecione um item para editar.");
      return;
    }

    navigate(`/funcionarios/editar/${selecionado}`);
  };

  const excluir = async () => {
    if (!selecionado) {
      alert("Selecione um item para excluir.");
      return;
    }

    if (!confirm("Tem certeza que quer excluir este treinamento?")) return;

    await DeletarFuncionario(selecionado);

    setFuncionarios(funcionarios.filter((f) => f.id !== selecionado));
    setSelecionado(null);
  };

  const filtrados = funcionarios.filter((f) =>
    f.colaborador?.toLowerCase()?.includes(busca.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Gerenciar funcionarios</h1>

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
            <th>MATRÍCULA</th>
          </tr>
        </thead>

        <tbody>
          {filtrados.map((f) => (
            <tr key={f.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selecionado === f.id}
                  onChange={() => setSelecionado(f.id)}
                />
              </td>
              <td>{f.nome || "—"}</td>
              <td>{f.funcao || "—"}</td>
              <td>{f.matricula || "—"}</td>
              <td>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.botoes}>
        <button
          className={styles.cadastrar}
          onClick={() => navigate("/funcionarios/cadastrar")}
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
