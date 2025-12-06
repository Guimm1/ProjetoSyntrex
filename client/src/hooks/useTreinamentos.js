// URL da API
const url = "http://localhost:5000";

import { useState, useEffect } from "react";

// LISTAR TREINAMENTOS CADASTRADOS
export function useListaTreinamentos() {
  const [treinamentos, setTreinamentos] = useState([]);

  useEffect(() => {
    async function fetchTreinamentos() {
      try {
        const req = await fetch(`${url}/treinamentos`);
        const res = await req.json();
        // Retornar apenas treinamentos ativos (active !== false)
        setTreinamentos(res.filter((t) => t.active !== false));
      } catch (erro) {
        console.log("Erro ao carregar treinamentos:", erro.message);
      }
    }

    fetchTreinamentos();
  }, []);

  return treinamentos;
}

// LISTAR CATEGORIAS DE TREINAMENTOS
export function useListaCategoriaTrainamentos() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const req = await fetch(`${url}/categoriasTrainamentos`);
        const res = await req.json();
        setCategorias(res);
      } catch (erro) {
        console.log("Erro ao carregar categorias de treinamentos:", erro.message);
      }
    }

    fetchCategorias();
  }, []);

  return categorias;
}

// CADASTRAR TREINAMENTO
export function useCadastrarTreinamentos() {
  const CadastrarTreinamento = async (data) => {
    try {
      // garantir que novo registro seja marcado como ativo
      if (data.active === undefined) data.active = true;
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

// LISTAR TODOS TREINAMENTOS (inclui desativados) - útil para reativação
export function useListaTreinamentosTodos() {
  const [treinamentos, setTreinamentos] = useState([]);

  useEffect(() => {
    async function fetchTreinamentos() {
      try {
        const req = await fetch(`${url}/treinamentos`);
        const res = await req.json();
        setTreinamentos(res);
      } catch (erro) {
        console.log("Erro ao carregar treinamentos (todos):", erro.message);
      }
    }

    fetchTreinamentos();
  }, []);

  return treinamentos;
}

// REATIVAR TREINAMENTO (set active: true)
export function useReativarTreinamentos() {
  const ReativarTreinamento = async (id) => {
    try {
      const req = await fetch(`${url}/treinamentos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: true }),
      });

      if (!req.ok) {
        console.error("Erro ao reativar treinamento:", req.status);
        return;
      }

      console.log(`Treinamento ${id} reativado com sucesso`);
    } catch (erro) {
      console.error("Erro ao reativar:", erro.message);
    }
  };

  return { ReativarTreinamento };
}

// EXCLUIR UM TREINAMENTO
export function useExcluirTreinamentos() {
  const ExcluirTreinamento = async (id) => {
    try {
      // realizar PATCH definindo active=false (desativar)
      const req = await fetch(`${url}/treinamentos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: false }),
      });

      if (!req.ok) {
        console.error("Erro ao desativar treinamento:", req.status);
        return;
      }

      console.log(`Treinamento ${id} desativado com sucesso`);
    } catch (erro) {
      console.error("Erro ao desativar:", erro.message);
    }
  };

  return { ExcluirTreinamento };
}