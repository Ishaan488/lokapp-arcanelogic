"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not logged in, show landing page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col">
        <nav className="w-full py-4 px-8 flex items-center justify-between">
          <span className="text-2xl font-extrabold text-white tracking-tight">
            LOK<span className="text-amber-400">App</span>
          </span>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/login")}
              className="px-5 py-2 rounded-xl text-white border border-white/20 hover:bg-white/10 font-medium transition"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold transition shadow-lg shadow-amber-500/25"
            >
              Get Started
            </button>
          </div>
        </nav>

        <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight max-w-3xl">
            Report Issues.
            <br />
            <span className="text-amber-400">Transform</span> Your City.
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-xl">
            Snap a photo, describe the problem, and let AI route it to the right
            department. Track resolution in real-time.
          </p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => router.push("/signup")}
              className="px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-lg shadow-lg shadow-amber-500/25 transition-all duration-200"
            >
              Start Reporting →
            </button>
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {["📸 Photo Evidence", "🎙️ Voice Input", "🤖 AI Routing", "⏱️ SLA Tracking", "📊 Analytics"].map((f) => (
              <span
                key={f}
                className="px-4 py-2 rounded-full bg-white/10 backdrop-blur text-sm text-slate-300 border border-white/10"
              >
                {f}
              </span>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Logged in — show main app home
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4">
        <h2 className="text-3xl font-bold text-white">
          Welcome, <span className="text-amber-400">{user?.name}</span>
        </h2>
        <p className="text-slate-400 text-lg">What would you like to do?</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mt-4">
          <button
            onClick={() => router.push("/newreport")}
            className="py-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xl shadow-lg shadow-amber-500/25 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span className="text-2xl">📸</span> New Report
          </button>
          <button
            onClick={() => alert("Coming in Phase 2!")}
            className="py-6 rounded-2xl bg-white/10 backdrop-blur border border-white/20 hover:bg-white/15 text-white font-bold text-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span className="text-2xl">📋</span> All Reports
          </button>
          {(user?.role === "OFFICIAL" || user?.role === "ADMIN") && (
            <button
              onClick={() => alert("Coming in Phase 4!")}
              className="py-6 rounded-2xl bg-white/10 backdrop-blur border border-white/20 hover:bg-white/15 text-white font-bold text-xl transition-all duration-200 flex items-center justify-center gap-2 sm:col-span-2"
            >
              <span className="text-2xl">📊</span> Dashboard
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
