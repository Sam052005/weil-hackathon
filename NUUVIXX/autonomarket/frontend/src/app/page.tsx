"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Shield, Cpu, Bot, TrendingUp } from "lucide-react";

const stats = [
  { label: "Products Indexed", value: "14,200+", change: "+3.2%", up: true },
  { label: "Avg Negotiation", value: "–8.4%", change: "Savings", up: true },
  { label: "Active Agents", value: "6", change: "Running", up: true },
  { label: "Pending Approvals", value: "2", change: "Review", up: false },
];

const featured = [
  { id: 1, name: "Sony WH-1000XM5", category: "Audio", price: 29999, risk: "Low", score: 9.2 },
  { id: 2, name: "Apple MacBook Air M3", category: "Compute", price: 114900, risk: "High", score: 7.1 },
  { id: 3, name: "Keychron Q1 Pro", category: "Peripherals", price: 16500, risk: "Low", score: 9.6 },
];

const riskColor: Record<string, string> = {
  Low: "badge-green",
  Medium: "badge-amber",
  High: "badge-red",
  Critical: "badge-red",
};

export default function Home() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "28px", maxWidth: 1100, margin: "0 auto" }}>

      {/* Page title */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-hi)", margin: 0, letterSpacing: "-0.02em" }}>
          Agentic Commerce Dashboard
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-mid)", margin: "4px 0 0" }}>
          AI agents are actively discovering, negotiating, and routing your orders.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <motion.div
            key={i}
            className="card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{ padding: "16px 18px" }}
          >
            <div style={{ fontSize: 11, color: "var(--text-lo)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-hi)", letterSpacing: "-0.02em" }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: s.up ? "#4ade80" : "#fbbf24", marginTop: 4, fontWeight: 500 }}>
              {s.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Featured products table */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ marginBottom: 24 }}
      >
        {/* Table header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: "1px solid var(--border)",
        }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-hi)" }}>Featured Intelligence</span>
            <span style={{ fontSize: 11, color: "var(--text-lo)", marginLeft: 8 }}>Agent-curated picks</span>
          </div>
          <Link href="/products" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#60a5fa", textDecoration: "none", fontWeight: 500 }}>
            View catalog <ArrowRight size={12} />
          </Link>
        </div>

        {/* Column headings */}
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 100px",
          padding: "8px 20px",
          borderBottom: "1px solid var(--border)",
          fontSize: 11, fontWeight: 600, color: "var(--text-lo)", textTransform: "uppercase", letterSpacing: "0.07em",
        }}>
          <span>Product</span>
          <span>Category</span>
          <span>Price</span>
          <span>Risk</span>
          <span style={{ textAlign: "right" }}>Agent Score</span>
        </div>

        {featured.map((p, i) => (
          <motion.div
            key={p.id}
            className="table-row"
            style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 100px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 + i * 0.08 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 6, background: "var(--bg-elevated)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={13} color="#60a5fa" />
              </div>
              <Link href={`/products/${p.id}`} style={{ textDecoration: "none", color: "var(--text-hi)", fontWeight: 500, fontSize: 13 }}>
                {p.name}
              </Link>
            </div>
            <span style={{ color: "var(--text-mid)", fontSize: 13 }}>{p.category}</span>
            <span style={{ color: "var(--text-hi)", fontWeight: 600, fontFamily: "monospace", fontSize: 13 }}>₹{p.price.toLocaleString("en-IN")}</span>
            <span><span className={riskColor[p.risk]}>{p.risk} Risk</span></span>
            <div style={{ textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
              <span className="agent-badge"><Bot size={9} /> {p.score}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Feature highlights */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {[
          { icon: Zap, title: "Agentic Discovery", desc: "LLM-driven semantic matching across global catalogs in real-time.", color: "#3b82f6" },
          { icon: Shield, title: "Smart Escrow", desc: "Funds held in WUSD until delivery is cryptographically verified.", color: "#22c55e" },
          { icon: Cpu, title: "Human Governance", desc: "Cerebrum HITL ensures zero runaway autonomous spending.", color: "#a855f7" },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 + i * 0.08 }}
            style={{ padding: "18px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}
          >
            <div style={{ width: 32, height: 32, borderRadius: 7, background: `${item.color}18`, border: `1px solid ${item.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <item.icon size={15} color={item.color} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-hi)", marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "var(--text-mid)", lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>

    </motion.div>
  );
}
