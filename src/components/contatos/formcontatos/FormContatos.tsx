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
  return (
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
  );
}