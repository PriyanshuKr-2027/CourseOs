"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogo, Envelope, Lock, ArrowRight, User } from "@phosphor-icons/react";
import { useSupabase } from "@/components/providers/SupabaseProvider";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp } = useSupabase();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name)) {
      setError("Please fill in all fields.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        const signUpResult = await signUp(email, password, name);
        if (signUpResult.error) {
          setError(signUpResult.error.message || "Sign up failed.");
        } else {
          if (signUpResult.data?.session) {
            router.push("/dashboard");
          } else {
            setShowSuccessModal(true);
          }
        }
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError(signInError.message || "Invalid login credentials.");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4 relative">
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
          disabled={loading}
          onClick={async () => {
            setError("");
            // Google auth simulation if mock, or actual OAuth
            try {
              const mockEmail = "learner@example.com";
              const { error: oAuthError } = await signIn(mockEmail, "password");
              if (oAuthError) setError(oAuthError.message);
            } catch (err) {
              setError(err instanceof Error ? err.message : "An unknown error occurred.");
            }
          }}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-paper hover:bg-border border border-border rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
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

          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  placeholder="John Doe"
                  disabled={loading}
                  value={name}
                  required={isSignUp}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 text-sm font-medium"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Envelope className="absolute left-3.5 top-3 w-5 h-5 text-text-secondary" />
              <input
                type="email"
                placeholder="you@example.com"
                disabled={loading}
                value={email}
                required
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Password</label>
              {!isSignUp && (
                <button type="button" disabled={loading} className="text-xs text-focus hover:underline">
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-5 h-5 text-text-secondary" />
              <input
                type="password"
                placeholder="••••••••"
                disabled={loading}
                value={password}
                required
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 text-sm font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B1917] text-white py-3 rounded-xl font-semibold shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
            {!loading && <ArrowRight weight="bold" />}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="text-center">
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
            disabled={loading}
            className="text-xs text-text-secondary hover:text-focus transition-colors"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>

      {/* Success Modal Popup */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-surface border border-border rounded-2xl p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-focus/10 flex items-center justify-center mx-auto text-focus">
              <Envelope weight="fill" className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-text-primary">Verify your email</h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                We've sent a verification link to <strong className="text-text-primary">{email}</strong>. Please check your inbox (and spam folder) to activate your account.
              </p>
            </div>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setIsSignUp(false); // switch back to sign-in view
                setName("");
                setEmail("");
                setPassword("");
              }}
              className="w-full bg-[#1B1917] text-white py-3 rounded-xl font-semibold shadow-sm hover:opacity-90 transition-opacity cursor-pointer text-sm"
            >
              Okay, got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
