<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/LangGraph-Latest-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Gemini_1.5_Flash-AI-4285F4?style=for-the-badge&logo=google" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql" />
</p>

<h1 align="center">🤖 AutonoMarket</h1>
<h3 align="center">The Agentic Commerce Platform with Human Governance</h3>

<p align="center">
  <em>"Where agents work for you, but you're always in control."</em>
</p>

---

## 📖 Overview

**AutonoMarket** is an AI-powered e-commerce platform where a multi-agent system autonomously discovers products, negotiates prices, routes transactions, and generates recommendations — all governed by a **human-in-the-loop (HITL) oversight system** called **Cerebrum**.

Built with **LangGraph**, **Google Gemini 1.5 Flash**, **FastAPI**, and **Next.js 16**, AutonoMarket demonstrates how autonomous AI agents can be deployed responsibly in financial contexts with configurable guardrails and cryptographic audit trails.

### What Makes This Different?

| Feature | Traditional E-Commerce | AutonoMarket |
|---|---|---|
| Product Discovery | Keyword search | 🤖 LLM-powered semantic matching |
| Pricing | Fixed prices | 💰 Autonomous AI negotiation (2–12% savings) |
| Trust | No audit trail | 🔐 Cryptographic SHA-256 + Merkle root anchoring |
| AI Safety | N/A | 🛡️ Cerebrum HITL governance with configurable thresholds |

---

## ✨ Key Features

- **🔍 AI Discovery Agent** — Gemini-powered semantic product matching
- **💸 Negotiation Agent** — Autonomous price bargaining with suppliers
- **🚦 Smart Routing** — Configurable thresholds for auto-approval vs. human escalation
- **🛡️ Cerebrum Governance** — LangGraph `interrupt_before` pauses workflow for human approval
- **📊 Agent Nexus Panel** — Real-time cinematic view of agent reasoning
- **🔗 Audit Chain** — SHA-256 signed actions with Merkle root blockchain anchoring
- **💎 Escrow Settlement** — WUSD stablecoin escrow for secure transactions
- **⚡ WebSocket Notifications** — Real-time updates via native WebSocket
- **🎨 Premium UI** — Glassmorphism, Framer Motion animations, dark theme

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 16)                 │
│  Landing • Products • Product Detail • Approvals        │
│  Cart • Checkout • Audit Trail                          │
│  [React 19 · Tailwind CSS 4 · Framer Motion · Axios]   │
└────────────────────────┬────────────────────────────────┘
                         │ REST API + WebSocket
┌────────────────────────┴────────────────────────────────┐
│                    BACKEND (FastAPI)                     │
│  ┌────────────────────────────────────────────────┐     │
│  │         LangGraph Orchestrator (StateGraph)    │     │
│  │  START → Discovery → Negotiation → Routing     │     │
│  │       → Recommendation → [Conditional Edge]    │     │
│  │       → Cerebrum Gate (HITL) / Auto-Execute    │     │
│  │       → END                                    │     │
│  └────────────────────────────────────────────────┘     │
│  Auth (JWT) · Audit (SHA-256) · Escrow · Reputation     │
│  WebSocket Manager · Services Layer                     │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────┐
│                    INFRASTRUCTURE                        │
│  PostgreSQL 15 · Redis 7 · Google Gemini 1.5 Flash      │
│  (All via Docker Compose)                                │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 18+** (with npm)
- **Docker Desktop** (for PostgreSQL and Redis)
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/apikey))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/autonomarket.git
cd autonomarket
```

### 2. Start Infrastructure (Docker)

```bash
docker-compose up -d
```

This starts:
- **PostgreSQL 15** on port `5432`
- **Redis 7** on port `6379`

### 3. Configure Environment Variables

```bash
copy .env.example .env
```

Edit `.env` and add your API key:

```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost/autonomarket
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=yoursecretkeyhere
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
GOOGLE_API_KEY=your_gemini_api_key_here
```

### 4. Start the Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will be live at **http://localhost:8000**.  
Swagger docs at **http://localhost:8000/api/v1/openapi.json**.

### 5. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be live at **http://localhost:3000**.

---

## 🎮 Usage

### The Agentic Shopping Flow

1. **Browse** → Visit `/products` to see the AI-curated catalog
2. **Select** → Click on a product to view details
3. **Deploy Agents** → Click **"Initialize Agent Execution"** to start the AI pipeline
4. **Watch** → The Agent Nexus panel shows real-time agent reasoning:
   - 🔵 **Discovery** identifies the best product match
   - 🟢 **Negotiation** bargains for a better price
   - 🟡 **Routing** checks approval thresholds
   - 🔴 **Cerebrum** escalates high-value decisions
5. **Govern** → If escalated, visit `/approvals` to approve or reject
6. **Settle** → Complete checkout with WUSD escrow
7. **Verify** → View the complete audit trail at `/audit`

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/login` | JWT authentication |
| `GET` | `/api/v1/products/` | List product catalog |
| `POST` | `/api/v1/agent/query` | Execute agent pipeline |
| `GET` | `/api/v1/orders/` | List user orders |
| `GET` | `/api/v1/approvals/` | List pending approvals |
| `POST` | `/api/v1/approvals/{id}/action` | Approve/reject transaction |
| `WS` | `/ws` | WebSocket for real-time notifications |

