import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { Plus, X, Edit2, Trash2, Star, StarOff, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Clientes() {
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Clientes</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar clientes..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors w-full sm:w-64"
            />
          </div>
          <button 
            onClick={openCreateModal}
            className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Cliente
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-4">{editingId ? 'Editar Cliente' : 'Novo Cliente'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nome</label>
                <input 
                  type="text" 
                  value={nome} 
                  onChange={e => setNome(e.target.value)} 
                  required 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Empresa</label>
                <input 
                  type="text" 
                  value={empresa} 
                  onChange={e => setEmpresa(e.target.value)} 
                  required 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Telefone</label>
                <input 
                  type="text" 
                  value={telefone} 
                  onChange={e => setTelefone(e.target.value)} 
                  required 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                >
                  {editingId ? 'Salvar Alterações' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="glass-panel rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Carregando dados...</div>
        ) : filteredData.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center border-2 border-dashed border-slate-700/50 m-6 rounded-xl">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl text-slate-500">?</span>
            </div>
            <h3 className="text-lg font-medium text-slate-200 mb-1">Nenhum cliente encontrado</h3>
            <p className="text-slate-400 max-w-sm">
              Nenhum cliente com o termo "{searchTerm}" foi encontrado.
            </p>
          </div>
        ) : (
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 min-w-[700px]">
              <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg">Nome</th>
                  <th className="px-6 py-4">Empresa</th>
                  <th className="px-6 py-4">Telefone</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 rounded-tr-lg">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item: any) => (
                  <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{item.nome}</td>
                    <td className="px-6 py-4">{item.empresa}</td>
                    <td className="px-6 py-4">{item.telefone}</td>
                    <td className="px-6 py-4">{item.email}</td>
                    <td className="px-6 py-4">
                      {item.statusOportunidade ? (
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full">Oportunidade</span>
                      ) : (
                        <span className="px-2 py-1 bg-slate-500/10 text-slate-400 text-xs rounded-full">Lead</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        {!item.statusOportunidade ? (
                          <button onClick={() => handleMakeOpportunity(item.id)} className="text-emerald-400 hover:text-emerald-300" title="Tornar Oportunidade">
                            <Star className="w-4 h-4" />
                          </button>
                        ) : (
                          <button onClick={() => handleRemoveOpportunity(item)} className="text-amber-400 hover:text-amber-300" title="Remover Oportunidade">
                            <StarOff className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => openEditModal(item)} className="text-blue-400 hover:text-blue-300" title="Editar">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300" title="Excluir">
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
