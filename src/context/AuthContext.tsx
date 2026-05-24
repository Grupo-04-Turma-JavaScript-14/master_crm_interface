// =============================================================================
// AuthContext.tsx — Gerenciamento Global de Autenticação do CRM Master
// -----------------------------------------------------------------------------
// Este arquivo controla TODA a autenticação da aplicação:
// - Verificação de token salvo ao abrir o app
// - Função de login (chama o backend ou usa modo dev)
// - Função de logout (limpa token e redireciona)
// - Dados do usuário logado disponíveis globalmente via useAuth()
//
// ⚠️  MODO DESENVOLVIMENTO ATIVO:
//     As funções login() e carregarUsuarioDoToken() estão com fallback fake.
//     Quando o backend estiver conectado:
//     1. Descomente os blocos marcados com "✅ PRODUÇÃO"
//     2. Remova os blocos marcados com "🚧 MODO DEV — REMOVER EM PRODUÇÃO"
// =============================================================================

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios';

// -----------------------------------------------------------------------------
// TIPAGENS
// -----------------------------------------------------------------------------

interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
  cargo: 'Seller / Primeiro contato' | 'Seller / Recuperador';
  fotoUrl?: string;
  createdAt: string;
}

interface AuthContextType {
  usuarioLogado: UsuarioLogado | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  atualizarUsuario: (dados: Partial<UsuarioLogado>) => void;
  isLoading: boolean;
}

// -----------------------------------------------------------------------------
// CRIAÇÃO DO CONTEXTO E HOOK
// -----------------------------------------------------------------------------

const AuthContext = createContext<AuthContextType | null>(null);

// Hook que qualquer componente usa para acessar o contexto
// Ex: const { usuarioLogado, logout } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}

