import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../api/axios';
import { Plus, X, Edit2, Trash2, Star, StarOff, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import TableSkeleton from '../components/TableSkeleton';

export default function Clientes() {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [statusOportunidade, setStatusOportunidade] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchClientes = () => {
    setLoading(true);
    api.get('/clientes')
      .then(res => setData(res.data))
      .catch(err => {
        console.error("API Error:", err);
        toast.error("Erro ao carregar clientes.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setNome('');
    setEmpresa('');
    setTelefone('');
    setEmail('');
    setStatusOportunidade(false);
    setIsModalOpen(true);
  };

  const openEditModal = async (client: any) => {
    try {
      const res = await api.get(`/clientes/${client.id}`);
      const data = res.data;
      setEditingId(data.id);
      setNome(data.nome);
      setEmpresa(data.empresa);
      setTelefone(data.telefone);
      setEmail(data.email);
      setStatusOportunidade(data.statusOportunidade || false);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao buscar dados do cliente.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put('/clientes', { id: editingId, nome, empresa, telefone, email, statusOportunidade });
        toast.success('Cliente atualizado com sucesso!');
      } else {
        await api.post('/clientes', { nome, empresa, telefone, email });
        toast.success('Cliente cadastrado com sucesso!');
      }
      setIsModalOpen(false);
      fetchClientes();
    } catch (err) {
      console.error(err);
      toast.error(editingId ? 'Erro ao atualizar cliente.' : 'Erro ao cadastrar cliente.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente? Todos os contatos associados também serão excluídos.')) return;
    try {
      await api.delete(`/clientes/${id}`);
      toast.success('Cliente excluído com sucesso!');
      fetchClientes();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir cliente.');
    }
  };

  const handleMakeOpportunity = async (id: number) => {
    try {
      await api.patch(`/clientes/${id}/oportunidade`);
      toast.success('Cliente transformado em oportunidade!');
      fetchClientes();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao atualizar status do cliente.');
    }
  };

  const handleRemoveOpportunity = async (client: any) => {
    try {
      await api.put('/clientes', { 
        id: client.id, 
        nome: client.nome, 
        empresa: client.empresa, 
        telefone: client.telefone, 
        email: client.email, 
        statusOportunidade: false 
      });
      toast.success('Cliente removido das oportunidades!');
      fetchClientes();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao remover oportunidade.');
    }
  };

  const filteredData = data.filter((item: any) => 
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.telefone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Clientes</h2>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>Gerencie seus clientes e oportunidades</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`} />
            <input 
              type="text" 
              placeholder="Buscar clientes..." 
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
            Novo Cliente
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
            <h3 className={`text-xl font-bold tracking-tight mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>{editingId ? 'Editar Cliente' : 'Novo Cliente'}</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
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
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>Empresa</label>
                <input 
                  type="text" 
                  value={empresa} 
                  onChange={e => setEmpresa(e.target.value)} 
                  required 
                  className={`w-full rounded-lg px-4 py-2.5 text-sm transition-all outline-none border ${
                    isDarkMode 
                      ? 'bg-neutral-900 border-neutral-800 text-white focus:border-neutral-500' 
                      : 'bg-neutral-50 border-neutral-200 text-black focus:border-neutral-400'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>Telefone</label>
                <input 
                  type="text" 
                  value={telefone} 
                  onChange={e => setTelefone(e.target.value)} 
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
                  {editingId ? 'Salvar Alterações' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={`rounded-2xl border overflow-hidden transition-colors ${isDarkMode ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'}`}>
        {loading ? (
          <div className="p-6">
            <TableSkeleton columns={6} rows={5} />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-neutral-900 text-neutral-600' : 'bg-neutral-100 text-neutral-400'}`}>
              <Search className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Nenhum cliente encontrado</h3>
            <p className={`text-sm max-w-sm ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
              {searchTerm ? `Nenhum cliente com o termo "${searchTerm}" foi encontrado.` : 'Você ainda não tem clientes cadastrados no sistema.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[700px]">
              <thead className={`text-[10px] uppercase tracking-wider font-bold border-b ${isDarkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-500' : 'bg-neutral-50 border-neutral-200 text-neutral-500'}`}>
                <tr>
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4">Empresa</th>
                  <th className="px-6 py-4">Telefone</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}>
                {filteredData.map((item: any) => (
                  <tr key={item.id} className={`border-b last:border-0 transition-colors ${isDarkMode ? 'border-neutral-800 hover:bg-neutral-900/50' : 'border-neutral-100 hover:bg-neutral-50'}`}>
                    <td className={`px-6 py-4 font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{item.nome}</td>
                    <td className="px-6 py-4">{item.empresa}</td>
                    <td className="px-6 py-4 font-mono text-xs">{item.telefone}</td>
                    <td className="px-6 py-4">{item.email}</td>
                    <td className="px-6 py-4">
                      {item.statusOportunidade ? (
                        <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md border ${isDarkMode ? 'bg-neutral-900 border-neutral-700 text-neutral-300' : 'bg-neutral-100 border-neutral-300 text-neutral-700'}`}>Oportunidade</span>
                      ) : (
                        <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md border ${isDarkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-500' : 'bg-neutral-50 border-neutral-200 text-neutral-400'}`}>Lead</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {!item.statusOportunidade ? (
                          <button onClick={() => handleMakeOpportunity(item.id)} className={`p-1.5 rounded-md transition-colors ${isDarkMode ? 'text-neutral-500 hover:text-white hover:bg-neutral-800' : 'text-neutral-400 hover:text-black hover:bg-neutral-200'}`} title="Tornar Oportunidade">
                            <Star className="w-4 h-4" />
                          </button>
                        ) : (
                          <button onClick={() => handleRemoveOpportunity(item)} className={`p-1.5 rounded-md transition-colors ${isDarkMode ? 'text-neutral-500 hover:text-white hover:bg-neutral-800' : 'text-neutral-400 hover:text-black hover:bg-neutral-200'}`} title="Remover Oportunidade">
                            <StarOff className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => openEditModal(item)} className={`p-1.5 rounded-md transition-colors ${isDarkMode ? 'text-neutral-500 hover:text-white hover:bg-neutral-800' : 'text-neutral-400 hover:text-black hover:bg-neutral-200'}`} title="Editar">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className={`p-1.5 rounded-md transition-colors ${isDarkMode ? 'text-neutral-500 hover:text-red-400 hover:bg-red-400/10' : 'text-neutral-400 hover:text-red-600 hover:bg-red-50'}`} title="Excluir">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
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
