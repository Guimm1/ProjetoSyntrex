// Login_fixed.jsx
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import { BsBoxArrowInRight } from "react-icons/bs";
import { useVerificaLogin } from "../hooks/useUsuarios";
import { useForm } from "react-hook-form";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EnvelopeFill, LockFill } from "react-bootstrap-icons";
import Syntrex from "../assets/Syntrex.svg";

// ✅ Importa o contexto
import { AuthContext } from "../contexts/UserContexts.jsx";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [alertaClasse, setAlertaClasse] = useState("d-none");

  const { verificaLogin } = useVerificaLogin();
  const { login } = useContext(AuthContext); // ✅ Pega o login do contexto
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const resposta = verificaLogin(data);

    if (resposta.sucesso) {
      // ✅ Salva no contexto e localStorage
      login(resposta.user);

      alert("Login efetuado com sucesso");
      navigate("/home"); // ✅ Agora funciona corretamente
    } else {
      setAlertaClasse("my-3 w-75 mx-auto");
    }
  };

  const onError = (errors) => {
    console.log("Erros:", errors);
  };

  return (
    <div
      style={{
        backgroundColor: "#223773",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Logo no topo */}
      <div
      className="bg-white w-100 d-block position-absolute top-0"
       style={{height:"80px"}}
      >
        <img
          src={Syntrex}
          alt="Syntrex"
          style={{ height: "50px", marginRight: "8px",  position: "absolute",
          top: "15px",
          left: "40px",
        
          
        }}
          onError={(e) => {
            // Esconde a imagem se não existir (evita overlay de erro do Vite)
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      <Container
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ textAlign: "center", maxWidth: "400px" }}
      >
        <h2 style={{ color: "#fff", marginBottom: "30px", fontWeight: "700" }}>
          Acesse sua conta
        </h2>

        <Form
          style={{ width: "100%" }}
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          {/* Campo de email */}
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <EnvelopeFill
              style={{
                position: "absolute",
                left: "15px",
                top: "12px",
                color: "#888",
              }}
            />
            <Form.Control
              type="email"
              placeholder="E-mail"
              style={{
                paddingLeft: "40px",
                height: "45px",
                borderRadius: "6px",
              }}
              {...register("email", {
                required: "O email é obrigatório",
                pattern: {
                  value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
                  message: "Email inválido",
                },
                validate: (value) =>
                  value.includes("@") || "Email deve possuir um @",
              })}
            />
            {errors.email && (
              <p className="text-danger mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Campo de senha */}
          <div style={{ position: "relative", marginBottom: "15px" }}>
            <LockFill
              style={{
                position: "absolute",
                left: "15px",
                top: "12px",
                color: "#888",
              }}
            />
            <Form.Control
              type="password"
              placeholder="Senha"
              style={{
                paddingLeft: "40px",
                height: "45px",
                borderRadius: "6px",
              }}
              {...register("senha", { required: "A senha é obrigatória" })}
            />
            {errors.senha && (
              <p className="text-danger mt-1">{errors.senha.message}</p>
            )}
          </div>

          {/* Checkbox */}
          <Form.Check
            type="checkbox"
            label="Lembrar-me"
            style={{ color: "white", textAlign: "left", marginBottom: "20px" }}
          />

          {/* Botão de login */}
          <Button
            variant="success"
            type="submit"
            style={{
              backgroundColor: "#009975",
              border: "none",
              width: "100%" ,
              height: "45px",
              borderRadius: "6px",
              fontWeight: "600",
            }}
          >
            Entrar
          </Button>

          {/* Link de esqueci senha */}
          <div style={{ marginTop: "15px" }}>
            <a
              href="#"
              style={{
                color: "#fff",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Esqueci minha senha
            </a>
          </div>

          {/* Alerta */}
          <Alert variant="danger" className={alertaClasse} style={{ marginTop: "20px" }}>
            Usuário ou senha inválidos
          </Alert>
        </Form>
      </Container>

      {/* Rodapé */}
      <p
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          color: "#b5b5b5",
          fontSize: "12px",
        }}
      >
        syntrex.com.br
      </p>
    </div>
  );
};

export default Login;

