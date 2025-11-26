// url da API
const url = "http://localhost:5000"; // mantenha a porta que seu json-server usa

import { useState, useEffect } from "react";

// LISTAR CATEGORIAS
export function useListaCategorias() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const req = await fetch(`${url}/categorias`);
        const res = await req.json();
        setCategorias(res);
      } catch (erro) {
        console.log("Erro ao carregar categorias:", erro.message);
      }
    }
    fetchCategorias();
  }, []);

  return categorias;
}

// LISTA DE MEDIDAS
export function useListaMedidas() {
  const [medidas] = useState([
    { id: 1, nome: "mL" },
    { id: 2, nome: "L" },
  ]);
  return medidas;
}

// ✅ CADASTRAR EXAME (corrigido)
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
      console.log(" Treinamento cadastrado com sucesso:", res);

      return res;
    } catch (erro) {
      console.error(" Erro na requisição:", erro.message);
    }
  };


  return { CadastrarTreinamento };
}