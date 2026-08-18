"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [securityKey, setSecurityKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email || !securityKey) {
      setError("Please enter both your email and security key.");
      return;
    }

    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      router.push("/admin/dashboard");
    }, 600);
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-950 px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-2xl">
            🛡️
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white">
            Admin Portal
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Restricted access. Sign in with your admin credentials and
            security key.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl sm:p-8"
        >
          {error && (
            <div className="mb-4 rounded-lg border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-zinc-300"
              >
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@ayurcare.com"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="securityKey"
                className="mb-1.5 block text-sm font-medium text-zinc-300"
              >
                Security Key
              </label>
              <div className="relative">
                <input
                  id="securityKey"
                  type={showKey ? "text" : "password"}
                  autoComplete="off"
                  value={securityKey}
                  onChange={(event) => setSecurityKey(event.target.value)}
                  placeholder="Enter your security key"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 pr-16 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-500 hover:text-zinc-300"
                >
                  {showKey ? "Hide" : "Show"}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-zinc-500">
                This is your unique admin security key, not your account
                password.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-800"
          >
            {submitting ? "Verifying..." : "Sign in securely"}
          </button>

          <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
            <span>🔒</span>
            <span>Your session is encrypted and access is logged.</span>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-zinc-400 hover:text-zinc-200"
          >
            ← Back to login options
          </Link>
        </div>
      </div>
    </div>
  );
}
