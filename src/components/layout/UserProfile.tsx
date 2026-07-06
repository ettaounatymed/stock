"use client";

import type { FormEvent } from "react";

type UserProfileProps = {
  isSupabaseConfigured: boolean;
  authEmail: string;
  authPassword: string;
  authStatus: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function UserProfile({
  isSupabaseConfigured,
  authEmail,
  authPassword,
  authStatus,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: UserProfileProps) {
  return (
    <article className="w-full rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
      <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Owner access</p>
      <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">🔐 Sign in to open the stock tracker</h1>
      <p className="mt-4 max-w-2xl text-slate-200/90">This dashboard is private. Only the owner account configured in Supabase can view and manage the app.</p>

      {isSupabaseConfigured ? (
        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-3xl border border-white/10 bg-slate-950/60 p-5 shadow-lg shadow-black/20">
          <label className="block text-sm text-slate-100">
            Email
            <input
              type="email"
              value={authEmail}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="owner@example.com"
              className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-cyan-400"
              required
            />
          </label>

          <label className="block text-sm text-slate-100">
            Password
            <input
              type="password"
              value={authPassword}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="Supabase password"
              className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-cyan-400"
              required
            />
          </label>

          <button type="submit" className="w-full rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">Sign in</button>
        </form>
      ) : (
        <div className="mt-8 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-50">
          Supabase is not configured yet. Add your project URL and anon key in the environment variables to enable owner-only access.
        </div>
      )}

      <p className="mt-4 text-sm text-slate-200/90">{authStatus || "Use the owner email and password from your Supabase project."}</p>
    </article>
  );
}