"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, Trash2, ArrowRight } from "lucide-react";

const MOCK_CART = [
    { id: 1, name: "Sony WH-1000XM5 Wireless Headphones", category: "Audio", price: 29999, quantity: 1, agent_status: "Negotiated (−10%)" },
];

export default function CartPage() {
    const subtotal = MOCK_CART.reduce((a, i) => a + i.price, 0);
    const savings = subtotal * 0.1;
    const total = subtotal - savings;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 28, maxWidth: 900, margin: "0 auto" }}>
            <div style={{ marginBottom: 22 }}>
                <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-hi)", margin: 0, letterSpacing: "-0.02em" }}>Shopping Cart</h1>
                <p style={{ fontSize: 12, color: "var(--text-mid)", margin: "4px 0 0" }}>{MOCK_CART.length} item{MOCK_CART.length !== 1 ? "s" : ""} · Escrow-ready</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, alignItems: "start" }}>
                {/* Items */}
                <div className="card">
                    <div style={{ padding: "8px 20px", borderBottom: "1px solid var(--border)", fontSize: 11, fontWeight: 600, color: "var(--text-lo)", textTransform: "uppercase", letterSpacing: "0.07em", display: "grid", gridTemplateColumns: "minmax(0,1fr) 80px 80px 40px" }}>
                        <span>Product</span><span>Price</span><span>Qty</span><span></span>
                    </div>
                    {MOCK_CART.map((item, i) => (
                        <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                            className="table-row" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 80px 80px 40px", gap: 12 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                                <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text-hi)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
                                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                    <span style={{ fontSize: 11, color: "var(--text-lo)" }}>{item.category}</span>
                                    <span className="agent-badge" style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                                        <Bot size={8} /> {item.agent_status}
                                    </span>
                                </div>
                            </div>
                            <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 13, color: "var(--text-hi)", alignSelf: "center" }}>₹{item.price.toLocaleString("en-IN")}</span>
                            <span style={{ fontSize: 13, color: "var(--text-mid)", alignSelf: "center" }}>×{item.quantity}</span>
                            <button className="btn-ghost" style={{ padding: "4px 8px", alignSelf: "center" }}><Trash2 size={12} /></button>
                        </motion.div>
                    ))}
                </div>

                {/* Summary */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-hi)" }}>Order Summary</span>
                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 9 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-mid)" }}>
                            <span>Subtotal</span>
                            <span style={{ fontFamily: "monospace", color: "var(--text-hi)" }}>₹{subtotal.toLocaleString("en-IN")}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#4ade80" }}>
                                <span className="dot-green" /> Agent Savings
                            </span>
                            <span style={{ fontFamily: "monospace", color: "#4ade80" }}>−₹{savings.toLocaleString("en-IN")}</span>
                        </div>
                        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-mid)" }}>Total</span>
                            <span style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: "var(--text-hi)" }}>₹{total.toLocaleString("en-IN")}</span>
                        </div>
                    </div>
                    <Link href="/checkout" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "10px 0" }}>
                        Checkout <ArrowRight size={13} />
                    </Link>
                    <p style={{ fontSize: 10, textAlign: "center", color: "var(--text-lo)", margin: 0 }}>Settled via Weilchain WUSD Stablecoin</p>
                </motion.div>
            </div>
        </motion.div>
    );
}
