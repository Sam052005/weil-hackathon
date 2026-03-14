"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AuditPage() {
    const [auditLogs, setAuditLogs] = useState<any[]>([]);

    useEffect(() => {
        const fetchAudit = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/v1/audit/");
                setAuditLogs(res.data.map((log: any) => {
                    const date = new Date(log.created_at);
                    return {
                        time: date.toLocaleTimeString(),
                        actor: "Agent Nexus",
                        action: log.action,
                        details: log.details,
                        status: "Anchored",
                        signature: log.signature
                    };
                }));
            } catch (e) {
                console.error("Failed to fetch audit logs:", e);
            }
        };
        fetchAudit();
        const interval = setInterval(fetchAudit, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 w-full flex-1 font-mono">
            <div className="mb-12">
                <h1 className="text-3xl font-bold text-white mb-2">Audit Intelligence</h1>
                <p className="text-gray-400 font-sans">Immutable cryptographic trail of all agent actions and system decisions.</p>
            </div>

            <div className="relative space-y-1">
                {/* Vertical Line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-800 z-0"></div>

                {auditLogs.map((log: any, idx: number) => (
                    <div key={idx} className="relative z-10 flex items-start gap-8 py-6 pl-10 group">
                        {/* Dot */}
                        <div className="absolute left-[13px] top-[32px] w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] group-hover:bg-emerald-400 transition-colors"></div>

                        <div className="text-xs text-gray-500 pt-1 shrink-0 w-16">{log.time}</div>

                        <div className="flex-1 p-5 rounded-xl border border-gray-800 bg-gray-900/40 backdrop-blur-sm group-hover:border-gray-700 transition-all hover:translate-x-1">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">{log.actor}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded border border-current ${log.status === 'Anchored' ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-500 bg-gray-500/10'
                                    }`}>
                                    {log.status}
                                </span>
                            </div>
                            <h3 className="text-white font-semibold mb-1 uppercase text-sm">{log.action}</h3>
                            <p className="text-gray-400 text-xs truncate max-w-full block" title={log.details}>{log.details}</p>
                            <p className="text-gray-600 text-[9px] mt-2 font-mono break-all leading-tight">SIG: {log.signature}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-6 rounded-xl border border-blue-500/30 bg-blue-500/5 backdrop-blur-md flex items-center justify-between font-sans">
                <div>
                    <h4 className="text-blue-400 font-bold text-sm">Blockchain Anchor Readiness</h4>
                    <p className="text-gray-400 text-xs">All local signatures are ready for Weilchain audit log contract batching.</p>
                </div>
                <button className="px-5 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-500 transition-colors">
                    Push to Audit Log
                </button>
            </div>
        </div>
    );
}
