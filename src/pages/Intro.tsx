import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Intro() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      
      <div className="z-10 text-center space-y-8 glass-panel p-12 rounded-3xl max-w-2xl mx-4">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Bem-vindo ao CRM Master
        </h1>
        <p className="text-lg text-slate-300">
          A plataforma definitiva para gerenciar seus clientes, contatos e usuários com eficiência e elegância.
        </p>
        
        <button
          onClick={() => navigate('/login')}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-blue-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-500 hover:scale-105 active:scale-95"
        >
          Acessar o Sistema
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
