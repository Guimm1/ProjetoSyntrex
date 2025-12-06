// url da API
const url = "http://localhost:5000"; // mantenha a porta que seu json-server usa

import { useState, useEffect } from "react";

// LISTAR EXAMES CADASTRADOS
export function useListaExames() {
  const [exames, setExames] = useState([]);

  useEffect(() => {
    async function fetchExames() {
      try {
        const req = await fetch(`${url}/exames`);
        const res = await req.json();
        // Retornar apenas exames ativos (active !== false)
        setExames(res.filter((e) => e.active !== false));
      } catch (erro) {
        console.log("Erro ao carregar exame:", erro.message);
      }
    }
    fetchExames();
  }, []);

  return exames;
}

// LISTAR CATEGORIAS DE EXAMES
export function useListaCategoriaExames() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const req = await fetch(`${url}/categoriasExames`);
        const res = await req.json();
        setCategorias(res);
      } catch (erro) {
        console.log("Erro ao carregar categorias de exames:", erro.message);
      }
    }
    fetchCategorias();
  }, []);

  return categorias;
}


// ✅ CADASTRAR EXAME (corrigido)
export function useCadastrarExame() {
  const CadastrarExame = async (data) => {
    try {
      // garantir que novo registro seja marcado como ativo
      if (data.active === undefined) data.active = true;
      // Alterado de /cadastroexame → /exames (rota do json-server)
      const req = await fetch(`${url}/exames`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!req.ok) {
        console.error("Erro ao cadastrar exame:", req.status);
        return;
      }

      const res = await req.json();
      console.log(" Exame cadastrado com sucesso:", res);

      return res;
    } catch (erro) {
      console.error(" Erro na requisição:", erro.message);
    }
  };

  return { CadastrarExame };
}

// EDITAR TREINAMENTO
export function useEditarExames() {
  const EditarExame = async (id, data) => {
    try {
      const req = await fetch(`${url}/exames/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!req.ok) {
        console.error("Erro ao editar exames:", req.status);
        return;
      }

      const res = await req.json();
      console.log("Exame editado com sucesso:", res);
      return res;
    } catch (erro) {
      console.error("Erro na requisição:", erro.message);
    }
  };

  return { EditarExame };
}

// LISTAR TODOS EXAMES (inclui desativados)
export function useListaExamesTodos() {
  const [exames, setExames] = useState([]);

  useEffect(() => {
    async function fetchExames() {
      try {
        const req = await fetch(`${url}/exames`);
        const res = await req.json();
        setExames(res);
      } catch (erro) {
        console.log("Erro ao carregar exames (todos):", erro.message);
      }
    }
    fetchExames();
  }, []);

  return exames;
}

// REATIVAR EXAME
export function useReativarExames() {
  const ReativarExame = async (id) => {
    try {
      const req = await fetch(`${url}/exames/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: true }),
      });

      if (!req.ok) {
        console.error("Erro ao reativar exame:", req.status);
        return;
      }

      console.log(`Exame ${id} reativado com sucesso`);
    } catch (erro) {
      console.error("Erro ao reativar:", erro.message);
    }
  };

  return { ReativarExame };
}

// EXCLUIR UM TREINAMENTO
export function useExcluirExames() {
  const ExcluirExame = async (id) => {
    try {
      // Desativar em vez de excluir
      const req = await fetch(`${url}/exames/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: false }),
      });

      if (!req.ok) {
        console.error("Erro ao desativar exame:", req.status);
        return;
      }

      console.log(`Exame ${id} desativado com sucesso`);
    } catch (erro) {
      console.error("Erro ao desativar:", erro.message);
    }
  };

  return { ExcluirExame };
}