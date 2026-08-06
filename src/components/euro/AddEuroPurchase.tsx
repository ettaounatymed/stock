"use client";

import type { ChangeEvent, FormEvent } from "react";
import type { EuroFormValues } from "@/lib/stock";

type AddEuroPurchaseProps = {
  form: EuroFormValues;
  canEdit: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function AddEuroPurchase({ form, canEdit, onChange, onSubmit }: AddEuroPurchaseProps) {
  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950/60 p-5 shadow-xl shadow-black/20">
      <div className="mb-4">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Add euro purchase</p>
        <h3 className="mt-2 text-lg font-semibold text-white">Record a new euro buy</h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-100">
            Purchase date
            <input
              type="date"
              name="purchaseDate"
              value={form.purchaseDate}
              onChange={onChange}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </label>

          <label className="block text-sm text-slate-100">
            EUR bought
            <input
              type="number"
              step="0.01"
              name="euroAmount"
              value={form.euroAmount}
              onChange={onChange}
              placeholder="100"
              className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </label>
        </div>

        <label className="block text-sm text-slate-100">
          Total MAD paid for this euro purchase
          <input
            type="number"
            step="0.01"
            name="euroPriceMAD"
            value={form.euroPriceMAD}
            onChange={onChange}
            placeholder="10500"
            className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />
          <p className="mt-2 text-xs text-slate-400">Enter the total MAD amount paid to buy the EUR amount above, not the per-euro price.</p>
        </label>

        <label className="block text-sm text-slate-100">
          Notes
          <textarea
            name="notes"
            value={form.notes}
            onChange={onChange}
            rows={3}
            placeholder="Bank transfer, exchange office, etc."
            className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />
        </label>

        {!canEdit ? <p className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-50">Read-only view is active. Sign in as the owner to add or edit records.</p> : null}

        <button
          type="submit"
          disabled={!canEdit}
          className="w-full rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-200"
        >
          Save euro purchase
        </button>
      </form>
    </section>
  );
}
