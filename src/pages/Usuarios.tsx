import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { Plus } from 'lucide-react';

export default function Usuarios() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Stub API call
    api.get('/usuario')
      .then(res => setData(res.data))
      .catch(err => console.error("API Error (expected until backend is running):", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Usuários</h2>
        <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Novo Usuário
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Carregando dados...</div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center border-2 border-dashed border-slate-700/50 m-6 rounded-xl">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl text-slate-500">?</span>
            </div>
            <h3 className="text-lg font-medium text-slate-200 mb-1">Nenhum usuário encontrado</h3>
            <p className="text-slate-400 max-w-sm">
              Você ainda não tem usuários cadastrados no sistema.
            </p>
          </div>
        ) : (
          <div className="p-6">
            {/* Table would go here */}
          </div>
        )}
      </div>
    </div>
  );
}
