"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from "framer-motion";
import {
    ArrowUpRight,
    ShoppingBag,
    Bot,
    Zap
} from "lucide-react";

interface ProductCardProps {
    id: number;
    name: string;
    description: string;
    price: number;
}

export function ProductCard({ id, name, description, price }: ProductCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative flex flex-col rounded-[32px] overflow-hidden glass glass-hover p-2 shadow-2xl"
        >
            {/* Top Banner Tag */}
            <div className="absolute top-6 left-6 z-20 flex gap-2">
                <div className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 backdrop-blur-md text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Bot size={12} /> Agent Ready
                </div>
            </div>

            {/* Image Container */}
            <div className="relative h-64 rounded-[26px] overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950" />
                <div className="absolute inset-0 pattern-grid-lg text-white/[0.03]" />

                {/* Placeholder Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700">
                    <ShoppingBag size={80} strokeWidth={1} />
                </div>

                {/* Overlay Action */}
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-500">
                    <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                        <ArrowUpRight size={24} />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 pt-2 flex flex-col flex-grow">
                <div className="mb-2">
                    <h3 className="text-xl font-black text-white line-clamp-1 tracking-tight">{name}</h3>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Tech / Store Exclusive</p>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                    {description}
                </p>

                <div className="mt-auto flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-500 block">Negotiable Price</span>
                        <span className="text-2xl font-black text-white tracking-tighter">₹{price.toLocaleString('en-IN')}</span>
                    </div>

                    <Link
                        href={`/products/${id}`}
                        className="h-12 w-12 rounded-2xl bg-white text-black flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all duration-500 overflow-hidden relative group/btn"
                    >
                        <Zap size={20} className="z-10" />
                        <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                    </Link>
                </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/0 to-emerald-500/0 group-hover:from-blue-500/10 group-hover:to-emerald-500/10 rounded-[32px] -z-10 transition-all duration-700" />
        </motion.div>
    );
}
