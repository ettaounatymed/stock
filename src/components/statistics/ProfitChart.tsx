type ProfitChartProps = {
  totalProfit: number;
  stockValue: number;
};

export function ProfitChart({ totalProfit, stockValue }: ProfitChartProps) {
  const safeStock = Math.max(stockValue, 1);
  const profitRatio = Math.max(Math.min(Math.abs(totalProfit) / safeStock, 1), 0);

  return (
    <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 shadow-lg shadow-black/20">
      <p className="text-sm text-slate-200">💹 Profit snapshot</p>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${totalProfit >= 0 ? "bg-emerald-400" : "bg-rose-400"}`} style={{ width: `${Math.max(profitRatio * 100, 12)}%` }} />
      </div>
      <p className="mt-3 text-sm text-slate-300">Total profit: {totalProfit.toFixed(2)} MAD</p>
    </article>
  );
}