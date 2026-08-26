"use client";

import { useMemo, useState } from "react";
import type { EuroPurchaseRecord } from "@/lib/stock";

type EuroPurchaseHistoryProps = {
  purchases: EuroPurchaseRecord[];
  canEdit: boolean;
  onDelete: (id: string) => void;
};

const PAGE_SIZE = 5;

export function EuroPurchaseHistory({ purchases, canEdit, onDelete }: EuroPurchaseHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const filteredPurchases = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return purchases;
    }

    return purchases.filter((item) => {
      const haystack = [item.purchaseDate, item.euroAmount, item.euroPriceMAD, item.notes]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [purchases, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredPurchases.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pageItems = filteredPurchases.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Purchase history</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Past euro purchases</h3>
        </div>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100">
          {filteredPurchases.length} visible / {purchases.length} total
        </span>
      </div>

      <label className="mb-4 block text-sm text-slate-100">
        <span className="mb-1 block">Filter by date, amount, MAD, or notes</span>
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search purchases..."
          className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400"
        />
      </label>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50">
        {pageItems.length === 0 ? (
          <div className="p-5 text-sm text-slate-200">
            {purchases.length === 0
              ? "No euro purchase recorded yet. Add your euro buying history to compute the average rate for profit."
              : "No purchases match this filter."}
          </div>
        ) : (
          <>
            <div className="md:hidden">
            <div className="divide-y divide-white/10">
              {pageItems.map((item) => {
                const euroAmount = Number(item.euroAmount || 0);
                const euroPriceMAD = Number(item.euroPriceMAD || 0);
                const rate = euroAmount > 0 ? euroPriceMAD / euroAmount : 0;

                return (
                  <article key={item.id} className="space-y-3 p-4 text-sm text-slate-200">
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 break-words font-medium text-white">{item.purchaseDate || "No date"}</p>
                      {canEdit ? (
                        <button
                          type="button"
                          onClick={() => onDelete(item.id)}
                          className="min-h-11 shrink-0 rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs font-medium text-rose-100 transition hover:bg-rose-400/20"
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>

                    <dl className="grid grid-cols-3 gap-2">
                      <div className="min-w-0 rounded-xl bg-slate-900/60 p-2">
                        <dt className="text-[10px] uppercase tracking-[0.12em] text-slate-400">EUR</dt>
                        <dd className="mt-1 truncate font-medium text-white">{euroAmount.toFixed(2)}</dd>
                      </div>
                      <div className="min-w-0 rounded-xl bg-slate-900/60 p-2">
                        <dt className="text-[10px] uppercase tracking-[0.12em] text-slate-400">MAD</dt>
                        <dd className="mt-1 truncate font-medium text-white">{euroPriceMAD.toFixed(2)}</dd>
                      </div>
                      <div className="min-w-0 rounded-xl bg-slate-900/60 p-2">
                        <dt className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Rate</dt>
                        <dd className="mt-1 truncate font-medium text-white">{rate.toFixed(2)}</dd>
                      </div>
                    </dl>

                    <p className="break-words text-xs leading-5 text-slate-400">{item.notes || "No notes"}</p>
                  </article>
                );
              })}
            </div>
            </div>

            <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full divide-y divide-white/10 text-sm">
              <thead className="bg-slate-900/70 text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">EUR</th>
                  <th className="px-4 py-3">MAD</th>
                  <th className="px-4 py-3">Rate</th>
                  <th className="px-4 py-3">Notes</th>
                  {canEdit ? <th className="px-4 py-3 text-right">Action</th> : null}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {pageItems.map((item) => {
                  const rate = Number(item.euroAmount || 0) > 0 ? Number(item.euroPriceMAD || 0) / Number(item.euroAmount || 0) : 0;

                  return (
                    <tr key={item.id} className="bg-slate-950/40 text-slate-200 hover:bg-slate-900/70">
                      <td className="px-4 py-3 font-medium text-white">{item.purchaseDate || "No date"}</td>
                      <td className="px-4 py-3">{Number(item.euroAmount || 0).toFixed(2)}</td>
                      <td className="px-4 py-3">{Number(item.euroPriceMAD || 0).toFixed(2)}</td>
                      <td className="px-4 py-3">{rate.toFixed(2)}</td>
                      <td className="px-4 py-3 text-slate-400">{item.notes || "—"}</td>
                      {canEdit ? (
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => onDelete(item.id)}
                            className="rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-1 text-xs font-medium text-rose-100 transition hover:bg-rose-400/20"
                          >
                            Delete
                          </button>
                        </td>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </>
        )}
      </div>

      {totalPages > 1 ? (
        <div className="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="w-full rounded border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white hover:bg-slate-900/70 sm:w-auto"
            disabled={safePage === 1}
          >
            Prev
          </button>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;

              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`rounded px-2 py-1 text-sm ${safePage === pageNumber ? "bg-cyan-400/30 text-white" : "bg-transparent text-slate-300"}`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            className="w-full rounded border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white hover:bg-slate-900/70 sm:w-auto"
            disabled={safePage === totalPages}
          >
            Next
          </button>
        </div>
      ) : null}
    </section>
  );
}
