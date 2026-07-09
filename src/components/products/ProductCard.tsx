"use client";

import type { ProductRecord } from "@/lib/stock";
import { getProductStatus } from "@/lib/stock";

type ProductCardProps = {
  item: ProductRecord;
  averageEuroRate: number;
  canEdit: boolean;
  onEdit: (item: ProductRecord) => void;
  onDelete: (id: string) => void;
};

export function ProductCard({ item, averageEuroRate, canEdit, onEdit, onDelete }: ProductCardProps) {
  const euroRate = averageEuroRate > 0 ? averageEuroRate : 0;
  const buyCostMAD = euroRate > 0 ? Number(item.buyPriceEUR || 0) * euroRate : 0;
  const profitMAD = euroRate > 0 ? Number(item.salePriceMAD || 0) - buyCostMAD : 0;
  const status = getProductStatus(item);

  return (
    <article className="rounded-3xl border border-white/10 bg-slate-950/65 p-3 shadow-lg shadow-black/20 sm:p-4">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-base font-semibold text-white">{item.productName}</p>
          <p className="text-xs text-slate-300">{item.category} • {item.sourceCountry}</p>
          {item.imei ? <p className="mt-1 text-xs text-cyan-100">IMEI: {item.imei}</p> : null}
          <span
            className={`mt-2 inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold ${
              status === "sold"
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                : "border-amber-400/30 bg-amber-400/10 text-amber-100"
            }`}
          >
            {status === "sold" ? "Sold" : "In stock"}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          {canEdit ? (
            <>
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100 transition hover:bg-cyan-400/20"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                className="rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-1 text-xs font-medium text-rose-100 transition hover:bg-rose-400/20"
              >
                Delete
              </button>
            </>
          ) : (
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">Read only</span>
          )}
        </div>
      </div>

      <dl className="mt-3 grid gap-3 text-xs text-slate-100 sm:grid-cols-2">
        <div>
          <dt className="text-slate-400">Bought</dt>
          <dd>{item.purchaseDate || "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Sold</dt>
          <dd>{item.saleDate || "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Buy cost</dt>
          <dd>{buyCostMAD.toFixed(2)} MAD</dd>
        </div>
        <div>
          <dt className="text-slate-400">EUR rate</dt>
          <dd>{euroRate > 0 ? `${euroRate.toFixed(2)} MAD / EUR` : "Not available"}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Sell price</dt>
          <dd>{Number(item.salePriceMAD || 0).toFixed(2)} MAD</dd>
        </div>
        <div>
          <dt className="text-slate-400">Profit</dt>
          <dd className={profitMAD >= 0 ? "text-emerald-300" : "text-rose-300"}>{profitMAD.toFixed(2)} MAD</dd>
        </div>
        <div>
          <dt className="text-slate-400">Notes</dt>
          <dd>{item.notes || "—"}</dd>
        </div>
      </dl>
    </article>
  );
}