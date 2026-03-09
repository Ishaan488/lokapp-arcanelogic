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
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-zinc-50 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not logged in, show landing page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col text-zinc-50">
        <nav className="w-full py-4 px-8 flex items-center justify-between border-b border-zinc-800">
          <span className="text-2xl font-extrabold tracking-tight">
            LOKApp
          </span>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/login")}
              className="px-5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-50 font-medium transition-colors shadow-sm"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="px-5 py-2 rounded-lg bg-zinc-50 hover:bg-zinc-200 text-zinc-900 font-medium transition-colors shadow-sm"
            >
              Get Started
            </button>
          </div>
        </nav>

        <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight max-w-3xl text-zinc-50">
            Report Issues.
            <br />
            Transform Your City.
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-xl">
            Snap a photo, describe the problem, and let AI route it to the right
            department. Track resolution in real-time.
          </p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => router.push("/signup")}
              className="px-8 py-4 rounded-lg bg-zinc-50 hover:bg-zinc-200 text-zinc-900 font-medium text-lg shadow-sm transition-colors"
            >
              Start Reporting →
            </button>
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {["📸 Photo Evidence", "🎙️ Voice Input", "🤖 AI Routing", "⏱️ SLA Tracking", "📊 Analytics"].map((f) => (
              <span
                key={f}
                className="px-4 py-2 rounded-full bg-zinc-900 text-sm text-zinc-300 border border-zinc-800"
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
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4">
        <h2 className="text-3xl font-bold text-zinc-50">
          Welcome, {user?.name}
        </h2>
        <p className="text-zinc-400 text-lg">What would you like to do?</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mt-4">
          <button
            onClick={() => router.push("/newreport")}
            className="py-6 rounded-xl bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-medium text-xl shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-2xl">📸</span> New Report
          </button>
          <button
            onClick={() => alert("Coming in Phase 2!")}
            className="py-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-50 font-medium text-xl transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span className="text-2xl">📋</span> All Reports
          </button>
          {(user?.role === "OFFICIAL" || user?.role === "ADMIN") && (
            <button
              onClick={() => alert("Coming in Phase 4!")}
              className="py-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-50 font-medium text-xl transition-colors shadow-sm flex items-center justify-center gap-2 sm:col-span-2"
            >
              <span className="text-2xl">📊</span> Dashboard
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
