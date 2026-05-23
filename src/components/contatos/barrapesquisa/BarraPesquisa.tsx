interface BarraPesquisaProps {
  pesquisa: string;
  setPesquisa: (valor: string) => void;
}

export default function BarraPesquisa({ pesquisa, setPesquisa }: BarraPesquisaProps) {
  return (
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
  );
}