// url da API
const url = "http://localhost:5000"; // mantenha a porta que seu json-server usa

import { useState, useEffect } from "react";

// LISTAR CATEGORIAS
export function useListaExames() {
  const [exames, setExames] = useState([]);

  useEffect(() => {
    async function fetchExames() {
      try {
        const req = await fetch(`${url}/exames`);
        const res = await req.json();
        setExames(res);
      } catch (erro) {
        console.log("Erro ao carregar exame:", erro.message);
      }
    }
    fetchExames();
  }, []);

  return exames;
}


// ✅ CADASTRAR EXAME (corrigido)
export function useCadastrarExame() {
  const CadastrarExame = async (data) => {
    try {
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

// EXCLUIR UM TREINAMENTO
export function useExcluirExames() {
  const ExcluirExame = async (id) => {
    try {
      const req = await fetch(`${url}/exames/${id}`, {
        method: "DELETE",
      });

      if (!req.ok) {
        console.error("Erro ao excluir exame:", req.status);
        return;
      }

      console.log(`Exame ${id} excluído com sucesso`);
    } catch (erro) {
      console.error("Erro ao excluir:", erro.message);
    }
  };

  return { ExcluirExame };
}