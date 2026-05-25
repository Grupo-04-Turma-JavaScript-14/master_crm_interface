import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, UserPlus, Activity, TrendingUp, Star } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
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
  const [chartData, setChartData] = useState<{label: string, value: number, height: number}[]>([]);

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

        const recentes = [...contatos]
          .sort((a: any, b: any) => new Date(b.dataContato).getTime() - new Date(a.dataContato).getTime())
          .slice(0, 4);
          
        setAtividades(recentes);

        const hoje = new Date();
        const ultimos7Dias = Array.from({length: 7}).map((_, i) => {
          const d = new Date(hoje);
          d.setDate(d.getDate() - (6 - i));
          return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        });

        const contatosPorDia: Record<string, number> = {};
        ultimos7Dias.forEach(dia => contatosPorDia[dia] = 0);

        contatos.forEach((c: any) => {
          if (!c.dataContato) return;
          const dia = new Date(c.dataContato).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
          if (contatosPorDia[dia] !== undefined) {
            contatosPorDia[dia]++;
          }
        });

        const maxContatos = Math.max(...Object.values(contatosPorDia), 1); 
        
        const dataGrafico = ultimos7Dias.map(dia => ({
          label: dia,
          value: contatosPorDia[dia],
          height: Math.max((contatosPorDia[dia] / maxContatos) * 150, 4)
        }));
        
        setChartData(dataGrafico);
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
    { label: 'Total de Clientes', value: metricas.totalClientes.toString(), trend: '+12%', icon: Users },
    { label: 'Total de Contatos', value: metricas.totalContatos.toString(), trend: '+5%', icon: UserPlus },
    { label: 'Usuários Ativos', value: metricas.totalUsuarios.toString(), trend: '+2%', icon: Activity },
    { label: 'Oportunidades', value: metricas.totalOportunidades.toString(), trend: '+18%', icon: Star }
  ];

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Header section */}
      <div>
         <h1 className={`text-2xl md:text-4xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Overview
         </h1>
         <p className={`mt-2 text-sm ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Acompanhamento de métricas e interações recentes.
         </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric Cards */}
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl ${
                isDarkMode 
                  ? 'bg-[#0a0a0a] border-neutral-800' 
                  : 'bg-white border-neutral-200'
              }`}
            >
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-start justify-between mb-8">
                  <div className={`p-2.5 rounded-lg border ${isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-black'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${
                    stat.trend.startsWith('+') 
                      ? (isDarkMode ? 'bg-neutral-900 border-neutral-700 text-neutral-300' : 'bg-neutral-100 border-neutral-300 text-neutral-700') 
                      : (isDarkMode ? 'bg-neutral-900 border-neutral-700 text-neutral-400' : 'bg-neutral-100 border-neutral-300 text-neutral-500')
                  }`}>
                    {stat.trend.startsWith('+') ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1 rotate-180" />}
                    {stat.trend}
                  </span>
                </div>
                
                <div>
                  <h3 className={`text-xs uppercase font-semibold tracking-wider mb-2 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    {stat.label}
                  </h3>
                  <div className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
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
        <div className={`lg:col-span-2 p-6 rounded-3xl border transition-colors duration-300 ${isDarkMode ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-200'}`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Interações (7 Dias)</h3>
            <select className={`text-xs uppercase font-bold tracking-wider rounded-lg px-3 py-1.5 border outline-none ${isDarkMode ? 'bg-black border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-600'}`}>
              <option>Esta Semana</option>
            </select>
          </div>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#262626' : '#e5e5e5'} />
                <XAxis 
                  dataKey="label" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: isDarkMode ? '#737373' : '#a3a3a3', fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: isDarkMode ? '#737373' : '#a3a3a3', fontWeight: 700 }}
                />
                <Tooltip 
                  cursor={{ fill: isDarkMode ? '#171717' : '#f5f5f5' }}
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#171717' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#262626' : '#e5e5e5'}`,
                    borderRadius: '8px',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                  formatter={(value: number) => [`${value} interações`, 'Total']}
                  labelStyle={{ color: isDarkMode ? '#a3a3a3' : '#737373', marginBottom: '4px' }}
                />
                <Bar 
                  dataKey="value" 
                  fill={isDarkMode ? '#ffffff' : '#000000'} 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`p-6 rounded-3xl border transition-colors duration-300 ${isDarkMode ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-200'}`}>
          <h3 className={`text-lg font-bold tracking-tight mb-8 ${isDarkMode ? 'text-white' : 'text-black'}`}>Feed de Atividades</h3>
          <div className="space-y-8 pl-2">
            {atividades.length === 0 ? (
              <p className={`text-sm font-medium ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Nenhuma atividade recente.</p>
            ) : atividades.map((act, idx) => (
              <div key={idx} className="flex gap-5 relative">
                 {/* Timeline line */}
                 {idx !== atividades.length - 1 && <div className={`absolute left-[5px] top-6 bottom-[-32px] w-[2px] ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`} />}
                 
                 <div className={`w-3 h-3 mt-1.5 rounded-full flex-shrink-0 z-10 ${isDarkMode ? 'bg-neutral-300 outline outline-4 outline-[#0a0a0a]' : 'bg-neutral-800 outline outline-4 outline-white'}`} />
                 
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{act.cliente?.nome || 'Desconhecido'}</h4>
                     <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${isDarkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-400' : 'bg-neutral-100 border-neutral-200 text-neutral-500'}`}>
                       {formatTimeAgo(act.dataContato)}
                     </span>
                   </div>
                   <p className={`text-xs leading-relaxed max-w-[200px] sm:max-w-xs ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                     {act.descricao}
                   </p>
                   <p className={`text-[10px] font-semibold mt-2 uppercase tracking-wide ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                     Resp: {act.usuario?.nome}
                   </p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
