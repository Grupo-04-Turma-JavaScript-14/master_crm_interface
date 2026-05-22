export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Cards */}
        {[
          { label: 'Total de Clientes', value: '1,234', trend: '+12%' },
          { label: 'Novos Contatos', value: '56', trend: '+5%' },
          { label: 'Usuários Ativos', value: '89', trend: '-2%' }
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl">
            <h3 className="text-slate-400 text-sm font-medium mb-2">{stat.label}</h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-white">{stat.value}</span>
              <span className={`text-sm font-medium ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel p-6 rounded-2xl h-96 flex flex-col">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Visão Geral</h3>
        <div className="flex-1 border-2 border-dashed border-slate-700/50 rounded-xl flex items-center justify-center text-slate-500">
          Gráfico será renderizado aqui
        </div>
      </div>
    </div>
  );
}
