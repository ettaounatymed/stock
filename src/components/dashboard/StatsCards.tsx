import type { StockSummary } from "@/lib/stock";
import { ProfitCard } from "@/components/dashboard/ProfitCard";
import { ProductsCard } from "@/components/dashboard/ProductsCard";
import { StockCard } from "@/components/dashboard/StockCard";
import { TotalSellMADCard } from "./TotalSellMADCard";

type StatsCardsProps = {
  summary: StockSummary;
};

export function StatsCards({ summary }: StatsCardsProps) {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
      <ProfitCard value={summary.totalProfit} />
      <StockCard stockValue={summary.stockValue} euroRemaining={summary.euroRemaining} />
      <ProductsCard inStockCount={summary.inStockCount} soldCount={summary.soldCount} totalItems={summary.totalItems} />
      <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 shadow-lg shadow-black/20">
        <p className="text-sm text-slate-200">⚡ Avg EUR rate</p>
        <p className="mt-3 text-3xl font-semibold text-white">{summary.averageEuroRate > 0 ? `${summary.averageEuroRate.toFixed(2)} MAD / EUR` : "Add purchases"}</p>
      </article>
      <TotalSellMADCard totalSellMAD={summary.totalSellMAD} />
    </section>
  );
}