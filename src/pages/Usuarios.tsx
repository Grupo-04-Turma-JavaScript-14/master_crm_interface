import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../api/axios';
import { Plus, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import TableSkeleton from '../components/TableSkeleton';
import Avatar from '../components/Avatar';

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
    <>
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Usuários</h2>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>Gerencie o acesso ao sistema</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-auto group">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'text-neutral-500 group-focus-within:text-white' : 'text-neutral-400 group-focus-within:text-black'}`} />
            <input 
              type="text" 
              placeholder="Buscar usuários..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`pl-10 pr-10 py-2 rounded-lg text-sm transition-all outline-none border w-full sm:w-64 ${
                isDarkMode 
                  ? 'bg-[#0a0a0a] border-neutral-800 text-white focus:border-neutral-500 placeholder:text-neutral-600 focus:ring-1 focus:ring-neutral-500' 
                  : 'bg-white border-neutral-200 text-black focus:border-neutral-400 placeholder:text-neutral-400 shadow-sm focus:ring-1 focus:ring-neutral-400'
              }`}
            />
            <div className={`absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-bold border ${isDarkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-500' : 'bg-neutral-100 border-neutral-200 text-neutral-400'}`}>/</div>
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


      <div className={`rounded-2xl border overflow-hidden transition-colors ${isDarkMode ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'}`}>
        {loading ? (
          <div className="p-6">
            <TableSkeleton columns={4} rows={4} />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center justify-center animate-fade-in-up">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-inner ${isDarkMode ? 'bg-neutral-900/50 text-neutral-600 border border-neutral-800' : 'bg-neutral-50 text-neutral-400 border border-neutral-100'}`}>
              <Search className="w-8 h-8" />
            </div>
            <h3 className={`text-xl font-bold tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Nenhum usuário encontrado</h3>
            <p className={`text-sm max-w-sm mb-6 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
              {searchTerm ? `Não encontramos ninguém com o termo "${searchTerm}". Verifique a ortografia ou limpe a busca.` : 'Você ainda não possui usuários cadastrados. Comece adicionando o primeiro!'}
            </p>
            {!searchTerm && (
              <button 
                onClick={openCreateModal}
                className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all shadow-md hover:-translate-y-0.5 ${
                  isDarkMode ? 'bg-white text-black hover:bg-neutral-200' : 'bg-black text-white hover:bg-neutral-800'
                }`}
              >
                Cadastrar Primeiro Usuário
              </button>
            )}
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={item.nome} />
                        <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{item.nome}</span>
                      </div>
                    </td>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Panel */}
          <div className={`relative w-full max-w-md shadow-2xl flex flex-col transform transition-all animate-fade-in-up rounded-2xl overflow-hidden max-h-[90vh] ${isDarkMode ? 'bg-[#0a0a0a] border border-neutral-800' : 'bg-white border border-neutral-200'}`}>
            
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
              <h3 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Novo Usuário
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-neutral-500 hover:text-white hover:bg-neutral-900' : 'text-neutral-400 hover:text-black hover:bg-neutral-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <form id="usuario-form" onSubmit={handleCreate} className="space-y-5">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>Nome</label>
                  <input 
                    type="text" 
                    value={nome} 
                    onChange={e => setNome(e.target.value)} 
                    required 
                    className={`w-full rounded-lg px-4 py-2.5 text-sm transition-all outline-none border ${
                      isDarkMode 
                        ? 'bg-neutral-900 border-neutral-800 text-white focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500' 
                        : 'bg-neutral-50 border-neutral-200 text-black focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400'
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
                        ? 'bg-neutral-900 border-neutral-800 text-white focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500' 
                        : 'bg-neutral-50 border-neutral-200 text-black focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400'
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
                        ? 'bg-neutral-900 border-neutral-800 text-white focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500' 
                        : 'bg-neutral-50 border-neutral-200 text-black focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400'
                    }`}
                  />
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className={`p-6 border-t ${isDarkMode ? 'border-neutral-800 bg-[#0a0a0a]' : 'border-neutral-200 bg-white'} flex justify-end gap-3`}>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${isDarkMode ? 'text-neutral-400 hover:bg-neutral-900' : 'text-neutral-500 hover:bg-neutral-100'}`}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                form="usuario-form"
                className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all hover:-translate-y-0.5 shadow-md ${
                  isDarkMode ? 'bg-white text-black hover:bg-neutral-200' : 'bg-black text-white hover:bg-neutral-800'
                }`}
              >
                Salvar Usuário
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
