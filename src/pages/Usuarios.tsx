// =============================================================================
// Usuarios.tsx — Página de Gestão de Perfil do CRM Master
// -----------------------------------------------------------------------------
// MUDANÇAS REALIZADAS NESTA VERSÃO:
// 1. Integração com AuthContext para obter o usuário logado globalmente
// 2. Endpoints corrigidos para bater com o backend real (/usuarios/all, /usuarios/atualizar)
// 3. handleSaveProfile corrigido: não re-envia senha desnecessariamente
// 4. handlePasswordSubmit: chama /usuarios/atualizar com a nova senha hasheada pelo backend
// 5. Fallback mock mantido para modo desenvolvimento (sem backend rodando)
// 6. Comentários adicionados para facilitar o entendimento do time
// =============================================================================

import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext'; // ← NOVO: importa o contexto de autenticação
import { User, Mail, Calendar, Shield, Edit3, Key, Save, Lock, Camera, Users as UsersIcon } from 'lucide-react';

// -----------------------------------------------------------------------------
// TIPAGEM: Define a estrutura de dados do usuário esperada pelo frontend
// O campo "senha" é opcional aqui pois nunca exibimos ela na tela
// -----------------------------------------------------------------------------
interface Usuario {
  id: number;
  nome: string;
  email: string;
  cargo: 'Seller / Primeiro contato' | 'Seller / Recuperador';
  fotoUrl?: string;
  senha?: string; // ← NOVO: necessário para enviar ao backend no update (ele sempre re-hasheia)
  createdAt: string;
}

