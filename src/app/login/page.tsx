"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogo, Envelope, Lock, ArrowRight } from "@phosphor-icons/react";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    
    // Simulate successful login
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface border border-border rounded-2xl p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-lg bg-signal mx-auto flex items-center justify-center">
            <span className="font-bold text-white text-lg">DS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isSignUp ? "Create an account" : "Sign in to your tracker"}
          </h1>
          <p className="text-xs text-text-secondary">
            Master algorithms in 92 days.
          </p>
        </div>

        {/* OAuth */}
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-paper hover:bg-border border border-border rounded-xl text-sm font-semibold transition-all"
        >
          <GoogleLogo className="w-5 h-5" />
          Continue with Google
        </button>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-border"></div>
          <span className="px-3 text-xs text-text-secondary font-medium bg-surface">Or continue with</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-xs text-alert bg-alert/5 p-3 rounded-lg border border-alert/20 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Envelope className="absolute left-3.5 top-3 w-5 h-5 text-text-secondary" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Password</label>
              {!isSignUp && (
                <button type="button" className="text-xs text-focus hover:underline">
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-5 h-5 text-text-secondary" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 text-sm font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-focus text-white py-3 rounded-xl font-semibold shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
            <ArrowRight weight="bold" />
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="text-center">
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
            className="text-xs text-text-secondary hover:text-focus transition-colors"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
