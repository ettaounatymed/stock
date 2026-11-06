"use client";

import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Boxes,
  CircleDollarSign,
  Coins,
  Euro,
  Package,
  Percent,
  ShoppingBag,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { StockSummary, TabId } from "@/lib/stock";
import { ProfitChart } from "@/components/statistics/ProfitChart";
import { SalesChart } from "@/components/statistics/SalesChart";

type StatisticsPageProps = {
  summary: StockSummary;
  onSelectTab: (tab: TabId) => void;
};

type Metric = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tab?: TabId;
  tone?: "warning";
};

export function StatisticsPage({ summary, onSelectTab }: StatisticsPageProps) {
  const metrics: Metric[] = [
    { label: "In stock", value: String(summary.inStockCount), detail: "Available products", icon: Package, tab: "in-stock" },
    { label: "Sold", value: String(summary.soldCount), detail: "Completed sales", icon: ShoppingBag, tab: "sold" },
    { label: "Product purchases (EUR)", value: `${summary.totalProductBuyEUR.toFixed(2)} EUR`, detail: "Purchase currency", icon: Euro },
    { label: "Buy cost (MAD)", value: `${summary.totalBuyMAD.toFixed(2)} MAD`, detail: "Including allocated costs", icon: Wallet },
    { label: "Stock value", value: `${summary.stockValue.toFixed(2)} MAD`, detail: "Current inventory", icon: Boxes },
    { label: "Total profit", value: `${summary.totalProfit.toFixed(2)} MAD`, detail: `${summary.averageProfitPerSoldItem.toFixed(2)} MAD average per sale`, icon: CircleDollarSign },
    { label: "Profit margin", value: `${summary.profitMargin.toFixed(1)}%`, detail: "On sold product costs", icon: Percent },
    { label: "Sell-through", value: `${summary.sellThroughRate.toFixed(1)}%`, detail: `${summary.soldCount} of ${summary.totalItems} products sold`, icon: TrendingUp },
    { label: "Low stock", value: `${summary.lowStockCount} items`, detail: summary.lowStockAlert ? "Restock may be needed" : "Stock levels are healthy", icon: AlertTriangle, tone: "warning" },
    { label: "Average EUR rate", value: summary.averageEuroRate > 0 ? `${summary.averageEuroRate.toFixed(2)} MAD / EUR` : "Add purchases", detail: "Weighted average", icon: Activity },
    { label: "Total euros bought", value: `${summary.totalEuroBought.toFixed(2)} EUR`, detail: "Across all purchases", icon: Coins },
    { label: "Euro purchases (MAD)", value: `${summary.totalEuroBoughtMAD.toFixed(2)} MAD`, detail: "Total exchange spend", icon: Banknote },
    { label: "Total sales", value: `${summary.totalSellMAD.toFixed(2)} MAD`, detail: "Sales value recorded", icon: CircleDollarSign },
    { label: "Total products", value: String(summary.totalItems), detail: "Across all stock", icon: Boxes },
  ];

  const ProfitIcon = summary.totalProfit >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <article className="relative isolate overflow-hidden rounded-[2rem] border border-blue-400/15 bg-[#06132b]/90 p-4 shadow-[0_24px_80px_-32px_rgba(0,81,255,0.42)] sm:p-6 lg:p-7">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 left-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative">
        <header className="mb-6 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
              <Activity className="h-4 w-4" aria-hidden="true" />
              Business overview
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Statistics dashboard</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              A clear view of your inventory, sales and overall performance.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-2 text-xs font-medium text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            Live overview
          </div>
        </header>

        <section aria-label="Key performance indicators" className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
          <KeyMetric
            label="Stock value"
            value={`${summary.stockValue.toFixed(2)} MAD`}
            detail={`${summary.inStockCount} products currently available`}
            icon={Package}
            accent="blue"
          />
          <KeyMetric
            label="Total profit"
            value={`${summary.totalProfit.toFixed(2)} MAD`}
            detail={`${summary.profitMargin.toFixed(1)}% profit margin`}
            icon={ProfitIcon}
            accent={summary.totalProfit >= 0 ? "green" : "rose"}
          />
          <KeyMetric
            label="Products tracked"
            value={String(summary.totalItems)}
            detail={`${summary.soldCount} sold · ${summary.inStockCount} in stock`}
            icon={Boxes}
            accent="cyan"
          />
          <KeyMetric
            label="Sell-through"
            value={`${summary.sellThroughRate.toFixed(1)}%`}
            detail={`${summary.soldCount} of ${summary.totalItems} products sold`}
            icon={TrendingUp}
            accent="violet"
            progress={summary.sellThroughRate}
          />
        </section>

        <section aria-label="Stock and sales charts" className="mt-4 grid gap-4 xl:grid-cols-2">
          <ProfitChart totalProfit={summary.totalProfit} stockValue={summary.stockValue} />
          <SalesChart soldCount={summary.soldCount} inStockCount={summary.inStockCount} />
        </section>

        <section className="mt-7" aria-labelledby="details-heading">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">Detailed breakdown</p>
              <h3 id="details-heading" className="mt-1 text-lg font-semibold text-white">All metrics</h3>
            </div>
            <span className="hidden text-xs text-slate-500 sm:block">Select stock or sold to view products</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              const { tab } = metric;
              const cardClassName = `group h-full w-full rounded-2xl border p-4 text-left transition duration-200 ${
                metric.tone === "warning"
                  ? "border-amber-400/15 bg-amber-400/[0.035] hover:border-amber-300/35 hover:bg-amber-400/[0.07]"
                  : "border-white/[0.07] bg-[#0a1934]/80 hover:border-blue-400/30 hover:bg-[#0c1e3d]"
              } ${tab ? "cursor-pointer" : ""}`;

              const content = (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <span className={`grid h-9 w-9 place-items-center rounded-xl ${
                      metric.tone === "warning" ? "bg-amber-400/10 text-amber-300" : "bg-blue-500/10 text-blue-300"
                    }`}>
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    {tab ? <ArrowRight className="mt-2 h-4 w-4 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-blue-300" aria-hidden="true" /> : null}
                  </div>
                  <p className="mt-4 text-xs font-medium text-slate-400">{metric.label}</p>
                  <p className="mt-1 break-words text-lg font-semibold tracking-tight text-white sm:text-xl">{metric.value}</p>
                  <p className={`mt-1 text-xs ${metric.tone === "warning" && summary.lowStockAlert ? "text-amber-300" : "text-slate-500"}`}>
                    {metric.detail}
                  </p>
                </>
              );

              return tab ? (
                <button key={metric.label} type="button" onClick={() => onSelectTab(tab)} className={cardClassName}>
                  {content}
                </button>
              ) : (
                <div key={metric.label} className={cardClassName}>{content}</div>
              );
            })}
          </div>
        </section>

        <footer className="mt-5 flex items-start gap-3 rounded-2xl border border-blue-400/10 bg-blue-500/[0.06] p-4 text-xs leading-5 text-slate-400 sm:text-sm">
          <CircleDollarSign className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
          <p>
            Profit = sales − purchase cost − allocated product costs − general expenses. Expenses in EUR are converted using your average EUR rate.
          </p>
        </footer>
      </div>
    </article>
  );
}

type KeyMetricProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  accent: "blue" | "green" | "cyan" | "violet" | "rose";
  progress?: number;
};

function KeyMetric({ label, value, detail, icon: Icon, accent, progress }: KeyMetricProps) {
  const accentClasses = {
    blue: "border-blue-400/15 from-blue-500/15 to-blue-500/[0.02] text-blue-300",
    green: "border-emerald-400/15 from-emerald-500/15 to-emerald-500/[0.02] text-emerald-300",
    cyan: "border-cyan-400/15 from-cyan-500/15 to-cyan-500/[0.02] text-cyan-300",
    violet: "border-violet-400/15 from-violet-500/15 to-violet-500/[0.02] text-violet-300",
    rose: "border-rose-400/15 from-rose-500/15 to-rose-500/[0.02] text-rose-300",
  }[accent];

  return (
    <article className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-4 ${accentClasses}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950/50">
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 break-words text-2xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{detail}</p>
      {progress !== undefined ? (
        <div
          className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-label="Sell-through"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.min(Math.max(progress, 0), 100)}
        >
          <div className="h-full rounded-full bg-violet-400 transition-[width]" style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }} />
        </div>
      ) : null}
    </article>
  );
}
