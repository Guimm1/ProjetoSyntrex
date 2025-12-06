// Importando o css da barra de navegação
import styles from "./BarraNavegacao.module.css";

// Importar os componentes do bootstrap
import { Nav, Navbar, NavDropdown, Image, Accordion } from "react-bootstrap";

// Importando os links do router
import { NavLink } from "react-router-dom";

import { BsBox, BsCardChecklist, BsPersonFillAdd } from "react-icons/bs";

// Importar as informações do contexto autenticação de usuário
import { AuthContext } from "../../contexts/UserContexts";
import { useContext } from "react";

// Importanto os icones
import { BsPeople } from "react-icons/bs";

import { LuClipboardCheck } from "react-icons/lu";

import { LuClipboardList } from "react-icons/lu";

import { BsBuilding } from "react-icons/bs";

import { BsBuildingFillGear } from "react-icons/bs";

import { BsPersonFill } from "react-icons/bs";

import { IoHomeOutline } from "react-icons/io5";

import { IoListSharp } from "react-icons/io5";

import { MdAddCircle } from "react-icons/md";

import { BsBuildingAdd } from "react-icons/bs";

import { BsPersonGear } from "react-icons/bs";

import { TbReportSearch } from "react-icons/tb";

import { BsPersonAdd } from "react-icons/bs";

import { FaClipboardList } from "react-icons/fa";

import { IoStorefront } from "react-icons/io5";

import { LuClipboardPlus } from "react-icons/lu";

import { FaClipboardCheck } from "react-icons/fa";

import { GiTeacher } from "react-icons/gi";

import { FaGear } from "react-icons/fa6";

import { BiBookAlt } from "react-icons/bi";

import { BiBookAdd } from "react-icons/bi";

import { GoGear } from "react-icons/go";

import { LiaChalkboardTeacherSolid } from "react-icons/lia";

