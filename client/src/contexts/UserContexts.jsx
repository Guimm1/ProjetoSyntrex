// Importando o hook de criar o contexto
import { createContext, useState, useEffect } from "react";

// Criando o contexto de autorização
export const AuthContext = createContext()

// Cria o provider do contexto
// Provider = fornece as informações para os componentes filhos
export const AuthProvider = ( { children } ) => {
    // State pra guardar o nome do usuário logado no momento
    const [usuarioNome, setUsuarioNome ] = useState("")

    // Quando o componente é renderizado, busca no localStorage o usuario atual, se não tiver nenhum define como Visitante
    useEffect(() =>{
        const nomeAtual = localStorage.getItem("userName") || "Visitante"
        setUsuarioNome(nomeAtual)
    }, [])

    // Função pra receber as informações login, e guardar no localStorage
    const login = (data) => {
        console.log("Usuário logado:", data)
        localStorage.setItem("id", data.id)
        localStorage.setItem("userName", data.nome)
        localStorage.setItem("email", data.email)
        localStorage.setItem("imagemPerfil", data.imagemUrl)
        setUsuarioNome(data.nome)
    }

    // Função pra remover as informações login do localStorage e redefinir o nome de usuário pra Visitante
    const logout = () => {
        localStorage.clear()
        setUsuarioNome("Visitante")
    }

    // Retorna o provider fornecerndo os dados do usuário, login e logout
    return (
        <AuthContext.Provider value={ {usuarioNome, login, logout} }>
            { children }
        </AuthContext.Provider>
    )
}