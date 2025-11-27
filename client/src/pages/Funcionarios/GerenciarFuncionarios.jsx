import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import styles from "./GerenciarFuncionarios.module.css";
import { useDeletarFuncionario } from "../../hooks/useFuncionarios";
import { useNavigate } from "react-router-dom";

const GerenciarFuncionarios = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();
  const { DeletarFuncionario } = useDeletarFuncionario();

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    const res = await fetch("http://localhost:5000/funcionarios");
    const data = await res.json();
    setFuncionarios(data);
  };

  const handleNovo = () => navigate("/funcionarios/cadastrar");
  const handleEditar = () => {
    const marcado = funcionarios.find((f) => f._selecionado);
    if (!marcado) return alert("Selecione um funcionário!");
    navigate(`/funcionarios/editar/${marcado.id}`);
  };

  const handleExcluir = async () => {
    const marcado = funcionarios.find((f) => f._selecionado);
    if (!marcado) return alert("Selecione um funcionário!");
    await DeletarFuncionario(marcado.id);
    carregar();
  };

  const handleCheck = (id) => {
    setFuncionarios(
      funcionarios.map((f) => ({
        ...f,
        _selecionado: f.id === id,
      }))
    );
  };

  const filtrados = funcionarios.filter((f) =>
    f.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className={styles["container-pagina"]}>
      <div className={styles["sidebar-placeholder"]} />

      <main className={styles["main-content"]}>
        <h1 className={styles["titulo-pagina"]}>Gerenciar Funcionários</h1>

        <div className={styles["search-wrapper"]}>
          <div className={styles["search-box"]}>
            <FiSearch size={18} />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar colaborador..."
            />
          </div>
        </div>

        <div className={styles["table-container"]}>
          <table>
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
                      checked={f._selecionado || false}
                      onChange={() => handleCheck(f.id)}
                    />
                  </td>
                  <td>{f.nome}</td>
                  <td>{f.funcao}</td>
                  <td>{f.matricula}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles["botoes-container"]}>
          <button className={`${styles.btn} ${styles["btn-novo"]}`} onClick={handleNovo}>
            Cadastrar Novo
          </button>
          <button className={`${styles.btn} ${styles["btn-editar"]}`} onClick={handleEditar}>
            Editar
          </button>
          <button className={`${styles.btn} ${styles["btn-desativar"]}`} onClick={handleExcluir}>
            Desativar
          </button>
        </div>
      </main>
    </div>
  );
};

export default GerenciarFuncionarios;