const BarraNavegacao = () => {
  // importar o nome de usuario logado e funcao logout
  const { usuarioNome, logout } = useContext(AuthContext);

  // Guarda o id do usuário atual
  const idAtual = localStorage.getItem("id");

  // Guarda a imagem do usuário atual
  const imagemAtual = localStorage.getItem("imagemPerfil");

  // Imagem padrão
  const semImagem = "https://cdn-icons-png.flaticon.com/512/17/17004.png";
  
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-black bg-white min-vh-100 max-vh-100"
      style={{ width: "250px" }}
    >
  


      {/* Opções de menu */}
      <Nav className="flex-column mb-auto">
        {/* Opção home */}
        <Nav.Link as={NavLink} to="/home" className="text-black px-2">
          <IoHomeOutline className="fs-4" />
          <span className="fs-5 ms-2">Home</span>
        </Nav.Link>    

        {/* Criando o arcordeon */}
        <Accordion flush className="flex-column mb-auto" alwaysOpen>
          {/* Páginas produtos */}
          <Accordion.Item eventKey="0" className="bg-white text-black">
            <Accordion.Header className={styles.accordionHeader}>
              <BsPeople  className="fs-4" />
              <span className="ms-2 "> Funcionarios </span>
            </Accordion.Header>
            <Accordion.Body className={`p-0 bg-white ${styles.accordionBody}`}>
              <Nav className="flex-column">
                {/* Opção 1 */}
                <Nav.Link
                  as={NavLink}
                  to="/funcionarios/gerenciar"
                  className="text-black ps-4"
                >
                  <BsPersonGear  className="fs-5" />
                  <span className="ms-2"> Gerenciar </span>
                </Nav.Link>
                {/* Opção 2 */}
                <Nav.Link
                  as={NavLink}
                  to="/funcionarios/cadastrar"
                  className="text-black ps-4"
                >
                  <BsPersonAdd className="fs-5" />
                  <span className="ms-2"> Cadastrar </span>
                </Nav.Link>
              </Nav>
            </Accordion.Body>
          </Accordion.Item>
          {/* fim produtos */}

          {/* Páginas cliente */}
          <Accordion.Item eventKey="1" className="bg-white text-black">
            <Accordion.Header className={styles.accordionHeader}>
              <LuClipboardList className="fs-4" />
              <span className="ms-2"> Exames </span>
            </Accordion.Header>
            <Accordion.Body className={`p-0 bg-white ${styles.accordionBody}`}>
              <Nav className="flex-column">
                {/* Opção 1 */}
                <Nav.Link
                  as={NavLink}
                  to="/exames/gerenciar"
                  className="text-black ps-4"
                >
                  <LuClipboardCheck  className="fs-5" />
                  <span className="ms-2"> Gerenciar </span>
                </Nav.Link>
                {/* Opção 2 */}
                <Nav.Link
                  as={NavLink}
                  to="/exames/cadastrar"
                  className="text-black ps-4"
                >
                  <LuClipboardPlus className="fs-5" />
                  <span className="ms-2"> Atribuir </span>
                </Nav.Link>
              </Nav>
            </Accordion.Body>
          </Accordion.Item>
          {/* fim cliente */}

          
          {/* Páginas Pedidos */}
          <Accordion.Item eventKey="3" className="bg-white text-black">
            <Accordion.Header className={styles.accordionHeader}>
              <LiaChalkboardTeacherSolid className="fs-4" />
              <span className="ms-2"> Treinamentos </span>
            </Accordion.Header>
            <Accordion.Body className={`p-0 bg-white ${styles.accordionBody}`}>
              <Nav className="flex-column">
                {/* Opção 1 */}
                <Nav.Link
                  as={NavLink}
                  to="/treinamentos/gerenciar"
                  className="text-black ps-4"
                >
                  <BiBookAlt className="fs-5" />
                  <span className="ms-2"> Gerenciar </span>
                </Nav.Link>
                
                {/* Opção 2 */}
                <Nav.Link
                  as={NavLink}
                  to="/treinamentos/cadastrar"
                  className="text-black ps-4"
                >
                  <BiBookAdd className="fs-5" />
                  <span className="ms-2"> Atribuir </span>
                </Nav.Link>
              </Nav>
            </Accordion.Body>
          </Accordion.Item>
          {/* fim funcionarios */}
        </Accordion>

         {/* Opção Relatórios */}
        <Nav.Link as={NavLink} to="/relatorios" className="text-black px-2">
          <TbReportSearch className="fs-4" />
          <span className="fs-5 ms-2">Relatórios</span>
        </Nav.Link>


       
        <Nav.Link as={NavLink} to="/configuracoes" className="text-black px-2">
          <GoGear className="fs-4" />
          <span className="fs-5 ms-2">Configurações</span>
        </Nav.Link>



      </Nav>
       
       
      <hr className=" border-secondary"/>
       
        
      {/* Visualizar foto e nome do perfil, e opções */}
      <Nav className=" dropdown pb-4">
        <NavDropdown
          title={
            <span className="text-black align-items-center">
              <Image 
                src= "https://img.freepik.com/vetores-premium/icone-de-perfil-de-usuario-em-estilo-plano-ilustracao-em-vetor-avatar-membro-em-fundo-isolado-conceito-de-negocio-de-sinal-de-permissao-humana_157943-15752.jpg?semt=ais_hybrid&w=740&q=80"
                width={66}
                height={66}
                roundedCircle
                className="me-2"
              />
              {usuarioNome}
            </span> 
          }
          menuVariant="dark">
          {/* Opção de editar o perfil */}
          <NavDropdown.Item as={NavLink} to={`/funcionarios/editar/${idAtual}`}>
            Editar
          </NavDropdown.Item>

          {/* Voltar pra tela de login */}
          <NavDropdown.Item as={NavLink} to="/login" onClick={logout}>
            Sair
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </div>
  );
};

export default BarraNavegacao;