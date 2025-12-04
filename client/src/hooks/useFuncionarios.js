// url da API
const url = "http://localhost:5000";

import { useState, useEffect } from "react";

// LISTAR FUNCIONARIO
// Cria o hook para listar os Funcionarios, puxando os dados da api
export function useListaFuncionarios() {
  //Lista com Funcionarios
  const [funcionarios, setFuncionarios] = useState([]);

   // Buscar dados ao montar
  useEffect(() => {
    async function fetchData() {
      try {
        const req = await fetch(`${url}/funcionarios`);
        const res = await req.json();

        console.log("📌 Dados da API:", res); // <-- AQUI SEMPRE MOSTRA CERTO

        setFuncionarios(res); // Atualiza o state
      } catch (erro) {
        console.log("Erro:", erro.message);
      }
    }

    fetchData();
  }, [url]);

  // Aqui você vê o valor ATUALIZADO do state
  useEffect(() => {
    console.log("✅ State atualizado:", funcionarios);
  }, [funcionarios]);

  return funcionarios;
}

// CADASTRAR FUNCIONARIO
export function useCadastrarFuncionario() {
  const CadastrarFuncionario = async (data) => {
    try {
      const req = await fetch(`${url}/funcionarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!req.ok) {
        console.error("Erro ao cadastrar funcionario:", req.status);
        return;
      }

      const res = await req.json();
      console.log("Funcionario cadastrado com sucesso:", res);

      return res;
    } catch (erro) {
      console.error("Erro na requisição:", erro.message);
    }
  };

  return { CadastrarFuncionario };
}

// EDITAR FUNCIONARIO
export function useEditarFuncionario() {
  const EditarFuncionario = async (id, data) => {
    try {
      const req = await fetch(`${url}/funcionarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!req.ok) {
        console.error("Erro ao editar funcionario:", req.status);
        return;
      }

      const res = await req.json();
      console.log("Funcionario editado com sucesso:", res);
      return res;
    } catch (erro) {
      console.error("Erro na requisição:", erro.message);
    }
  };

  return { EditarFuncionario };
}

// EXCLUIR UM FUNCIONARIO
export function useDeletarFuncionario() {
  const DeletarFuncionario = async (id) => {
    try {
      const req = await fetch(`${url}/funcionarios/${id}`, {
        method: "DELETE",
      });

      if (!req.ok) {
        console.error("Erro ao excluir funcionario:", req.status);
        return;
      }

      console.log(`Funcionario ${id} excluído com sucesso`);
    } catch (erro) {
      console.error("Erro ao excluir:", erro.message);
    }
  };

  return { DeletarFuncionario };
}