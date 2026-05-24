interface FormClientesProps {
  editandoIndex: number | null;
  nome: string;
  setNome: (valor: string) => void;
  empresa: string;
  setEmpresa: (valor: string) => void;
  telefone: string;
  setTelefone: (valor: string) => void;
  email: string;
  setEmail: (valor: string) => void;
  statusOportunidade: boolean;
  setStatusOportunidade: (valor: boolean) => void;
  setShowForm: (valor: boolean) => void;
  setEditandoIndex: (index: number | null) => void;
  cadastrarCliente: () => void;
}

export default function FormClientes({
  editandoIndex,
  nome,
  setNome,
  empresa,
  setEmpresa,
  telefone,
  setTelefone,
  email,
  setEmail,
  statusOportunidade,
  setStatusOportunidade,
  setShowForm,
  setEditandoIndex,
  cadastrarCliente,
}: FormClientesProps) {
  
  // Impede a página de recarregar e chama a função de salvar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    cadastrarCliente();
  };

  return (
    <div className="p-6 flex justify-center">
      {/* MUDANÇA AQUI: De div para form com handleSubmit */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl glass-panel rounded-2xl border border-slate-800 p-6 bg-slate-950/40">
        <h3 className="text-xl font-bold text-white mb-4">
          {editandoIndex !== null ? "Editar Cliente" : "Novo Cliente"}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campo Nome com required */}
          <div>
            <label className="block text-slate-300 mb-2 text-sm">Nome do Cliente*</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: João Silva"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Campo Empresa com required */}
          <div>
            <label className="block text-slate-300 mb-2 text-sm">Empresa*</label>
            <input
              type="text"
              required
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              placeholder="Ex: Tech Solutions"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Campo Telefone com required */}
          <div>
            <label className="block text-slate-300 mb-2 text-sm">Telefone*</label>
            <input
              type="text"
              required
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="Ex: (11) 99999-9999"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Campo E-mail com required */}
          <div>
            <label className="block text-slate-300 mb-2 text-sm">E-mail*</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: joao@email.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Status Oportunidade */}
        <div className="mt-5 flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
          <input
            type="checkbox"
            id="statusOportunidade"
            checked={statusOportunidade}
            onChange={(e) => setStatusOportunidade(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 accent-blue-500 cursor-pointer"
          />
          <label htmlFor="statusOportunidade" className="text-sm text-slate-300 cursor-pointer select-none">
            Marcar como <strong className="text-blue-400 font-semibold">Oportunidade Ativa</strong>
          </label>
        </div>

        {/* Botões de Ação */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setEditandoIndex(null);
            }}
            className="px-5 py-3 bg-transparent text-white border border-slate-600 rounded-xl hover:bg-red-600/20 hover:border-red-600 transition-colors"
          >
            Cancelar
          </button>
          
          {/* O botão submit que alteramos no passo 1 */}
          <button
            type="submit"
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors"
          >
            {editandoIndex !== null ? "Salvar Alterações" : "Cadastrar"}
          </button>
        </div>
      </form>
    </div>
  );
}