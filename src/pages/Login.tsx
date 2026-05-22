import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PointillismAnimation from '../components/PointillismAnimation';

export default function Login() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Form fields
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('token', 'fake-jwt-token');
    navigate('/app/dashboard');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Do not login automatically. Just switch back to login mode.
    alert('Cadastro realizado com sucesso! Faça login para continuar.');
    setIsRegistering(false);
    // clear fields except email so they can log in quickly
    setNome('');
    setSenha('');
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-900">
      {/* Left side - Animation */}
      <div className="hidden md:block w-1/2 bg-slate-100 relative overflow-hidden">
        <PointillismAnimation />
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex flex-col relative p-8">
        <div className="flex-1 flex items-center justify-center w-full max-w-[420px] mx-auto">
          <div className="w-full flex flex-col">
            {/* Logo */}
            <div className="flex justify-center mb-10">
              <svg width="180" height="30" viewBox="0 0 220 36" className="sm:w-[220px] sm:h-[36px]">
                <defs>
                  <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#eab308" />
                  </linearGradient>
                  <pattern id="dotMaskPattern" x="0" y="0" width="3.5" height="3.5" patternUnits="userSpaceOnUse">
                    <circle cx="1.75" cy="1.75" r="1.4" fill="white" />
                  </pattern>
                  <mask id="dotsMask">
                    <rect width="100%" height="100%" fill="url(#dotMaskPattern)" />
                  </mask>
                </defs>
                <text x="110" y="28" fontSize="28" fontWeight="900" letterSpacing="2" fill="url(#textGrad)" mask="url(#dotsMask)" textAnchor="middle">MASTER CRM</text>
              </svg>
            </div>

            {/* Headers */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 tracking-tight">
                {isRegistering ? 'Crie sua conta' : 'Bem-vindo de volta!'}
              </h2>
              <p className="text-slate-500 text-sm">
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
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm placeholder-slate-400 transition-shadow"
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
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm placeholder-slate-400 transition-shadow"
                  placeholder="Digite seu e-mail"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm placeholder-slate-400 transition-shadow"
                  placeholder={isRegistering ? "Crie uma senha" : "Sua senha"}
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full cursor-pointer text-sm font-bold border-2 px-6 py-3 rounded-full transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 bg-white border-black text-black hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${isRegistering ? 'mt-2' : ''}`}
              >
                {isRegistering ? 'Cadastrar' : 'Entrar'}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-slate-500">
                {isRegistering ? (
                  <>
                    Já tem uma conta?{' '}
                    <button type="button" onClick={() => setIsRegistering(false)} className="font-semibold text-slate-900 hover:underline">
                      Entrar
                    </button>
                  </>
                ) : (
                  <>
                    Não tem uma conta?{' '}
                    <button type="button" onClick={() => setIsRegistering(true)} className="font-semibold text-slate-900 hover:underline">
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
