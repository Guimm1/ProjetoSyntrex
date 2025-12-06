import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/UserContexts';
import styles from './Configuracoes.module.css';

const Configuracoes = () => {
  const navigate = useNavigate();
  const { usuarioNome } = useContext(AuthContext);
  
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [avoisExames, setAvisosExames] = useState(true);
  const [avisosTreinamentos, setAvisosTreinamentos] = useState(true);
  const [idioma, setIdioma] = useState('pt-BR');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState(''); // 'sucesso' ou 'erro'

  // Carregar preferências do localStorage
  useEffect(() => {
    const avisosExamesStorage = localStorage.getItem('avisosExames');
    const avisosTreinamentosStorage = localStorage.getItem('avisosTreinamentos');
    const idiomaStorage = localStorage.getItem('idioma');

    if (avisosExamesStorage !== null) setAvisosExames(JSON.parse(avisosExamesStorage));
    if (avisosTreinamentosStorage !== null) setAvisosTreinamentos(JSON.parse(avisosTreinamentosStorage));
    if (idiomaStorage) setIdioma(idiomaStorage);
  }, []);

  const salvarPreferencias = () => {
    localStorage.setItem('avisosExames', JSON.stringify(avoisExames));
    localStorage.setItem('avisosTreinamentos', JSON.stringify(avisosTreinamentos));
    localStorage.setItem('idioma', JSON.stringify(idioma));

    setMensagem('Preferências salvas com sucesso!');
    setTipoMensagem('sucesso');
    setTimeout(() => setMensagem(''), 3000);
  };

  const alterarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmaSenha) {
      setMensagem('Todos os campos de senha são obrigatórios');
      setTipoMensagem('erro');
      return;
    }

    if (novaSenha !== confirmaSenha) {
      setMensagem('A nova senha e confirmação não correspondem');
      setTipoMensagem('erro');
      return;
    }

    if (novaSenha.length < 3) {
      setMensagem('A nova senha deve ter pelo menos 3 caracteres');
      setTipoMensagem('erro');
      return;
    }

    try {
      const userId = localStorage.getItem('id');
      
      // Primeiro, verificar se a senha atual está correta
      const response = await fetch('http://localhost:5000/usuarios/' + userId);
      const usuario = await response.json();

      if (usuario.senha !== senhaAtual) {
        setMensagem('Senha atual incorreta');
        setTipoMensagem('erro');
        return;
      }

      // Atualizar a senha
      await fetch('http://localhost:5000/usuarios/' + userId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...usuario, senha: novaSenha }),
      });

      setMensagem('Senha alterada com sucesso!');
      setTipoMensagem('sucesso');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmaSenha('');
      setTimeout(() => setMensagem(''), 3000);
    } catch (erro) {
      setMensagem('Erro ao alterar senha: ' + erro.message);
      setTipoMensagem('erro');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Configurações</h1>

      <div className={styles.conteudo}>
        {/* Card de Preferências */}
        <div className={styles.card}>
          <h2 className={styles.subtitulo}>Preferências</h2>

          <div className={styles.secao}>
            <label className={styles.label}>Idioma</label>
            <select 
              value={idioma} 
              onChange={(e) => setIdioma(e.target.value)}
              className={styles.select}
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div className={styles.divisor}></div>

          <div className={styles.secao}>
            <label className={styles.label}>Notificações</label>
            
            <div className={styles.checkbox}>
              <input 
                type="checkbox" 
                id="avisosExames"
                checked={avoisExames}
                onChange={(e) => setAvisosExames(e.target.checked)}
              />
              <label htmlFor="avisosExames">Avisos de Vencimentos de exames</label>
            </div>

            <div className={styles.checkbox}>
              <input 
                type="checkbox" 
                id="avisosTreinamentos"
                checked={avisosTreinamentos}
                onChange={(e) => setAvisosTreinamentos(e.target.checked)}
              />
              <label htmlFor="avisosTreinamentos">Avisos de Vencimentos de treinamentos</label>
            </div>
          </div>

          <button className={styles.botaoSalvar} onClick={salvarPreferencias}>
            SALVAR
          </button>
        </div>

        {/* Card de Alteração de Senha */}
        <div className={styles.card}>
          <h2 className={styles.subtitulo}>Alterar Senha</h2>

          <div className={styles.secao}>
            <label className={styles.label}>Senha atual</label>
            <input 
              type="password"
              className={styles.input}
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              placeholder="Digite sua senha atual"
            />
          </div>

          <div className={styles.secao}>
            <label className={styles.label}>Nova senha</label>
            <input 
              type="password"
              className={styles.input}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Digite a nova senha"
            />
          </div>

          <div className={styles.secao}>
            <label className={styles.label}>Confirmar nova senha</label>
            <input 
              type="password"
              className={styles.input}
              value={confirmaSenha}
              onChange={(e) => setConfirmaSenha(e.target.value)}
              placeholder="Confirme a nova senha"
            />
          </div>

          <button className={styles.botaoSalvar} onClick={alterarSenha}>
            SALVAR
          </button>
        </div>
      </div>

      {/* Mensagem de Feedback */}
      {mensagem && (
        <div className={`${styles.mensagem} ${styles[tipoMensagem]}`}>
          {mensagem}
        </div>
      )}
    </div>
  );
};

export default Configuracoes;