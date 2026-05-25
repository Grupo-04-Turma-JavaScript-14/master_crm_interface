import { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Activity } from 'lucide-react';
import { api } from '../api/axios';

export default function FeedAtividades() {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const navigate = useNavigate();

  const [allContatos, setAllContatos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/contatos');
        const sorted = [...res.data].sort(
          (a: any, b: any) =>
            new Date(b.dataContato).getTime() - new Date(a.dataContato).getTime()
        );
        setAllContatos(sorted);
      } catch (err) {
        console.error('Erro ao carregar feed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  const filtered = allContatos.filter((act: any) =>
    act.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    act.cliente?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    act.usuario?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/app/dashboard')}
          className={`p-2 rounded-xl border transition-all hover:-translate-x-0.5 ${
            isDarkMode
              ? 'bg-black border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600'
              : 'bg-white border-neutral-200 text-neutral-500 hover:text-black hover:border-neutral-400'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className={`text-2xl md:text-4xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Feed de Atividades
          </h1>
          <p className={`mt-1 text-sm ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
            {filtered.length} {filtered.length === 1 ? 'registro encontrado' : 'registros encontrados'}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
        isDarkMode ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-200'
      }`}>
        <Search className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`} />
        <input
          type="text"
          placeholder="Pesquisar por cliente, descrição ou responsável..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          autoFocus
          className={`flex-1 bg-transparent text-sm outline-none ${
            isDarkMode
              ? 'text-white placeholder:text-neutral-600'
              : 'text-black placeholder:text-neutral-400'
          }`}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className={`text-xs font-semibold px-2 py-1 rounded-md ${
              isDarkMode ? 'text-neutral-500 hover:text-white' : 'text-neutral-400 hover:text-black'
            }`}
          >
            Limpar
          </button>
        )}
      </div>

      {/* Feed List */}
      <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-200'}`}>
        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-5">
                <div className={`w-3 h-3 mt-1.5 rounded-full flex-shrink-0 animate-pulse ${isDarkMode ? 'bg-neutral-700' : 'bg-neutral-200'}`} />
                <div className="flex-1 space-y-2">
                  <div className={`h-4 w-1/3 rounded animate-pulse ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`} />
                  <div className={`h-3 w-2/3 rounded animate-pulse ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Activity className={`w-10 h-10 ${isDarkMode ? 'text-neutral-700' : 'text-neutral-300'}`} />
            <p className={`text-sm font-medium ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
              Nenhuma atividade encontrada para "{searchTerm}"
            </p>
          </div>
        ) : (
          <div className="space-y-8 pl-2">
            {filtered.map((act: any, idx: number) => (
              <div key={idx} className="flex gap-5 relative group">
                {/* Timeline line */}
                {idx !== filtered.length - 1 && (
                  <div className={`absolute left-[5px] top-6 bottom-[-32px] w-[2px] ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
                )}

                <div className={`w-3 h-3 mt-1.5 rounded-full flex-shrink-0 z-10 transition-colors ${
                  isDarkMode
                    ? 'bg-neutral-300 outline outline-4 outline-[#0a0a0a] group-hover:bg-white'
                    : 'bg-neutral-800 outline outline-4 outline-white group-hover:bg-black'
                }`} />

                <div className={`flex-1 p-4 rounded-xl border transition-all ${
                  isDarkMode
                    ? 'bg-neutral-900/30 border-neutral-800 hover:border-neutral-600'
                    : 'bg-neutral-50/50 border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
                }`}>
                  <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {act.cliente?.nome || 'Desconhecido'}
                      </h4>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isDarkMode
                          ? 'bg-neutral-800 border-neutral-700 text-neutral-400'
                          : 'bg-white border-neutral-200 text-neutral-500'
                      }`}>
                        {formatTimeAgo(act.dataContato)}
                      </span>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      {new Date(act.dataContato).toLocaleDateString('pt-BR', {
                        day: '2-digit', month: '2-digit', year: 'numeric'
                      })}
                    </p>
                  </div>

                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {act.descricao}
                  </p>

                  <p className={`text-[10px] font-bold mt-4 uppercase tracking-widest ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    Resp: {act.usuario?.nome || 'Sistema'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
