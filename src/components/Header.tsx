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
        <nav className="w-full py-4 px-8 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
            <Link href="/" className="text-2xl font-extrabold text-zinc-50 tracking-tight">
                LOKApp
            </Link>

            {user && (
                <div className="relative" ref={dropdownRef}>
                    <button
                        className="flex items-center gap-3 text-zinc-50 font-medium px-4 py-2 rounded-xl hover:bg-zinc-900 transition-colors"
                        onClick={() => setDropdownOpen((open) => !open)}
                    >
                        {/* Avatar circle */}
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-50 font-bold text-sm">
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
                        <div className="absolute right-0 mt-2 w-52 bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg z-50 overflow-hidden">
                            <div className="px-4 py-3 border-b border-zinc-800">
                                <p className="text-zinc-50 font-medium text-sm">{user.name}</p>
                                <p className="text-zinc-400 text-xs">{user.email}</p>
                            </div>
                            <button
                                className="w-full text-left px-4 py-3 hover:bg-zinc-800 text-zinc-300 transition flex items-center gap-2 text-sm"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    router.push("/profile");
                                }}
                            >
                                <span>👤</span> View Profile
                            </button>
                            <button
                                className="w-full text-left px-4 py-3 hover:bg-red-950/30 text-red-500 transition flex items-center gap-2 text-sm border-t border-zinc-800"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    logout();
                                    router.push("/login");
                                }}
                            >
                                <span>🚪</span> Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}