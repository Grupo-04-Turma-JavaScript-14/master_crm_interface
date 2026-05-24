import { Pencil, Trash2, User, Briefcase, FileText, Calendar } from "lucide-react";

interface ListarContatosProps {
  data: any[];
  pesquisa: string;
  setClienteSelecionado: (valor: string) => void;
  setDescricao: (valor: string) => void;
  setEditandoIndex: (index: number | null) => void;
  setShowForm: (valor: boolean) => void;
  setData: (lista: any[]) => void;
  salvarContatos: (lista: any[]) => void;
}

export default function ListarContatos({
  data,
  pesquisa,
  setClienteSelecionado,
  setDescricao,
  setEditandoIndex,
  setShowForm,
  setData,
  salvarContatos,
}: ListarContatosProps) {
  return (
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
                
                {/* Coluna Usuário */}
                <td className="py-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      {/* Ícone limpo da biblioteca Lucide */}
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">
                        {item.usuario && item.usuario !== "" ? item.usuario : "Usuário Logado"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Coluna Cliente */}
                <td className="py-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                      {/* Ícone de pasta/maleta comercial */}
                      <Briefcase size={16} />
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
                      {/* Ícone de folha de texto */}
                      <FileText size={14} />
                    </div>
                    <span className="text-slate-300 text-sm truncate">{item.descricao}</span>
                  </div>
                </td>

                {/* Coluna Data */}
                <td className="py-4 align-middle">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                      {/* Ícone de calendário */}
                      <Calendar size={14} />
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
  );
}