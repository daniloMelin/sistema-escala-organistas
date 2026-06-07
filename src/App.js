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
import { auth, firebaseConfigError, isFirebaseReady } from './firebaseConfig';

// Lazy loading para componentes grandes
const loadChurchDashboard = () => import('./components/ChurchDashboard');
const loadChurchScheduleGenerator = () => import('./components/ChurchScheduleGenerator');

const ChurchDashboard = lazy(loadChurchDashboard);
const ChurchScheduleGenerator = lazy(loadChurchScheduleGenerator);
const firestoreReporter = createFirestoreLoggerReporter({
  getUser: () => auth?.currentUser || null,
});

// Componente de Layout
const Layout = ({ children, user, onLogout }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await onLogout();
      navigate('/');
    } catch (error) {
      logger.error('Erro ao fazer logout:', error);
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
                className={({ isActive }) =>
                  isActive ? 'app-nav-link app-nav-link-active' : 'app-nav-link'
                }
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
      <main className="app-main">{children}</main>
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

const AppBootLoading = () => (
  <div className="auth-shell auth-shell--loading" aria-busy="true" aria-live="polite">
    <div className="auth-card auth-card--loading">
      <div className="skeleton-line skeleton-line--title" />
      <div className="skeleton-line skeleton-line--md" />
      <div className="skeleton-line skeleton-line--md" />
      <div className="skeleton-button auth-card__skeleton-button" />
    </div>
  </div>
);

const RouteLoadingFallback = () => (
  <div
    className="page-container page-container--lg app-route-loading"
    aria-busy="true"
    aria-live="polite"
  >
    <div className="dashboard-toolbar">
      <span className="skeleton-button" />
      <span className="skeleton-button" />
    </div>
    <div className="section-header">
      <div className="skeleton-line skeleton-line--title" />
      <div className="skeleton-line skeleton-line--md" />
    </div>
    <div className="app-route-loading__panel">
      <div className="skeleton-line skeleton-line--title" />
      <div className="skeleton-line skeleton-line--md" />
      <div className="skeleton-line skeleton-line--sm" />
    </div>
    <div className="app-route-loading__panel">
      <div className="skeleton-line skeleton-line--title" />
      <div className="skeleton-line skeleton-line--md" />
      <div className="skeleton-line skeleton-line--md" />
      <div className="skeleton-line skeleton-line--sm" />
    </div>
  </div>
);

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setLoggerReporter(firestoreReporter);
    setLoggerContextProvider(() => ({
      route: typeof window !== 'undefined' && window.location ? window.location.pathname : '',
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

    if (!isFirebaseReady || !auth) {
      setIsLoading(false);
      return undefined;
    }

    let unsubscribe = null;
    let isSubscribed = true;

    import('firebase/auth')
      .then(({ onAuthStateChanged }) => {
        if (!isSubscribed) return;

        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setIsLoading(false);
        });
      })
      .catch((error) => {
        logger.error('Erro ao inicializar listener de autenticação:', error);
        if (isSubscribed) {
          setIsLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    loadChurchDashboard();

    let timeoutId = null;
    let idleCallbackId = null;

    const preloadScheduleGenerator = () => {
      loadChurchScheduleGenerator();
    };

    if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
      idleCallbackId = window.requestIdleCallback(preloadScheduleGenerator, { timeout: 2000 });
    } else {
      timeoutId = window.setTimeout(preloadScheduleGenerator, 1200);
    }

    return () => {
      if (
        idleCallbackId !== null &&
        typeof window !== 'undefined' &&
        typeof window.cancelIdleCallback === 'function'
      ) {
        window.cancelIdleCallback(idleCallbackId);
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [user]);

  if (isLoading) {
    return <AppBootLoading />;
  }

  if (!isE2EMode && !isFirebaseReady) {
    return (
      <div className="app-center-block">
        <h2>Configuração pendente</h2>
        <p>{firebaseConfigError}</p>
        <p className="muted-text">
          Revise as variáveis de ambiente do Firebase antes de usar o sistema em produção.
        </p>
      </div>
    );
  }

  const handleLogout = async () => {
    if (isE2EMode) {
      clearE2ESession();
      setUser(null);
      return;
    }

    if (auth) {
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
    }
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
              <Suspense fallback={<RouteLoadingFallback />}>
                <Routes>
                  {/* Rota principal: Lista de Igrejas */}
                  <Route path="/" element={<ChurchManager user={user} />} />

                  {/* Rota do Painel da Igreja */}
                  <Route path="/igreja/:id" element={<ChurchDashboard user={user} />} />

                  {/* Rota do Gerador de Escala */}
                  <Route
                    path="/igreja/:id/escala"
                    element={<ChurchScheduleGenerator user={user} />}
                  />

                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </Layout>
          </ChurchProvider>
        ) : (
          <Auth onAuthSuccess={setUser} onE2ELogin={handleE2ELogin} />
        )}
      </Router>
    </ErrorBoundary>
  );
}

export default App;
