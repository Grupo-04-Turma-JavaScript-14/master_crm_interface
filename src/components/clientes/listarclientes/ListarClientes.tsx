import { Pencil, Trash2, Mail, Phone } from "lucide-react";

interface ListarClientesProps {
  data: any[];
  pesquisa: string;
  setNome: (valor: string) => void;
  setEmpresa: (valor: string) => void;
  setTelefone: (valor: string) => void;
  setEmail: (valor: string) => void;
  setStatusOportunidade: (valor: boolean) => void;
  setEditandoIndex: (index: number | null) => void;
  setShowForm: (valor: boolean) => void;
  setData: (lista: any[]) => void;
  salvarClientes: (lista: any[]) => void;
}

export default function ListarClientes({
  data,
  pesquisa,
  setNome,
  setEmpresa,
  setTelefone,
  setEmail,
  setStatusOportunidade,
  setEditandoIndex,
  setShowForm,
  setData,
  salvarClientes,
}: ListarClientesProps) {
  // Filtra os clientes dinamicamente por Nome ou por Empresa
  const dadosFiltrados = data.filter(
    (item) =>
      item.nome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
      item.empresa?.toLowerCase().includes(pesquisa.toLowerCase()),
  );

  return (
    <div className="p-6 overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800/60 text-slate-500 text-xs font-semibold tracking-wider">
            {/* ID foi removido daqui do cabeçalho */}
            <th className="pb-4 pt-2">NOME</th>
            <th className="pb-4 pt-2">EMPRESA</th>
            <th className="pb-4 pt-2">CONTATO</th>
            <th className="pb-4 pt-2">STATUS</th>
            <th className="pb-4 pt-2 text-center">AÇÕES</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/40">
          {dadosFiltrados.map((item: any, index: number) => (
            <tr
              key={index}
              className="group hover:bg-slate-800/5 transition-colors"
            >
              {/* Antiga célula <td> do ID foi removida daqui */}

              {/* Coluna Nome (Com Letra Inicial e ID discreto embaixo) */}
              <td className="py-4 align-middle">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-semibold text-sm">
                    {item.nome?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-white font-medium text-sm">
                      {item.nome}
                    </span>
                    {/* O ID aparece de forma limpa aqui se for menor que 1.000.000 (banco real) */}
                    {item.id && item.id < 1000000 && (
                      <span className="text-slate-500 text-xs font-mono">
                        ID: {item.id}
                      </span>
                    )}
                  </div>
                </div>
              </td>

              {/* Coluna Empresa */}
              <td className="py-4 align-middle">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <span className="text-slate-300 text-sm font-medium">
                    {item.empresa}
                  </span>
                </div>
              </td>

              {/* Coluna Contato (E-mail e Telefone juntos de forma limpa) */}
              <td className="py-4 align-middle">
                <div className="flex flex-col gap-1.5">
                  {/* Linha do E-mail */}
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail size={14} className="text-slate-500 shrink-0" />
                    <span className="text-sm font-medium">{item.email}</span>
                  </div>

                  {/* Linha do Telefone */}
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone size={12} className="text-slate-600 shrink-0" />
                    <span className="text-xs">{item.telefone}</span>
                  </div>
                </div>
              </td>

              {/* Coluna Status (Estilizada baseada no boolean da Entidade) */}
              <td className="py-4 align-middle">
                {item.statusOportunidade ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                    ● Oportunidade
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700/50">
                    Padrão
                  </span>
                )}
              </td>

              {/* Coluna Ações */}
              <td className="py-4 align-middle text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setNome(item.nome);
                      setEmpresa(item.empresa);
                      setTelefone(item.telefone);
                      setEmail(item.email);
                      setStatusOportunidade(item.statusOportunidade || false);
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
                      salvarClientes(novaLista);
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