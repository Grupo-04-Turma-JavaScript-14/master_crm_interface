import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../api/axios';
import { Plus, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import TableSkeleton from '../components/TableSkeleton';

export default function Usuarios() {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const fetchUsuarios = () => {
    setLoading(true);
    api.get('/usuarios/all')
      .then(res => setData(res.data))
      .catch(err => {
        console.error("API Error:", err);
        toast.error("Erro ao carregar usuários.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const openCreateModal = () => {
    setNome('');
    setEmail('');
    setSenha('');
    setIsModalOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/usuarios/cadastrar', { nome, email, senha });
      toast.success('Usuário cadastrado com sucesso!');
      setIsModalOpen(false);
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao cadastrar usuário.');
    }
  };

  const filteredData = data.filter((item: any) => 
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Usuários</h2>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>Gerencie o acesso ao sistema</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`} />
            <input 
              type="text" 
              placeholder="Buscar usuários..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-lg text-sm transition-all outline-none border w-full sm:w-64 ${
                isDarkMode 
                  ? 'bg-[#0a0a0a] border-neutral-800 text-white focus:border-neutral-500 placeholder:text-neutral-600' 
                  : 'bg-white border-neutral-200 text-black focus:border-neutral-400 placeholder:text-neutral-400 shadow-sm'
              }`}
            />
          </div>
          <button 
            onClick={openCreateModal}
            className={`flex items-center justify-center w-full sm:w-auto px-5 py-2 text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 ${
              isDarkMode ? 'bg-white text-black hover:bg-neutral-200' : 'bg-black text-white hover:bg-neutral-800'
            } whitespace-nowrap`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`p-8 rounded-2xl w-full max-w-md relative shadow-2xl ${isDarkMode ? 'bg-[#0a0a0a] border border-neutral-800' : 'bg-white border border-neutral-200'}`}>
            <button 
              onClick={() => setIsModalOpen(false)}
              className={`absolute top-6 right-6 transition-colors ${isDarkMode ? 'text-neutral-500 hover:text-white' : 'text-neutral-400 hover:text-black'}`}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className={`text-xl font-bold tracking-tight mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>Novo Usuário</h3>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>Nome</label>
                <input 
                  type="text" 
                  value={nome} 
                  onChange={e => setNome(e.target.value)} 
                  required 
                  className={`w-full rounded-lg px-4 py-2.5 text-sm transition-all outline-none border ${
                    isDarkMode 
                      ? 'bg-neutral-900 border-neutral-800 text-white focus:border-neutral-500' 
                      : 'bg-neutral-50 border-neutral-200 text-black focus:border-neutral-400'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  className={`w-full rounded-lg px-4 py-2.5 text-sm transition-all outline-none border ${
                    isDarkMode 
                      ? 'bg-neutral-900 border-neutral-800 text-white focus:border-neutral-500' 
                      : 'bg-neutral-50 border-neutral-200 text-black focus:border-neutral-400'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>Senha</label>
                <input 
                  type="password" 
                  value={senha} 
                  onChange={e => setSenha(e.target.value)} 
                  required 
                  className={`w-full rounded-lg px-4 py-2.5 text-sm transition-all outline-none border ${
                    isDarkMode 
                      ? 'bg-neutral-900 border-neutral-800 text-white focus:border-neutral-500' 
                      : 'bg-neutral-50 border-neutral-200 text-black focus:border-neutral-400'
                  }`}
                />
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-neutral-800">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${isDarkMode ? 'text-neutral-400 hover:bg-neutral-900' : 'text-neutral-500 hover:bg-neutral-100'}`}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors shadow-md ${
                    isDarkMode ? 'bg-white text-black hover:bg-neutral-200' : 'bg-black text-white hover:bg-neutral-800'
                  }`}
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={`rounded-2xl border overflow-hidden transition-colors ${isDarkMode ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'}`}>
        {loading ? (
          <div className="p-6">
            <TableSkeleton columns={4} rows={4} />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-neutral-900 text-neutral-600' : 'bg-neutral-100 text-neutral-400'}`}>
              <Search className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Nenhum usuário encontrado</h3>
            <p className={`text-sm max-w-sm ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
              {searchTerm ? `Nenhum usuário com o termo "${searchTerm}" foi encontrado.` : 'Nenhum usuário cadastrado.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[500px]">
              <thead className={`text-[10px] uppercase tracking-wider font-bold border-b ${isDarkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-500' : 'bg-neutral-50 border-neutral-200 text-neutral-500'}`}>
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Data de Criação</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}>
                {filteredData.map((item: any) => (
                  <tr key={item.id} className={`border-b last:border-0 transition-colors ${isDarkMode ? 'border-neutral-800 hover:bg-neutral-900/50' : 'border-neutral-100 hover:bg-neutral-50'}`}>
                    <td className={`px-6 py-4 font-mono text-xs ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>#{item.id}</td>
                    <td className={`px-6 py-4 font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{item.nome}</td>
                    <td className="px-6 py-4">{item.email}</td>
                    <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
