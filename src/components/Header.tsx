"use client";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        }
        if (dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);

    const getRoleBadge = (role: string) => {
        const colors: Record<string, string> = {
            CITIZEN: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
            OFFICIAL: "bg-blue-500/20 text-blue-300 border-blue-500/30",
            ADMIN: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        };
        return colors[role] || colors.CITIZEN;
    };

    return (
        <nav className="w-full py-4 px-8 bg-white/5 backdrop-blur-xl border-b border-white/10 flex items-center justify-between">
            <Link href="/" className="text-2xl font-extrabold text-white tracking-tight">
                LOK<span className="text-amber-400">App</span>
            </Link>

            {user && (
                <div className="relative" ref={dropdownRef}>
                    <button
                        className="flex items-center gap-3 text-white font-medium px-4 py-2 rounded-xl hover:bg-white/10 transition"
                        onClick={() => setDropdownOpen((open) => !open)}
                    >
                        {/* Avatar circle */}
                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="hidden sm:inline">{user.name}</span>
                        <span
                            className={`text-xs px-2 py-0.5 rounded-full border ${getRoleBadge(user.role)} hidden sm:inline`}
                        >
                            {user.role}
                        </span>
                        <svg
                            className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-52 bg-slate-800 border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                            <div className="px-4 py-3 border-b border-white/10">
                                <p className="text-white font-medium text-sm">{user.name}</p>
                                <p className="text-slate-400 text-xs">{user.email}</p>
                            </div>
                            <button
                                className="w-full text-left px-4 py-3 hover:bg-white/10 text-slate-300 transition text-sm"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    router.push("/profile");
                                }}
                            >
                                👤 View Profile
                            </button>
                            <button
                                className="w-full text-left px-4 py-3 hover:bg-red-500/20 text-red-400 transition text-sm border-t border-white/10"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    logout();
                                    router.push("/login");
                                }}
                            >
                                🚪 Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}