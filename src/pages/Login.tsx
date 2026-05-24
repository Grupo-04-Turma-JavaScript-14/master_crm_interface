// =============================================================================
// Login.tsx — Página de Autenticação do CRM Master
// -----------------------------------------------------------------------------
// MUDANÇAS REALIZADAS NESTA VERSÃO:
// 1. handleLogin agora chama o backend real: POST /usuarios/logar
// 2. O token JWT retornado pelo backend é salvo no localStorage
// 3. handleRegister agora chama o backend real: POST /usuarios/cadastrar
// 4. Mensagens de erro reais são exibidas ao usuário (email já cadastrado, etc.)
// 5. Estado de loading adicionado para desabilitar o botão durante a requisição
// 6. useAuth() substituiu o navigate direto — o contexto faz o redirecionamento
// =============================================================================

import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { api } from '../api/axios';         // ← instância do axios já configurada
import { useAuth } from '../context/AuthContext'; // ← contexto de autenticação
import PointillismAnimation from '../components/PointillismAnimation';

export default function Login() {
  // ---------------------------------------------------------------------------
  // CONTEXTO: usamos a função "login" do AuthContext
  // Ela faz a chamada ao backend, salva o token e redireciona para /app/dashboard
  // ---------------------------------------------------------------------------
  const { login } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('master_crm_theme') === 'dark';
  });

  // Campos do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Estados de feedback para o usuário
  const [erro, setErro] = useState('');           // mensagem de erro da API
  const [isLoading, setIsLoading] = useState(false); // desabilita o botão durante a requisição

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('master_crm_theme', newTheme ? 'dark' : 'light');
    window.dispatchEvent(new Event('themeChange'));
  };

  // ---------------------------------------------------------------------------
  // HANDLE LOGIN — corrigido para chamar o backend real
  // O backend espera: POST /usuarios/logar com { usuario: email, senha }
  // O campo se chama "usuario" (não "email") — conforme o UsuarioLogin entity do NestJS
  // ---------------------------------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setIsLoading(true);

    try {
      // Delega para o AuthContext que faz a chamada, salva o token e redireciona
      await login(email, senha);
    } catch (error: any) {
      // Exibe mensagem de erro para o usuário — ex: "Usuário ou senha incorretos"
      const mensagem = error?.response?.data?.message || 'E-mail ou senha incorretos. Tente novamente.';
      setErro(mensagem);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // HANDLE REGISTER — corrigido para chamar o backend real
  // O backend espera: POST /usuarios/cadastrar com { nome, email, senha }
  // Após o cadastro, volta para o modo login sem autenticar automaticamente
  // ---------------------------------------------------------------------------
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setIsLoading(true);

    try {
      // Chama o endpoint de cadastro do backend
      await api.post('/usuarios/cadastrar', { nome, email, senha });

      // Sucesso: volta para o modo login com os campos limpos
      setIsRegistering(false);
      setNome('');
      setSenha('');
      // Mantém o email preenchido para facilitar o login
      setErro(''); // limpa erros anteriores

      // Pequena mensagem de sucesso reutilizando o campo de erro (com cor diferente no JSX)
      // Usamos uma convenção: se começa com "✓" é sucesso
      setErro('✓ Cadastro realizado! Faça login para continuar.');

    } catch (error: any) {
      // Ex: "O Usuário já existe!" — mensagem que vem do UsuarioService.create()
      const mensagem = error?.response?.data?.message || 'Erro ao cadastrar. Tente novamente.';
      setErro(mensagem);
    } finally {
      setIsLoading(false);
    }
  };

  // Determina se a mensagem no campo "erro" é na verdade um sucesso
  const isMensagemSucesso = erro.startsWith('✓');

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-1000 ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-white text-slate-900'}`}>

      {/* Lado esquerdo — Animação */}
      <div className={`hidden md:block w-1/2 relative overflow-hidden transition-colors duration-1000 ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-slate-100'}`}>
        <PointillismAnimation />
      </div>

      {/* Lado direito — Formulário */}
      <div className="w-full md:w-1/2 flex flex-col relative p-8">

        {/* Botão de tema */}
        <div className="absolute top-6 right-6 z-10 animate-fade-in-down">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border-2 transition-all cursor-pointer ${isDarkMode ? 'border-neutral-800 text-white hover:bg-neutral-900 hover:border-neutral-600' : 'border-neutral-200 text-black hover:bg-neutral-100 hover:border-black'}`}
            title="Alternar Tema"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center w-full max-w-105 mx-auto mt-8 sm:mt-0">
          <div className="w-full flex flex-col">

            {/* Logo */}
            <div className="flex justify-center mb-10">
              <svg viewBox="0 0 1402 1122" className={`w-32 sm:w-48 h-auto transition-all ${isDarkMode ? 'invert opacity-90' : 'opacity-100'}`}>
                <defs>
                  <pattern id="loginDotMaskPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="8" fill="white" />
                  </pattern>
                  <mask id="loginDotsMask">
                    <rect width="100%" height="100%" fill="url(#loginDotMaskPattern)" />
                  </mask>
                </defs>
                <image href="/logo_master.svg" width="1402" height="1122" mask="url(#loginDotsMask)" />
              </svg>
            </div>

            {/* Título */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 tracking-tight">
                {isRegistering ? 'Crie sua conta' : 'Bem-vindo de volta!'}
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-neutral-400' : 'text-slate-500'}`}>
                {isRegistering
                  ? 'Preencha seus dados para começar a usar a plataforma.'
                  : 'Seu trabalho, sua equipe, seu fluxo — tudo em um só lugar.'}
              </p>
            </div>

            {/* Mensagem de erro ou sucesso — aparece apenas quando há algo para mostrar */}
            {erro && (
              <div className={`mb-4 px-4 py-3 rounded-xl text-sm text-center border ${
                isMensagemSucesso
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'   // sucesso (cadastro OK)
                  : 'bg-red-500/10 border-red-500/30 text-red-400'               // erro (login falhou)
              }`}>
                {erro}
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={isRegistering ? handleRegister : handleLogin} className="flex flex-col gap-4">

              {/* Campo nome — só aparece no cadastro */}
              {isRegistering && (
                <div className="animate-fade-in-down" style={{ animationDuration: '0.3s' }}>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-shadow ${
                      isDarkMode
                        ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:ring-white'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-black'
                    }`}
                    placeholder="Nome completo"
                    required
                  />
                </div>
              )}

              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-shadow ${
                    isDarkMode
                      ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:ring-white'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-black'
                  }`}
                  placeholder="Digite seu e-mail"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-shadow ${
                    isDarkMode
                      ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:ring-white'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-black'
                  }`}
                  placeholder={isRegistering ? 'Crie uma senha' : 'Sua senha'}
                  required
                />
              </div>

              {/* Botão de submit — desabilitado durante o loading */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full cursor-pointer text-sm font-bold border-2 px-6 py-3 rounded-full transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${
                  isDarkMode
                    ? 'bg-black border-neutral-700 text-white hover:bg-neutral-900 focus:ring-neutral-700'
                    : 'bg-white border-black text-black hover:bg-neutral-50 focus:ring-black'
                } ${isRegistering ? 'mt-2' : ''}`}
              >
                {/* Texto dinâmico baseado no estado de loading */}
                {isLoading
                  ? (isRegistering ? 'Cadastrando...' : 'Entrando...')
                  : (isRegistering ? 'Cadastrar' : 'Entrar')
                }
              </button>
            </form>

            <div className="text-center mt-6">
              <p className={`text-sm ${isDarkMode ? 'text-neutral-500' : 'text-slate-500'}`}>
                {isRegistering ? (
                  <>
                    Já tem uma conta?{' '}
                    <button
                      type="button"
                      onClick={() => { setIsRegistering(false); setErro(''); }}
                      className={`font-semibold hover:underline ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                    >
                      Entrar
                    </button>
                  </>
                ) : (
                  <>
                    Não tem uma conta?{' '}
                    <button
                      type="button"
                      onClick={() => { setIsRegistering(true); setErro(''); }}
                      className={`font-semibold hover:underline ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                    >
                      Cadastre-se
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex gap-6 justify-center mt-auto text-xs text-slate-400">
          <a href="#" className="hover:text-slate-600 transition-colors">Ajuda</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Termos</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Privacidade</a>
        </div>
      </div>
    </div>
  );
}