// -----------------------------------------------------------------------------
// DECODIFICADOR DE JWT — sem biblioteca externa
// Extrai o payload do token (id, email) para identificar o usuário logado
// -----------------------------------------------------------------------------
function decodeJwt(token: string): any {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

// -----------------------------------------------------------------------------
// AUTH PROVIDER — envolve toda a aplicação no App.tsx
// -----------------------------------------------------------------------------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuarioLogado, setUsuarioLogado] = useState<UsuarioLogado | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // EFEITO INICIAL: verifica se já existe um token salvo no localStorage
  // Isso mantém o usuário logado mesmo após fechar e reabrir o navegador
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const tokenSalvo = localStorage.getItem('token');
    if (tokenSalvo) {
      setToken(tokenSalvo);
      carregarUsuarioDoToken(tokenSalvo);
    } else {
      setIsLoading(false);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // CARREGAR USUÁRIO DO TOKEN
  // Chamado ao iniciar o app (token salvo) ou após o login
  // ---------------------------------------------------------------------------
  async function carregarUsuarioDoToken(tkn: string) {

    // =========================================================================
    // 🚧 MODO DEV — REMOVER EM PRODUÇÃO
    // Se o token for o fake de desenvolvimento, define um usuário mock
    // e não tenta chamar o backend (que não está rodando)
    // =========================================================================
    if (tkn === 'dev-token') {
      // Usuário fake para desenvolvimento — substitua pelos seus dados de teste
      setUsuarioLogado({
        id: 1,
        nome: 'Usuário Dev',
        email: 'dev@mastercrm.com',
        cargo: 'Seller / Primeiro contato',
        createdAt: new Date().toISOString(),
      });
      setIsLoading(false);
      return; // para aqui, não chama o backend
    }
    // =========================================================================

    // =========================================================================
    // ✅ PRODUÇÃO — este bloco funciona com o backend real
    // Decodifica o token JWT, extrai o ID do usuário (payload.sub)
    // e busca os dados completos em /usuarios/all
    // =========================================================================
    try {
      const payload = decodeJwt(tkn);
      if (!payload?.sub) throw new Error('Token inválido ou expirado');

      // Busca a lista completa e filtra pelo ID do usuário logado
      // (o backend não tem GET /usuarios/me, por isso buscamos todos e filtramos)
      const res = await api.get('/usuarios/all');
      const todos: UsuarioLogado[] = res.data;
      const eu = todos.find((u) => u.id === payload.sub);

      if (eu) {
        setUsuarioLogado(eu);
      } else {
        throw new Error('Usuário não encontrado na lista');
      }
    } catch (error) {
      console.error('Sessão inválida, fazendo logout:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
    // =========================================================================
  }

  // ---------------------------------------------------------------------------
  // FUNÇÃO DE LOGIN
  // ---------------------------------------------------------------------------
  async function login(email: string, senha: string) {

    // =========================================================================
    // ✅ PRODUÇÃO — descomente este bloco quando o backend estiver rodando
    // e remova o bloco "🚧 MODO DEV" abaixo dele
    //
    // try {
    //   const res = await api.post('/usuarios/logar', {
    //     usuario: email, // o backend espera o campo "usuario", não "email"
    //     senha,
    //   });
    //
    //   // ⚠️ ATENÇÃO: confirme com o colega de backend qual é o nome do campo
    //   // O NestJS com Passport normalmente retorna "access_token"
    //   // Se for diferente, ajuste aqui: res.data.access_token ou res.data.token
    //   const novoToken = res.data.token ?? res.data.access_token;
    //
    //   localStorage.setItem('token', novoToken);
    //   setToken(novoToken);
    //   await carregarUsuarioDoToken(novoToken);
    //   navigate('/app/dashboard');
    // } catch (error) {
    //   throw error; // repassa o erro para o Login.tsx exibir a mensagem
    // }
    // =========================================================================

    // =========================================================================
    // 🚧 MODO DEV — REMOVER EM PRODUÇÃO
    // Tenta o backend real primeiro. Se falhar (backend offline), usa login fake.
    // Isso permite testar o frontend sem precisar do backend rodando.
    // =========================================================================
    try {
      // Tenta o backend real
      const res = await api.post('/usuarios/logar', {
        usuario: email,
        senha,
      });

      const novoToken = res.data.token ?? res.data.access_token;
      localStorage.setItem('token', novoToken);
      setToken(novoToken);
      await carregarUsuarioDoToken(novoToken);
      navigate('/app/dashboard');

    } catch (error) {
      // Backend offline → loga com usuário fake para continuar o desenvolvimento
      console.warn('⚠️ Backend offline — ativando login em modo desenvolvimento');

      const tokenFake = 'dev-token';

      // Usa a parte antes do @ como nome (ex: "jose" de "jose@email.com")
      const nomeFake = email.includes('@')
        ? email.split('@')[0].replace(/[._]/g, ' ')
        : 'Usuário Dev';

      const usuarioFake: UsuarioLogado = {
        id: 1,
        nome: nomeFake,
        email: email,
        cargo: 'Seller / Primeiro contato',
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('token', tokenFake);
      setToken(tokenFake);
      setUsuarioLogado(usuarioFake);
      navigate('/app/dashboard');
    }
    // =========================================================================
  }

  // ---------------------------------------------------------------------------
  // LOGOUT — limpa tudo e redireciona para o login
  // ---------------------------------------------------------------------------
  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUsuarioLogado(null);
    navigate('/login');
  }

  // ---------------------------------------------------------------------------
  // ATUALIZAR USUÁRIO — sincroniza mudanças de perfil globalmente
  // Chamado pelo Usuarios.tsx após salvar o perfil para atualizar o header
  // ---------------------------------------------------------------------------
  function atualizarUsuario(dados: Partial<UsuarioLogado>) {
    setUsuarioLogado((prev) => prev ? { ...prev, ...dados } : null);
  }

  return (
    <AuthContext.Provider value={{
      usuarioLogado,
      token,
      login,
      logout,
      atualizarUsuario,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
