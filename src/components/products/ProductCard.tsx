"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { ProductRecord } from "@/lib/stock";
import { getProductBuyCostMAD, getProductStatus } from "@/lib/stock";

type ProductCardProps = {
  item: ProductRecord;
  averageEuroRate: number;
  allocatedExpenseMAD?: number;
  canEdit: boolean;
  onEdit: (item: ProductRecord) => void;
  onDelete: (id: string) => void;
};

export function ProductCard({ item, averageEuroRate, allocatedExpenseMAD = 0, canEdit, onEdit, onDelete }: ProductCardProps) {
  const purchaseTimeEuroRate = Number(item.euroRate || 0);
  const euroRateForCost = averageEuroRate || purchaseTimeEuroRate;
  const buyCostMAD = getProductBuyCostMAD(item, averageEuroRate);
  const realCostMAD = buyCostMAD + allocatedExpenseMAD;
  const status = getProductStatus(item);
  const profitMAD = status === "sold" && (item.buyCurrency === "MAD" || euroRateForCost > 0)
    ? Number(item.salePriceMAD || 0) - realCostMAD
    : null;

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-blue-300/10 bg-gradient-to-br from-[#0b1d3b] to-[#061329] p-4 shadow-lg shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:border-blue-400/30 hover:shadow-[0_20px_45px_-30px_rgba(22,133,255,0.65)] sm:p-5">
      <div aria-hidden="true" className={`pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full blur-3xl ${status === "sold" ? "bg-emerald-500/[0.07]" : "bg-blue-500/[0.09]"}`} />
      <div className="relative flex flex-col gap-4 border-b border-blue-200/[0.08] pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${
            status === "sold" ? "border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300" : "border-blue-400/15 bg-blue-500/[0.1] text-blue-300"
          }`}>
            <span className="text-sm font-bold">{item.productName.trim().slice(0, 1).toUpperCase() || "P"}</span>
          </span>
          <div className="min-w-0">
            <h3 className="break-words text-base font-semibold tracking-tight text-white sm:text-lg">{item.productName || "Unnamed product"}</h3>
            <p className="mt-1 text-xs text-slate-400">{item.category} <span className="px-1 text-slate-600">/</span> {item.sourceCountry}</p>
            {item.imei ? <p className="mt-2 break-all font-mono text-[11px] text-blue-200/80">IMEI · {item.imei}</p> : null}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
            status === "sold"
              ? "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-200"
              : "border-blue-400/20 bg-blue-500/[0.08] text-blue-200"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${status === "sold" ? "bg-emerald-400" : "bg-blue-400"}`} />
            {status === "sold" ? "Sold" : "In stock"}
          </span>
          {canEdit ? (
            <>
              <button
                type="button"
                onClick={() => onEdit(item)}
                aria-label={`Edit ${item.productName || "product"}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-400/20 bg-blue-500/[0.07] px-3 py-2 text-xs font-medium text-blue-100 hover:border-blue-300/40 hover:bg-blue-500/15"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                aria-label={`Delete ${item.productName || "product"}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-400/15 bg-rose-400/[0.05] px-3 py-2 text-xs font-medium text-rose-200/90 hover:border-rose-400/35 hover:bg-rose-400/10"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
              </button>
            </>
          ) : (
            <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-slate-400">Read only</span>
          )}
        </div>
      </div>

      <dl className="relative mt-4 grid gap-2.5 text-xs sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-white/[0.04] bg-slate-950/20 p-3">
          <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">Bought</dt>
          <dd className="mt-1.5 font-medium text-slate-200">{item.purchaseDate || "—"}</dd>
        </div>
        <div className="rounded-xl border border-white/[0.04] bg-slate-950/20 p-3">
          <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">Sold</dt>
          <dd className="mt-1.5 font-medium text-slate-200">{item.saleDate || "—"}</dd>
        </div>
        <div className="rounded-xl border border-white/[0.04] bg-slate-950/20 p-3">
          <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">Paid</dt>
          <dd className="mt-1.5 font-medium text-slate-200">{item.buyCurrency === "MAD" ? `${Number(item.buyPriceMAD || 0).toFixed(2)} MAD` : `${Number(item.buyPriceEUR || 0).toFixed(2)} EUR`}</dd>
        </div>
        <div className="rounded-xl border border-white/[0.04] bg-slate-950/20 p-3">
          <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">Buy cost</dt>
          <dd className="mt-1.5 font-medium text-slate-200">{realCostMAD.toFixed(2)} MAD</dd>
        </div>
        {item.buyCurrency !== "MAD" ? <div className="rounded-xl border border-white/[0.04] bg-slate-950/20 p-3">
          <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">EUR rate at purchase</dt>
          <dd className="mt-1.5 font-medium text-slate-200">{purchaseTimeEuroRate > 0 ? `${purchaseTimeEuroRate.toFixed(2)} MAD / EUR` : "Not recorded"}</dd>
        </div> : null}
        <div className="rounded-xl border border-white/[0.04] bg-slate-950/20 p-3">
          <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">Sell price</dt>
          <dd className="mt-1.5 font-medium text-slate-200">{Number(item.salePriceMAD || 0).toFixed(2)} MAD</dd>
        </div>
        <div className={`rounded-xl border p-3 ${profitMAD === null ? "border-white/[0.04] bg-slate-950/20" : profitMAD >= 0 ? "border-emerald-400/10 bg-emerald-400/[0.035]" : "border-rose-400/10 bg-rose-400/[0.035]"}`}>
          <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">Profit</dt>
          <dd className={`mt-1.5 font-semibold ${profitMAD === null ? "text-slate-400" : profitMAD >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
            {profitMAD === null ? "Not sold yet" : `${profitMAD.toFixed(2)} MAD`}
          </dd>
        </div>
        <div className="rounded-xl border border-white/[0.04] bg-slate-950/20 p-3">
          <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">Additional costs</dt>
          <dd className="mt-1.5 font-medium text-slate-200">{allocatedExpenseMAD.toFixed(2)} MAD</dd>
        </div>
        <div className="rounded-xl border border-white/[0.04] bg-slate-950/20 p-3 sm:col-span-2 xl:col-span-1">
          <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">Notes</dt>
          <dd className="mt-1.5 break-words leading-5 text-slate-300">{item.notes || "—"}</dd>
        </div>
      </dl>
    </article>
  );
}