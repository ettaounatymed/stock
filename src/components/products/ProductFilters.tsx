"use client";

type ProductFiltersProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  visibleCount: number;
  totalCount: number;
};

export function ProductFilters({ searchTerm, onSearchChange, visibleCount, totalCount }: ProductFiltersProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <label className="block flex-1 text-sm text-slate-100">
        <span className="flex items-center gap-2">🔎 Search products</span>
        <input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name, IMEI, country, notes..."
          className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400"
        />
      </label>

      <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100">
        {visibleCount} visible / {totalCount} total
      </span>
    </div>
  );
}