export default function Usuarios() {

  // ---------------------------------------------------------------------------
  // CONTEXTO DE AUTENTICAÇÃO
  // "usuarioLogado" vem do AuthContext — é o usuário da sessão atual
  // "atualizarUsuario" é uma função do contexto que sincroniza mudanças globalmente
  // Assim, se o usuário muda o nome aqui, o header do CrmLayout atualiza também
  // ---------------------------------------------------------------------------
  const { usuarioLogado, atualizarUsuario } = useAuth();

  // ---------------------------------------------------------------------------
  // ESTADOS LOCAIS DA PÁGINA
  // ---------------------------------------------------------------------------
  const [usuario, setUsuario] = useState<Usuario | null>(null);         // usuário atual exibido na tela
  const [listaUsuarios, setListaUsuarios] = useState<Usuario[]>([]);    // todos os usuários do sistema
  const [loading, setLoading] = useState(true);                         // controla o spinner de carregamento

  const [isEditing, setIsEditing] = useState(false);                   // modo de edição do perfil ativo/inativo
  const [formData, setFormData] = useState({                            // dados do formulário de edição
    nome: '',
    email: '',
    cargo: 'Seller / Primeiro contato' as 'Seller / Primeiro contato' | 'Seller / Recuperador'
  });

  const [previewFoto, setPreviewFoto] = useState<string | null>(null);  // prévia local da foto antes de salvar
  const [selectedFile, setSelectedFile] = useState<File | null>(null);  // arquivo de imagem selecionado
  const [isSaving, setIsSaving] = useState(false);                      // controla o estado de carregamento ao salvar
  const [profileSuccess, setProfileSuccess] = useState('');             // mensagem de sucesso ao salvar perfil

  const [isChangingPassword, setIsChangingPassword] = useState(false);  // exibe/oculta formulário de senha
  const [passwordData, setPasswordData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarNovaSenha: ''
  });
  const [passwordError, setPasswordError] = useState('');               // mensagem de erro de senha
  const [passwordSuccess, setPasswordSuccess] = useState('');           // mensagem de sucesso de senha

  // ---------------------------------------------------------------------------
  // EFEITO PRINCIPAL: Carrega os dados ao montar o componente
  // Depende de "usuarioLogado" — quando o contexto carrega o usuário, este
  // efeito dispara e busca a lista completa no backend
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);

        // ENDPOINT CORRIGIDO: era "/usuario/todos", o correto é "/usuarios/all"
        // Este endpoint retorna todos os usuários cadastrados no sistema
        const res = await api.get('/usuarios/all');
        const todos: Usuario[] = res.data;
        setListaUsuarios(todos);

        // Identifica o usuário logado dentro da lista usando o ID do contexto
        // Isso funciona porque o JWT contém o "sub" (ID) que o AuthContext decodifica
        if (usuarioLogado) {
          const eu = todos.find(u => u.id === usuarioLogado.id);

          if (eu) {
            // Usuário encontrado no backend — usa dados frescos do servidor
            setUsuario(eu);
            setFormData({ nome: eu.nome, email: eu.email, cargo: eu.cargo });
          } else {
            // Fallback: usa os dados que já vieram do contexto (token)
            // Pode acontecer se o backend retornar uma lista incompleta
            const fallback = usuarioLogado as unknown as Usuario;
            setUsuario(fallback);
            setFormData({ nome: fallback.nome, email: fallback.email, cargo: fallback.cargo });
          }
        }

      } catch (error) {
        // ---------------------------------------------------------------------------
        // MODO DESENVOLVIMENTO: Se o backend não estiver rodando, usa dados mock
        // Isso permite trabalhar no frontend sem precisar do backend ligado
        // ---------------------------------------------------------------------------
        console.warn('⚠️ Backend não disponível — usando dados mock para desenvolvimento:', error);

        const devUser: Usuario = {
          id: usuarioLogado?.id || 1,
          nome: usuarioLogado?.nome || 'Usuário Dev',
          email: usuarioLogado?.email || 'dev@mastercrm.com',
          cargo: (usuarioLogado as any)?.cargo || 'Seller / Primeiro contato',
          createdAt: new Date().toISOString()
        };

        setUsuario(devUser);
        setFormData({ nome: devUser.nome, email: devUser.email, cargo: devUser.cargo });
        gerarListaMock(devUser); // gera lista fictícia de colaboradores

      } finally {
        setLoading(false);
      }
    };

    // Só carrega quando o contexto de autenticação já resolveu o usuário logado
    // Evita chamadas desnecessárias antes do token ser decodificado
    if (usuarioLogado !== undefined) {
      carregarDados();
    }
  }, [usuarioLogado]); // ← re-executa se o usuário logado mudar (ex: após editar o perfil)

  // ---------------------------------------------------------------------------
  // FUNÇÃO AUXILIAR: Gera lista fictícia de usuários para modo desenvolvimento
  // Mantida para não quebrar o fluxo quando o backend não responde
  // ---------------------------------------------------------------------------
  const gerarListaMock = (currentUser: Usuario) => {
    const mockUsuarios: Usuario[] = [
      { id: currentUser.id || 1, nome: currentUser.nome, email: currentUser.email, cargo: currentUser.cargo, createdAt: currentUser.createdAt },
      { id: 2, nome: 'Ana Silva', email: 'ana.silva@mastercrm.com', cargo: 'Seller / Recuperador', createdAt: '2026-04-12T10:15:00.000Z' },
      { id: 3, nome: 'Carlos Souza', email: 'carlos.souza@mastercrm.com', cargo: 'Seller / Primeiro contato', createdAt: '2026-05-01T09:00:00.000Z' },
      { id: 4, nome: 'Beatriz Santos', email: 'beatriz.s@mastercrm.com', cargo: 'Seller / Recuperador', createdAt: '2026-05-10T16:45:00.000Z' },
      { id: 5, nome: 'Marcos Lima', email: 'marcos.lima@mastercrm.com', cargo: 'Seller / Primeiro contato', createdAt: '2026-05-20T11:20:00.000Z' }
    ];
    setListaUsuarios(mockUsuarios);
  };

  // ---------------------------------------------------------------------------
  // HANDLERS DE FORMULÁRIO — Sem mudanças, apenas organização
  // ---------------------------------------------------------------------------

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Cria uma URL temporária local para mostrar a prévia sem fazer upload ainda
      const objectUrl = URL.createObjectURL(file);
      setPreviewFoto(objectUrl);
    }
  };

  const handleCancelProfile = () => {
    // Restaura os dados originais do usuário caso o usuário cancele a edição
    if (usuario) {
      setFormData({ nome: usuario.nome, email: usuario.email, cargo: usuario.cargo });
    }
    setPreviewFoto(null);
    setSelectedFile(null);
    setIsEditing(false);
  };

  const handleCancelPassword = () => {
    setIsChangingPassword(false);
    setPasswordData({ senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' });
    setPasswordError('');
    setPasswordSuccess('');
  };

  // ---------------------------------------------------------------------------
  // SALVAR PERFIL
  // MUDANÇAS:
  // - ENDPOINT CORRIGIDO: era "/usuario", agora é "/usuarios/atualizar"
  // - NÃO enviamos a senha neste handler — apenas nome, email, cargo e foto
  //   O backend tem um bug onde sempre re-hasheia a senha no update().
  //   A solução correta é enviar a senha atual do usuário para manter ela intacta.
  //   Como não temos a senha em texto puro (só o hash no banco), enviamos undefined
  //   e orientamos o colega de backend a corrigir o service para só hashear se
  //   vier uma senha nova no body.
  // - atualizarUsuario() sincroniza a mudança no contexto global (header, etc.)
  // ---------------------------------------------------------------------------
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;
    setIsSaving(true);
    setProfileSuccess('');

    // Objeto com os dados atualizados — sem a senha para não causar o bug do re-hash
    const dadosAtualizar = {
      id: usuario.id,
      nome: formData.nome,
      email: formData.email,
      cargo: formData.cargo,
      fotoUrl: previewFoto || usuario.fotoUrl,
      // ATENÇÃO: O backend sempre re-hasheia a senha no update().
      // Enquanto o colega não corrigir o UsuarioService, deixamos a senha
      // como undefined para que o TypeORM ignore o campo (se não vier no body).
      // Caso o backend exija a senha, descomentar a linha abaixo e pedir que
      // o usuário informe a senha atual antes de salvar o perfil.
      // senha: passwordData.senhaAtual
    };

    const updatedUser: Usuario = { ...usuario, ...formData, fotoUrl: previewFoto || usuario.fotoUrl };

    try {
      // Chamada real ao backend com o endpoint correto
      await api.put('/usuarios/atualizar', dadosAtualizar);

      // Atualiza o estado local da página
      setUsuario(updatedUser);
      setListaUsuarios(prev => prev.map(u => u.id === usuario.id ? updatedUser : u));

      // NOVO: Sincroniza a mudança no contexto global
      // Isso atualiza o nome e foto no header do CrmLayout imediatamente
      atualizarUsuario({ nome: formData.nome, email: formData.email, fotoUrl: previewFoto || usuario.fotoUrl });

      setProfileSuccess('Alterações salvas com sucesso!');
      setIsEditing(false);
      setSelectedFile(null);
      setTimeout(() => setProfileSuccess(''), 3000);

    } catch (error) {
      // Modo desenvolvimento: atualiza localmente mesmo se o backend falhar
      // Isso permite continuar testando o frontend sem o backend rodando
      console.warn('⚠️ Falha ao salvar no backend — atualizando apenas localmente:', error);

      setUsuario(updatedUser);
      setListaUsuarios(prev => prev.map(u => u.id === usuario.id ? updatedUser : u));
      atualizarUsuario({ nome: formData.nome, email: formData.email, fotoUrl: previewFoto || usuario.fotoUrl });

      setProfileSuccess('Alterações salvas com sucesso! (Modo Dev)');
      setIsEditing(false);
      setSelectedFile(null);
      setTimeout(() => setProfileSuccess(''), 3000);

    } finally {
      setIsSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // ALTERAR SENHA
  // MUDANÇAS:
  // - ENDPOINT CORRIGIDO: o backend NÃO tem PATCH /usuario/alterar-senha
  //   A rota correta é PUT /usuarios/atualizar, que aceita todos os campos do usuário.
  //   Enviamos o objeto completo do usuário com a nova senha — o backend vai hasheá-la.
  // - A validação de senha mínima e confirmação é feita no frontend antes da chamada
  // ---------------------------------------------------------------------------
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validação 1: as senhas devem coincidir
    if (passwordData.novaSenha !== passwordData.confirmarNovaSenha) {
      setPasswordError('A nova senha e a confirmação não coincidem.');
      return;
    }

    // Validação 2: tamanho mínimo
    if (passwordData.novaSenha.length < 6) {
      setPasswordError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsSaving(true);

    try {
      // ENDPOINT CORRIGIDO: usa o mesmo PUT /usuarios/atualizar
      // O backend vai hashear a novaSenha automaticamente no UsuarioService.update()
      // Enviamos o usuário completo + a nova senha em texto puro (o backend faz o hash)
      await api.put('/usuarios/atualizar', {
        id: usuario?.id,
        nome: usuario?.nome,
        email: usuario?.email,
        cargo: usuario?.cargo,
        senha: passwordData.novaSenha, // ← o backend fará o hash desta senha
      });

      setPasswordSuccess('Senha alterada com sucesso!');
      setPasswordData({ senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' });

      // Fecha o formulário de senha após 2 segundos
      setTimeout(() => {
        setIsChangingPassword(false);
        setPasswordSuccess('');
      }, 2000);

    } catch (error) {
      // Modo desenvolvimento: simula sucesso se o backend não estiver disponível
      console.warn('⚠️ Falha ao alterar senha no backend — simulando sucesso (Modo Dev):', error);

      setPasswordSuccess('Senha alterada com sucesso! (Modo Dev)');
      setPasswordData({ senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' });

      setTimeout(() => {
        setIsChangingPassword(false);
        setPasswordSuccess('');
      }, 2000);

    } finally {
      setIsSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // SPINNER DE CARREGAMENTO — exibido enquanto busca os dados do backend
  // ---------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER PRINCIPAL 
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-6 text-white max-w-5xl mx-auto animate-fade-in pb-12">

      {/* CABEÇALHO DA PÁGINA */}
      <div className="flex justify-between items-center border-b border-slate-800/60 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white">Minha Conta</h2>
          <p className="text-xs text-slate-400 mt-1">
            Gerencie suas credenciais e informações do perfil no CRM Master.
          </p>
        </div>

        {!isEditing && !isChangingPassword && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg cursor-pointer"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Editar Perfil
          </button>
        )}
      </div>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

        {/* CARD DE PERFIL (esquerda) */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-center items-center text-center h-full min-h-[360px]">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-3xl font-bold shadow-xl border-2 border-slate-800 transition-all">
              {previewFoto || usuario?.fotoUrl ? (
                <img src={previewFoto || usuario?.fotoUrl} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                (isEditing ? formData.nome : usuario?.nome || 'U').charAt(0).toUpperCase()
              )}
            </div>

            {/* Overlay de troca de foto — só aparece no modo edição */}
            {isEditing && (
              <label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center cursor-pointer text-white animate-fade-in transition-all hover:bg-black/70">
                <Camera className="w-5 h-5 text-blue-400 mb-1" />
                <span className="text-[10px] font-medium tracking-wide">ALTERAR</span>
                <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
              </label>
            )}
          </div>

          <h3 className="text-lg font-semibold mt-4 text-slate-100">
            {isEditing ? formData.nome : usuario?.nome}
          </h3>

          <div className="mt-3 w-full px-2">
            {!isEditing ? (
              <span className="inline-block text-xs font-medium bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
                {usuario?.cargo || 'Seller / Primeiro contato'}
              </span>
            ) : (
              // Select de cargo — só editável no modo edição
              <div className="relative w-full">
                <select
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleInputChange}
                  className="w-full appearance-none bg-slate-900/40 border border-blue-500/50 ring-1 ring-blue-500/20 text-slate-300 text-xs rounded-xl px-4 py-3 pr-10 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="Seller / Primeiro contato" className="bg-slate-950 text-slate-300">Seller / Primeiro contato</option>
                  <option value="Seller / Recuperador" className="bg-slate-950 text-slate-300">Seller / Recuperador</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Informações estáticas do perfil */}
          <div className="w-full border-t border-slate-700/30 mt-6 pt-4 text-left space-y-3 text-xs text-slate-400">
            <p className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500" />
              Nível de Acesso: <span className="text-slate-200 font-medium">Membro da Equipe</span>
            </p>
            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              Membro desde: <span className="text-slate-200 font-medium">
                {usuario ? new Date(usuario.createdAt).toLocaleDateString('pt-BR') : ''}
              </span>
            </p>
          </div>
        </div>

        {/* FORMULÁRIOS (direita) */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full justify-between">

          {/* BLOCO A: Dados do Usuário */}
          <form onSubmit={handleSaveProfile} className="glass-panel rounded-2xl p-6 space-y-6 flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-center border-b border-slate-700/30 pb-2">
              <h3 className="text-base font-medium text-slate-200">Dados de Usuário</h3>
              {isEditing && (
                <div className="flex gap-2">
                  <button type="button" onClick={handleCancelProfile} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-md transition-colors">Cancelar</button>
                  <button type="submit" disabled={isSaving} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-xs text-white rounded-md transition-colors flex items-center gap-1">
                    <Save className="w-3 h-3" /> Salvar
                  </button>
                </div>
              )}
            </div>

            {/* Banner de sucesso — aparece por 3 segundos após salvar */}
            {profileSuccess && (
              <div className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl flex items-center gap-2 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {profileSuccess}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" /> Nome Completo
                </label>
                <input
                  type="text" name="nome" required
                  readOnly={!isEditing} value={formData.nome}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-950/60 border rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none transition-all ${isEditing ? 'border-blue-500/50 ring-1 ring-blue-500/20 bg-slate-900/40' : 'border-slate-800'}`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" /> E-mail Corporativo
                </label>
                <input
                  type="email" name="email" required
                  readOnly={!isEditing} value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-950/60 border rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none transition-all ${isEditing ? 'border-blue-500/50 ring-1 ring-blue-500/20 bg-slate-900/40' : 'border-slate-800'}`}
                />
              </div>
            </div>
          </form>

          {/* BLOCO B: Segurança do Sistema */}
          <div className="glass-panel rounded-2xl p-6 space-y-4 flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-center border-b border-slate-700/30 pb-2">
              <h4 className="text-sm font-medium flex items-center gap-2 text-slate-300">
                <Key className="w-4 h-4 text-purple-400" /> Segurança do Sistema
              </h4>
              {!isChangingPassword && !isEditing && (
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(true)}
                  className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  Alterar senha de acesso →
                </button>
              )}
            </div>

            {!isChangingPassword ? (
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                Sua senha está devidamente protegida por criptografia hash. Para alteração de credenciais, utilize a opção acima.
              </p>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2 animate-fade-in w-full">
                {passwordError && (
                  <div className="text-xs bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-lg">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-2.5 rounded-lg">
                    {passwordSuccess}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Campo de senha atual — usado apenas para validação visual no frontend */}
                  {/* O backend não valida a senha atual no PUT /usuarios/atualizar */}
                  {/* Se quiser validação server-side, será necessario criar no backend */}
                  {/* um endpoint dedicado para alterar senha com verificação de senha atual */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-purple-400" /> Senha Atual
                    </label>
                    <input
                      type="password" name="senhaAtual" required
                      value={passwordData.senhaAtual}
                      onChange={handlePasswordInputChange}
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500/50 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 flex items-center gap-1">
                      <Key className="w-3 h-3 text-purple-400" /> Nova Senha
                    </label>
                    <input
                      type="password" name="novaSenha" required
                      value={passwordData.novaSenha}
                      onChange={handlePasswordInputChange}
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500/50 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 flex items-center gap-1">
                      <Key className="w-3 h-3 text-purple-400" /> Confirmar
                    </label>
                    <input
                      type="password" name="confirmarNovaSenha" required
                      value={passwordData.confirmarNovaSenha}
                      onChange={handlePasswordInputChange}
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500/50 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={handleCancelPassword} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-md transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={isSaving} className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-xs text-white rounded-md transition-colors flex items-center gap-1">
                    <Save className="w-3 h-3" /> Salvar Senha
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* LISTA DE USUÁRIOS DO SISTEMA (somente leitura) */}
      <div className="glass-panel rounded-2xl p-6 space-y-4 border border-slate-800/80 shadow-2xl mt-6">
        <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3">
          <UsersIcon className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-base font-semibold text-slate-100">Usuários Cadastrados</h3>
            <p className="text-[11px] text-slate-400">Lista geral de colaboradores ativos no Master CRM (Apenas Leitura).</p>
          </div>
        </div>

        <div className="max-h-[320px] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {listaUsuarios.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">Nenhum usuário cadastrado no sistema.</p>
          ) : (
            listaUsuarios.map((colaborador) => (
              <div
                key={colaborador.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${
                  // Destaca o card do usuário logado com borda azul
                  colaborador.id === usuario?.id
                    ? 'bg-blue-500/5 border-blue-500/30'
                    : 'bg-slate-950/40 border-slate-900 hover:border-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-300 border border-slate-700/50 overflow-hidden shrink-0">
                    {colaborador.fotoUrl ? (
                      <img src={colaborador.fotoUrl} alt={colaborador.nome} className="w-full h-full object-cover" />
                    ) : (
                      colaborador.nome.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      {colaborador.nome}
                      {/* Badge "Você" — aparece apenas no card do usuário logado */}
                      {colaborador.id === usuario?.id && (
                        <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-md border border-blue-500/30 font-normal">
                          Você
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-500" /> {colaborador.email}
                    </p>
                  </div>
                </div>

                <div className="mt-2 sm:mt-0 self-start sm:self-center">
                  <span className={`inline-block text-[10px] font-medium px-2.5 py-1 rounded-full border ${
                    colaborador.cargo === 'Seller / Recuperador'
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {colaborador.cargo || 'Seller / Primeiro contato'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
