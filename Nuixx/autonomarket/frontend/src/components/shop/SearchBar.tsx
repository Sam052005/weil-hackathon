"use client";
import React, { useState } from 'react';
import { Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function SearchBar() {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative w-full group">
            <motion.form
                animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
                className={`relative flex items-center transition-all duration-500 overflow-hidden rounded-2xl border ${isFocused ? 'border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] bg-slate-900/80' : 'border-white/5 bg-white/5'
                    }`}
            >
                <div className="pl-6 text-slate-500 group-hover:text-blue-400 transition-colors">
                    <Search size={20} />
                </div>

                <input
                    type="text"
                    value={query}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask agents to find products..."
                    className="w-full h-14 pl-4 pr-16 bg-transparent text-white placeholder-slate-500 font-medium focus:outline-none"
                />

                <div className="absolute right-3 flex gap-2">
                    <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles size={12} /> AI Search
                    </div>
                </div>
            </motion.form>

            {/* Background Glow */}
            <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-xl -z-10 transition-opacity duration-500 ${isFocused ? 'opacity-30' : 'opacity-0'
                }`} />
        </div>
    );
}
