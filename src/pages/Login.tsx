import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';
import PointillismAnimation from '../components/PointillismAnimation';
import { api } from '../api/axios';

export default function Login() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('master_crm_theme') === 'dark';
  });

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('master_crm_theme', newTheme ? 'dark' : 'light');
    
    // Dispatch a custom event to notify other components (like Intro.tsx if it was active, though they don't share a screen)
    window.dispatchEvent(new Event('themeChange'));
  };

  // Form fields
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/usuarios/logar', { usuario: email, senha });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/app/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/usuarios/cadastrar', { nome, email, senha });
      toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
      setIsRegistering(false);
      setNome('');
      setSenha('');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Erro ao cadastrar usuário.');
    }
  };

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-1000 ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-white text-slate-900'}`}>
      {/* Left side - Animation */}
      <div className={`hidden md:block w-1/2 relative overflow-hidden transition-colors duration-1000 ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-slate-100'}`}>
        <PointillismAnimation />
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex flex-col relative p-8">
        
        {/* Theme Toggle Button */}
        <div className="absolute top-6 right-6 z-10 animate-fade-in-down">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border-2 transition-all cursor-pointer ${isDarkMode ? 'border-neutral-800 text-white hover:bg-neutral-900 hover:border-neutral-600' : 'border-neutral-200 text-black hover:bg-neutral-100 hover:border-black'}`}
            title="Alternar Tema"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center w-full max-w-[420px] mx-auto mt-8 sm:mt-0">
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

            {/* Headers */}
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

            {/* Form */}
            <form onSubmit={isRegistering ? handleRegister : handleLogin} className="flex flex-col gap-4">
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
                  placeholder={isRegistering ? "Crie uma senha" : "Sua senha"}
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full cursor-pointer text-sm font-bold border-2 px-6 py-3 rounded-full transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDarkMode 
                    ? 'bg-black border-neutral-700 text-white hover:bg-neutral-900 focus:ring-neutral-700' 
                    : 'bg-white border-black text-black hover:bg-neutral-50 focus:ring-black'
                } ${isRegistering ? 'mt-2' : ''}`}
              >
                {isRegistering ? 'Cadastrar' : 'Entrar'}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className={`text-sm ${isDarkMode ? 'text-neutral-500' : 'text-slate-500'}`}>
                {isRegistering ? (
                  <>
                    Já tem uma conta?{' '}
                    <button type="button" onClick={() => setIsRegistering(false)} className={`font-semibold hover:underline ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Entrar
                    </button>
                  </>
                ) : (
                  <>
                    Não tem uma conta?{' '}
                    <button type="button" onClick={() => setIsRegistering(true)} className={`font-semibold hover:underline ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Cadastre-se
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex gap-6 justify-center mt-auto text-xs text-slate-400">
          <a href="#" className="hover:text-slate-600 transition-colors">Ajuda</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Termos</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Privacidade</a>
        </div>
      </div>
    </div>
  );
}
