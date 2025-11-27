// url da API
const url = "http://localhost:5000";

// Importando o hook de useState e useEffect
import { useState, useEffect } from "react";

export function useVerificaLogin() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const req = await fetch(`${url}/usuarios`);
        const res = await req.json();
        setUsuarios(res);
      } catch (erro) {
        console.log("Erro ao buscar usuários:", erro.message);
      }
    }
    fetchData();
  }, []);

  const verificaLogin = (data) => {
    const userToFind = usuarios.find(
      (user) => user.email === data.email && user.senha === data.senha
    );

    if (userToFind) {
      console.log("Usuário logado:", userToFind.nome);
      return { sucesso: true, user: userToFind }; // ✅ Retorna o objeto do usuário
    } else {
      return { sucesso: false };
    }
  };

  return { verificaLogin };
}
