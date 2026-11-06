import { CircleDollarSign, TrendingDown, TrendingUp } from "lucide-react";

type ProfitChartProps = {
  totalProfit: number;
  stockValue: number;
};

export function ProfitChart({ totalProfit, stockValue }: ProfitChartProps) {
  const safeStock = Math.max(stockValue, 1);
  const profitRatio = Math.max(Math.min(Math.abs(totalProfit) / safeStock, 1), 0);
  const circumference = 2 * Math.PI * 42;
  const dashLength = profitRatio * circumference;
  const TrendIcon = totalProfit >= 0 ? TrendingUp : TrendingDown;
  const tone = totalProfit >= 0 ? "text-emerald-300" : "text-rose-300";
  const ringColor = totalProfit >= 0 ? "#34d399" : "#fb7185";

  return (
    <article className="rounded-2xl border border-white/[0.07] bg-[#091831]/90 p-5 shadow-lg shadow-black/10 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Profit snapshot</p>
          <p className="mt-1 text-xs text-slate-400">Compared with current stock value</p>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.06] text-emerald-300">
          <CircleDollarSign className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
        <div className="relative grid h-36 w-36 shrink-0 place-items-center">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" role="img" aria-label={`${Math.round(profitRatio * 100)} percent of current stock value`}>
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(148 163 184 / 0.12)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={ringColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${dashLength} ${circumference}`}
            />
          </svg>
          <div className="absolute text-center">
            <p className={`text-2xl font-semibold text-white`}>{Math.round(profitRatio * 100)}%</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-slate-500">of stock value</p>
          </div>
        </div>

        <div className="w-full space-y-3 sm:flex-1">
          <div className="rounded-xl border border-white/[0.06] bg-slate-950/30 p-4">
            <p className="text-xs text-slate-400">Total profit</p>
            <div className="mt-1 flex items-center gap-2">
              <TrendIcon className={`h-4 w-4 ${tone}`} aria-hidden="true" />
              <p className={`text-xl font-semibold ${tone}`}>{totalProfit.toFixed(2)} MAD</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 px-1 text-xs">
            <span className="text-slate-500">Current stock value</span>
            <span className="font-medium text-slate-300">{stockValue.toFixed(2)} MAD</span>
          </div>
        </div>
      </div>
    </article>
  );
}
