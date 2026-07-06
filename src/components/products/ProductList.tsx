"use client";

type ProductListProps<T> = {
  items: T[];
  emptyMessage: string;
  renderItem: (item: T) => React.ReactNode;
  layout?: "grid" | "stack";
};

export function ProductList<T>({ items, emptyMessage, renderItem, layout = "grid" }: ProductListProps<T>) {
  if (items.length === 0) {
    return <p className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-4 text-sm text-slate-200">{emptyMessage}</p>;
  }

  return <div className={layout === "grid" ? "grid gap-3 md:grid-cols-2" : "space-y-3"}>{items.map(renderItem)}</div>;
}