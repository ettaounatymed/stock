import { PackageCheck, ShoppingBag } from "lucide-react";

type SalesChartProps = {
  soldCount: number;
  inStockCount: number;
};

export function SalesChart({ soldCount, inStockCount }: SalesChartProps) {
  const total = soldCount + inStockCount;
  const soldRatio = total > 0 ? soldCount / total : 0;
  const circumference = 2 * Math.PI * 42;
  const dashLength = soldRatio * circumference;

  return (
    <article className="rounded-2xl border border-white/[0.07] bg-[#091831]/90 p-5 shadow-lg shadow-black/10 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Inventory mix</p>
          <p className="mt-1 text-xs text-slate-400">Sold and available products</p>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-xl border border-blue-400/10 bg-blue-400/[0.06] text-blue-300">
          <PackageCheck className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
        <div className="relative grid h-36 w-36 shrink-0 place-items-center">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" role="img" aria-label={`${soldCount} sold out of ${total} products`}>
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(56 189 248 / 0.18)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${dashLength} ${circumference}`}
            />
          </svg>
          <div className="absolute text-center">
            <p className="text-2xl font-semibold text-white">{total}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-slate-500">products</p>
          </div>
        </div>

        <div className="w-full space-y-3 sm:flex-1">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-slate-950/30 p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs text-slate-400">Sold</p>
                <p className="mt-0.5 text-lg font-semibold text-white">{soldCount}</p>
              </div>
            </div>
            <span className="text-sm font-medium text-cyan-300">{(soldRatio * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-slate-950/30 p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-400/10 text-blue-300">
                <PackageCheck className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs text-slate-400">In stock</p>
                <p className="mt-0.5 text-lg font-semibold text-white">{inStockCount}</p>
              </div>
            </div>
            <span className="text-sm font-medium text-blue-300">{((1 - soldRatio) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </article>
  );
}
