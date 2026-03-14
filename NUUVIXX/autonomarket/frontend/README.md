# AutonoMarket — Frontend

The frontend for AutonoMarket, built with **Next.js 16** (App Router), **React 19**, **Tailwind CSS 4**, and **Framer Motion**.

## Stack

| Tech | Purpose |
|---|---|
| Next.js 16 | App Router, SSR, routing |
| React 19 | UI components |
| Tailwind CSS 4 | Styling |
| Framer Motion | Animations |
| Axios | API requests |
| Lucide React | Icons |

## Pages

| Route | Description |
|---|---|
| `/` | Landing page with hero and featured products |
| `/products` | AI-curated product catalog |
| `/products/[id]` | Product detail with Agent Nexus panel |
| `/approvals` | Governance dashboard for HITL approvals |
| `/audit` | Cryptographic audit trail |
| `/cart` | Shopping cart with negotiated prices |
| `/checkout` | 3-step WUSD escrow checkout |

## Running Locally

```bash
npm install
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000). Requires the backend to be running at `http://localhost:8000`.

## Environment

No `.env` file needed for the frontend. The backend URL is hardcoded to `http://localhost:8000` for local development. Update `src/app/(shop)/products/[id]/page.tsx` to change it.
