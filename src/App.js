import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';

// Componentes Atuais
import ChurchManager from './components/ChurchManager';
import Auth from './components/Auth';
import ErrorBoundary from './components/ErrorBoundary';

// Contexto e Autenticação
import { ChurchProvider } from './contexts/ChurchContext';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Lazy loading para componentes grandes
const ChurchDashboard = lazy(() => import('./components/ChurchDashboard'));
const ChurchScheduleGenerator = lazy(() => import('./components/ChurchScheduleGenerator'));

// Componente de Layout
const Layout = ({ children, user }) => {
  const navigate = useNavigate();
  const activeStyle = {
    fontWeight: 'bold',
    color: '#007bff',
    textDecoration: 'underline',
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <>
      <header>
        <nav style={{ background: '#f8f9fa', padding: '15px 20px', marginBottom: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ul style={{ listStyle: 'none', display: 'flex', gap: '25px', margin: 0, padding: 0, alignItems: 'center' }}>
            <li>
                <NavLink to="/" style={({ isActive }) => isActive ? activeStyle : { textDecoration: 'none', color: '#333' }} end>
                    🏠 Minhas Igrejas
                </NavLink>
            </li>
          </ul>
          {user && (
            <div>
              <span style={{ marginRight: '15px', color: '#555' }}>Olá, {user.email}</span>
              <button onClick={handleLogout} style={{ padding: '8px 12px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: 'white' }}>Sair</button>
            </div>
          )}
        </nav>
      </header>
      <main style={{ padding: '0 20px' }}>
        {children}
      </main>
      <footer style={{ textAlign: 'center', padding: '20px', marginTop: '40px', fontSize: '0.9em', color: '#777', borderTop: '1px solid #eee' }}>
        <p>&copy; {new Date().getFullYear()} Gerenciador de Escalas.</p>
      </footer>
    </>
  );
};

const NotFoundPage = () => (
   <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Página Não Encontrada (404)</h2>
    <p>A página que você procura não existe ou foi removida.</p>
  </div>
);

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div style={{textAlign: 'center', marginTop: '50px'}}>Carregando...</div>;
  }

  return (
    <ErrorBoundary>
      <Router>
        {user ? (
          <ChurchProvider>
            <Layout user={user}>
              <Suspense fallback={<div style={{textAlign: 'center', marginTop: '50px'}}>Carregando...</div>}>
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
          <Auth />
        )}
      </Router>
    </ErrorBoundary>
  );
}

export default App;