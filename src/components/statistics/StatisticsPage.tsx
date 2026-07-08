"use client";

import type { StockSummary } from "@/lib/stock";
import { ProfitChart } from "@/components/statistics/ProfitChart";
import { SalesChart } from "@/components/statistics/SalesChart";
import type { TabId } from "@/lib/stock";

type StatisticsPageProps = {
  summary: StockSummary;
  onSelectTab: (tab: TabId) => void;
};

export function StatisticsPage({ summary, onSelectTab }: StatisticsPageProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Statistics</p>
      <h2 className="mt-2 text-xl font-semibold text-white">Live overview of your stock</h2>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { id: "in-stock", label: "In stock", value: summary.inStockCount, icon: "🟢" },
          { id: "sold", label: "Sold", value: summary.soldCount, icon: "✅" },
          { label: "Buy cost (MAD)", value: summary.totalBuyMAD.toFixed(2), icon: "🧾" },
          { label: "Stock value", value: `${summary.stockValue.toFixed(2)} MAD`, icon: "📦" },
          { label: "Total profit", value: `${summary.totalProfit.toFixed(2)} MAD`, icon: "💰" },
          { label: "Avg EUR rate", value: summary.averageEuroRate > 0 ? `${summary.averageEuroRate.toFixed(2)} MAD / EUR` : "Add purchases", icon: "⚡" },
          { label: "Total sell (MAD)", value: `${summary.totalSellMAD.toFixed(2)} MAD`, icon: "💵" },
          { label: "Total items", value: summary.totalItems, icon: "📊" },
        ].map((item) => (
          <article key={item.label} onClick={() => item.id && onSelectTab(item.id as TabId)} className={`rounded-3xl border border-white/10 bg-slate-950/60 p-5 shadow-lg shadow-black/20 ${
    item.id ? "cursor-pointer hover:border-cyan-400" : ""
  }`}>
            <p className="text-sm text-slate-200">{item.icon} {item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <ProfitChart totalProfit={summary.totalProfit} stockValue={summary.stockValue} />
        <SalesChart soldCount={summary.soldCount} inStockCount={summary.inStockCount} />
      </div>

      <div className="mt-5 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5 text-sm text-cyan-50">
        Profit is calculated from your euro purchases and your sell price in MAD. If you do not have euro history yet, the profit will be estimated once rates are available.
      </div>
    </article>
  );
}