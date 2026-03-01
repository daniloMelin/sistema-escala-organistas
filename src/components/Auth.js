import React, { useState } from 'react';

import { auth, db } from '../firebaseConfig';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

import {
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import logger from '../utils/logger';
import Button from './ui/Button';
import './Auth.css';

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
    <div className="auth-shell">
      <div className="auth-card">
        <h2 className="auth-title">Sistema de Escala de Organistas</h2>
        <p className="auth-subtitle">
          Utilize sua conta Google para entrar ou criar seu acesso ao sistema.
        </p>

        {error && <p className="auth-error">{error}</p>}

        <Button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          variant="primary"
          size="lg"
          fullWidth
        >
          {isLoading ? 'Aguarde...' : 'Entrar com o Google'}
        </Button>
      </div>
    </div>
  );
};

export default Auth;
