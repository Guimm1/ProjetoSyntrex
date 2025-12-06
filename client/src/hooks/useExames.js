// url da API
const url = "http://localhost:5000"; // mantenha a porta que seu json-server usa

import { useState, useEffect } from "react";

// LISTAR CATEGORIAS
export function useListaAtribuirExames() {
  const [atribuirexames, setAtribuirExames] = useState([]);

  useEffect(() => {
    async function fetchAtribuirExames() {
      try {
        const req = await fetch(`${url}/atribuicaoexames`);
        const res = await req.json();
        setAtribuirExames(res);
      } catch (erro) {
        console.log("Erro ao carregar exame:", erro.message);
      }
    }
    fetchAtribuirExames();
  }, []);

  return atribuirexames;
}


// ✅ CADASTRAR EXAME (corrigido)
export function useAtribuirExame() {
  const AtribuirExame = async (data) => {
    try {
      // Alterado de /cadastroexame → /exames (rota do json-server)
      const req = await fetch(`${url}/atribuicaoexames`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!req.ok) {
        console.error("Erro ao atribuir exame:", req.status);
        return;
      }

      const res = await req.json();
      console.log(" Exame atribuido com sucesso:", res);

      return res;
    } catch (erro) {
      console.error(" Erro na requisição:", erro.message);
    }
  };

  return { AtribuirExame };
}

// EDITAR TREINAMENTO
export function useEditarExames() {
  const EditarExame = async (id, data) => {
    try {
      const req = await fetch(`${url}/atribuicaoexames/${id}`, {
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
      const req = await fetch(`${url}/atribuicaoexames/${id}`, {
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