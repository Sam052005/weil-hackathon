"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import axios from "axios";

const riskBadge: Record<string, string> = { Low: "badge-green", Medium: "badge-amber", High: "badge-red", Critical: "badge-red" };

export default function ApprovalsPage() {
    const [approvals, setApprovals] = useState<any[]>([]);

    const fetchApprovals = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/v1/approvals/");
            setApprovals(res.data.map((a: any) => ({
                id: a.id,
                order_id: a.order_id,
                product_name: a.product_name,
                supplier_id: a.supplier_id || "Unknown",
                amount: a.amount,
                status: a.status,
                risk_score: "High", // simplified for demo
                reason: "Value threshold exceeded via LangGraph routing."
            })));
        } catch (e) {
            console.error("Failed to fetch approvals:", e);
        }
    };

    useEffect(() => {
        fetchApprovals();
        const interval = setInterval(fetchApprovals, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleAction = async (id: number, actionType: 'approve' | 'reject') => {
        try {
            await axios.post(`http://localhost:8000/api/v1/approvals/${id}/action`, {
                action: actionType,
                reason: "Human reviewed"
            });
            fetchApprovals();
        } catch (e) {
            console.error("Failed to submit action", e);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 28, maxWidth: 1000, margin: "0 auto" }}>
            {/* Page header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                <div>
                    <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-hi)", margin: 0, letterSpacing: "-0.02em" }}>
                        Governance Dashboard
                    </h1>
                    <p style={{ fontSize: 12, color: "var(--text-mid)", margin: "4px 0 0" }}>
                        Review and authorize agent-negotiated transactions.
                    </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 600, color: "#4ade80", padding: "5px 12px", borderRadius: 6, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.18)" }}>
                    <span className="dot-green" />
                    Live Feed Active
                </div>
            </div>

            {/* Table */}
            <div className="card">
                {/* Column headers */}
                <div style={{
                    display: "grid", gridTemplateColumns: "minmax(0,2fr) 120px 130px 100px 180px",
                    padding: "8px 20px", borderBottom: "1px solid var(--border)",
                    fontSize: 11, fontWeight: 600, color: "var(--text-lo)", textTransform: "uppercase", letterSpacing: "0.07em",
                }}>
                    <span>Order / Product</span>
                    <span>Supplier</span>
                    <span>Amount</span>
                    <span>Risk</span>
                    <span style={{ textAlign: "right" }}>Actions</span>
                </div>

                {approvals.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ padding: "48px 20px", textAlign: "center", color: "var(--text-lo)" }}
                    >
                        <CheckCircle size={28} style={{ margin: "0 auto 10px", color: "#4ade80" }} />
                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-mid)" }}>All caught up — no pending approvals.</div>
                    </motion.div>
                ) : (
                    <AnimatePresence>
                        {approvals.map((a, i) => (
                            <motion.div
                                key={a.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -30, transition: { duration: 0.25 } }}
                                transition={{ delay: i * 0.08 }}
                            >
                                {/* Main row */}
                                <div className="table-row" style={{
                                    display: "grid",
                                    gridTemplateColumns: "minmax(0,2fr) 120px 130px 100px 180px",
                                    alignItems: "start",
                                }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                        <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text-hi)" }}>{a.product_name}</span>
                                        <span style={{ fontSize: 11, color: "var(--text-lo)" }}>Order #{a.order_id}</span>
                                    </div>
                                    <span style={{ fontSize: 12, color: "var(--text-mid)", paddingTop: 2 }}>#{a.supplier_id}</span>
                                    <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 14, color: "var(--text-hi)", paddingTop: 2 }}>
                                        ₹{a.amount.toLocaleString("en-IN")}
                                    </span>
                                    <span style={{ paddingTop: 3 }}>
                                        <span className={riskBadge[a.risk_score]}>{a.risk_score}</span>
                                    </span>
                                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                                        <button className="btn-success" onClick={() => handleAction(a.id, 'approve')}>
                                            <CheckCircle size={12} /> Approve
                                        </button>
                                        <button className="btn-danger" onClick={() => handleAction(a.id, 'reject')}>
                                            Reject
                                        </button>
                                    </div>
                                </div>

                                {/* Rationale sub-row */}
                                <div style={{
                                    padding: "10px 20px 14px 58px",
                                    borderBottom: "1px solid var(--border)",
                                    display: "flex", alignItems: "flex-start", gap: 8,
                                }}>
                                    <AlertTriangle size={12} color="#fbbf24" style={{ marginTop: 2, flexShrink: 0 }} />
                                    <span style={{ fontSize: 12, color: "var(--text-mid)", lineHeight: 1.5 }}>
                                        <strong style={{ color: "var(--text-lo)", fontWeight: 600 }}>Auto-Pause Rationale: </strong>
                                        {a.reason}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </motion.div>
    );
}
