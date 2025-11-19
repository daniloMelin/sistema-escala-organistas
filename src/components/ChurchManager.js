import React, { useState, useEffect, useCallback } from 'react';
// Importamos o updateChurch
import { getChurches, addChurch, deleteChurch, updateChurch } from '../services/firebaseService';
import { useNavigate } from 'react-router-dom';
import { useChurch } from '../contexts/ChurchContext';

const ChurchManager = ({ user }) => {
  const [churches, setChurches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados do formulário
  const [churchName, setChurchName] = useState('');
  const [churchCode, setChurchCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado de Edição
  const [editingId, setEditingId] = useState(null);

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

  // Prepara formulário para edição
  const handleStartEdit = (e, church) => {
    e.stopPropagation(); // Não navega para a igreja
    setChurchName(church.name);
    setChurchCode(church.code || '');
    setEditingId(church.id);
    setError('');
    setSuccessMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancela edição
  const handleCancelEdit = () => {
    setChurchName('');
    setChurchCode('');
    setEditingId(null);
    setError('');
    setSuccessMessage('');
  };
  
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
        if (editingId) {
            // --- MODO ATUALIZAÇÃO ---
            await updateChurch(user.uid, editingId, { 
                name: churchName, 
                code: churchCode 
            });
            setSuccessMessage('Igreja atualizada com sucesso!');
        } else {
            // --- MODO CRIAÇÃO ---
            await addChurch(user.uid, { 
                name: churchName, 
                code: churchCode 
            });
            setSuccessMessage('Igreja cadastrada com sucesso!');
        }

        // Limpa tudo
        handleCancelEdit();
        await fetchChurches();

    } catch (err) {
        setError('Falha ao salvar a igreja.');
        console.error(err);
    }
    setIsSubmitting(false);
  };
  
  const handleChurchSelect = (church) => {
    setSelectedChurch(church);
    navigate(`/igreja/${church.id}`);
  };

  const handleDeleteChurch = async (e, churchId, churchName) => {
    e.stopPropagation(); 
    
    if (window.confirm(`Tem certeza que deseja excluir a igreja "${churchName}"? \n\nATENÇÃO: Todas as organistas e escalas desta igreja serão perdidas para sempre.`)) {
      try {
        await deleteChurch(user.uid, churchId);
        setSuccessMessage('Igreja excluída com sucesso.');
        
        // Se estava editando a igreja que foi excluída, cancela a edição
        if (editingId === churchId) {
            handleCancelEdit();
        }
        
        fetchChurches();
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir igreja. Tente novamente.');
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2>Gerenciamento de Igrejas</h2>
      
      {/* --- FORMULÁRIO (Criação e Edição) --- */}
      <div style={{ 
          marginBottom: '30px', padding: '20px', borderRadius: '8px', 
          border: editingId ? '1px solid #ffeeba' : '1px solid #ccc',
          backgroundColor: editingId ? '#fff3cd' : '#fff'
      }}>
        <h3 style={{ marginTop: 0 }}>{editingId ? 'Editar Igreja' : 'Cadastrar Nova Igreja'}</h3>
        
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
            
            <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    style={{
                        padding: '10px 20px', cursor: isSubmitting ? 'wait' : 'pointer',
                        backgroundColor: editingId ? '#ffc107' : '#007bff', // Amarelo se editar, Azul se criar
                        color: editingId ? '#000' : 'white',
                        border: 'none', borderRadius: '4px', fontWeight: 'bold'
                    }}
                >
                    {isSubmitting ? 'Salvando...' : (editingId ? 'Atualizar Igreja' : 'Cadastrar Igreja')}
                </button>

                {editingId && (
                    <button 
                        type="button" 
                        onClick={handleCancelEdit}
                        disabled={isSubmitting}
                        style={{
                            padding: '10px 15px', cursor: 'pointer',
                            backgroundColor: '#6c757d', color: 'white',
                            border: 'none', borderRadius: '4px'
                        }}
                    >
                        Cancelar
                    </button>
                )}
            </div>
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
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f9f9f9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
                <div>
                    <strong style={{fontSize: '1.1em', color: '#0056b3'}}>{church.name}</strong>
                    <br />
                    {church.code && <small>Código: {church.code}</small>}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    {/* Botão Editar */}
                    <button 
                      onClick={(e) => handleStartEdit(e, church)}
                      style={{
                        backgroundColor: '#ffc107', color: '#333', border: 'none', 
                        borderRadius: '4px', padding: '6px 12px', cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                      title="Editar dados da igreja"
                    >
                      Editar
                    </button>

                    {/* Botão Excluir */}
                    <button 
                      onClick={(e) => handleDeleteChurch(e, church.id, church.name)}
                      style={{
                        backgroundColor: '#dc3545', color: 'white', border: 'none', 
                        borderRadius: '4px', padding: '6px 12px', cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                      title="Excluir esta igreja"
                    >
                      Excluir
                    </button>
                </div>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default ChurchManager;