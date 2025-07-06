import React, { useState, useEffect, useCallback } from 'react';
import { getChurches, addChurch } from '../services/firebaseService';
import { useNavigate } from 'react-router-dom';      // <-- 1. Importar para navegação
import { useChurch } from '../contexts/ChurchContext'; // <-- 2. Importar nosso hook de Contexto

const ChurchManager = ({ user }) => {
  const [churches, setChurches] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Mudado para true para mostrar carregando no início
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para o formulário
  const [churchName, setChurchName] = useState('');
  const [churchCode, setChurchCode] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();                   // <-- 3. Inicializar o hook de navegação
  const { setSelectedChurch } = useChurch();        // <-- 4. Pegar a função para setar a igreja do Contexto

  const fetchChurches = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const userChurches = await getChurches(user.uid);
      setChurches(userChurches);
    } catch (err) {
      setError('Falha ao carregar as igrejas.');
      console.error(err);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchChurches();
  }, [fetchChurches]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!churchName) {
        setError('O nome da igreja é obrigatório.');
        return;
    }
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
        await addChurch(user.uid, { name: churchName, code: churchCode });
        setSuccessMessage('Igreja cadastrada com sucesso!');
        setChurchName('');
        setChurchCode('');
        await fetchChurches();
    } catch (err) {
        setError('Falha ao cadastrar a igreja.');
        console.error(err);
    }
    setIsSubmitting(false);
  };
  
  // 5. NOVA FUNÇÃO: Define o que acontece quando o usuário clica em uma igreja da lista
  const handleChurchSelect = (church) => {
    setSelectedChurch(church); // Salva a igreja selecionada no "quadro de avisos" global
    navigate(`/igreja/${church.id}`); // Redireciona para a página de detalhes daquela igreja
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2>Gerenciamento de Igrejas</h2>
      
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>Cadastrar Nova Igreja</h3>
        <form onSubmit={handleSubmit}>
            <div style={{marginBottom: '10px'}}>
                <label htmlFor="churchName">Nome da Igreja/Congregação:</label>
                <input
                    type="text" id="churchName" value={churchName}
                    onChange={(e) => setChurchName(e.target.value)}
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    required disabled={isSubmitting}
                />
            </div>
            <div style={{marginBottom: '15px'}}>
                <label htmlFor="churchCode">Código (opcional):</label>
                <input
                    type="text" id="churchCode" value={churchCode}
                    onChange={(e) => setChurchCode(e.target.value)}
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    disabled={isSubmitting}
                />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <button type="submit" disabled={isSubmitting} style={{padding: '10px 15px', cursor: 'pointer'}}>
                {isSubmitting ? 'Salvando...' : 'Cadastrar Igreja'}
            </button>
        </form>
      </div>

      <h3>Suas Igrejas Cadastradas</h3>
      {isLoading && <p>Carregando...</p>}
      {!isLoading && churches.length === 0 && <p>Nenhuma igreja cadastrada ainda. Use o formulário acima para começar.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {churches.map(church => (
            // 6. MUDANÇA PRINCIPAL: Adicionamos o onClick ao item da lista
            <li 
              key={church.id} 
              onClick={() => handleChurchSelect(church)}
              style={{ 
                border: '1px solid #eee', padding: '15px', marginBottom: '10px', 
                borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f9f9f9'; e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
            >
                <strong style={{fontSize: '1.1em', color: '#0056b3'}}>{church.name}</strong>
                <br />
                {church.code && <small>Código: {church.code}</small>}
            </li>
        ))}
      </ul>
    </div>
  );
};

export default ChurchManager;