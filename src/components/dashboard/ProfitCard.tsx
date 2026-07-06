type ProfitCardProps = {
  value: number;
};

export function ProfitCard({ value }: ProfitCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 shadow-lg shadow-black/20">
      <p className="text-sm text-slate-200">💹 Profit</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value.toFixed(2)} MAD</p>
    </article>
  );
}