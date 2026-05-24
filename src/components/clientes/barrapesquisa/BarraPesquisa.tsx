interface BarraPesquisaProps {
  pesquisa: string;
  setPesquisa: (valor: string) => void;
}

export default function BarraPesquisa({ pesquisa, setPesquisa }: BarraPesquisaProps) {
  return (
    <div className="w-full">
      {/* Container principal com efeito glass fino e cantos arredondados */}
      <div className="flex items-center bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-xl px-4 py-3 shadow-sm transition-all focus-within:border-blue-500/50">
        
        {/* Ícone da Lupa perfeitamente alinhado */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-slate-500 mr-3 shrink-0"
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
        
        {/* Campo de input centralizado na vertical */}
        <input
          type="text"
          placeholder="Pesquisar por nome do cliente ou empresa..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          className="w-full bg-transparent outline-none text-white text-sm placeholder-slate-500 py-0.5 leading-none"
        />
      </div>
    </div>
  );
}