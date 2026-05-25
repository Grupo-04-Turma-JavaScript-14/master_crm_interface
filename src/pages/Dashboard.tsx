import { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Users, UserPlus, Activity, TrendingUp, Star } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { api } from '../api/axios';

// Componente para animar os números
const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    
    const duration = 1000; // 1 segundo
    const incrementTime = 20;
    const step = Math.ceil(end / (duration / incrementTime));
    
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value]);

  return <>{displayValue}</>;
};

// Mini gráfico de linha (Sparkline) para o card
const Sparkline = ({ isDarkMode, colorClass }: { isDarkMode: boolean, colorClass: string }) => (
  <svg className="w-full h-12 mt-2 -ml-2" viewBox="0 0 100 30" preserveAspectRatio="none">
    <path 
      d="M0,25 C10,20 20,28 30,15 C40,2 50,18 60,10 C70,2 80,22 90,5 L100,20" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className={colorClass}
      vectorEffect="non-scaling-stroke"
    />
    <path 
      d="M0,25 C10,20 20,28 30,15 C40,2 50,18 60,10 C70,2 80,22 90,5 L100,20 L100,30 L0,30 Z" 
      fill="currentColor" 
      className={`${colorClass} opacity-10`}
    />
  </svg>
);

export default function Dashboard() {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const navigate = useNavigate();

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
    { label: 'Total de Clientes', value: metricas.totalClientes.toString(), icon: Users },
    { label: 'Total de Contatos', value: metricas.totalContatos.toString(), icon: UserPlus },
    { label: 'Usuários Ativos', value: metricas.totalUsuarios.toString(), icon: Activity },
    { label: 'Oportunidades', value: metricas.totalOportunidades.toString(), icon: Star }
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
              className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl group ${
                isDarkMode 
                  ? 'bg-black border-neutral-800 hover:border-neutral-600' 
                  : 'bg-white border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {/* Efeito de brilho de fundo no hover */}
              <div className={`absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${isDarkMode ? 'bg-white' : 'bg-black'}`} />

              <div className="flex flex-col h-full justify-between relative z-10">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xs uppercase font-bold tracking-widest ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {stat.label}
                  </h3>
                  <div className={`p-2.5 rounded-xl border shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${isDarkMode ? 'bg-black border-neutral-700 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-600'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className={`text-4xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    <AnimatedNumber value={Number(stat.value)} />
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0">
                <Sparkline isDarkMode={isDarkMode} colorClass={isDarkMode ? 'text-neutral-600' : 'text-neutral-300'} />
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
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Feed de Atividades</h3>
            <button
              onClick={() => navigate('/app/feed')}
              className={`text-xs uppercase tracking-wider font-bold hover:underline transition-colors ${isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-black'}`}
            >
              Ver Tudo
            </button>
          </div>
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
