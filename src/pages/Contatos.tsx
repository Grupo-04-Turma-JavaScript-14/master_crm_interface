import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { Plus, X, Edit2, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contatos() {
  const [data, setData] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [descricao, setDescricao] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDados = async () => {
    setLoading(true);
    try {
      const [resContatos, resUsuarios, resClientes] = await Promise.all([
        api.get('/contatos'),
        api.get('/usuarios/all'),
        api.get('/clientes')
      ]);
      const contatosValidos = resContatos.data.filter((c: any) => c.cliente?.statusOportunidade);
      const clientesOportunidade = resClientes.data.filter((c: any) => c.statusOportunidade);
      
      setData(contatosValidos);
      setUsuarios(resUsuarios.data);
      setClientes(clientesOportunidade);
      
      if (resUsuarios.data.length > 0 && !usuarioId) setUsuarioId(resUsuarios.data[0].id.toString());
      if (clientesOportunidade.length > 0 && !clienteId) setClienteId(clientesOportunidade[0].id.toString());
    } catch (err) {
      console.error("API Error:", err);
      toast.error("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setDescricao('');
    if (usuarios.length > 0) setUsuarioId(usuarios[0].id.toString());
    if (clientes.length > 0) setClienteId(clientes[0].id.toString());
    setIsModalOpen(true);
  };

  const openEditModal = async (contato: any) => {
    try {
      const res = await api.get(`/contatos/${contato.id}`);
      const data = res.data;
      setEditingId(data.id);
      setDescricao(data.descricao);
      setUsuarioId(data.usuario?.id?.toString() || '');
      setClienteId(data.cliente?.id?.toString() || '');
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao buscar dados do contato.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put('/contatos', { 
          id: editingId,
          descricao, 
          usuario: { id: parseInt(usuarioId) }, 
          cliente: { id: parseInt(clienteId) } 
        });
        toast.success('Contato atualizado com sucesso!');
      } else {
        await api.post('/contatos', { 
          descricao, 
          usuario: { id: parseInt(usuarioId) }, 
          cliente: { id: parseInt(clienteId) } 
        });
        toast.success('Contato registrado com sucesso!');
      }
      setIsModalOpen(false);
      setDescricao('');
      fetchDados();
    } catch (err) {
      console.error(err);
      toast.error(editingId ? 'Erro ao atualizar contato.' : 'Erro ao registrar contato.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este contato?')) return;
    try {
      await api.delete(`/contatos/${id}`);
      toast.success('Contato excluído com sucesso!');
      fetchDados();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir contato.');
    }
  };

  const filteredData = data.filter((item: any) => 
    item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.cliente?.nome && item.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.usuario?.nome && item.usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Contatos</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar contatos..." 
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
            Novo Contato
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
            <h3 className="text-xl font-bold text-white mb-4">{editingId ? 'Editar Contato' : 'Novo Contato'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Descrição</label>
                <textarea 
                  value={descricao} 
                  onChange={e => setDescricao(e.target.value)} 
                  required 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Usuário Responsável</label>
                <select 
                  value={usuarioId} 
                  onChange={e => setUsuarioId(e.target.value)} 
                  required 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {usuarios.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Cliente Associado</label>
                <select 
                  value={clienteId} 
                  onChange={e => setClienteId(e.target.value)} 
                  required 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {clientes.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.nome} ({c.empresa})</option>
                  ))}
                </select>
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
            <h3 className="text-lg font-medium text-slate-200 mb-1">Nenhum contato encontrado</h3>
            <p className="text-slate-400 max-w-sm">
              Nenhum contato com o termo "{searchTerm}" foi encontrado.
            </p>
          </div>
        ) : (
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 min-w-[700px]">
              <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg">ID</th>
                  <th className="px-6 py-4">Descrição</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4 rounded-tr-lg">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item: any) => (
                  <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">{item.id}</td>
                    <td className="px-6 py-4 font-medium text-white max-w-xs truncate" title={item.descricao}>{item.descricao}</td>
                    <td className="px-6 py-4">{item.cliente?.nome || 'N/A'}</td>
                    <td className="px-6 py-4">{item.usuario?.nome || 'N/A'}</td>
                    <td className="px-6 py-4">{new Date(item.dataContato).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
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
