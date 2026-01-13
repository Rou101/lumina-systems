"use client";

import { useStore } from "@/store/useStore";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumGateProps {
    children: React.ReactNode;
    blurAmount?: "sm" | "md" | "lg";
    className?: string;
    fallbackMessage?: string;
}

export function PremiumGate({
    children,
    blurAmount = "md",
    className,
    fallbackMessage = "Upgrade to Reveal Intelligence"
}: PremiumGateProps) {
    const { isPremium, togglePremium } = useStore();

    if (isPremium) {
        return <>{children}</>;
    }

    return (
        <div className={cn("relative overflow-hidden group", className)}>
            <div className={cn(
                "transition-all duration-500",
                blurAmount === "sm" && "blur-sm",
                blurAmount === "md" && "blur-md",
                blurAmount === "lg" && "blur-xl"
            )}>
                <div className="pointer-events-none select-none opacity-50 grayscale">
                    {children}
                </div>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/10 backdrop-blur-[2px]">
                <div className="bg-zinc-900/90 border border-zinc-700 p-6 rounded-xl flex flex-col items-center gap-3 shadow-2xl">
                    <div className="p-3 bg-zinc-800 rounded-full border border-zinc-700">
                        <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-wide">PRO ACCESS ONLY</h3>
                    <p className="text-sm text-zinc-400 text-center max-w-[200px]">
                        {fallbackMessage}
                    </p>
                    <button
                        onClick={togglePremium}
                        className="mt-2 px-6 py-2 bg-primary text-black font-bold rounded hover:bg-amber-400 transition-colors text-sm uppercase tracking-wider"
                    >
                        Unlock Now
                    </button>
                </div>
            </div>
        </div>
    );
}
