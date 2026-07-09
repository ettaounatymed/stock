"use client";

import { STOCK_TABS, type TabId } from "@/lib/stock";


type SidebarProps = {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
};

export function Sidebar({ activeTab, onSelectTab, isMobileOpen = false, onCloseMobile }: SidebarProps) {
  return (
    <aside className={`rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all sm:p-5 ${isMobileOpen ? "fixed inset-x-3 top-24 z-40 max-h-[70vh] overflow-auto" : "hidden sm:block"}`}>
      <div className="flex items-center justify-between sm:hidden">
        <p className="text-sm font-semibold text-white">Menu</p>
        {onCloseMobile ? (
          <button type="button" onClick={onCloseMobile} className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white">
            Close
          </button>
        ) : null}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        {STOCK_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              onSelectTab(item.id);
              onCloseMobile?.();
            }}
            className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
              activeTab === item.id
                ? "border-cyan-400/60 bg-cyan-400/15 text-white"
                : "border-white/10 bg-slate-950/40 text-slate-100 hover:border-cyan-400/30 hover:bg-slate-900/70"
            }`}
          >
            <span aria-hidden="true">
              {typeof item.icon === "string" ? (
                item.icon
              ) : item.icon ? (
                (() => {
                  const Icon = item.icon as unknown as React.ElementType;
                  return <Icon className="h-4 w-4" />;
                })()
              ) : null}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-50 sm:mt-6">
        Add your euro purchases first, then the average rate will be used for product cost and profit.
      </div>
    </aside>
  );
}