---

## 📁 Project Structure

```
autonomarket/
├── backend/
│   ├── app/
│   │   ├── agents/            # LangGraph multi-agent system
│   │   │   ├── orchestrator.py    # StateGraph workflow definition
│   │   │   ├── discovery.py       # Gemini-powered product matching
│   │   │   ├── negotiation.py     # AI price bargaining
│   │   │   ├── routing.py         # Threshold-based approval routing
│   │   │   ├── recommendation.py  # Cross-sell engine
│   │   │   └── state.py           # Agent state schema
│   │   ├── api/routes/        # REST API endpoints
│   │   ├── audit/             # SHA-256 logging + Merkle root
│   │   ├── cerebrum/          # HITL gateway + WebSocket manager
│   │   ├── core/              # Config, database, security
│   │   ├── models/            # SQLAlchemy ORM models
│   │   ├── services/          # Business logic layer
│   │   └── main.py            # FastAPI application entry
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Landing page (hero + featured)
│   │   │   ├── (shop)/            # Products, cart, checkout pages
│   │   │   └── (dashboard)/       # Approvals, audit trail pages
│   │   └── components/
│   │       ├── shop/              # ProductCard, SearchBar
│   │       └── ui/                # Header
│   └── package.json
├── docker-compose.yml
└── .env.example
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 · React 19 · Tailwind CSS 4 · Framer Motion · Axios |
| Backend | FastAPI · LangGraph · LangChain · Google Gemini 1.5 Flash |
| Database | PostgreSQL 15 · Redis 7 · SQLAlchemy (Async) |
| Security | JWT (python-jose) · bcrypt (passlib) · SHA-256 Audit |
| Infrastructure | Docker Compose · WebSocket |

---

## 👥 Contributors

| Name | Role | Responsibilities |
|---|---|---|
| [Member 1] | Full-Stack Lead | Backend architecture, LangGraph orchestrator, API design |
| [Member 2] | Frontend Engineer | Next.js UI, Agent Nexus panel, animations |
| [Member 3] | AI/ML Engineer | Gemini integration, prompt engineering, agent design |
| [Member 4] | DevOps / Blockchain | Docker setup, audit chain, escrow mock, deployment |

---

## 🙏 Acknowledgments

- **[IIT Mandi](https://iitmandi.ac.in/)** — For hosting Mandi Hacks
- **[Google Gemini](https://ai.google.dev/)** — Gemini 1.5 Flash powering Discovery and Negotiation agents
- **[LangGraph](https://github.com/langchain-ai/langgraph)** — Multi-agent orchestration framework
- **[LangChain](https://github.com/langchain-ai/langchain)** — LLM application framework
- **[Vercel / Next.js](https://nextjs.org/)** — Frontend framework
- **[FastAPI](https://fastapi.tiangolo.com/)** — Backend framework

---

## 📄 License

This project was built for **Mandi Hacks 2026**. All rights reserved by the team.

---

<p align="center">
  <strong>AutonoMarket — Commerce 3.0</strong><br/>
  <em>Where agents work for you, but you're always in control.</em>
</p>
