type ProductsCardProps = {
  inStockCount: number;
  soldCount: number;
  totalItems: number;
};

export function ProductsCard({ inStockCount, soldCount, totalItems }: ProductsCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 shadow-lg shadow-black/20">
      <p className="text-sm text-slate-200">📦 Products</p>
      <p className="mt-3 text-3xl font-semibold text-white">{totalItems}</p>
      <p className="mt-2 text-sm text-slate-300">{inStockCount} in stock / {soldCount} sold</p>
    </article>
  );
}