import { getProductStatus, normalizeDateForInput, type ProductRecord } from "@/lib/stock";

type ProductFlowChartProps = {
  records: ProductRecord[];
};

type MonthlyFlow = {
  month: string;
  bought: number;
  sold: number;
};

export function ProductFlowChart({ records }: ProductFlowChartProps) {
  const monthlyTotals = records.reduce<Record<string, MonthlyFlow>>((totals, record) => {
    const addToMonth = (date: string, field: "bought" | "sold") => {
      const month = normalizeDateForInput(date).slice(0, 7);
      if (!/^\d{4}-\d{2}$/.test(month)) {
        return;
      }

      totals[month] ??= { month, bought: 0, sold: 0 };
      totals[month][field] += 1;
    };

    addToMonth(record.purchaseDate, "bought");
    addToMonth(record.saleDate, "sold");
    return totals;
  }, {});

  const monthKeys = Object.keys(monthlyTotals).sort();
  const months = monthKeys.map((month) => monthlyTotals[month]);

  const chartWidth = 720;
  const chartHeight = 260;
  const padding = { top: 20, right: 16, bottom: 42, left: 34 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;
  const maximum = Math.max(...months.flatMap((month) => [month.bought, month.sold]), 1);
  const xFor = (index: number) => padding.left + (months.length > 1 ? (index / (months.length - 1)) * plotWidth : plotWidth / 2);
  const yFor = (value: number) => padding.top + plotHeight - (value / maximum) * plotHeight;
  const pathFor = (field: "bought" | "sold") => months.map((month, index) => {
    const command = index === 0 ? "M" : "L";
    return `${command} ${xFor(index)} ${yFor(month[field])}`;
  }).join(" ");
  const formatMonth = (month: string) => new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(`${month}-01T00:00:00`));
  const totalBought = records.length;
  const totalSold = records.filter((record) => getProductStatus(record) === "sold").length;

  return (
    <article className="mt-5 rounded-3xl border border-white/10 bg-slate-950/60 p-5 shadow-lg shadow-black/20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-slate-200">📦 Product orders</p>
          <p className="mt-1 text-sm text-slate-400">{months.length} month{months.length === 1 ? "" : "s"} with activity</p>
        </div>
        <div className="flex gap-4 text-xs text-slate-300">
          <span><i className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-cyan-400" />Bought</span>
          <span><i className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />Sold</span>
        </div>
      </div>

      {months.length > 0 ? (
        <div className="mt-5 overflow-x-auto">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-auto min-w-[32rem] w-full" role="img" aria-label="Monthly quantities bought and sold">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padding.top + plotHeight * ratio;
              const label = Math.round(maximum * (1 - ratio));
              return <g key={ratio}><line x1={padding.left} x2={chartWidth - padding.right} y1={y} y2={y} stroke="rgb(148 163 184 / 0.18)" /><text x={padding.left - 9} y={y + 4} fill="#94a3b8" fontSize="10" textAnchor="end">{label}</text></g>;
            })}
            <path d={pathFor("bought")} fill="none" stroke="#22d3ee" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            <path d={pathFor("sold")} fill="none" stroke="#34d399" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            {months.map((month, index) => (
              <g key={month.month}>
                <circle cx={xFor(index)} cy={yFor(month.bought)} r="4" fill="#22d3ee" />
                <circle cx={xFor(index)} cy={yFor(month.sold)} r="4" fill="#34d399" />
                <title>{`${formatMonth(month.month)}: ${month.bought} bought, ${month.sold} sold`}</title>
                <text x={xFor(index)} y={chartHeight - 14} fill="#94a3b8" fontSize="11" textAnchor="middle">{formatMonth(month.month)}</text>
              </g>
            ))}
          </svg>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-white/10 pt-3 text-xs sm:grid-cols-3 lg:grid-cols-4">
            {months.map((month) => (
              <div key={`${month.month}-values`} className="flex items-center justify-between gap-2 text-slate-400">
                <span>{formatMonth(month.month)}</span>
                <span className="whitespace-nowrap"><strong className="text-cyan-300">{month.bought}</strong> / <strong className="text-emerald-300">{month.sold}</strong></span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">Total bought: <strong className="text-cyan-300">{totalBought}</strong> · Total sold: <strong className="text-emerald-300">{totalSold}</strong></p>
        </div>
      ) : (
        <p className="mt-6 text-sm text-slate-400">Add dated products to see monthly quantities here.</p>
      )}
    </article>
  );
}