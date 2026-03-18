<div align="center">

# 🤖 Agente de Agendamento — Alavanca AI

**Agente de IA autônomo da Alavanca AI para agendamento inteligente via WhatsApp, focado na conversão e automação de clínicas.**

[![Bun](https://img.shields.io/badge/Runtime-Bun-black?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![LangGraph](https://img.shields.io/badge/Orquestração-LangGraph-1c1c1c?style=for-the-badge&logo=langchain&logoColor=white)](https://langchain-ai.github.io/langgraphjs/)
[![OpenAI](https://img.shields.io/badge/LLM-GPT--4o-412991?style=for-the-badge&logo=openai&logoColor=white)](https://platform.openai.com)
[![Google Calendar](https://img.shields.io/badge/Agenda-Google%20Calendar-4285F4?style=for-the-badge&logo=googlecalendar&logoColor=white)](https://developers.google.com/calendar)
[![Chatwoot](https://img.shields.io/badge/CRM-Chatwoot-1F93FF?style=for-the-badge&logo=chatwoot&logoColor=white)](https://www.chatwoot.com)
[![Docker](https://img.shields.io/badge/DB-PostgreSQL%20via%20Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

</div>

---

## ✨ Visão Geral

Sistema de atendimento inteligente baseado em **LangGraph** que gerencia agendamentos de clínicas diretamente pelo **WhatsApp**, via integração com **Chatwoot**. O agente conduz a conversa de forma autônoma: qualifica o lead, busca horários disponíveis no Google Calendar, cria o agendamento, envia lembretes automáticos e executa follow-ups pós-consulta — tudo sem intervenção humana.

```
Paciente (WhatsApp) → Chatwoot → Webhook → Agente LangGraph
  → Google Calendar (busca/cria eventos)
  → Kanban Chatwoot (atualiza funil)
  → ElevenLabs (resposta em áudio)
  → Follow-up automático (lembrete + pós-consulta)
```

---

## 🧰 Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Runtime** | [Bun](https://bun.sh) |
| **HTTP Server** | [ElysiaJS](https://elysiajs.com) |
| **Orquestração IA** | [LangGraph.js](https://langchain-ai.github.io/langgraphjs/) |
| **LLM** | OpenAI GPT-4o / GPT-4o-mini |
| **Transcrição de Áudio** | OpenAI Whisper |
| **TTS (Voz)** | ElevenLabs |
| **CRM / Mensageria** | Chatwoot (WhatsApp) |
| **Agenda** | Google Calendar API (Service Account) |
| **Banco de Dados** | PostgreSQL 16 (via Docker) |
| **Observabilidade** | Langfuse (opcional) |

---

## 📋 Pré-requisitos

- [Bun](https://bun.sh) >= 1.0
- [Docker](https://www.docker.com) (para PostgreSQL)
- Conta e credenciais nos seguintes serviços:
  - [OpenAI](https://platform.openai.com) — API Key
  - [Chatwoot](https://www.chatwoot.com) — URL + Token
  - [Google Cloud](https://console.cloud.google.com) — Service Account com acesso ao Calendar
  - [ElevenLabs](https://elevenlabs.io) — API Key + Voice ID

---

## 🚀 Como Rodar Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/Thuglife22741/agente-agendamento-clinica-langgraph.git
cd agente-agendamento-clinica-langgraph

# 2. Instale as dependências
bun install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais reais

# 4. Suba o PostgreSQL via Docker
docker compose up -d

# 5. Crie as tabelas no banco
bun run setup

# 6. Inicie o servidor em modo desenvolvimento
bun run dev
```

O servidor estará disponível em `http://localhost:3000`.

---

## ⚙️ Configuração de Variáveis de Ambiente

Copie `.env.example` para `.env` e preencha os valores. As principais variáveis são:

```bash
# Servidor
PORT=3000

# Banco de Dados (PostgreSQL)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=clinica
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/clinica

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
OPENAI_MODEL_MINI=gpt-4o-mini

# Chatwoot
CHATWOOT_BASE_URL=https://app.chatwoot.com
CHATWOOT_API_TOKEN=your-token
CHATWOOT_ACCOUNT_ID=1
CHATWOOT_ALERT_INBOX_ID=1
CHATWOOT_ALERT_CONVERSATION_ID=1

# Google Calendar (JSON da Service Account em uma única linha)
GOOGLE_CALENDAR_CREDENTIALS={"type":"service_account","project_id":"..."}

# Agenda por profissional (slug → Calendar ID)
PROFISSIONAIS_CALENDAR_IDS={"dra-ana-cristina":"xxxx@group.calendar.google.com"}

# ElevenLabs
ELEVENLABS_API_KEY=xi-...
ELEVENLABS_VOICE_ID=...

# Timing
DEBOUNCE_DELAY_MS=16000
LOCK_MAX_RETRIES=5
LOCK_RETRY_DELAY_MS=3000
```

> ⚠️ **Nunca** versione o arquivo `.env` — ele está no `.gitignore`.

---

## 🗂️ Estrutura do Projeto

```
src/
├── config/          # Configuração de profissionais e variáveis de ambiente
├── db/              # Pool PostgreSQL, fila de mensagens, lock, checkpointer
├── graphs/
│   ├── main-agent/  # Grafo principal de atendimento (16 nós)
│   └── follow-up/   # Grafo de follow-up e lembretes (7 nós)
├── lib/             # Logger, formatadores, utilidades
├── routes/          # Endpoints HTTP (Elysia)
├── services/        # Integrações: Chatwoot, Google Calendar, ElevenLabs, OpenAI
├── tools/           # Ferramentas do agente (9 ferramentas LangGraph)
├── types/           # Tipos TypeScript compartilhados
└── index.ts         # Entry point
```

---

## 🔄 Fluxo de Atendimento

```
Mensagem recebida
  → Debounce (16s) para agregar mensagens
  → Lock por conversa (evita race conditions)
  → Agente LangGraph:
      ├── Qualifica o lead (Kanban: Novo → Qualificado)
      ├── Coleta dados (nome, DN, procedimento, data)
      ├── Busca janelas disponíveis no Google Calendar
      ├── Cria o evento no calendário
      ├── Move Kanban → Agendado
      └── Responde via áudio (ElevenLabs) ou texto
  → Follow-up automático na véspera (lembrete)
  → Follow-up pós-consulta (24h após)
```

---

## 🛠️ Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `bun run dev` | Servidor com hot reload |
| `bun run start` | Servidor em produção |
| `bun run setup` | Cria tabelas no PostgreSQL |
| `bun run typecheck` | Verificação de tipos TypeScript |
| `bun test` | Executa todos os testes |

---

## 🌐 Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/webhook/chatwoot` | Entrada do agente principal |
| `POST` | `/webhook/followup` | Entrada do grafo de follow-up |
| `POST` | `/setup` | Criação das tabelas |

---

## 🏢 Sobre

Desenvolvido pela **[Alavanca AI](https://alavanca.ai)** — automação inteligente para clínicas e negócios.

---

<div align="center">
  <sub>Projeto privado · Todos os direitos reservados · Alavanca AI</sub>
</div>
