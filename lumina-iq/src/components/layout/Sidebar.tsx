"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, LineChart, LayoutDashboard, Gem } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
    { href: "/", label: "Overview", icon: LayoutDashboard },
    { href: "/analytics", label: "Market Analytics", icon: BarChart3 },
    { href: "/prediction", label: "Crystal Ball", icon: Gem },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r border-zinc-800 bg-black text-zinc-400 h-screen fixed left-0 top-0 flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-zinc-800">
                <span className="text-xl font-bold text-white tracking-widest">LUMINA.IQ</span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-zinc-900 text-white border-l-2 border-primary"
                                    : "hover:bg-zinc-900/50 hover:text-white"
                            )}
                        >
                            <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-zinc-500")} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-zinc-800">
                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                    <p className="text-xs font-semibold text-primary mb-1">PRO ACCOUNT</p>
                    <p className="text-xs text-zinc-500">Access full market depth.</p>
                </div>
            </div>
        </aside>
    );
}
