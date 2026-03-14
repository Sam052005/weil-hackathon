"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Zap, Filter, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";

const CATEGORIES = ["All", "Audio", "Compute", "Peripherals", "Display"];
const riskBadge: Record<string, string> = { Low: "badge-green", Medium: "badge-amber", High: "badge-red" };

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [active, setActive] = useState("All");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/v1/products/");
                setProducts(res.data.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    category: p.name.includes('Headphone') ? 'Audio' : p.name.includes('MacBook') ? 'Compute' : 'Peripherals',
                    price: p.price,
                    score: 9.0 + (p.id % 10) / 10, // Mock score for demo
                    risk: "Low",
                    negotiated: true
                })));
            } catch (e) {
                console.error("Failed to fetch products:", e);
            }
        };
        fetchProducts();
    }, []);

    const filtered = active === "All" ? products : products.filter(p => p.category === active);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 28, maxWidth: 1100, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                <div>
                    <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-hi)", margin: 0, letterSpacing: "-0.02em" }}>
                        AI-Curated Catalog
                    </h1>
                    <p style={{ fontSize: 12, color: "var(--text-mid)", margin: "4px 0 0" }}>
                        {products.length} products · Negotiation protocol active
                    </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-ghost" style={{ fontSize: 12 }}><Filter size={13} /> Filter</button>
                </div>
            </div>

            {/* Pills */}
            <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
                {CATEGORIES.map(c => (
                    <button
                        key={c}
                        className={`pill${active === c ? " active" : ""}`}
                        onClick={() => setActive(c)}
                    >
                        {c === "All" && <span className="dot-green" />}
                        {c}
                    </button>
                ))}
            </div>

            {/* Table card */}
            <motion.div className="card" layout>
                {/* Column headings */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0,2fr) 110px 110px 90px 80px 60px",
                    padding: "8px 20px",
                    borderBottom: "1px solid var(--border)",
                    fontSize: 11, fontWeight: 600, color: "var(--text-lo)",
                    textTransform: "uppercase", letterSpacing: "0.07em",
                }}>
                    <span>Product</span>
                    <span>Category</span>
                    <span>Price</span>
                    <span>Risk</span>
                    <span>Score</span>
                    <span style={{ textAlign: "right" }}></span>
                </div>

                {filtered.map((p, i) => (
                    <motion.div
                        key={p.id}
                        className="table-row"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "minmax(0,2fr) 110px 110px 90px 80px 60px",
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                    >
                        {/* Name + badge */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--bg-elevated)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Zap size={12} color="#60a5fa" />
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <Link href={`/products/${p.id}`} style={{ textDecoration: "none", color: "var(--text-hi)", fontWeight: 500, fontSize: 13, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {p.name}
                                </Link>
                                {p.negotiated && (
                                    <span className="agent-badge" style={{ marginTop: 2, display: "inline-flex" }}>
                                        <Bot size={8} /> Agent Negotiated
                                    </span>
                                )}
                            </div>
                        </div>

                        <span style={{ color: "var(--text-mid)", fontSize: 12, alignSelf: "center" }}>{p.category}</span>
                        <span style={{ color: "var(--text-hi)", fontWeight: 600, fontFamily: "monospace", fontSize: 13, alignSelf: "center" }}>₹{p.price.toLocaleString("en-IN")}</span>
                        <span style={{ alignSelf: "center" }}><span className={riskBadge[p.risk]}>{p.risk}</span></span>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, alignSelf: "center" }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: p.score >= 9 ? "#4ade80" : p.score >= 8 ? "#fbbf24" : "var(--text-mid)" }}>
                                {p.score}
                            </span>
                            <span style={{ fontSize: 10, color: "var(--text-lo)" }}>/10</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", alignSelf: "center" }}>
                            <Link href={`/products/${p.id}`} className="btn-ghost" style={{ padding: "4px 10px", fontSize: 12 }}>
                                <ArrowUpRight size={12} />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}
