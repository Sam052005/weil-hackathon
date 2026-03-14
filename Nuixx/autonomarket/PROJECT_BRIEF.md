# AutonoMarket: Agentic Commerce Platform

## Project Overview
AutonoMarket is a next-generation "Agentic Commerce" platform built to automate and optimize the procurement process. By leveraging Large Language Models (LLMs) and intelligent agent workflows, AutonoMarket acts as an autonomous intermediary between buyers and suppliers, handling everything from product discovery to price negotiation and risk assessment.

The project demonstrates a seamless integration between a modern, highly-responsive Next.js frontend and a robust FastAPI backend, utilizing specialized AI agents powered by LangGraph and Google's Gemini models.

---

## Architecture Stack

### Backend
- **Framework:** FastAPI (Python 3.12+)
- **Database:** SQLite (with `aiosqlite` for asynchronous operations) and SQLAlchemy ORM
- **Agent Orchestration:** LangGraph & LangChain
- **LLM Provider:** Google GenAI (Gemini 2.0 Flash Lite)
- **Authentication:** OAuth2 with JWT (JSON Web Tokens) and bcrypt password hashing
- **Testing:** Pytest with `pytest-asyncio`

### Frontend
- **Framework:** Next.js 16 (React 19)
- **Styling:** TailwindCSS 4 with Framer Motion for premium micro-animations and glassmorphism UI
- **Icons:** Lucide-React
- **Network Requests:** Axios

---

## Core Agent Architecture (The "Agent Nexus")

AutonoMarket utilizes a multi-agent system orchestrated through a state graph. When a user submits a query (e.g., "wireless headphones"), the request flows through the following intelligent nodes:

1. **Discovery Agent (`discovery.py`)**
   - **Role:** Understands user intent and semantically matches queries against the local product database.
   - **Capability:** Evaluates the catalog and selects the most relevant product, returning the product ID and its reasoning. Has a fallback keyword-simulation mode if the LLM is unavailable.

2. **Negotiation Agent (`negotiation.py`)**
   - **Role:** Acts as an autonomous buyer attempting to secure the best price from the supplier.
   - **Capability:** Engages in simulated bargaining based on volume and market trends to secure a realistic discount (2% to 12% off the original price).

3. **Routing Agent (`routing.py`)**
   - **Role:** The risk and compliance manager.
   - **Capability:** Evaluates the final negotiated price value. If the order exceeds a predefined risk threshold (e.g., ₹5,000), it routes the order to human governance (HITL - Human In The Loop) rather than auto-executing.

4. **Recommendation Engine (`recommendation.py`)**
   - **Role:** Identifies cross-sell and up-sell opportunities based on the selected product.

---

## Key Features

- **Agentic Dashboard:** Real-time metrics showing products indexed, average agent negotiation savings, and active agent instances.
- **Smart Escrow & Auditing:** The system maintains an immutable cryptographic trail of all agent decisions (`/audit`). Every step of the agent's plan and trace (Discovery -> Negotiation -> Routing) is logged with a SHA signature.
- **Human Governance (HITL):** A dedicated Approvals dashboard (`/approvals`) allows managers to review and authorize or reject high-risk, agent-negotiated transactions.
- **Resilient Fallbacks:** The backend gracefully falls back to algorithmic simulations if the LLM provider rate-limits or an API key is missing, ensuring the application remains functional for demonstrations.
- **Premium UI:** A stunning, dark-mode-first interface using deep gradients, frosted glass effects (glassmorphism), and fluid `framer-motion` page transitions.

---

## Testing Strategy

The backend includes a comprehensive, asynchronous test suite designed to run in complete isolation:
- **Shared In-Memory SQLite (`conftest.py`):** A custom fixture spins up a shared test database and seeds it with demo users, suppliers, and products.
- **FastAPI Dependency Overrides:** The testing environment overrides the production `get_db` generator, pointing all route handlers to the in-memory test engine.
- **Mocked Agents:** LLM calls are mocked in the test suite using `unittest.mock`, allowing the pipeline to be tested deterministically for routing logic, discovery simulations, and negotiation simulations without requiring live API keys or incurring costs.

---

## Getting Started

### 1. Start the Backend
```bash
cd backend
source venv/Scripts/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*API Docs available at: http://localhost:8000/docs*

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
*Web App available at: http://localhost:3000*
