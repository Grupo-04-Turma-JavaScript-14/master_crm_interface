import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, UserPlus, Activity, TrendingUp, Star } from 'lucide-react';
import { api } from '../api/axios';

export default function Dashboard() {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();

  const [metricas, setMetricas] = useState({
    totalClientes: 0,
    totalContatos: 0,
    totalUsuarios: 0,
    totalOportunidades: 0,
  });
  const [atividades, setAtividades] = useState<any[]>([]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [resClientes, resContatos, resUsuarios] = await Promise.all([
          api.get('/clientes'),
          api.get('/contatos'),
          api.get('/usuarios/all')
        ]);
        
        const clientes = resClientes.data;
        const contatos = resContatos.data;
        const usuarios = resUsuarios.data;
        
        setMetricas({
          totalClientes: clientes.length,
          totalContatos: contatos.length,
          totalUsuarios: usuarios.length,
          totalOportunidades: clientes.filter((c: any) => c.statusOportunidade).length,
        });

        // Ordenar contatos por data e pegar os 4 mais recentes
        const recentes = contatos
          .sort((a: any, b: any) => new Date(b.dataContato).getTime() - new Date(a.dataContato).getTime())
          .slice(0, 4);
          
        setAtividades(recentes);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
      }
    };
    
    carregarDados();
  }, []);

  const formatTimeAgo = (dateStr: string) => {
    if (!dateStr) return 'Data desconhecida';
    const diff = new Date().getTime() - new Date(dateStr).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'Agora mesmo';
    if (min < 60) return `Há ${min} min`;
    const horas = Math.floor(min / 60);
    if (horas < 24) return `Há ${horas} hora${horas > 1 ? 's' : ''}`;
    const dias = Math.floor(horas / 24);
    return `Há ${dias} dia${dias > 1 ? 's' : ''}`;
  };

  const stats = [
    { label: 'Total de Clientes', value: metricas.totalClientes.toString(), trend: '+12%', icon: Users, color: 'from-blue-500 to-cyan-400' },
    { label: 'Total de Contatos', value: metricas.totalContatos.toString(), trend: '+5%', icon: UserPlus, color: 'from-purple-500 to-pink-500' },
    { label: 'Usuários Ativos', value: metricas.totalUsuarios.toString(), trend: '+2%', icon: Activity, color: 'from-amber-400 to-orange-500' },
    { label: 'Oportunidades', value: metricas.totalOportunidades.toString(), trend: '+18%', icon: Star, color: 'from-emerald-400 to-teal-500' }
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header section */}
      <div>
         <h1 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Bem-vindo ao Master CRM
         </h1>
         <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Aqui está o resumo das suas atividades e métricas importantes.
         </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric Cards */}
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                isDarkMode 
                  ? 'bg-slate-900/80 border-slate-800 shadow-lg' 
                  : 'bg-white border-slate-100 shadow-md'
              }`}
            >
              {/* Decorative gradient blob */}
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 blur-2xl bg-gradient-to-br ${stat.color}`} />
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 text-white shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`flex items-center text-sm font-semibold px-2 py-1 rounded-full ${
                    stat.trend.startsWith('+') 
                      ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-600') 
                      : (isDarkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-600')
                  }`}>
                    {stat.trend.startsWith('+') ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1 rotate-180" />}
                    {stat.trend}
                  </span>
                </div>
                
                <div>
                  <h3 className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {stat.label}
                  </h3>
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    {stat.value}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overview Chart */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-100 shadow-md'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Visão Geral de Oportunidades</h3>
            <select className={`text-sm rounded-lg px-3 py-1.5 border outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
              <option>Últimos 7 dias</option>
              <option>Este Mês</option>
              <option>Este Ano</option>
            </select>
          </div>
          <div className={`w-full h-72 rounded-2xl flex items-center justify-center border-2 border-dashed ${isDarkMode ? 'border-slate-700/50 bg-slate-800/20' : 'border-slate-200 bg-slate-50/50'}`}>
            {/* Fake Chart graphic using CSS */}
            <div className="flex items-end space-x-2 sm:space-x-4 h-48 w-full px-6 opacity-80">
              {[40, 70, 45, 90, 65, 85, 120].map((height, idx) => (
                <div key={idx} className="w-full relative group flex justify-center">
                  <div 
                    className="w-full rounded-t-lg bg-gradient-to-t from-purple-500/80 to-pink-500/80 transition-all duration-500 group-hover:from-purple-400 group-hover:to-pink-400" 
                    style={{ height: `${height}px` }}
                  />
                  {/* Tooltip on hover */}
                  <div className={`absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold px-2 py-1 rounded shadow-lg ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}>
                    {height * 10}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`p-6 rounded-3xl border transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-100 shadow-md'}`}>
          <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Interações Recentes</h3>
          <div className="space-y-6">
            {atividades.length === 0 ? (
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Nenhuma atividade recente.</p>
            ) : atividades.map((act, idx) => (
              <div key={idx} className="flex gap-4 relative">
                 {/* Timeline line */}
                 {idx !== atividades.length - 1 && <div className={`absolute left-[11px] top-6 bottom-[-24px] w-0.5 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />}
                 
                 <div className={`w-6 h-6 rounded-full flex-shrink-0 z-10 ring-4 bg-blue-500 ${isDarkMode ? 'ring-slate-900' : 'ring-white'}`} />
                 <div>
                   <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Contato: {act.cliente?.nome || 'Desconhecido'}</h4>
                   <p className={`text-xs mt-0.5 max-w-[200px] sm:max-w-xs truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{act.descricao}</p>
                   <span className={`text-[10px] font-medium block mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{formatTimeAgo(act.dataContato)} por {act.usuario?.nome}</span>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
