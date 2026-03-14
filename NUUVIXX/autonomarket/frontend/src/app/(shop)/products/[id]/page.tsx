"use client";
import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bot,
    Cpu,
    ShieldCheck,
    TrendingDown,
    Truck,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Info,
    Sparkles
} from "lucide-react";
import axios from "axios";

// Mock products (same as backend for demo)
const MOCK_PRODUCTS = [
    { id: 1, name: "Sony WH-1000XM5 Wireless Headphones", price: 29999, description: "Industry leading noise canceling headphones. Two processors control 8 microphones for unprecedented noise cancellation.", stock: 42, supplier: "Electronics Hub" },
    { id: 2, name: "Apple MacBook Air M3", price: 114900, description: "Supercharged by M3, the MacBook Air is light and powerful. Perfect for portable performance.", stock: 15, supplier: "Tech Haven" },
    { id: 3, name: "Keychron Q1 Pro Mechanical Keyboard", price: 16500, description: "A fully customizable 75% layout custom mechanical keyboard featuring QMK/VIA support.", stock: 8, supplier: "Keeb Warehouse" }
];

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [messages, setMessages] = useState<{ agent: string, text: string, type: 'info' | 'success' | 'warning' | 'critical' }[]>([]);
    const [isActive, setIsActive] = useState(false);
    const [finalPrice, setFinalPrice] = useState<number | null>(null);
    const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'done'>('idle');
    const endRef = useRef<HTMLDivElement>(null);

    const product = MOCK_PRODUCTS.find(p => p.id === Number(params.id)) || MOCK_PRODUCTS[0];

    const startAgentWorkflow = async () => {
        setIsActive(true);
        setStatus('running');
        setMessages([]);

        try {
            // Direct call to our backend (ensure uvicorn is running)
            const response = await axios.post("http://localhost:8000/api/v1/agent/query", {
                query: `Purchase ${product.name}`,
                thread_id: `demo-${Date.now()}`
            });

            const data = response.data;

            // Process reasoning logs from Gemini
            for (const log of data.reasoning) {
                let type: any = 'info';
                let agentName = "System";

                if (log.includes("[Discovery]")) { agentName = "Discovery"; type = "info"; }
                else if (log.includes("[Negotiation]")) { agentName = "Negotiation"; type = "success"; }
                else if (log.includes("[Routing]")) { agentName = "Routing"; type = "warning"; }

                setMessages(prev => [...prev, {
                    agent: agentName,
                    text: log.replace(/\[.*?\]\s*/, ""),
                    type
                }]);

                await new Promise(r => setTimeout(r, 1200)); // Cinematic delay
            }

            setFinalPrice(data.final_price);

            if (data.is_waiting_for_approval) {
                setStatus('paused');
                setMessages(prev => [...prev, {
                    agent: "Cerebrum",
                    text: "Decision escalated to human governance due to value threshold.",
                    type: "critical"
                }]);
            } else {
                setStatus('done');
            }

        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, {
                agent: "Error",
                text: "Could not connect to Agent nexus. Is the backend server running?",
                type: "critical"
            }]);
            setStatus('idle');
            setIsActive(false);
        }
    };

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 w-full flex-1">
            {/* Product Information - 7 Columns */}
            <div className="lg:col-span-7 space-y-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group h-[450px] rounded-3xl overflow-hidden glass border-white/5 flex items-center justify-center p-12"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-emerald-500/10" />
                    <div className="absolute inset-0 pattern-grid-lg text-white/[0.03]" />

                    <motion.div
                        animate={{
                            scale: [1, 1.02, 1],
                            rotate: [0, 1, 0, -1, 0]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        className="z-10 w-64 h-64 bg-slate-800/40 rounded-full flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-xl"
                    >
                        <Bot size={80} className="text-blue-400 opacity-80" />
                    </motion.div>

                    <div className="absolute bottom-6 left-6 right-6 flex gap-4">
                        <div className="flex-1 glass p-4 rounded-2xl flex items-center gap-4">
                            <ShieldCheck className="text-emerald-400" />
                            <div className="text-xs">
                                <p className="font-bold">Verified Origin</p>
                                <p className="text-gray-500">Authorized {product.supplier}</p>
                            </div>
                        </div>
                        <div className="flex-1 glass p-4 rounded-2xl flex items-center gap-4">
                            <TrendingDown className="text-blue-400" />
                            <div className="text-xs">
                                <p className="font-bold">Auto-Negotiation</p>
                                <p className="text-gray-500">Live Bargaining Enabled</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <div className="space-y-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                                <Sparkles size={14} /> New Arrival
                            </span>
                            <h1 className="text-5xl font-black text-white glow-text">{product.name}</h1>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 line-through">₹{(product.price * 1.05).toLocaleString()}</p>
                            <div className="text-4xl font-black text-white">₹{product.price.toLocaleString()}</div>
                        </div>
                    </div>

                    <p className="text-xl text-gray-400 leading-relaxed font-medium">
                        {product.description}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4 text-xs font-bold uppercase tracking-widest">
                        <div className="px-6 py-3 rounded-full glass border-white/5 text-gray-400 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" /> {product.stock} In Stock
                        </div>
                        <div className="px-6 py-3 rounded-full glass border-white/5 text-gray-400 flex items-center gap-2">
                            <Truck size={14} /> Global Shipping
                        </div>
                    </div>
                </div>
            </div>

            {/* Agent Orchestrator Panel - 5 Columns */}
            <div className="lg:col-span-5 flex flex-col h-[700px] rounded-[32px] glass border-white/5 shadow-3xl relative overflow-hidden flex-grow self-start">
                <div className="p-8 border-b border-white/5 flex items-center justify-between z-10 bg-slate-900/40 backdrop-blur-3xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center">
                            <Cpu size={24} className={isActive ? "text-blue-400 animate-pulse" : "text-gray-600"} />
                        </div>
                        <div>
                            <span className="font-black text-lg text-white block">Agent Nexus v2</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                Reasoning Model: Gemini 1.5 Flash
                            </span>
                        </div>
                    </div>

                    <div className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                </div>

                <div className="flex-1 p-8 overflow-y-auto space-y-6 z-10">
                    <AnimatePresence mode="popLayout">
                        {messages.length === 0 && !isActive ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center space-y-6"
                            >
                                <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center">
                                    <Bot size={40} className="text-slate-600" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Nexus Standby</h4>
                                    <p className="text-gray-500 text-sm max-w-[200px]">Authorize agents to start product discovery and discovery.</p>
                                </div>
                            </motion.div>
                        ) : (
                            messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    className={`flex gap-4 group p-4 rounded-2xl border ${msg.type === 'info' ? 'bg-blue-500/5 border-blue-500/10 text-blue-100' :
                                            msg.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-100' :
                                                msg.type === 'warning' ? 'bg-amber-500/5 border-amber-500/10 text-amber-100' :
                                                    'bg-red-500/5 border-red-500/10 text-red-100'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border ${msg.type === 'info' ? 'bg-blue-500/20 border-blue-500/20 text-blue-400' :
                                            msg.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/20 text-emerald-400' :
                                                msg.type === 'warning' ? 'bg-amber-500/20 border-amber-500/20 text-amber-400' :
                                                    'bg-red-500/20 border-red-500/20 text-red-400'
                                        }`}>
                                        {msg.type === 'info' && <Bot size={16} />}
                                        {msg.type === 'success' && <TrendingDown size={16} />}
                                        {msg.type === 'warning' && <ShieldCheck size={16} />}
                                        {msg.type === 'critical' && <AlertCircle size={16} />}
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{msg.agent}</span>
                                        <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                    <div ref={endRef} />
                </div>

                {/* Action Panel */}
                <div className="p-8 border-t border-white/5 bg-slate-900/60 backdrop-blur-3xl z-10">
                    {status === 'idle' && (
                        <button
                            onClick={startAgentWorkflow}
                            className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            Initialize Agent Execution <ArrowRight size={18} />
                        </button>
                    )}

                    {status === 'running' && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 10 }}
                                    className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                                />
                            </div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest animate-pulse">Processing Agent Reasoning...</span>
                        </div>
                    )}

                    {status === 'paused' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-red-400 p-4 rounded-xl bg-red-400/5 border border-red-400/10 text-sm">
                                <AlertCircle size={18} />
                                <span>Cerebrum Governance Triggered</span>
                            </div>
                            <button
                                onClick={() => router.push('/approvals')}
                                className="w-full py-5 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3"
                            >
                                Visit Approval Dashboard <ArrowRight size={18} />
                            </button>
                        </div>
                    )}

                    {status === 'done' && finalPrice && (
                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
                            <div className="p-6 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 text-center">
                                <p className="text-xs text-emerald-400 font-black uppercase tracking-widest mb-2">Bargaining Successful</p>
                                <div className="text-3xl font-black text-white">₹{finalPrice.toLocaleString()}</div>
                                <p className="text-xs text-gray-500 mt-2">Value secured below threshold. Safe to execute.</p>
                            </div>
                            <button
                                onClick={() => router.push('/cart')}
                                className="w-full py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-widest transition-all"
                            >
                                Finalize Transaction <CheckCircle2 size={18} className="inline ml-2" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
