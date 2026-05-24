// =============================================================================
// App.tsx — Configuração de Rotas e Contexto Global do CRM Master
// -----------------------------------------------------------------------------
// MUDANÇAS REALIZADAS NESTA VERSÃO:
// 1. AuthProvider adicionado envolvendo todas as rotas — disponibiliza o
//    usuário logado e as funções login/logout para qualquer componente da app
// 2. Componente RotaProtegida criado — redireciona para /login se não houver
//    token válido, evitando acesso não autorizado às páginas do CRM
// 3. Tela de loading global adicionada — evita flash de conteúdo protegido
//    enquanto o AuthContext ainda está verificando o token salvo
// IMPORTANTE: AuthProvider DEVE estar dentro do BrowserRouter pois usa
// useNavigate() internamente para redirecionar após login/logout
// =============================================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // ← NOVO: contexto global
import { useAuth } from './context/AuthContext';       // ← NOVO: para RotaProtegida

import Intro from './pages/Intro';
import Login from './pages/Login';
import CrmLayout from './layouts/CrmLayout';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Contatos from './pages/Contatos';
import Usuarios from './pages/Usuarios';

// -----------------------------------------------------------------------------
// COMPONENTE: RotaProtegida
// Verifica se existe um token no localStorage antes de renderizar a rota.
// Se não houver token → redireciona para /login automaticamente.
// Se o AuthContext ainda está carregando (verificando token) → mostra spinner.
// Isso impede que alguém acesse /app/dashboard digitando a URL diretamente.
// -----------------------------------------------------------------------------
function RotaProtegida({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();

  // Enquanto o contexto verifica o token salvo, mostra um spinner de tela cheia
  // Sem isso, a tela piscaria rapidamente entre login e dashboard
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Sem token → redireciona para login e não renderiza nada protegido
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token presente → renderiza a rota normalmente
  return <>{children}</>;
}

// -----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL: App
// Ordem obrigatória do aninhamento:
// BrowserRouter → AuthProvider → Routes
// O AuthProvider precisa estar dentro do BrowserRouter porque usa useNavigate()
// -----------------------------------------------------------------------------
function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider envolve todas as rotas para que qualquer componente
          possa acessar useAuth() — usuário logado, login, logout, etc. */}
      <AuthProvider>
        <Routes>

          {/* ROTAS PÚBLICAS — acessíveis sem autenticação */}
          <Route path="/" element={<Intro />} />
          <Route path="/login" element={<Login />} />

          {/* ROTAS PROTEGIDAS — só acessíveis com token válido
              RotaProtegida verifica o token antes de renderizar o CrmLayout
              Todas as sub-rotas /app/* ficam automaticamente protegidas */}
          <Route
            path="/app"
            element={
              <RotaProtegida>
                <CrmLayout />
              </RotaProtegida>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="contatos" element={<Contatos />} />
            <Route path="usuarios" element={<Usuarios />} />
          </Route>

          {/* FALLBACK — qualquer rota desconhecida volta para a intro */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
