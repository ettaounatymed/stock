"use client";

import { STOCK_TABS, type TabId } from "@/lib/stock";


type SidebarProps = {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
};

export function Sidebar({ activeTab, onSelectTab }: SidebarProps) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
     
      <div className="mt-5 space-y-2">
        {STOCK_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
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
                  // cast to ElementType to satisfy JSX element requirements
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

      <div className="mt-6 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-50">
        Add your euro purchases first, then the average rate will be used for product cost and profit.
      </div>
    </aside>
  );
}