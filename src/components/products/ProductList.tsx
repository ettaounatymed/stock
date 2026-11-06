"use client";

import React, { useState } from "react";

type ProductListProps<T> = {
  items: T[];
  emptyMessage: string;
  renderItem: (item: T) => React.ReactNode;
  layout?: "grid" | "stack";
  pageSize?: number;
};

export function ProductList<T>({ items, emptyMessage, renderItem, layout = "grid", pageSize }: ProductListProps<T>) {
  const [page, setPage] = useState(1);

  const effectivePageSize = pageSize && pageSize > 0 ? pageSize : items.length;

  if (items.length === 0) {
    return <p className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-4 text-sm text-slate-200">{emptyMessage}</p>;
  }

  const totalPages = Math.max(1, Math.ceil(items.length / effectivePageSize));
  const currentPage = Math.min(page, totalPages);

  const start = (currentPage - 1) * effectivePageSize;
  const pageItems = items.slice(start, start + effectivePageSize);

  return (
    <div>
      <div className={layout === "stack" ? "grid gap-4" : "grid gap-4 md:grid-cols-2 2xl:grid-cols-3"}>{pageItems.map(renderItem)}</div>

      {totalPages > 1 && (
        <div className="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, Math.min(totalPages, p) - 1))}
            className="w-full rounded-xl border border-blue-300/15 bg-[#091831] px-4 py-2 text-sm text-slate-200 transition hover:border-blue-300/30 hover:bg-blue-500/10 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            disabled={currentPage === 1}
          >
            Prev
          </button>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const idx = i + 1;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPage(idx)}
                  className={`rounded-xl border px-3 py-2 text-sm transition ${currentPage === idx ? "border-blue-400/40 bg-blue-500/20 text-white" : "border-white/[0.06] bg-[#091831] text-slate-400 hover:border-blue-400/25 hover:text-white"}`}
                >
                  {idx}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, Math.min(totalPages, p) + 1))}
            className="w-full rounded-xl border border-blue-300/15 bg-[#091831] px-4 py-2 text-sm text-slate-200 transition hover:border-blue-300/30 hover:bg-blue-500/10 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}