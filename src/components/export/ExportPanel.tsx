"use client";

type ExportPanelProps = {
  onExport: () => void;
  disabled: boolean;
  totalCount: number;
};

export function ExportPanel({ onExport, disabled, totalCount }: ExportPanelProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Export</p>
      <h2 className="mt-2 text-xl font-semibold text-white">Download your inventory</h2>
      <p className="mt-3 text-slate-200/90">Export a CSV with the current product list, status, IMEI, and estimated profit.</p>
      <p className="mt-3 text-xs text-slate-400">{totalCount} products ready for export.</p>
      <button type="button" onClick={onExport} disabled={disabled} className="mt-5 rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-200">
        Export CSV
      </button>
    </article>
  );
}