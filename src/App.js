import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';

// Componentes
import OrganistForm from './components/OrganistForm';
import ScheduleGenerator from './components/ScheduleGenerator';
import ChurchManager from './components/ChurchManager';
import Auth from './components/Auth';

// Contexto e Autenticação
import { ChurchProvider } from './contexts/ChurchContext'; // Importa o Provedor
import { auth } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

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
            <li><NavLink to="/" style={({ isActive }) => isActive ? activeStyle : { textDecoration: 'none', color: '#333' }} end>Igrejas</NavLink></li>
            {/* Estes links serão movidos/removidos no futuro, mas os deixamos por enquanto */}
            <li><NavLink to="/cadastro-organistas" style={({ isActive }) => isActive ? activeStyle : { textDecoration: 'none', color: '#333' }}>Cadastro de Organistas</NavLink></li>
            <li><NavLink to="/gerar-escala" style={({ isActive }) => isActive ? activeStyle : { textDecoration: 'none', color: '#333' }}>Gerar Escala</NavLink></li>
          </ul>
          {user && (
            <div>
              <span style={{ marginRight: '15px', color: '#555' }}>Olá, {user.email}</span>
              <button onClick={handleLogout} style={{ padding: '8px 12px', cursor: 'pointer' }}>Sair</button>
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

// Componente de Página não encontrada
const NotFoundPage = () => (
   <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Página Não Encontrada (404)</h2>
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
    <Router>
      {user ? (
        // O ChurchProvider DEVE estar aqui, envolvendo todo o conteúdo que precisa do contexto
        <ChurchProvider>
          <Layout user={user}>
            <Routes>
              <Route path="/" element={<ChurchManager user={user} />} />
              <Route path="/cadastro-organistas" element={<OrganistForm user={user} />} />
              <Route path="/gerar-escala" element={<ScheduleGenerator user={user} />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </ChurchProvider>
      ) : (
        <Auth />
      )}
    </Router>
  );
}

export default App;