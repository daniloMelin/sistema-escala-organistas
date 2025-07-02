import React, { useState, useEffect, useCallback } from 'react';
import { getChurches, addChurch } from '../services/firebaseService';

const ChurchManager = ({ user }) => {
  const [churches, setChurches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [churchName, setChurchName] = useState('');
  const [churchCode, setChurchCode] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
        await addChurch(user.uid, { name: churchName, code: churchCode });
        setSuccessMessage('Igreja cadastrada com sucesso!');
        setChurchName('');
        setChurchCode('');
        await fetchChurches(); // Atualiza a lista
    } catch (err) {
        setError('Falha ao cadastrar a igreja.');
        console.error(err);
    }
    setIsLoading(false);
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
                    required
                />
            </div>
            <div style={{marginBottom: '15px'}}>
                <label htmlFor="churchCode">Código (opcional):</label>
                <input
                    type="text" id="churchCode" value={churchCode}
                    onChange={(e) => setChurchCode(e.target.value)}
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <button type="submit" disabled={isLoading} style={{padding: '10px 15px', cursor: 'pointer'}}>
                {isLoading ? 'Salvando...' : 'Cadastrar Igreja'}
            </button>
        </form>
      </div>

      <h3>Suas Igrejas Cadastradas</h3>
      {isLoading && <p>Carregando...</p>}
      {!isLoading && churches.length === 0 && <p>Nenhuma igreja cadastrada ainda. Use o formulário acima para começar.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {churches.map(church => (
            <li key={church.id} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '10px', borderRadius: '4px', cursor: 'pointer', '&:hover': {backgroundColor: '#f9f9f9'} }}>
                <strong>{church.name}</strong>
                <br />
                {church.code && <small>Código: {church.code}</small>}
            </li>
        ))}
      </ul>
    </div>
  );
};

export default ChurchManager;