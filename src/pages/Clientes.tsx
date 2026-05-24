import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Plus, User } from "lucide-react";
import { salvarClientes, buscarClientes } from "../lib/clientesStorage";

// Importando os componentes que criamos nas subpastas
import BarraPesquisa from "../components/clientes/barrapesquisa/BarraPesquisa";
import FormClientes from "../components/clientes/formclientes/FormClientes";
import ListarClientes from "../components/clientes/listarclientes/ListarClientes";

export default function Clientes() {
  // Estados para os campos exigidos pela Entidade do TypeORM
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [statusOportunidade, setStatusOportunidade] = useState(false);

  // Estados de controle da interface
  const [pesquisa, setPesquisa] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);

  //  BLOCO ORIGINAL
  useEffect(() => {
    // Stub API call
    api
      .get("/cliente")
      .then((res) => setData(res.data))
      .catch((err) =>
        console.error("API Error (expected until backend is running):", err),
      )
      .finally(() => setLoading(false));

    // Plano B: Carregando os clientes salvos no localStorage localmente
    const clientesSalvos = buscarClientes();
    setData(clientesSalvos);
  }, []);

  // Função do CRUD para Cadastrar ou Salvar Alterações localmente
  function cadastrarCliente() {
    // Validação simples dos campos obrigatórios
    if (!nome || !empresa || !telefone || !email) {
      alert("Por favor, preencha todos os campos obrigatórios (*)");
      return;
    }

    const novoCliente = {
      id: editandoIndex !== null ? data[editandoIndex].id : Date.now(),
      nome: nome,
      empresa: empresa,
      telefone: telefone,
      email: email,
      statusOportunidade: statusOportunidade, // Campo booleano da entidade
    };

    let novaLista;

    if (editandoIndex !== null) {
      // Se estiver editando, substitui a linha correspondente
      novaLista = [...data];
      novaLista[editandoIndex] = novoCliente;
      setEditandoIndex(null);
    } else {
      // Se for novo cadastro, adiciona na lista
      novaLista = [...data, novoCliente];
    }

    // Atualiza o estado da tela e grava na "gavetinha" da pasta lib
    setData(novaLista);
    salvarClientes(novaLista);

    // Fecha o formulário e limpa os campos para o próximo
    setShowForm(false);
    setNome("");
    setEmpresa("");
    setTelefone("");
    setEmail("");
    setStatusOportunidade(false);
  }
  return (
    <div className="space-y-6">
      {/* 1. CABEÇALHO DO CRM */}
      <div className="flex justify-between items-start pt-2">
        <div className="space-y-1">
          {/* Título com o ícone alinhado e colorido */}
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <User className="w-6 h-6 text-sky-400 stroke-[2.5]" />
            Clientes Cadastrados
          </h2>

          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Gerencie sua carteira de clientes, acompanhe interações e
            identifique novas oportunidades de negócios.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors shrink-0 shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Cliente
        </button>
      </div>

      {/* 2. CARD EXCLUSIVO DA BARRA DE PESQUISA  */}
      <div className="w-full bg-slate-900/20 border border-slate-800/80 rounded-2xl p-4 shadow-sm">
        <BarraPesquisa pesquisa={pesquisa} setPesquisa={setPesquisa} />
      </div>

      {/* 3. CARD INDEPENDENTE PARA A TABELA*/}
      <div className="glass-panel rounded-2xl overflow-hidden bg-transparent border border-slate-800/40">
        {" "}
        {/* Formulário Condicional */}
        {showForm && (
          <FormClientes
            editandoIndex={editandoIndex}
            nome={nome}
            setNome={setNome}
            empresa={empresa}
            setEmpresa={setEmpresa}
            telefone={telefone}
            setTelefone={setTelefone}
            email={email}
            setEmail={setEmail}
            statusOportunidade={statusOportunidade}
            setStatusOportunidade={setStatusOportunidade}
            setShowForm={setShowForm}
            setEditandoIndex={setEditandoIndex}
            cadastrarCliente={cadastrarCliente}
          />
        )}
        {/* Tabela de Listagem de Dados */}
        {loading ? (
          <div className="p-8 text-center text-slate-400">
            Carregando dados dos clientes...
          </div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center border-2 border-dashed border-slate-700/50 m-6 rounded-xl">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl text-slate-500">?</span>
            </div>
            <h3 className="text-lg font-medium text-slate-200 mb-1">
              Nenhum cliente cadastrado
            </h3>
            <p className="text-slate-400 max-w-sm text-sm">
              Sua lista está vazia. Clique no botão "Novo Cliente" acima para
              registrar sua primeira empresa no banco.
            </p>
          </div>
        ) : (
          <ListarClientes
            data={data}
            pesquisa={pesquisa}
            setNome={setNome}
            setEmpresa={setEmpresa}
            setTelefone={setTelefone}
            setEmail={setEmail}
            setStatusOportunidade={setStatusOportunidade}
            setEditandoIndex={setEditandoIndex}
            setShowForm={setShowForm}
            setData={setData}
            salvarClientes={salvarClientes}
          />
        )}
      </div>
    </div>
  );
}
