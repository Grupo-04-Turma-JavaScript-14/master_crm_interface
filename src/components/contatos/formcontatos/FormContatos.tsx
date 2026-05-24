interface FormContatosProps {
  editandoIndex: number | null;
  clienteSelecionado: string;
  setClienteSelecionado: (valor: string) => void;
  clientes: any[];
  descricao: string;
  setDescricao: (valor: string) => void;
  setShowForm: (valor: boolean) => void;
  setEditandoIndex: (index: number | null) => void;
  cadastrarContato: () => void;
}

export default function FormContatos({
  editandoIndex,
  clienteSelecionado,
  setClienteSelecionado,
  clientes,
  descricao,
  setDescricao,
  setShowForm,
  setEditandoIndex,
  cadastrarContato,
}: FormContatosProps) {
  
  // Impede o recarregamento da página e envia o formulário de forma segura
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    cadastrarContato();
  };

  return (
    <div className="p-6 flex justify-center">
      {/* Alterado para tag <form> com suporte ao envio nativo */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl glass-panel rounded-2xl border border-slate-800 p-6 bg-slate-950/40">
        <h3 className="text-xl font-bold text-white mb-4">
          {editandoIndex !== null ? "Editar Contato" : "Novo Contato"}
        </h3>
        
        {/* Campo de Seleção do Cliente */}
        <div className="mt-4">
          <label className="block text-slate-300 mb-2 text-sm">Cliente*</label>
          <select
            required
            value={clienteSelecionado}
            onChange={(e) => setClienteSelecionado(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors cursor-pointer"
          >
            <option value="" disabled>
              Selecione um cliente...
            </option>
            
            {/* CORREÇÃO AQUI: Mudamos de .name para .nome e adicionamos a empresa */}
            {clientes.map((cliente: any, index: number) => (
              <option key={cliente.id || index} value={cliente.nome} className="bg-slate-900 text-white">
                {cliente.nome} {cliente.empresa ? `(${cliente.empresa})` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Campo de Descrição */}
        <div className="mt-4">
          <label className="block text-slate-300 mb-2 text-sm">Descrição*</label>
          <input
            type="text"
            required
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Digite uma descrição do contato"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
          />
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