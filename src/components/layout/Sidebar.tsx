"use client";

import { STOCK_TABS, type TabId } from "@/lib/stock";


type SidebarProps = {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  visibleTabs?: TabId[];
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
};

export function Sidebar({ activeTab, onSelectTab, visibleTabs, isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const tabs = visibleTabs ? STOCK_TABS.filter((item) => visibleTabs.includes(item.id)) : STOCK_TABS;

  return (
    <aside className={`app-sidebar rounded-3xl border p-4 transition-all sm:sticky sm:top-6 sm:max-h-[calc(100vh-3rem)] sm:overflow-y-auto sm:p-5 xl:static xl:h-full xl:max-h-full ${isMobileOpen ? "fixed inset-x-3 top-24 z-40 max-h-[70vh] overflow-auto" : "hidden sm:block"}`}>
      <div className="flex items-center justify-between sm:hidden">
        <p className="text-sm font-semibold text-white">Menu</p>
        {onCloseMobile ? (
          <button type="button" onClick={onCloseMobile} className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white">
            Close
          </button>
        ) : null}
      </div>
      <div className="mb-5 hidden border-b border-blue-300/10 pb-5 sm:block">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-300">Stock manager</p>
        <p className="mt-1 text-xs text-slate-500">Inventory workspace</p>
      </div>
      <div className="mt-4 grid gap-2 sm:mt-0 sm:grid-cols-2 xl:grid-cols-1">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              onSelectTab(item.id);
              onCloseMobile?.();
            }}
            className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
              activeTab === item.id
                ? "border-blue-400/35 bg-blue-500/15 text-white shadow-[inset_0_0_20px_rgba(22,133,255,0.08)]"
                : "border-white/[0.06] bg-slate-950/25 text-slate-300 hover:border-blue-400/20 hover:bg-blue-500/[0.07] hover:text-white"
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

      <div className="mt-4 rounded-2xl border border-blue-400/15 bg-blue-500/[0.07] p-4 text-sm leading-6 text-blue-100/80 sm:mt-6">
        Add your euro purchases first, then the average rate will be used for product cost and profit.
      </div>
    </aside>
  );
}