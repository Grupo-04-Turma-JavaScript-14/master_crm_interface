import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Plus, Trash2, Pencil } from "lucide-react";
import { salvarContatos, buscarContatos } from "../lib/contatosStorage";

export default function Contatos() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [descricao, setDescricao] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);

  // SEU BLOCO ORIGINAL INTACTO - NÃO MEXIDO:
  useEffect(() => {
    // Stub API call
    api
      .get("/contato")
      .then((res) => setData(res.data))
      .catch((err) =>
        console.error("API Error (expected until backend is running):", err),
      )
      .finally(() => setLoading(false));
    const clientesSalvos = buscarClientes();
    const contatosSalvos = buscarContatos();

    setData(contatosSalvos);

    setClientes(clientesSalvos);
  }, []);

  function cadastrarContato() {
    if (!clienteSelecionado || clienteSelecionado === "" || !descricao) {
      alert("Preencha o cliente e a descrição");
      return;
    }

    const novoContato = {
      usuario: "", 
      cliente: clienteSelecionado,
      descricao: descricao,
      data: new Date().toLocaleDateString(),
    };

    let novaLista;

    if (editandoIndex !== null) {
      novaLista = [...data];
      novaLista[editandoIndex] = novoContato;

      setEditandoIndex(null);
    } else {
      novaLista = [...data, novoContato];
    }

    setData(novaLista);
    salvarContatos(novaLista);

    setShowForm(false);
    
    setClienteSelecionado("");
    setDescricao("");
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho superior: Título e Botão Novo */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Contatos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Contato
        </button>
      </div>

      {/* Painel Principal com Efeito Glass */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        
        {/* Barra de Pesquisa */}
        <div className="px-6 pt-6">
          <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-slate-400 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Pesquisar por nome do cliente..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="w-full bg-transparent outline-none text-white placeholder-slate-500"
            />
          </div>
        </div>

        {/* Formulário de Cadastro/Edição */}
        {showForm && (
          <div className="p-6 flex justify-center">
            <div className="w-full max-w-2xl glass-panel rounded-2xl border border-slate-800 p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                {editandoIndex !== null ? "Editar Contato" : "Novo Contato"}
              </h3>
              
              <div className="mt-4">
                <label className="block text-slate-300 mb-2 text-sm">Cliente*</label>
                <select
                  value={clienteSelecionado}
                  onChange={(e) => setClienteSelecionado(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none"
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.name}>{cliente.name}</option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-slate-300 mb-2 text-sm">Descrição*</label>
                <input
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Digite uma descrição"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditandoIndex(null);
                  }}
                  className="px-5 py-3 bg-transparent text-white border border-slate-600 rounded-xl hover:bg-red-600/20 hover:border-red-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={cadastrarContato}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors"
                >
                  {editandoIndex !== null ? "Salvar Alterações" : "Cadastrar"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Listagem de Dados em Formato de Tabela */}
        {loading ? (
          <div className="p-8 text-center text-slate-400">
            Carregando dados...
          </div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center border-2 border-dashed border-slate-700/50 m-6 rounded-xl">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl text-slate-500">?</span>
            </div>
            <h3 className="text-lg font-medium text-slate-200 mb-1">
              Nenhum contato encontrado
            </h3>
            <p className="text-slate-400 max-w-sm">
              Você ainda não tem contatos cadastrados. Clique no botão acima para adicionar o primeiro.
            </p>
          </div>
        ) : (
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/60 text-slate-500 text-xs font-semibold tracking-wider">
                  <th className="pb-4 pt-2">USUÁRIO</th>
                  <th className="pb-4 pt-2">CLIENTE</th>
                  <th className="pb-4 pt-2">DESCRIÇÃO</th>
                  <th className="pb-4 pt-2">DATA</th>
                  <th className="pb-4 pt-2 text-center">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {data
                  .filter((item) =>
                    item.cliente?.toLowerCase().includes(pesquisa.toLowerCase())
                  )
                  .map((item: any, index: number) => (
                    <tr key={index} className="group hover:bg-slate-800/5 transition-colors">
                      
                      {/* Coluna Usuário - Apenas com o nome limpo */}
                      <td className="py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">
                              {item.usuario && item.usuario !== "" ? item.usuario : "Usuário Logado"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Coluna Cliente - Nome, E-mail e Telefone agrupados aqui */}
                      <td className="py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-white font-medium text-sm">{item.cliente}</p>
                            <p className="text-slate-500 text-xs mt-0.5">
                              {item.emailCliente && item.emailCliente !== "" ? item.emailCliente : "cliente@email.com"}
                            </p>
                            <p className="text-slate-500 text-xs mt-0.5">
                              {item.telefoneCliente && item.telefoneCliente !== "" ? item.telefoneCliente : "(11) 99999-9999"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Coluna Descrição */}
                      <td className="py-4 align-middle max-w-xs truncate">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M9 8h6m2 12H7a2 2 0 01-2-2V6a2 2 0 012-2h5.586a1 1 0 01.707.293l3.414 3.414A1 1 0 0117 8.414V18a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <span className="text-slate-300 text-sm truncate">{item.descricao}</span>
                        </div>
                      </td>

                      {/* Coluna Data */}
                      <td className="py-4 align-middle">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-slate-300 text-sm">{item.data}</span>
                        </div>
                      </td>

                      {/* Coluna Ações */}
                      <td className="py-4 align-middle text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setClienteSelecionado(item.cliente);
                              setDescricao(item.descricao);
                              setEditandoIndex(index);
                              setShowForm(true);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-800 text-slate-400 hover:text-green-400 hover:bg-green-500/10 hover:border-green-500/30 transition-all"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => {
                              const novaLista = data.filter((_, i) => i !== index);
                              setData(novaLista);
                              salvarContatos(novaLista);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                          >
                            <Trash2 size={14} />
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