// url da API
const url = "http://localhost:5000";

import { useState, useEffect } from "react";

export function useCadastrarFuncionario() {
  const CadastrarFuncionario = async (data) => {
    const req = await fetch(`${url}/funcionarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await req.json();
  };

  return { CadastrarFuncionario };
}

export function useEditarFuncionario() {
  const EditarFuncionario = async (id, data) => {
    const req = await fetch(`${url}/funcionarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await req.json();
  };

  return { EditarFuncionario };
}

export function useDeletarFuncionario() {
  const DeletarFuncionario = async (id) => {
    await fetch(`${url}/funcionarios/${id}`, { method: "DELETE" });
  };

  return { DeletarFuncionario };
}
