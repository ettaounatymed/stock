type StockCardProps = {
  stockValue: number;
  euroRemaining: number;
};

export function StockCard({ stockValue, euroRemaining }: StockCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 shadow-lg shadow-black/20">
      <p className="text-sm text-slate-200">📈 Stock Value</p>
      <p className="mt-3 text-3xl font-semibold text-white">{stockValue.toFixed(2)} MAD</p>
      <p className="mt-2 text-sm text-slate-300">💶 {euroRemaining.toFixed(2)} EUR remaining</p>
    </article>
  );
}