// URL da API
const url = "http://localhost:5000";

import { useState, useEffect } from "react";

// LISTAR TREINAMENTOS
export function useListaTreinamentos() {
  const [treinamentos, setTreinamentos] = useState([]);

  useEffect(() => {
    async function fetchTreinamentos() {
      try {
        const req = await fetch(`${url}/treinamentos`);
        const res = await req.json();
        setTreinamentos(res);
      } catch (erro) {
        console.log("Erro ao carregar treinamentos:", erro.message);
      }
    }

    fetchTreinamentos();
  }, []);

  return treinamentos;
}

// CADASTRAR TREINAMENTO
export function useCadastrarTreinamentos() {
  const CadastrarTreinamento = async (data) => {
    try {
      const req = await fetch(`${url}/treinamentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!req.ok) {
        console.error("Erro ao cadastrar treinamento:", req.status);
        return;
      }

      const res = await req.json();
      console.log("Treinamento cadastrado com sucesso:", res);

      return res;
    } catch (erro) {
      console.error("Erro na requisição:", erro.message);
    }
  };

  return { CadastrarTreinamento };
}

// EDITAR TREINAMENTO
export function useEditarTreinamentos() {
  const EditarTreinamento = async (id, data) => {
    try {
      const req = await fetch(`${url}/treinamentos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!req.ok) {
        console.error("Erro ao editar treinamento:", req.status);
        return;
      }

      const res = await req.json();
      console.log("Treinamento editado com sucesso:", res);
      return res;
    } catch (erro) {
      console.error("Erro na requisição:", erro.message);
    }
  };

  return { EditarTreinamento };
}

// EXCLUIR UM TREINAMENTO
export function useExcluirTreinamentos() {
  const ExcluirTreinamento = async (id) => {
    try {
      const req = await fetch(`${url}/treinamentos/${id}`, {
        method: "DELETE",
      });

      if (!req.ok) {
        console.error("Erro ao excluir treinamento:", req.status);
        return;
      }

      console.log(`Treinamento ${id} excluído com sucesso`);
    } catch (erro) {
      console.error("Erro ao excluir:", erro.message);
    }
  };

  return { ExcluirTreinamento };
}