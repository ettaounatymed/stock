"use client";

import type { ChangeEvent, FormEvent } from "react";
import type { EuroFormValues, EuroPurchaseRecord } from "@/lib/stock";

type EuroPurchasesProps = {
  form: EuroFormValues;
  canEdit: boolean;
  purchases: EuroPurchaseRecord[];
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: (id: string) => void;
};

export function EuroPurchases({ form, canEdit, purchases, onChange, onSubmit, onDelete }: EuroPurchasesProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Euro purchases</p>
          <h2 className="mt-2 text-xl font-semibold text-white">💶 Separate euro buying history</h2>
        </div>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">Average rate source</span>
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

        <button type="submit" disabled={!canEdit} className="w-full rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-200">
          Save euro purchase
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {purchases.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/40 p-5 text-sm text-slate-200">No euro purchase recorded yet. Add your euro buying history to compute the average rate for profit.</div>
        ) : (
          purchases.map((item) => (
            <article key={item.id} className="rounded-3xl border border-white/10 bg-slate-950/65 p-4 shadow-lg shadow-black/20">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{item.purchaseDate || "No date"}</p>
                  <p className="text-xs text-slate-300">
                    {Number(item.euroAmount || 0).toFixed(2)} EUR • {Number(item.euroPriceMAD || 0).toFixed(2)} MAD total • {Number(item.euroAmount || 0) > 0 ? (Number(item.euroPriceMAD || 0) / Number(item.euroAmount || 0)).toFixed(2) : "0.00"} MAD / EUR
                  </p>
                  {item.notes ? <p className="mt-1 text-xs text-slate-300">{item.notes}</p> : null}
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-1 text-xs font-medium text-rose-100 transition hover:bg-rose-400/20"
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </article>
  );
}