import React, { useState } from 'react';
import { auth } from '../services/firebaseService';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const Auth = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true); // Desabilita o botão para evitar múltiplos cliques
    const provider = new GoogleAuthProvider();
    
    try {
      await signInWithPopup(auth, provider);
      // O sucesso do login será detectado pelo 'onAuthStateChanged' no App.js,
      // que irá redirecionar o usuário para a página principal.
    } catch (err) {
      setError('Falha ao autenticar com o Google. Tente novamente.');
      console.error("Erro com Google Sign-In:", err);
      setIsLoading(false); // Reabilita o botão em caso de erro
    }
    // Não é necessário setar isLoading(false) em caso de sucesso,
    // pois o componente será desmontado e trocado pela aplicação.
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '450px', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '10px' }}>Sistema de Escala de Organistas</h2>
        <p style={{ color: '#555', marginBottom: '25px' }}>
          Utilize sua conta Google para entrar ou criar seu acesso ao sistema.
        </p>
        
        {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
        
        <button 
          onClick={handleGoogleSignIn} 
          disabled={isLoading}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: '#4285F4', // Cor do Google
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: isLoading ? 'not-allowed' : 'pointer', 
            fontSize: '16px',
            opacity: isLoading ? 0.7 : 1,
            width: '100%'
          }}
        >
          {isLoading ? 'Aguarde...' : 'Entrar com o Google'}
        </button>
      </div>
    </div>
  );
};

export default Auth;