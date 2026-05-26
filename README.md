# Master CRM Interface

Interface frontend de um sistema CRM (Customer Relationship Management) moderno, construído com React, TypeScript e Tailwind CSS. Focado em gestão de clientes, contatos e usuários, com dashboard analítico e feed de atividades em tempo real.

---

## ✨ Funcionalidades

- **Dashboard** — Métricas animadas de clientes, contatos, usuários e oportunidades, com gráficos de barras interativos via Recharts
- **Gestão de Clientes** — CRUD completo com busca, filtros, marcação de oportunidades (⭐) e visualização detalhada em modal
- **Gestão de Contatos** — Cadastro e acompanhamento de contatos vinculados a clientes
- **Gestão de Usuários** — Administração de usuários do sistema
- **Feed de Atividades** — Timeline cronológica de interações e contatos, com busca e visualização detalhada
- **Autenticação JWT** — Login e registro com token armazenado via `localStorage`
- **Tema Claro/Escuro** — Alternância de tema persistida no `localStorage`
- **Responsividade** — Sidebar com menu mobile e layout adaptável para todos os tamanhos de tela
- **Animação Pointilhismo** — Animação visual generativa na tela de login

---

## 🛠️ Stack Tecnológica

| Categoria        | Tecnologia                          |
|-----------------|-------------------------------------|
| Framework       | React 19                            |
| Linguagem       | TypeScript 6                        |
| Build Tool      | Vite 8                              |
| Estilização     | Tailwind CSS 4                      |
| Roteamento      | React Router DOM 7                  |
| HTTP Client     | Axios                               |
| Gráficos        | Recharts                            |
| Ícones          | Lucide React                        |
| Notificações    | React Hot Toast                     |
| Utilitários     | clsx, tailwind-merge                |
| Deploy          | Vercel                              |

---

## 📁 Estrutura do Projeto

```
src/
├── api/
│   └── axios.ts          # Instância do Axios com interceptor JWT
├── assets/               # Imagens e SVGs do projeto
├── components/
│   ├── Avatar.tsx         # Componente de avatar de usuário
│   ├── PointillismAnimation.tsx  # Animação canvas na tela de login
│   ├── SidebarLogo.tsx    # Logo animada da sidebar
│   └── TableSkeleton.tsx  # Skeleton loader para tabelas
├── layouts/
│   └── CrmLayout.tsx      # Layout principal com sidebar e header
├── lib/
│   └── utils.ts           # Utilitários (cn helper)
├── pages/
│   ├── Intro.tsx          # Página de introdução/landing
│   ├── Login.tsx          # Autenticação e registro
│   ├── Dashboard.tsx      # Métricas e gráficos
│   ├── Clientes.tsx       # CRUD de clientes
│   ├── Contatos.tsx       # CRUD de contatos
│   ├── Usuarios.tsx       # Gestão de usuários
│   └── FeedAtividades.tsx # Timeline de atividades
└── App.tsx                # Configuração de rotas
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Backend rodando (API REST)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/master-crm-interface.git
cd master-crm-interface

# Instale as dependências
npm install
```

### Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:4000
```

> Se a variável não for definida, a URL padrão `http://localhost:4000` será utilizada.

### Executando

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

---

## 🔐 Autenticação

A aplicação utiliza autenticação via **JWT**. O token é obtido no endpoint `/usuarios/logar` e armazenado no `localStorage` sob a chave `token`. O interceptor do Axios injeta automaticamente o token no header `Authorization: Bearer <token>` em todas as requisições autenticadas.

**Rotas públicas:** `/` (Intro) e `/login`  
**Rotas protegidas:** `/app/*` (Dashboard, Clientes, Contatos, Usuários, Feed)

---

## 🌐 Deploy

O projeto inclui configuração para deploy na **Vercel** (`vercel.json`) com rewrite de todas as rotas para `index.html`, garantindo o funcionamento correto do roteamento client-side (SPA).

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 📡 Integração com a API

A interface consome uma API REST. Os principais endpoints utilizados são:

| Método | Endpoint             | Descrição                    |
|--------|----------------------|------------------------------|
| POST   | `/usuarios/logar`    | Login (retorna JWT)          |
| POST   | `/usuarios/cadastrar`| Cadastro de usuário          |
| GET    | `/usuarios/all`      | Listar todos os usuários     |
| GET    | `/clientes`          | Listar clientes              |
| GET    | `/clientes/:id`      | Detalhes de um cliente       |
| POST   | `/clientes`          | Criar cliente                |
| PUT    | `/clientes/:id`      | Atualizar cliente            |
| DELETE | `/clientes/:id`      | Deletar cliente              |
| GET    | `/contatos`          | Listar contatos              |
| POST   | `/contatos`          | Criar contato                |
| PUT    | `/contatos/:id`      | Atualizar contato            |
| DELETE | `/contatos/:id`      | Deletar contato              |

---

👨‍💻 Desenvolvedores
- Marlos
- João
- Henriqu
- Mirelly
- Samara
- Mariane

---
🤝 Colaboração

Agradecemos a todos os colaboradores que participaram do desenvolvimento, testes e melhorias deste projeto.
## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.
