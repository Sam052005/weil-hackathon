"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Shield, ArrowRight } from "lucide-react";

const STEPS = ["Review", "Payment", "Confirmed"];

export default function CheckoutPage() {
    const [step, setStep] = useState(0);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 28, maxWidth: 680, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ marginBottom: 26 }}>
                <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-hi)", margin: 0 }}>Checkout</h1>
            </div>

            {/* Step indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 24 }}>
                {STEPS.map((s, i) => (
                    <React.Fragment key={s}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{
                                width: 26, height: 26, borderRadius: "50%", border: `2px solid ${i <= step ? "var(--blue)" : "var(--border)"}`,
                                background: i === step ? "rgba(59,130,246,0.15)" : i < step ? "rgba(59,130,246,0.1)" : "transparent",
                                color: i <= step ? "#60a5fa" : "var(--text-lo)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 11, fontWeight: 700, transition: "all 0.3s",
                            }}>
                                {i < step ? <CheckCircle size={12} /> : i + 1}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: i === step ? 600 : 400, color: i <= step ? "var(--text-hi)" : "var(--text-lo)", transition: "all 0.3s" }}>{s}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div style={{ flex: 1, height: 1, background: i < step ? "rgba(59,130,246,0.4)" : "var(--border)", margin: "0 12px", transition: "all 0.3s" }} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Card */}
            <div className="card" style={{ padding: 24, minHeight: 280 }}>
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div key="s0" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-hi)" }}>Order Summary</span>
                            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-hi)" }}>Sony WH-1000XM5</div>
                                    <div style={{ fontSize: 11, color: "#4ade80", marginTop: 3, fontWeight: 500 }}>Agent negotiated · −10%</div>
                                </div>
                                <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 15, color: "var(--text-hi)" }}>₹26,999</span>
                            </div>
                            <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "10px 0" }} onClick={() => setStep(1)}>
                                Continue to Payment <ArrowRight size={13} />
                            </button>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-hi)" }}>Escrow Settlement</span>
                            <div style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, padding: "20px 22px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Shield size={18} color="#60a5fa" />
                                </div>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-hi)" }}>Weilchain WUSD Escrow</div>
                                    <div style={{ fontSize: 12, color: "var(--text-mid)", marginTop: 3 }}>Funds held until delivery is verified</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--bg-elevated)", borderRadius: 8, border: "1px solid var(--border)" }}>
                                <span style={{ fontSize: 12, color: "var(--text-mid)" }}>Connected Wallet</span>
                                <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: "var(--text-hi)" }}>0x71C…4920</span>
                            </div>
                            <button className="btn-success" style={{ width: "100%", justifyContent: "center", padding: "10px 0" }} onClick={() => setStep(2)}>
                                Authorize Escrow Deposit
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="s2" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }} style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center", textAlign: "center", paddingTop: 12 }}>
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring", bounce: 0.5 }}
                                style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "2px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <CheckCircle size={24} color="#4ade80" />
                            </motion.div>
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-hi)" }}>Escrow Secured</div>
                                <div style={{ fontSize: 12, color: "var(--text-mid)", marginTop: 5, maxWidth: 420 }}>
                                    Funds are held in escrow. The Discovery agent is coordinating delivery with the supplier.
                                </div>
                            </div>
                            <div style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 8, padding: "12px 16px", fontFamily: "monospace", textAlign: "left", fontSize: 11, display: "flex", flexDirection: "column", gap: 6 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 6 }}>
                                    <span style={{ color: "var(--text-lo)", fontWeight: 600 }}>TX Hash</span>
                                    <span style={{ color: "#4ade80" }}>0x82f...a10b</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "var(--text-lo)", fontWeight: 600 }}>Audit Hash</span>
                                    <span style={{ color: "var(--text-mid)" }}>92fa...11ee</span>
                                </div>
                            </div>
                            <Link href="/audit" className="btn-ghost" style={{ padding: "8px 20px" }}>View Audit Trail</Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
