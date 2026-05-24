import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Plus, MessageSquare } from "lucide-react";
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
      
      {/* 1. NOVO CABEÇALHO DO CRM COM ÍCONE DE INTERAÇÕES AZUL */}
      <div className="flex justify-between items-start pt-2">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            {/* Ícone azul de balão de mensagem/interação com traço marcante */}
            <MessageSquare className="w-6 h-6 text-sky-400 stroke-[2.5]" /> 
            Histórico de Contatos
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Registre e acompanhe todas as interações, reuniões e negociações realizadas com seus clientes.
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors shrink-0 shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Contato
        </button>
      </div>

      {/* 2. CARD EXCLUSIVO E TRANSPARENTE DA BARRA DE PESQUISA */}
{/* 2. CARD DA BARRA DE PESQUISA COM A BORDA ATIVADA (MUDE PARA ISTO) */}
<div className="w-full bg-transparent border border-slate-800/80 rounded-xl p-3 shadow-sm">
  <BarraPesquisa pesquisa={pesquisa} setPesquisa={setPesquisa} />
</div>

      {/* 3. CARD DA TABELA DE CONTATOS (TOTALMENTE INTEGRADO À COR DA TELA) */}
      <div className="glass-panel rounded-2xl overflow-hidden bg-transparent border border-slate-800/40">
        
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
            <p className="text-slate-400 max-w-sm text-sm">
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