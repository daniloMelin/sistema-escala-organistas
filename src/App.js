import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import OrganistForm from './components/OrganistForm';
import ScheduleGenerator from './components/ScheduleGenerator';

// Componente de Layout para a navegação
const Layout = ({ children }) => {
  const activeStyle = {
    fontWeight: 'bold',
    color: '#007bff',
    textDecoration: 'underline',
  };

  return (
    <>
      <header>
        <nav style={{ background: '#f8f9fa', padding: '15px 20px', marginBottom: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <ul style={{ listStyle: 'none', display: 'flex', gap: '25px', margin: 0, padding: 0, alignItems: 'center' }}>
            <li>
              <NavLink to="/" style={({ isActive }) => isActive ? activeStyle : {textDecoration: 'none', color: '#333'}} end>
                Início
              </NavLink>
            </li>
            <li>
              <NavLink to="/cadastro-organistas" style={({ isActive }) => isActive ? activeStyle : {textDecoration: 'none', color: '#333'}}>
                Cadastro de Organistas
              </NavLink>
            </li>
            <li>
              <NavLink to="/gerar-escala" style={({ isActive }) => isActive ? activeStyle : {textDecoration: 'none', color: '#333'}}>
                Gerar/Visualizar Escala
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <main style={{ padding: '0 20px' }}>
        {children}
      </main>
      <footer style={{ textAlign: 'center', padding: '20px', marginTop: '40px', fontSize: '0.9em', color: '#777', borderTop: '1px solid #eee' }}>
        <p>&copy; {new Date().getFullYear()} Gerenciador de Escalas. (Hoje é {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})</p>
      </footer>
    </>
  );
};

// Página inicial simples
const HomePage = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1 style={{color: '#333'}}>Bem-vindo ao Gerenciador de Escalas de Organistas</h1>
    <p style={{fontSize: '1.1em', color: '#555'}}>Utilize o menu de navegação acima para gerenciar organistas e gerar as escalas para os cultos.</p>
    <p style={{marginTop: '30px', fontSize: '0.9em', color: '#777'}}>
        Desenvolvido para facilitar a organização dos músicos na igreja.
    </p>
  </div>
);

// Página "Não Encontrado"
const NotFoundPage = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Página Não Encontrada (404)</h2>
    <p>O recurso que você está procurando não existe.</p>
    <NavLink to="/">Voltar para a Página Inicial</NavLink>
  </div>
);


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cadastro-organistas" element={<OrganistForm />} />
          <Route path="/gerar-escala" element={<ScheduleGenerator />} />
          <Route path="*" element={<NotFoundPage />} /> {/* Rota para 404 */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;