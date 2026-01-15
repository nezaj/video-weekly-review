"use client";

import { useState } from "react";
import { db } from "@/lib/db";

type Step = "email" | "code";

export function LoginPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await db.auth.sendMagicCode({ email: email.trim() });
      setStep("code");
    } catch (err) {
      setError("Couldn't send code. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await db.auth.signInWithMagicCode({ email: email.trim(), code: code.trim() });
      // Auth state will update automatically via useAuth()
    } catch (err) {
      setError("Invalid code. Please check and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep("email");
    setCode("");
    setError(null);
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-bg-primary p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-4">
            <svg
              className="w-8 h-8 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h1 className="font-heading text-3xl font-bold text-text-primary tracking-tight">
            Weekly Review
          </h1>
          <p className="text-text-secondary mt-2">
            Track your progress. Reflect. Grow.
          </p>
        </div>

        {/* Card */}
        <div className="bg-bg-secondary border border-border rounded-2xl p-6 card-glow">
          {step === "email" ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-text-secondary mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full"
                  autoFocus
                  autoComplete="email"
                  required
                />
              </div>

              {error && (
                <div className="bg-error/10 border border-error/30 rounded-xl p-3 text-sm text-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Magic Code"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="text-center mb-2">
                <p className="text-text-secondary text-sm">
                  We sent a code to{" "}
                  <span className="text-text-primary font-medium">{email}</span>
                </p>
              </div>

              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-text-secondary mb-2"
                >
                  Verification code
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full text-center tracking-widest text-lg"
                  autoFocus
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                />
              </div>

              {error && (
                <div className="bg-error/10 border border-error/30 rounded-xl p-3 text-sm text-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Sign In"
                )}
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="w-full text-center text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                ← Use a different email
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-text-secondary mt-6">
          Your personal space for weekly reflection
        </p>
      </div>
    </div>
  );
}
