import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Plus } from "lucide-react";
import { salvarContatos, buscarContatos } from "../lib/contatosStorage";
import { buscarClientes } from "../lib/clientesStorage";
import BarraPesquisa from "../components/contatos/barrapesquisa/BarraPesquisa";
import ListarContatos from "../components/contatos/listarcontatos/ListarContatos";
import FormContatos from "../components/contatos/formcontatos/FormContatos";

export default function Contatos() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [descricao, setDescricao] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);

  // BLOCO ORIGINAL INTACTO - NÃO MEXIDO:
  useEffect(() => {
    // Stub API call
    api
      .get("/contato")
      .then((res) => setData(res.data))
      .catch((err) =>
        console.error("API Error (expected until backend is running):", err),
      )
      .finally(() => setLoading(false));
    const clientesSalvos = buscarClientes();
    const contatosSalvos = buscarContatos();

    setData(contatosSalvos);

    setClientes(clientesSalvos);
  }, []);

  function cadastrarContato() {
    if (!clienteSelecionado || clienteSelecionado === "" || !descricao) {
      alert("Preencha o cliente e a descrição");
      return;
    }

    const novoContato = {
      usuario: "", 
      cliente: clienteSelecionado,
      descricao: descricao,
      data: new Date().toLocaleDateString(),
    };

    let novaLista;

    if (editandoIndex !== null) {
      novaLista = [...data];
      novaLista[editandoIndex] = novoContato;

      setEditandoIndex(null);
    } else {
      novaLista = [...data, novoContato];
    }

    setData(novaLista);
    salvarContatos(novaLista);

    setShowForm(false);
    
    setClienteSelecionado("");
    setDescricao("");
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho superior: Título e Botão Novo */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Contatos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Contato
        </button>
      </div>

      {/* Painel Principal com Efeito Glass */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        
        {/* Chamada da Barra de Pesquisa */}
        <BarraPesquisa 
          pesquisa={pesquisa} 
          setPesquisa={setPesquisa} 
        />

        {/* Chamada do Formulário Condicional */}
        {showForm && (
          <FormContatos
            editandoIndex={editandoIndex}
            clienteSelecionado={clienteSelecionado}
            setClienteSelecionado={setClienteSelecionado}
            clientes={clientes}
            descricao={descricao}
            setDescricao={setDescricao}
            setShowForm={setShowForm}
            setEditandoIndex={setEditandoIndex}
            cadastrarContato={cadastrarContato}
          />
        )}

        {/* Chamada da Tabela de Listagem */}
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
              Nenhum contato encontrado
            </h3>
            <p className="text-slate-400 max-w-sm">
              Você ainda não tem contatos cadastrados. Clique no botão acima para adicionar o primeiro.
            </p>
          </div>
        ) : (
          <ListarContatos
            data={data}
            pesquisa={pesquisa}
            setClienteSelecionado={setClienteSelecionado}
            setDescricao={setDescricao}
            setEditandoIndex={setEditandoIndex}
            setShowForm={setShowForm}
            setData={setData}
            salvarContatos={salvarContatos}
          />
        )}
      </div>
    </div>
  );
}