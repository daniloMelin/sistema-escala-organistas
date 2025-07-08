import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useChurch } from '../contexts/ChurchContext';

const ChurchDashboard = () => {
  // useParams() pega os parâmetros da URL. No nosso caso, o :churchId da rota.
  const { churchId } = useParams(); 
  
  // useChurch() pega a igreja que salvamos no Contexto ao clicar na lista.
  const { selectedChurch } = useChurch();

  // Esta verificação é importante. Se o usuário recarregar a página, o estado do Contexto
  // é perdido. Esta mensagem guia o usuário de volta para a lista de igrejas.
  // No futuro, podemos melhorar isso fazendo uma busca no banco de dados se o contexto estiver vazio.
  if (!selectedChurch || selectedChurch.id !== churchId) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Carregando dados da Igreja...</h2>
        <p>Por favor, volte para a <Link to="/">lista de igrejas</Link> e selecione uma novamente para continuar.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <div style={{ marginBottom: '30px', paddingBottom: '15px', borderBottom: '2px solid #007bff' }}>
        <h2 style={{ margin: 0 }}>Painel da Igreja: {selectedChurch.name}</h2>
        {selectedChurch.code && <p style={{ margin: '5px 0 0 0', color: '#555' }}>Código: {selectedChurch.code}</p>}
      </div>

      <p>Selecione uma das opções abaixo para gerenciar esta congregação:</p>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {/* Link para a futura página de gerenciamento de organistas DESTA igreja */}
        <Link 
          to={`/igreja/${churchId}/organistas`}
          style={{ 
            padding: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            textDecoration: 'none', 
            color: 'black',
            flex: 1,
            textAlign: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#007bff'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <h3>Gerenciar Organistas</h3>
          <p>Adicione, edite ou remova as organistas desta igreja.</p>
        </Link>
        
        {/* Link para a futura página de geração de escala DESTA igreja */}
        <Link 
          to={`/igreja/${churchId}/escala`}
          style={{ 
            padding: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            textDecoration: 'none', 
            color: 'black',
            flex: 1,
            textAlign: 'center',
            transition: 'all 0.2s'
          }}
           onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#007bff'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'; }}
           onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <h3>Gerar Escala</h3>
          <p>Crie e visualize as escalas para os cultos desta igreja.</p>
        </Link>
      </div>
    </div>
  );
};

export default ChurchDashboard;