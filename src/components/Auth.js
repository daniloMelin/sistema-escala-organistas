import React, { useState } from 'react';

import { auth, db } from '../firebaseConfig';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

import {
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import logger from '../utils/logger';

const Auth = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      // 1. O usuário faz o login via pop-up do Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user; // Pegamos os dados do usuário do resultado

      // 2. Cria o documento do usuário no Firestore
      if (user) {
        // Criamos uma referência para o documento do usuário na coleção 'users'
        const userDocRef = doc(db, 'users', user.uid);

        // Usamos setDoc para criar ou atualizar o documento.
        // A opção { merge: true } é importante: ela cria o documento se ele não existir,
        // e se já existir, apenas atualiza os campos, sem apagar outros dados (como as subcoleções).
        await setDoc(userDocRef, {
          email: user.email,
          lastLogin: Timestamp.now(), // Armazena a data do último login
        }, { merge: true });
      }
      // Após isso, o onAuthStateChanged no App.js vai assumir e renderizar o app.

    } catch (err) {
      setError('Falha ao autenticar com o Google. Tente novamente.');
      logger.error("Erro com Google Sign-In:", err);
      setIsLoading(false);
    }
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
            backgroundColor: '#4285F4',
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
