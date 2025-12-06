import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import computeStatus from '../utils/computeStatus';

const Home = () => {
  const navigate = useNavigate();
  const [funcionarios, setFuncionarios] = useState([]);
  const [exames, setExames] = useState([]);
  const [treinamentos, setTreinamentos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/funcionarios').then(res => setFuncionarios(res.data));
    axios.get('http://localhost:5000/exames').then(res => setExames(res.data.filter(e => e.active !== false)));
    axios.get('http://localhost:5000/treinamentos').then(res => setTreinamentos(res.data.filter(t => t.active !== false)));
  }, []);

  // Calcular próximos do vencimento e vencidos
  const proximosVencimento = useMemo(() => {
    const alertas = [];

    exames.forEach(exame => {
      if (!exame.colaborador) return;
      const status = computeStatus(exame, 30);
      // Agora busca por VENCIDO ou PRÓX DO VENCIMENTO
      if (status === 'VENCIDO' || status === 'PRÓX DO VENCIMENTO') {
        const createdAt = exame.createdAt ? new Date(exame.createdAt) : new Date();
        const expiry = new Date(createdAt);
        expiry.setMonth(expiry.getMonth() + (exame.validade || 0));
        
        const func = funcionarios.find(f => f.nome?.toLowerCase() === exame.colaborador?.toLowerCase());
        alertas.push({
          tipo: 'exame',
          id: exame.id,
          nome: exame.nomeExame,
          colaborador: exame.colaborador,
          funcao: exame.funcao || func?.funcao || '—',
          validade: exame.validade,
          dataVencimento: expiry,
          status,
        });
      }
    });

    treinamentos.forEach(trein => {
      if (!trein.colaborador) return;
      const status = computeStatus(trein, 30);
      // Agora busca por VENCIDO ou PRÓX DO VENCIMENTO
      if (status === 'VENCIDO' || status === 'PRÓX DO VENCIMENTO') {
        const createdAt = trein.createdAt ? new Date(trein.createdAt) : new Date();
        const expiry = new Date(createdAt);
        expiry.setMonth(expiry.getMonth() + (trein.validade || 0));
        
        const func = funcionarios.find(f => f.nome?.toLowerCase() === trein.colaborador?.toLowerCase());
        alertas.push({
          tipo: 'treinamento',
          id: trein.id,
          nome: trein.nomeTreinamento,
          colaborador: trein.colaborador,
          funcao: trein.funcao || func?.funcao || '—',
          validade: trein.validade,
          dataVencimento: expiry,
          status,
        });
      }
    });

    return alertas.sort((a, b) => a.dataVencimento - b.dataVencimento);
  }, [exames, treinamentos, funcionarios]);

  const formatarData = (data) => {
    if (!data) return '—';
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const obterCorStatus = (status) => {
    if (status === 'VENCIDO') return '#ff6b6b';
    if (status === 'PRÓX DO VENCIMENTO') return '#f7e86b';
    return '#8fe39e';
  };

  const irParaGerenciamento = (tipo) => {
    if (tipo === 'exame') {
      navigate('/exames/gerenciar');
    } else if (tipo === 'treinamento') {
      navigate('/treinamentos/gerenciar');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#223773',
      padding: '40px 20px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Cabeçalho */}
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
        }}>
          <h1 style={{
            color: 'white',
            fontSize: '28px',
            fontWeight: '600',
            margin: '0 0 10px 0',
          }}>Dashboard de Alertas</h1>
          <p style={{
            color: '#b0b0b0',
            fontSize: '16px',
            margin: 0,
          }}>Treinamentos e Exames Vencidos ou Próximos do Vencimento</p>
        </div>

        {/* Resumo de Alertas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}>
          <div style={{
            backgroundColor: '#d4bf2a',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#223773',
              marginBottom: '8px',
            }}>
              {proximosVencimento.filter(a => a.status === 'PRÓX DO VENCIMENTO').length}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#223773',
              fontWeight: '600',
            }}>Próximos do Vencimento</div>
          </div>

          <div style={{
            backgroundColor: '#d63632',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: 'white',
              marginBottom: '8px',
            }}>
              {proximosVencimento.filter(a => a.status === 'VENCIDO').length}
            </div>
            <div style={{
              fontSize: '14px',
              color: 'white',
              fontWeight: '600',
            }}>Vencidos</div>
          </div>

          <div style={{
            backgroundColor: '#15966B',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: 'white',
              marginBottom: '8px',
            }}>
              {proximosVencimento.length}
            </div>
            <div style={{
              fontSize: '14px',
              color: 'white',
              fontWeight: '600',
            }}>Alertas Totais</div>
          </div>
        </div>

        {/* Lista de Alertas */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '30px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        }}>
          <h2 style={{
            color: '#223773',
            fontSize: '20px',
            fontWeight: '600',
            marginTop: 0,
            marginBottom: '25px',
          }}>Detalhes dos Alertas</h2>

          {proximosVencimento.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#888',
              fontSize: '16px',
            }}>
              ✓ Nenhum aviso de vencimento no momento. Excelente!
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '15px',
            }}>
              {proximosVencimento.map((alerta, idx) => {
                const diasRestantes = Math.floor((alerta.dataVencimento - new Date()) / (1000 * 60 * 60 * 24));
                const urgencia = diasRestantes < 0 ? 'VENCIDO' : `${diasRestantes} dias`;
                const corBg = alerta.status === 'VENCIDO' ? '#fff5f5' : '#fffbf0';
                const corBorda = obterCorStatus(alerta.status);

                return (
                  <div
                    key={idx}
                    onClick={() => irParaGerenciamento(alerta.tipo)}
                    style={{
                      backgroundColor: corBg,
                      border: `3px solid ${corBorda}`,
                      borderRadius: '8px',
                      padding: '18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      flex: 1,
                    }}>
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}>
                        <span style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#223773',
                        }}>
                          {alerta.nome}
                        </span>
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '12px',
                        fontSize: '14px',
                        color: '#555',
                        marginTop: '10px',
                      }}>
                        <div><strong>Colaborador:</strong> {alerta.colaborador}</div>
                        <div><strong>Função:</strong> {alerta.funcao}</div>
                      </div>
                    </div>
                    <div style={{
                      marginLeft: '20px',
                      textAlign: 'right',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      alignItems: 'flex-end',
                    }}>
                      <span
                        style={{
                          backgroundColor: corBorda,
                          color: alerta.status === 'PRÓX DO VENCIMENTO' ? '#000' : 'white',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontWeight: '700',
                          fontSize: '12px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {alerta.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;