"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    BookMarked,
    Trophy,
    Settings,
    Menu,
    X,
    GraduationCap
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: BookMarked, label: "My Learning", href: "/learning" },
    { icon: Trophy, label: "Achievements", href: "/achievements" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar Container */}
            <AnimatePresence mode="wait">
                {(isOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
                    <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        className={cn(
                            "fixed top-0 left-0 z-40 h-screen w-72 bg-slate-900 text-white transition-transform duration-300 lg:translate-x-0 border-r border-slate-800",
                            !isOpen && "hidden lg:block"
                        )}
                    >
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="p-6 border-b border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                        <GraduationCap className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="font-bold text-lg leading-tight">Agentic AI</h1>
                                        <p className="text-slate-400 text-xs">Mastery Platform</p>
                                    </div>
                                </div>
                            </div>

                            {/* Nav */}
                            <nav className="flex-1 p-4 space-y-2">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                                isActive
                                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                                            )}
                                        >
                                            <Icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
                                            <span className="font-medium">{item.label}</span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeNav"
                                                    className="absolute right-0 w-1 h-8 bg-white rounded-l-full opacity-20"
                                                />
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Footer */}
                            <div className="p-6 border-t border-slate-800">
                                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs font-medium text-slate-300">Progress</span>
                                        <span className="text-xs font-bold text-indigo-400">0%</span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full w-0 rounded-full" />
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-2">0 of 100 Courses Completed</p>
                                </div>
                                <p className="text-center text-xs text-slate-600 mt-6">
                                    v2.0.0 • PRO Edition
                                </p>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}
