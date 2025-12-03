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
    <div className={styles.container}>
          <h1 className={styles.titulo}>Gerenciar treinamentos</h1>
    
          <input
            type="text"
            placeholder="Buscar colaborador..."
            className={styles.busca}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

        <div className={styles.tabela}>
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

        <div className={styles.botoes}>
          <button className={styles.cadastrar} onClick={handleNovo}>
            Cadastrar Novo
          </button>
          <button className={styles.editar} onClick={handleEditar}>
            Editar
          </button>
          <button className={styles.excluir} onClick={handleExcluir}>
            Desativar
          </button>
        </div>
    </div>
  );
};

export default GerenciarFuncionarios;
