"use client";

import type { ChangeEvent, FormEvent } from "react";
import type { ProductFormValues } from "@/lib/stock";

type ProductFormProps = {
  form: ProductFormValues;
  canEdit: boolean;
  editingId: string | null;
  effectiveEuroRate: number;
  estimatedBuyCostMAD: number;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ProductForm({ form, canEdit, editingId, effectiveEuroRate, estimatedBuyCostMAD, onChange, onSubmit }: ProductFormProps) {
  const currentBuyPriceEUR = Number(form.buyPriceEUR || 0);

  return (
    <article className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">New entry</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{editingId ? "Update product" : "Add a product"}</h2>
        </div>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">Uses euro history</span>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm text-slate-100">
          Product name
          <input
            name="productName"
            value={form.productName}
            onChange={onChange}
            placeholder="iPhone 14 / jacket / shoes"
            className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none ring-0 transition placeholder:text-slate-400 focus:border-cyan-400"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-100">
            Category
            <select name="category" value={form.category} onChange={onChange} className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400">
              <option>Phone</option>
              <option>Clothes</option>
              <option>Accessories</option>
              <option>Other</option>
            </select>
          </label>

          <label className="block text-sm text-slate-100">
            Source country
            <select name="sourceCountry" value={form.sourceCountry} onChange={onChange} className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400">
              <option>Spain</option>
              <option>France</option>
              <option>Other</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-100">
            Purchase date
            <input type="date" name="purchaseDate" value={form.purchaseDate} onChange={onChange} className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400" />
          </label>

          <label className="block text-sm text-slate-100">
            Sale date
            <input type="date" name="saleDate" value={form.saleDate} onChange={onChange} className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400" />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-100">
            Buy price (EUR)
            <input type="number" step="0.01" name="buyPriceEUR" value={form.buyPriceEUR} onChange={onChange} placeholder="350" className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400" />
            {currentBuyPriceEUR > 0 ? (
              <p className="mt-2 text-xs text-slate-400">
                {effectiveEuroRate > 0
                  ? `Using ${effectiveEuroRate.toFixed(2)} MAD / EUR from euro purchase history. Estimated cost: ${estimatedBuyCostMAD.toFixed(2)} MAD.`
                  : "Add euro purchase history to calculate EUR → MAD automatically."}
              </p>
            ) : null}
          </label>

          <label className="block text-sm text-slate-100">
            IMEI (optional)
            <input name="imei" value={form.imei} onChange={onChange} placeholder="For iPhone / device serial" className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400" />
          </label>
        </div>

        <p className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-sm text-cyan-50">
          If you enter both a sale date and a sell price, the item will be marked as sold automatically. Leave them empty to keep it in stock.
        </p>

        <label className="block text-sm text-slate-100">
          Sale price (MAD)
          <input type="number" step="0.01" name="salePriceMAD" value={form.salePriceMAD} onChange={onChange} placeholder="4200" className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400" />
        </label>

        <label className="block text-sm text-slate-100">
          Notes
          <textarea name="notes" value={form.notes} onChange={onChange} rows={3} placeholder="Color, size, serial number, condition, seller..." className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400" />
        </label>

        {!canEdit ? <p className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-50">Read-only view is active. Sign in as the owner to add or edit records.</p> : null}

        <button type="submit" disabled={!canEdit} className="w-full rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-200">
          {editingId ? "Update record" : "Add record"}
        </button>
      </form>
    </article>
  );
}