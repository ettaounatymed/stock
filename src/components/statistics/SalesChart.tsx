type SalesChartProps = {
  soldCount: number;
  inStockCount: number;
};

export function SalesChart({ soldCount, inStockCount }: SalesChartProps) {
  const total = Math.max(soldCount + inStockCount, 1);
  const soldRatio = (soldCount / total) * 100;

  return (
    <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 shadow-lg shadow-black/20">
      <p className="text-sm text-slate-200">📊 Sales mix</p>
      <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-emerald-400" style={{ width: `${soldRatio}%` }} />
        <div className="h-full bg-amber-400" style={{ width: `${100 - soldRatio}%` }} />
      </div>
      <p className="mt-3 text-sm text-slate-300">{soldCount} sold • {inStockCount} in stock</p>
    </article>
  );
}