<div align="center">

# 🚀 Master CRM Interface

### Interface moderna de CRM desenvolvida com React, TypeScript e TailwindCSS

<br>

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
<img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
<img src="https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white"/>

<br>
<br>

### 🔗 Deploy da Aplicação
👉 https://mastercrminterface.vercel.app/

</div>

---

# 📌 Sobre o Projeto

O **Master CRM Interface** é uma interface frontend moderna de um sistema CRM (*Customer Relationship Management*), desenvolvida com foco em experiência do usuário, responsividade e arquitetura escalável.

A aplicação permite o gerenciamento completo de:

- Clientes
- Contatos
- Usuários
- Oportunidades
- Feed de atividades

Além disso, o projeto conta com dashboard analítico, autenticação JWT, tema claro/escuro e componentes reutilizáveis construídos com tecnologias modernas do ecossistema React.

---

# ✨ Funcionalidades

## 📊 Dashboard Analítico
- Métricas animadas
- Cards estatísticos
- Gráficos interativos com Recharts
- Visualização de oportunidades e desempenho

## 👥 Gestão de Clientes
- CRUD completo
- Busca e filtros dinâmicos
- Marcação de oportunidades ⭐
- Visualização detalhada em modal

## 📞 Gestão de Contatos
- Cadastro de contatos
- Associação com clientes
- Organização de informações

## 👤 Gestão de Usuários
- Administração de usuários do sistema
- Cadastro e autenticação

## 🕒 Feed de Atividades
- Timeline cronológica
- Histórico de interações
- Sistema de busca

## 🔐 Autenticação JWT
- Login e cadastro
- Rotas protegidas
- Persistência de autenticação via `localStorage`
- Interceptor automático com Axios

## 🌗 Tema Claro/Escuro
- Alternância de tema
- Persistência no navegador

## 📱 Responsividade
- Sidebar mobile
- Layout adaptável
- Compatível com diferentes tamanhos de tela

## 🎨 Diferenciais Visuais
- Animação generativa em pointilhismo
- Skeleton loading
- Interface moderna e fluida
- Experiência visual dinâmica

---

# 🛠️ Stack Tecnológica

| Categoria | Tecnologia |
|---|---|
| Framework | React 19 |
| Linguagem | TypeScript |
| Build Tool | Vite |
| Estilização | Tailwind CSS 4 |
| Roteamento | React Router DOM 7 |
| Requisições HTTP | Axios |
| Gráficos | Recharts |
| Ícones | Lucide React |
| Notificações | React Hot Toast |
| Utilitários | clsx, tailwind-merge |
| Deploy | Vercel |

---

# 📂 Estrutura do Projeto

```bash
src/
├── api/
│   └── axios.ts
│
├── assets/
│
├── components/
│   ├── Avatar.tsx
│   ├── PointillismAnimation.tsx
│   ├── SidebarLogo.tsx
│   └── TableSkeleton.tsx
│
├── layouts/
│   └── CrmLayout.tsx
│
├── lib/
│   └── utils.ts
│
├── pages/
│   ├── Intro.tsx
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Clientes.tsx
│   ├── Contatos.tsx
│   ├── Usuarios.tsx
│   └── FeedAtividades.tsx
│
└── App.tsx
```

---

# 🚀 Como Executar o Projeto

## 📋 Pré-requisitos

Antes de começar, você precisará ter instalado:

- Node.js 18+
- npm ou yarn
- Backend/API rodando localmente

---

# ⚙️ Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/master-crm-interface.git

# Acesse a pasta do projeto
cd master-crm-interface

# Instale as dependências
npm install
```

---

# 🔑 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:4000
```

Caso a variável não seja definida, o projeto utilizará:

```env
http://localhost:4000
```

como URL padrão da API.

---

# ▶️ Executando a Aplicação

## Ambiente de Desenvolvimento

```bash
npm run dev
```

## Build de Produção

```bash
npm run build
```

## Preview do Build

```bash
npm run preview
```

## Executar Lint

```bash
npm run lint
```

---

# 🔐 Sistema de Autenticação

A aplicação utiliza autenticação via JWT.

O token é obtido através do endpoint:

```bash
/usuarios/logar
```

e armazenado no:

```bash
localStorage
```

O Axios injeta automaticamente:

```bash
Authorization: Bearer <token>
```

em todas as requisições autenticadas.

---

# 🌐 Rotas da Aplicação

| Rota | Tipo |
|---|---|
| `/` | Pública |
| `/login` | Pública |
| `/app/dashboard` | Protegida |
| `/app/clientes` | Protegida |
| `/app/contatos` | Protegida |
| `/app/usuarios` | Protegida |
| `/app/feed` | Protegida |

---

# 📡 Integração com API

A interface consome uma API REST.

## Principais Endpoints

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/usuarios/logar` | Login |
| POST | `/usuarios/cadastrar` | Cadastro de usuário |
| GET | `/usuarios/all` | Listar usuários |
| GET | `/clientes` | Listar clientes |
| GET | `/clientes/:id` | Detalhes de cliente |
| POST | `/clientes` | Criar cliente |
| PUT | `/clientes/:id` | Atualizar cliente |
| DELETE | `/clientes/:id` | Deletar cliente |
| GET | `/contatos` | Listar contatos |
| POST | `/contatos` | Criar contato |
| PUT | `/contatos/:id` | Atualizar contato |
| DELETE | `/contatos/:id` | Deletar contato |

---

# ☁️ Deploy

O projeto está hospedado na Vercel.

A configuração do `vercel.json` garante o funcionamento correto do roteamento SPA:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

# 🎯 Destaques do Projeto

✅ Interface moderna de CRM  
✅ Dashboard analítico  
✅ Autenticação JWT  
✅ Tema claro/escuro  
✅ Componentização  
✅ Responsividade completa  
✅ Arquitetura escalável  
✅ Animações e experiência fluida  
✅ Integração com API REST  
✅ Estrutura profissional de frontend  

---

# 👨‍💻 Desenvolvedores

- Marlos
- João
- Henriqu
- Mirelly
- Samara
- Mariana
- Javier

---

# 🤝 Colaboração

Projeto desenvolvido em equipe com foco em boas práticas de desenvolvimento frontend, componentização, responsividade e experiência do usuário.

---

# 📄 Licença

Este projeto está sob a licença MIT.

Consulte o arquivo `LICENSE` para mais informações.

---

<div align="center">

### ⭐ Se gostou do projeto, considere deixar uma estrela no repositório!

Desenvolvido com ❤️ utilizando React + TypeScript

</div>
