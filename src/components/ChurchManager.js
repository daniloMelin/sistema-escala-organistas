import React, { useState, useEffect, useCallback } from 'react';
import { getChurches, addChurch, deleteChurch } from '../services/firebaseService'; // Importei deleteChurch
import { useNavigate } from 'react-router-dom';
import { useChurch } from '../contexts/ChurchContext';

const ChurchManager = ({ user }) => {
  const [churches, setChurches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [churchName, setChurchName] = useState('');
  const [churchCode, setChurchCode] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const { setSelectedChurch } = useChurch();

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
  
  const handleChurchSelect = (church) => {
    setSelectedChurch(church);
    navigate(`/igreja/${church.id}`);
  };

  // --- NOVA FUNÇÃO: Excluir Igreja ---
  const handleDeleteChurch = async (e, churchId, churchName) => {
    // Impede que o clique no botão "Excluir" ative o clique da linha (que entraria na igreja)
    e.stopPropagation(); 
    
    if (window.confirm(`Tem certeza que deseja excluir a igreja "${churchName}"? \n\nATENÇÃO: Todas as organistas e escalas desta igreja serão perdidas para sempre.`)) {
      try {
        await deleteChurch(user.uid, churchId);
        setSuccessMessage('Igreja excluída com sucesso.');
        fetchChurches(); // Recarrega a lista
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir igreja. Tente novamente.');
      }
    }
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
            <li 
              key={church.id} 
              onClick={() => handleChurchSelect(church)}
              style={{ 
                border: '1px solid #eee', padding: '15px', marginBottom: '10px', 
                borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center' // Flex para alinhar nome e botão
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f9f9f9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
                <div>
                    <strong style={{fontSize: '1.1em', color: '#0056b3'}}>{church.name}</strong>
                    <br />
                    {church.code && <small>Código: {church.code}</small>}
                </div>

                {/* Botão de Excluir */}
                <button 
                  onClick={(e) => handleDeleteChurch(e, church.id, church.name)}
                  style={{
                    backgroundColor: '#dc3545', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    padding: '6px 12px', 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    marginLeft: '10px'
                  }}
                  title="Excluir esta igreja"
                >
                  Excluir
                </button>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default ChurchManager;