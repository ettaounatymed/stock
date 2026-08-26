import type { StockSummary } from "@/lib/stock";
import { ProfitCard } from "@/components/dashboard/ProfitCard";
import { ProductsCard } from "@/components/dashboard/ProductsCard";
import { StockCard } from "@/components/dashboard/StockCard";
import { TotalSellMADCard } from "./TotalSellMADCard";
import { MetricCard } from "./MetricCard";

type StatsCardsProps = {
  summary: StockSummary;
};

export function StatsCards({ summary }: StatsCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <ProfitCard value={summary.totalProfit} />
      <StockCard stockValue={summary.stockValue} euroRemaining={summary.euroRemaining} />
      <ProductsCard inStockCount={summary.inStockCount} soldCount={summary.soldCount} totalItems={summary.totalItems} />
      <MetricCard
        icon="⚡"
        label="Avg EUR rate"
        value={summary.averageEuroRate > 0 ? `${summary.averageEuroRate.toFixed(2)} MAD / EUR` : "Add purchases"}
      />
      <MetricCard
        icon="💶"
        label="Total MAD spent for EUR"
        value={`${summary.totalEuroBoughtMAD.toFixed(2)} MAD`}
        detail={`${summary.totalEuroBought.toFixed(2)} EUR bought`}
      />
      <MetricCard
        icon="📈"
        label="Profit margin"
        value={`${summary.profitMargin.toFixed(1)}%`}
        detail={`${summary.averageProfitPerSoldItem.toFixed(2)} MAD avg per sold`}
      />
      <MetricCard
        icon="📦"
        label="Sell-through"
        value={`${summary.sellThroughRate.toFixed(1)}%`}
        detail={`${summary.soldCount}/${summary.totalItems} sold`}
      />
      <MetricCard
        icon="⚠️"
        label="Low stock"
        value={`${summary.lowStockCount} items`}
        detail={summary.lowStockAlert ? "Reorder soon" : "Stock levels are healthy"}
        variant={summary.lowStockAlert ? "warning" : "positive"}
      />
      <TotalSellMADCard totalSellMAD={summary.totalSellMAD} />
    </section>
  );
}