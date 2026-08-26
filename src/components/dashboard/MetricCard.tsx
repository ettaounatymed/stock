type MetricCardProps = {
  icon: string;
  label: string;
  value: string;
  detail?: string;
  variant?: "default" | "warning" | "positive";
};

const variantStyles: Record<NonNullable<MetricCardProps["variant"]>, string> = {
  default: "border-white/10 bg-slate-950/60 text-slate-100",
  warning: "border-amber-400/30 bg-amber-400/10 text-amber-100",
  positive: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
};

export function MetricCard({ icon, label, value, detail, variant = "default" }: MetricCardProps) {
  return (
    <article className={`rounded-3xl border p-5 shadow-lg shadow-black/20 ${variantStyles[variant]}`}>
      <p className="text-sm text-slate-200">{icon} {label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      {detail ? <p className="mt-2 text-sm text-slate-300">{detail}</p> : null}
    </article>
  );
}
