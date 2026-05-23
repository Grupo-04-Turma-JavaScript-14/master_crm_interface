/*import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { Plus } from 'lucide-react';

export default function Clientes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Stub API call
    api.get('/cliente')
      .then(res => setData(res.data))
      .catch(err => console.error("API Error (expected until backend is running):", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Clientes</h2>
        <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Novo Cliente
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
            <h3 className="text-lg font-medium text-slate-200 mb-1">Nenhum cliente encontrado</h3>
            <p className="text-slate-400 max-w-sm">
              Você ainda não tem clientes cadastrados. Clique no botão acima para adicionar o primeiro.
            </p>
          </div>
        ) : (
          <div className="p-6">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg">Nome</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 rounded-tr-lg">Ações</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item: any) => (
                  <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">{item.email}</td>
                    <td className="px-6 py-4 text-blue-400 hover:text-blue-300 cursor-pointer">Editar</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}*/

import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { Plus } from 'lucide-react';
import { salvarClientes, buscarClientes } from '../lib/clientesStorage';

export default function Clientes() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const clientesSalvos = buscarClientes();

    setData(clientesSalvos);

    setLoading(false);
  }, []);

  function cadastrarCliente() {
    const novoCliente = {
      id: Date.now(),
      name: nome,
      email: email
    };

    const novosClientes = [...data, novoCliente];

    setData(novosClientes);

    salvarClientes(novosClientes);

    setNome('');
    setEmail('');
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Clientes</h2>

        <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Novo Cliente
        </button>
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <div className="space-y-4">

          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
          />

          <button
            onClick={cadastrarCliente}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors"
          >
            Cadastrar
          </button>

        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
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
              Nenhum cliente encontrado
            </h3>

            <p className="text-slate-400 max-w-sm">
              Você ainda não tem clientes cadastrados. Clique no botão acima para adicionar o primeiro.
            </p>
          </div>
        ) : (
          <div className="p-6">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg">Nome</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 rounded-tr-lg">Ações</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item: any) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {item.name}
                    </td>

                    <td className="px-6 py-4">
                      {item.email}
                    </td>

                    <td className="px-6 py-4 text-blue-400 hover:text-blue-300 cursor-pointer">
                      Editar
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


