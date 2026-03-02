import React, { useState, useEffect, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import './App.css';

// Componentes Atuais
import ChurchManager from './components/ChurchManager';
import Auth from './components/Auth';
import ErrorBoundary from './components/ErrorBoundary';
import Button from './components/ui/Button';
import logger, { setLoggerReporter, setLoggerContextProvider } from './utils/logger';
import { createFirestoreLoggerReporter } from './services/firestoreLoggerReporter';
import {
  isE2EMode,
  E2E_TEST_USER,
  getE2ESession,
  setE2ESession,
  clearE2ESession,
} from './utils/e2eMode';

// Contexto e Autenticação
import { ChurchProvider } from './contexts/ChurchContext';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Lazy loading para componentes grandes
const ChurchDashboard = lazy(() => import('./components/ChurchDashboard'));
const ChurchScheduleGenerator = lazy(() => import('./components/ChurchScheduleGenerator'));
const firestoreReporter = createFirestoreLoggerReporter({
  getUser: () => auth.currentUser,
});

// Componente de Layout
const Layout = ({ children, user, onLogout }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await onLogout();
      navigate('/');
    } catch (error) {
      logger.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <>
      <header>
        <nav className="app-nav">
          <ul className="app-nav-list">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? 'app-nav-link app-nav-link-active' : 'app-nav-link')}
                end
              >
                🏠 Minhas Igrejas
              </NavLink>
            </li>
          </ul>
          {user && (
            <div className="app-nav-user">
              <span className="app-nav-greeting">Olá, {user.email}</span>
              <Button onClick={handleLogout} variant="secondary" size="sm">
                Sair
              </Button>
            </div>
          )}
        </nav>
      </header>
      <main className="app-main">
        {children}
      </main>
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Gerenciador de Escalas.</p>
      </footer>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  onLogout: PropTypes.func.isRequired,
  user: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string,
  }),
};

const NotFoundPage = () => (
  <div className="app-center-block">
    <h2>Página Não Encontrada (404)</h2>
    <p>A página que você procura não existe ou foi removida.</p>
  </div>
);

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setLoggerReporter(firestoreReporter);
    setLoggerContextProvider(() => ({
      route:
        typeof window !== 'undefined' && window.location
          ? window.location.pathname
          : '',
    }));

    return () => {
      setLoggerReporter(null);
      setLoggerContextProvider(null);
    };
  }, []);

  useEffect(() => {
    if (isE2EMode) {
      setUser(getE2ESession());
      setIsLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div className="app-loading">Carregando...</div>;
  }

  const handleLogout = async () => {
    if (isE2EMode) {
      clearE2ESession();
      setUser(null);
      return;
    }

    await signOut(auth);
  };

  const handleE2ELogin = () => {
    if (!isE2EMode) return;
    setE2ESession(E2E_TEST_USER);
    setUser(E2E_TEST_USER);
  };

  return (
    <ErrorBoundary>
      <Router>
        {user ? (
          <ChurchProvider>
            <Layout user={user} onLogout={handleLogout}>
              <Suspense fallback={<div className="app-loading">Carregando...</div>}>
                <Routes>
                  {/* Rota principal: Lista de Igrejas */}
                  <Route path="/" element={<ChurchManager user={user} />} />

                  {/* Rota do Painel da Igreja */}
                  <Route path="/igreja/:id" element={<ChurchDashboard user={user} />} />
                  
                  {/* Rota do Gerador de Escala */}
                  <Route path="/igreja/:id/escala" element={<ChurchScheduleGenerator user={user} />} />

                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </Layout>
          </ChurchProvider>
        ) : (
          <Auth onE2ELogin={handleE2ELogin} />
        )}
      </Router>
    </ErrorBoundary>
  );
}

export default App;
