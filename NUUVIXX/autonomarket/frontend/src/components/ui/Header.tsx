"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ShoppingBag,
    Shield,
    History,
    Wallet,
    Search,
    Bot,
    ChevronDown,
} from "lucide-react";

export function Header() {
    const pathname = usePathname();
    const [searchVal, setSearchVal] = useState("");

    const navItems = [
        { name: "Shop", href: "/products", icon: ShoppingBag },
        { name: "Approvals", href: "/approvals", icon: Shield, badge: true },
        { name: "Audit", href: "/audit", icon: History },
        { name: "Cart", href: "/cart", icon: ShoppingBag },
    ];

    return (
        <header style={{
            position: "sticky", top: 0, zIndex: 100,
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-surface)",
        }}>
            {/* Top bar */}
            <div style={{
                display: "flex", alignItems: "center",
                height: 52, padding: "0 20px", gap: 16,
            }}>
                {/* Logo */}
                <Link href="/" style={{
                    display: "flex", alignItems: "center", gap: 10,
                    textDecoration: "none", flexShrink: 0,
                }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: 7,
                        background: "linear-gradient(135deg,#3b82f6,#22c55e)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, fontWeight: 800, color: "white",
                    }}>A</div>
                    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-hi)", letterSpacing: "-0.01em" }}>
                            AutonoMarket
                        </span>
                        <span style={{ fontSize: 9, color: "var(--text-lo)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            Agentic Commerce
                        </span>
                    </div>
                </Link>

                {/* Divider */}
                <div style={{ width: 1, height: 24, background: "var(--border)", flexShrink: 0 }} />

                {/* Search */}
                <div style={{
                    flex: 1, maxWidth: 400,
                    display: "flex", alignItems: "center", gap: 8,
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: 7, padding: "0 12px", height: 32,
                }}>
                    <Search size={13} color="var(--text-lo)" />
                    <input
                        value={searchVal}
                        onChange={e => setSearchVal(e.target.value)}
                        placeholder="Search products, orders..."
                        style={{
                            background: "transparent", border: "none", outline: "none",
                            color: "var(--text-hi)", fontSize: 13, width: "100%",
                            caretColor: "#60a5fa",
                        }}
                    />
                </div>

                {/* Nav */}
                <nav style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: "auto" }}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-link${isActive ? " active" : ""}`}
                            >
                                <item.icon size={14} />
                                {item.name}
                                {item.badge && (
                                    <span style={{
                                        width: 6, height: 6, borderRadius: "50%",
                                        background: "#3b82f6", boxShadow: "0 0 5px #3b82f6",
                                        display: "inline-block",
                                    }} />
                                )}
                            </Link>
                        );
                    })}

                    <div style={{ width: 1, height: 20, background: "var(--border)", margin: "0 6px" }} />

                    {/* AI status chip */}
                    <div style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "4px 10px", borderRadius: 6,
                        background: "rgba(34,197,94,0.08)",
                        border: "1px solid rgba(34,197,94,0.18)",
                        fontSize: 11.5, fontWeight: 600, color: "#4ade80",
                        cursor: "default",
                    }}>
                        <span className="dot-green" />
                        <Bot size={12} />
                        Agents Live
                    </div>

                    <div style={{ width: 1, height: 20, background: "var(--border)", margin: "0 6px" }} />

                    {/* Wallet */}
                    <button className="btn-ghost" style={{ fontSize: 12 }}>
                        <Wallet size={13} />
                        0x71C…4920
                        <ChevronDown size={12} />
                    </button>
                </nav>
            </div>
        </header>
    );
}
