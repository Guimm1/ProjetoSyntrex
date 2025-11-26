import './index.css'

import {createRoot } from "react-dom/client"
import { StrictMode } from 'react'

// Provedor de rotas, do react-router
import { RouterProvider } from 'react-router-dom'

// Meu gerenciador de rotas
import MyRouter from "./MyRouter.jsx"

// Importação do Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Importar o provedor do contexto de usuário
import { AuthProvider } from "./contexts/UserContexts.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
   {/* Fornece as informações de contexto pra toda a aplicação */}
   <AuthProvider>
      {/* Faz o provedor utilizar as rotas que você definiu no MyRouter */}
      <RouterProvider router={MyRouter} />
    </AuthProvider>
  </StrictMode>,
)