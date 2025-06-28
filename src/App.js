import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import OrganistForm from './components/OrganistForm';
import ScheduleGenerator from './components/ScheduleGenerator';

// Importações de Autenticação
import { auth } from './services/firebaseService';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Auth from './components/Auth'; // Importa nosso novo componente

// Componente de Layout modificado para incluir botão de Sair
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
      navigate('/'); // Redireciona para a página de login após sair
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <>
      <header>
        <nav style={{ background: '#f8f9fa', padding: '15px 20px', marginBottom: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ul style={{ listStyle: 'none', display: 'flex', gap: '25px', margin: 0, padding: 0, alignItems: 'center' }}>
            <li><NavLink to="/" style={({ isActive }) => isActive ? activeStyle : { textDecoration: 'none', color: '#333' }} end>Início</NavLink></li>
            <li><NavLink to="/cadastro-organistas" style={({ isActive }) => isActive ? activeStyle : { textDecoration: 'none', color: '#333' }}>Cadastro de Organistas</NavLink></li>
            <li><NavLink to="/gerar-escala" style={({ isActive }) => isActive ? activeStyle : { textDecoration: 'none', color: '#333' }}>Gerar/Visualizar Escala</NavLink></li>
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

const HomePage = () => (
  // ... (código da HomePage permanece o mesmo)
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1 style={{color: '#333'}}>Bem-vindo ao Gerenciador de Escalas de Organistas</h1>
    <p style={{fontSize: '1.1em', color: '#555'}}>Utilize o menu de navegação acima para gerenciar organistas e gerar as escalas para os cultos.</p>
  </div>
);

const NotFoundPage = () => (
  // ... (código da NotFoundPage permanece o mesmo)
   <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Página Não Encontrada (404)</h2>
  </div>
);


function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged é um "ouvinte" que detecta logins e logouts
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Define o usuário (pode ser null se deslogado)
      setIsLoading(false);  // Marca que o carregamento inicial terminou
    });

    // Função de limpeza para remover o "ouvinte" quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div style={{textAlign: 'center', marginTop: '50px'}}>Carregando...</div>;
  }

  return (
    <Router>
      {user ? (
        // Se o usuário estiver logado, mostra o Layout e o app principal
        <Layout user={user}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cadastro-organistas" element={<OrganistForm />} />
            <Route path="/gerar-escala" element={<ScheduleGenerator />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      ) : (
        // Se não houver usuário, mostra apenas a tela de autenticação
        <Auth />
      )}
    </Router>
  );
}

export default App;