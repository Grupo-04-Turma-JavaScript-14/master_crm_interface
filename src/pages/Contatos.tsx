import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../api/axios';
import { Plus, X, Edit2, Trash2, Search, FileText, Building2, UserCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import TableSkeleton from '../components/TableSkeleton';
import Avatar from '../components/Avatar';

export default function Contatos() {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const [data, setData] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingContact, setViewingContact] = useState<any>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [descricao, setDescricao] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [clienteSearchQuery, setClienteSearchQuery] = useState('');

  const getLoggedUserId = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);
        return payload.sub?.toString();
      }
    } catch (e) {
      console.error("Error parsing token", e);
    }
    return null;
  };

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
      
      if (!usuarioId) {
        const loggedId = getLoggedUserId();
        setUsuarioId(loggedId || (resUsuarios.data.length > 0 ? resUsuarios.data[0].id.toString() : ''));
      }
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
    const loggedId = getLoggedUserId();
    setUsuarioId(loggedId || (usuarios.length > 0 ? usuarios[0].id.toString() : ''));
    if (clientes.length > 0) setClienteId(clientes[0].id.toString());
    setClienteSearchQuery('');
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
      setClienteSearchQuery('');
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao buscar dados do contato.');
    }
  };

  const openViewModal = (contato: any) => {
    setViewingContact(contato);
    setIsViewModalOpen(true);
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

  const filteredDropdownClientes = clientes.filter((c: any) => 
    c.nome.toLowerCase().includes(clienteSearchQuery.toLowerCase()) || 
    c.empresa.toLowerCase().includes(clienteSearchQuery.toLowerCase())
  );

  return (
    <>
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Contatos</h2>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>Registre as interações com suas oportunidades</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-auto group">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'text-neutral-500 group-focus-within:text-white' : 'text-neutral-400 group-focus-within:text-black'}`} />
            <input 
              type="text" 
              placeholder="Buscar contatos..." 
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
            Novo Contato
          </button>
        </div>
      </div>

      <div className={`rounded-2xl border overflow-hidden transition-colors ${isDarkMode ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'}`}>
        {loading ? (
          <div className="p-6">
            <TableSkeleton columns={5} rows={5} />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center justify-center animate-fade-in-up">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-inner ${isDarkMode ? 'bg-neutral-900/50 text-neutral-600 border border-neutral-800' : 'bg-neutral-50 text-neutral-400 border border-neutral-100'}`}>
              <Search className="w-8 h-8" />
            </div>
            <h3 className={`text-xl font-bold tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Nenhum contato encontrado</h3>
            <p className={`text-sm max-w-sm mb-6 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
              {searchTerm ? `Não encontramos ninguém com o termo "${searchTerm}". Verifique a ortografia ou limpe a busca.` : 'Você ainda não possui contatos registrados para as suas oportunidades.'}
            </p>
            {!searchTerm && (
              <button 
                onClick={openCreateModal}
                className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all shadow-md hover:-translate-y-0.5 ${
                  isDarkMode ? 'bg-white text-black hover:bg-neutral-200' : 'bg-black text-white hover:bg-neutral-800'
                }`}
              >
                Registrar Primeiro Contato
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[700px]">
              <thead className={`text-[10px] uppercase tracking-wider font-bold border-b ${isDarkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-500' : 'bg-neutral-50 border-neutral-200 text-neutral-500'}`}>
                <tr>
                  <th className="px-6 py-4">Descrição</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Responsável</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}>
                {filteredData.map((item: any) => (
                  <tr 
                    key={item.id} 
                    onClick={() => openViewModal(item)}
                    className={`border-b last:border-0 transition-colors cursor-pointer ${isDarkMode ? 'border-neutral-800 hover:bg-neutral-900/50' : 'border-neutral-100 hover:bg-neutral-50'}`}
                  >
                    <td className={`px-6 py-4 font-bold max-w-xs truncate ${isDarkMode ? 'text-white' : 'text-black'}`} title={item.descricao}>{item.descricao}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={item.cliente?.nome} />
                        <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{item.cliente?.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{item.usuario?.nome || 'N/A'}</td>
                    <td className="px-6 py-4 font-mono text-xs">{new Date(item.dataContato).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={(e) => { e.stopPropagation(); openEditModal(item); }} className={`p-1.5 rounded-md transition-colors ${isDarkMode ? 'text-neutral-500 hover:text-white hover:bg-neutral-800' : 'text-neutral-400 hover:text-black hover:bg-neutral-200'}`} title="Editar">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className={`p-1.5 rounded-md transition-colors ${isDarkMode ? 'text-neutral-500 hover:text-red-400 hover:bg-red-400/10' : 'text-neutral-400 hover:text-red-600 hover:bg-red-50'}`} title="Excluir">
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Panel */}
          <div className={`relative w-full max-w-xl shadow-2xl flex flex-col transform transition-all animate-fade-in-up rounded-2xl overflow-hidden max-h-[90vh] ${isDarkMode ? 'bg-[#0a0a0a] border border-neutral-800' : 'bg-white border border-neutral-200'}`}>
            
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
              <h3 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>{editingId ? 'Editar Contato' : 'Novo Contato'}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-neutral-500 hover:text-white hover:bg-neutral-900' : 'text-neutral-400 hover:text-black hover:bg-neutral-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <form id="contato-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>Descrição</label>
                  <textarea 
                    value={descricao} 
                    onChange={e => setDescricao(e.target.value)} 
                    required 
                    className={`w-full rounded-lg px-4 py-2.5 text-sm transition-all outline-none border ${
                      isDarkMode 
                        ? 'bg-neutral-900 border-neutral-800 text-white focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500' 
                        : 'bg-neutral-50 border-neutral-200 text-black focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400'
                    }`}
                    rows={3}
                  />
                </div>
                {/* O usuário responsável é automaticamente o usuário logado e não precisa ser exibido */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>Oportunidade (Cliente)</label>
                  
                  <div className={`w-full rounded-lg border overflow-hidden shadow-sm ${
                    isDarkMode ? 'bg-[#171717] border-neutral-800' : 'bg-white border-neutral-200'
                  }`}>
                    <div className={`p-2 border-b ${isDarkMode ? 'border-neutral-800' : 'border-neutral-100'}`}>
                      <div className="relative">
                        <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`} />
                        <input
                          type="text"
                          placeholder="Pesquisar oportunidade..."
                          value={clienteSearchQuery}
                          onChange={(e) => setClienteSearchQuery(e.target.value)}
                          className={`w-full rounded-md pl-9 pr-3 py-2 text-sm outline-none border transition-all ${
                            isDarkMode 
                              ? 'bg-black border-neutral-800 text-white focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600' 
                              : 'bg-neutral-50 border-neutral-200 text-black focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400'
                          }`}
                        />
                      </div>
                    </div>
                    <ul className="h-64 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
                      {filteredDropdownClientes.length === 0 ? (
                        <li className={`px-4 py-4 text-sm text-center ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
                          Nenhuma oportunidade encontrada.
                        </li>
                      ) : (
                        filteredDropdownClientes.map((c: any) => (
                          <li
                            key={c.id}
                            onClick={() => setClienteId(c.id.toString())}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center gap-3 ${
                              clienteId === c.id.toString() 
                                ? (isDarkMode ? 'bg-neutral-800 text-white font-bold' : 'bg-neutral-100 text-black font-bold') 
                                : (isDarkMode ? 'hover:bg-neutral-800/60 text-neutral-300' : 'hover:bg-neutral-50 text-neutral-600')
                            }`}
                          >
                            <Avatar name={c.nome} />
                            <div className="flex flex-col">
                              <span>{c.nome}</span>
                              <span className={`text-[10px] uppercase font-bold tracking-wider ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>{c.empresa}</span>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
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
                form="contato-form"
                className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all hover:-translate-y-0.5 shadow-md ${
                  isDarkMode ? 'bg-white text-black hover:bg-neutral-200' : 'bg-black text-white hover:bg-neutral-800'
                }`}
              >
                {editingId ? 'Salvar Alterações' : 'Salvar Contato'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* View Contact Modal */}
      {isViewModalOpen && viewingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setIsViewModalOpen(false)} />
          
          <div className={`relative w-full max-w-3xl flex flex-col transform transition-all animate-fade-in-up rounded-2xl overflow-hidden shadow-2xl max-h-[95vh] ${
            isDarkMode ? 'bg-[#0a0a0a] border border-neutral-800' : 'bg-white border border-neutral-200'
          }`}>
            
            {/* Header / Ribbon */}
            <div className={`px-8 py-6 border-b flex justify-between items-center ${
              isDarkMode ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-200'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-black shadow-sm'}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Registro de Interação</h3>
                  <p className={`text-xs uppercase tracking-widest font-bold mt-0.5 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>ID: #{String(viewingContact.id).padStart(5, '0')}</p>
                </div>
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-neutral-500 hover:text-white hover:bg-neutral-800' : 'text-neutral-400 hover:text-black hover:bg-neutral-100'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Body */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className={`max-w-prose mx-auto ${isDarkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                
                {/* Meta Grid */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 border-t border-l mb-10 text-sm rounded-lg overflow-hidden ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
                  <div className={`border-r border-b p-5 flex flex-col justify-center ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
                    <span className={`flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider mb-3 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
                      <Building2 className="w-3 h-3" /> Cliente Vinculado
                    </span>
                    <div className="flex items-center gap-3">
                      <Avatar name={viewingContact.cliente?.nome} />
                      <div>
                        <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{viewingContact.cliente?.nome || 'N/A'}</div>
                        <div className={`text-xs mt-0.5 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>{viewingContact.cliente?.empresa || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`border-r border-b p-5 flex flex-col justify-center ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
                    <span className={`flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider mb-3 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
                      <UserCircle2 className="w-3 h-3" /> Responsável
                    </span>
                    <div className="flex items-center gap-3">
                      <Avatar name={viewingContact.usuario?.nome || 'Sistema'} />
                      <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{viewingContact.usuario?.nome || 'Sistema'}</div>
                    </div>
                  </div>

                  <div className={`col-span-1 sm:col-span-2 border-r border-b p-4 flex items-center justify-between ${isDarkMode ? 'border-neutral-800 bg-neutral-900/30' : 'border-neutral-200 bg-neutral-50/50'}`}>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>Data do Registro</span>
                    <span className={`font-mono font-medium ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      {new Date(viewingContact.dataContato).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'medium' })}
                    </span>
                  </div>
                </div>

                {/* Description Body */}
                <div className="mb-16">
                  <h4 className={`text-xs font-bold uppercase tracking-widest mb-6 border-b pb-3 ${isDarkMode ? 'text-neutral-500 border-neutral-800' : 'text-neutral-400 border-neutral-200'}`}>Relato da Interação</h4>
                  <div className={`prose prose-neutral max-w-none border-l-2 pl-5 py-2 ${isDarkMode ? 'border-neutral-800 text-neutral-300' : 'border-neutral-200 text-neutral-700'}`}>
                    <p className="text-[15px] sm:text-base leading-relaxed whitespace-pre-wrap">
                      {viewingContact.descricao}
                    </p>
                  </div>
                </div>

                {/* Signature */}
                <div className="mt-20 flex flex-col items-center">
                  <div className={`w-64 border-t border-dashed mb-4 ${isDarkMode ? 'border-neutral-700' : 'border-neutral-300'}`}></div>
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>{viewingContact.usuario?.nome || 'Sistema'}</span>
                  <span className={`text-xs uppercase tracking-widest mt-1 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Assinatura Eletrônica do Responsável</span>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className={`p-5 border-t flex justify-end ${isDarkMode ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-neutral-200'}`}>
              <button onClick={() => setIsViewModalOpen(false)} className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors border shadow-sm ${
                isDarkMode ? 'bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800' : 'bg-white border-neutral-200 text-black hover:bg-neutral-50'
              }`}>
                Fechar Relatório
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
