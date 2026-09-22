"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { ExpenseCategory, ExpenseFormValues, ExpenseRecord, ProductRecord } from "@/lib/stock";

const categories: ExpenseCategory[] = ["Import", "Transport", "Delivery", "Packaging", "Customs", "Other"];
const PAGE_SIZE = 8;
const categoryIcons: Record<ExpenseCategory, string> = {
  Import: "🚚",
  Transport: "🚗",
  Delivery: "📦",
  Packaging: "📦",
  Customs: "🛃",
  Other: "💼",
};

type ExpensesPageProps = {
  expenses: ExpenseRecord[];
  products: ProductRecord[];
  form: ExpenseFormValues;
  canEdit: boolean;
  editingId: string | null;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onProductToggle: (productId: string) => void;
  onManualAllocationChange: (productId: string, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEdit: (expense: ExpenseRecord) => void;
  onDelete: (id: string) => void;
};

const formatMoney = (amount: number, currency: string) => `${amount.toFixed(2)} ${currency}`;
const formatTotals = (items: ExpenseRecord[]) => {
  const eur = items.filter((item) => item.currency === "EUR").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const mad = items.filter((item) => item.currency === "MAD").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  return [eur > 0 ? formatMoney(eur, "EUR") : "", mad > 0 ? formatMoney(mad, "MAD") : ""].filter(Boolean).join(" + ") || "0.00";
};

export function ExpensesPage({ expenses, products, form, canEdit, editingId, onChange, onProductToggle, onManualAllocationChange, onSubmit, onEdit, onDelete }: ExpensesPageProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | "all">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"history" | "add">("history");

  const filteredExpenses = useMemo(() => expenses.filter((expense) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [expense.description, expense.category, expense.currency, expense.notes].join(" ").toLowerCase().includes(query);
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
    const matchesFrom = !fromDate || expense.date >= fromDate;
    const matchesTo = !toDate || expense.date <= toDate;
    return matchesSearch && matchesCategory && matchesFrom && matchesTo;
  }), [categoryFilter, expenses, fromDate, search, toDate]);

  const monthKey = new Date().toISOString().slice(0, 7);
  const monthExpenseItems = expenses.filter((item) => item.date.startsWith(monthKey));
  const byCategory = categories.map((category) => ({ category, items: expenses.filter((item) => item.category === category) })).filter((item) => item.items.length > 0);
  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleExpenses = filteredExpenses.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const startNew = () => {
    setView("add");
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Additional costs</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Expenses</h2>
          <p className="mt-1 text-sm text-slate-300">Track import and business costs, then attach them to products for real profit.</p>
        </div>
        {canEdit && view === "history" ? <button type="button" onClick={startNew} className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">+ Add Expense</button> : null}
      </div>

      <div className="flex rounded-2xl border border-white/10 bg-slate-950/50 p-1">
        <button type="button" onClick={() => setView("history")} className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${view === "history" ? "bg-cyan-400 text-slate-950" : "text-slate-300 hover:bg-white/10"}`}>Expense History</button>
        {canEdit ? <button type="button" onClick={startNew} className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${view === "add" ? "bg-cyan-400 text-slate-950" : "text-slate-300 hover:bg-white/10"}`}>Add New Expense</button> : null}
      </div>

      {view === "history" ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total expenses" value={formatTotals(expenses)} />
        <Metric label="Expenses this month" value={formatTotals(monthExpenseItems)} />
        <Metric label="Categories used" value={String(byCategory.length)} />
        <Metric label="Recorded expenses" value={String(expenses.length)} />
      </div> : null}

      {view === "history" ? <div className="grid gap-4 xl:grid-cols-[1fr_1.6fr]">
        <article className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-200">By category</p>
          <div className="mt-4 space-y-3">
            {byCategory.length === 0 ? <p className="text-sm text-slate-400">No expenses recorded yet.</p> : byCategory.map((item) => (
              <div key={item.category} className="flex items-center justify-between border-b border-white/10 pb-2 text-sm">
                <span className="text-slate-200">{item.category}</span><span className="font-semibold text-white">{formatTotals(item.items)}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search expenses..." className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400" />
            <select value={categoryFilter} onChange={(event) => { setCategoryFilter(event.target.value as ExpenseCategory | "all"); setPage(1); }} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"><option value="all">All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select>
            <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400" />
            <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400" />
          </div>
        </article>
      </div> : null}

      {view === "add" ? <ExpenseForm form={form} products={products} canEdit={canEdit} editingId={editingId} onChange={onChange} onProductToggle={onProductToggle} onManualAllocationChange={onManualAllocationChange} onSubmit={onSubmit} onCancel={() => setView("history")} /> : null}

      {view === "history" ? <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-xl shadow-black/20 backdrop-blur-xl">
        <div className="border-b border-white/10 px-5 py-4"><p className="text-sm text-slate-300">{filteredExpenses.length} visible / {expenses.length} total</p></div>
        {visibleExpenses.length === 0 ? <p className="p-5 text-sm text-slate-300">{expenses.length ? "No expenses match these filters." : "No expenses recorded yet."}</p> : <div className="divide-y divide-white/10">
          {visibleExpenses.map((expense) => <div key={expense.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold text-white">{expense.description}</p><span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 text-xs text-cyan-100">{expense.category}</span></div><p className="mt-1 text-sm text-slate-400">{expense.date || "No date"} · {expense.allocations.length ? `${expense.allocations.length} product${expense.allocations.length === 1 ? "" : "s"}` : "General expense"}{expense.notes ? ` · ${expense.notes}` : ""}</p></div>
            <div className="flex items-center gap-3"><p className="font-semibold text-white">{formatMoney(Number(expense.amount || 0), expense.currency)}</p>{canEdit ? <><button type="button" onClick={() => { onEdit(expense); setView("add"); }} className="rounded-xl border border-cyan-400/30 px-3 py-2 text-xs text-cyan-100">Edit</button><button type="button" onClick={() => onDelete(expense.id)} className="rounded-xl border border-rose-400/30 px-3 py-2 text-xs text-rose-100">Delete</button></> : null}</div>
          </div>)}
        </div>}
        {totalPages > 1 ? <div className="flex items-center justify-center gap-3 border-t border-white/10 p-4"><button type="button" disabled={safePage === 1} onClick={() => setPage((value) => value - 1)} className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white disabled:opacity-40">Prev</button><span className="text-sm text-slate-300">{safePage} / {totalPages}</span><button type="button" disabled={safePage === totalPages} onClick={() => setPage((value) => value + 1)} className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white disabled:opacity-40">Next</button></div> : null}
      </article> : null}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 shadow-lg shadow-black/20"><p className="text-sm text-slate-300">{label}</p><p className="mt-3 text-2xl font-semibold text-white">{value}</p></article>;
}

function ProductPicker({ products, selectedIds, onToggle }: { products: ProductRecord[]; selectedIds: string[]; onToggle: (productId: string) => void }) {
  const [query, setQuery] = useState("");
  const selectedProducts = products.filter((product) => selectedIds.includes(product.id));
  const filteredProducts = products.filter((product) => [product.productName, product.imei || "", product.purchaseDate, product.sourceCountry, product.id].join(" ").toLowerCase().includes(query.trim().toLowerCase()));

  return <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/55 p-4 sm:p-5">
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm font-medium text-slate-200">Choose products to attach</p><p className="text-xs text-slate-500">Search by name, IMEI, date, country, or ID</p></div>
    {selectedProducts.length > 0 ? <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] p-3"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">{selectedIds.length} product{selectedIds.length === 1 ? "" : "s"} selected</p><div className="mt-2 flex flex-wrap gap-2">{selectedProducts.map((product) => <button key={product.id} type="button" onClick={() => onToggle(product.id)} className="rounded-lg border border-cyan-400/35 bg-cyan-400/15 px-3 py-2 text-xs text-cyan-50 transition hover:border-cyan-300 hover:bg-cyan-400/25">✓ {product.productName} · {product.purchaseDate || "No date"} ×</button>)}</div></div> : <div className="mt-4 rounded-xl border border-dashed border-white/15 px-4 py-3 text-sm text-slate-500">No products selected yet.</div>}
    <div className="relative mt-4"><span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, IMEI, date, country..." className="field pl-10" /></div>
    <div className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1">
      {filteredProducts.length === 0 ? <p className="p-3 text-sm text-slate-400">No matching products.</p> : filteredProducts.map((product) => {
        const isSelected = selectedIds.includes(product.id);
        return <button key={product.id} type="button" onClick={() => onToggle(product.id)} className={`flex min-h-[72px] w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${isSelected ? "border-cyan-400/60 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(34,211,238,0.12)]" : "border-white/10 bg-white/[0.02] hover:border-cyan-400/30 hover:bg-white/5"}`}>
          <span className="min-w-0"><span className="block truncate text-sm font-semibold text-white">{product.productName}</span><span className="mt-1 block truncate text-xs text-slate-400">{product.purchaseDate || "No date"} · {product.sourceCountry || "Unknown country"}</span><span className="mt-1 block truncate text-[11px] text-slate-500">{product.imei ? `IMEI: ${product.imei}` : `Product ID: ${product.id.slice(0, 8)}`}</span></span><span className={`ml-3 flex h-8 shrink-0 items-center rounded-lg px-3 text-xs font-semibold ${isSelected ? "bg-cyan-400 text-slate-950" : "bg-white/10 text-slate-300"}`}>{isSelected ? "✓ Selected" : "Select"}</span>
        </button>;
      })}
    </div>
  </div>;
}

type ExpenseFormProps = Omit<ExpensesPageProps, "expenses" | "onEdit" | "onDelete"> & { onCancel: () => void };

function ExpenseForm({ form, products, canEdit, editingId, onChange, onProductToggle, onManualAllocationChange, onSubmit, onCancel }: ExpenseFormProps) {
  const amount = Number(form.amount || 0);
  const equalAmount = form.productIds.length > 0 ? amount / form.productIds.length : 0;
  const manualTotal = form.productIds.reduce((total, productId) => total + Number(form.manualAllocations[productId] || 0), 0);
  const allocationTotal = form.allocationMethod === "manual" ? manualTotal : amount;

  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/35 shadow-2xl shadow-black/30">
      <header className="flex flex-col gap-4 border-b border-white/10 bg-[linear-gradient(110deg,rgba(34,211,238,0.16),rgba(15,23,42,0.25))] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">{editingId ? "Edit record" : "New record"}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">{editingId ? "Update expense" : "Add an expense"}</h3>
          <p className="mt-1 text-sm text-slate-300">Capture the cost now and connect it to stock when needed.</p>
        </div>
        <button type="button" onClick={onCancel} className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/10">Cancel</button>
      </header>

      <form onSubmit={onSubmit} className="space-y-5 p-5 sm:p-7">
        <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
          <div className="mb-6"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">01 · Expense details</p><p className="mt-2 text-sm text-slate-400">Tell us what this expense was for.</p></div>
          <div className="space-y-6">
            <label className="block text-sm font-medium text-slate-100"><span className="block">Description</span><span className="mt-1 block text-xs font-normal text-slate-500">Use a clear description that will be easy to find later.</span><textarea required name="description" value={form.description} onChange={onChange} placeholder="Import of 3 iPhones from Spain to Morocco" rows={3} className="field mt-3 resize-y" /></label>
            <div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-medium text-slate-100"><span className="block">Category</span><select name="category" value={form.category} onChange={onChange} className="field mt-3 appearance-none bg-slate-950/80 text-slate-100">{categories.map((category) => <option key={category} value={category} className="bg-slate-950 text-white">{categoryIcons[category]} {category}</option>)}</select></label><label className="block text-sm font-medium text-slate-100"><span className="block">Expense date</span><input required type="date" name="date" value={form.date} onChange={onChange} className="field mt-3" /></label></div>
          </div>
        </section>

        <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.045] p-5 sm:p-6">
          <div className="mb-6"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">02 · Cost</p><p className="mt-2 text-sm text-slate-400">Enter the amount and currency for this expense.</p></div>
          <div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-medium text-slate-100"><span className="block">Amount</span><div className="relative mt-3"><input required min="0.01" step="0.01" type="number" name="amount" value={form.amount} onChange={onChange} placeholder="0.00" className="field pr-20 text-lg font-semibold" /><span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-cyan-200">{form.currency}</span></div></label><label className="block text-sm font-medium text-slate-100"><span className="block">Currency</span><select name="currency" value={form.currency} onChange={onChange} className="field mt-3 appearance-none bg-slate-950/80 text-slate-100"><option value="EUR" className="bg-slate-950 text-white">EUR</option><option value="MAD" className="bg-slate-950 text-white">MAD</option></select></label></div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:p-5">
          <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">03 · Product allocation</p><p className="mt-1 text-sm text-slate-400">Leave empty for a general business expense.</p></div><span className="text-xs text-slate-500">{form.productIds.length} selected</span></div>
          {products.length ? <ProductPicker products={products} selectedIds={form.productIds} onToggle={onProductToggle} /> : <p className="mt-4 rounded-2xl border border-dashed border-white/15 p-5 text-sm text-slate-400">Add products first to allocate this cost.</p>}
        </section>

        {form.productIds.length > 0 ? <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:p-5"><div className="mb-4"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">04 · Split method</p><p className="mt-1 text-sm text-slate-400">Choose how this expense is distributed.</p></div><div className="grid gap-3 sm:grid-cols-2"><label className={`cursor-pointer rounded-2xl border p-4 transition ${form.allocationMethod === "equal" ? "border-cyan-400/60 bg-cyan-400/10" : "border-white/10 bg-slate-950/30 hover:border-white/20"}`}><input type="radio" name="allocationMethod" value="equal" checked={form.allocationMethod === "equal"} onChange={onChange} className="mr-2" /><span className="font-semibold text-white">Equal split</span><span className="mt-1 block text-xs text-slate-400">{equalAmount > 0 ? `${equalAmount.toFixed(2)} ${form.currency} per product` : "Divide evenly between products"}</span></label><label className={`cursor-pointer rounded-2xl border p-4 transition ${form.allocationMethod === "manual" ? "border-cyan-400/60 bg-cyan-400/10" : "border-white/10 bg-slate-950/30 hover:border-white/20"}`}><input type="radio" name="allocationMethod" value="manual" checked={form.allocationMethod === "manual"} onChange={onChange} className="mr-2" /><span className="font-semibold text-white">Manual split</span><span className="mt-1 block text-xs text-slate-400">Assign a specific amount to each product</span></label></div>{form.allocationMethod === "manual" ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{form.productIds.map((productId) => { const product = products.find((item) => item.id === productId); return <label key={productId} className="rounded-xl border border-white/10 bg-slate-950/40 p-3 text-xs text-slate-300"><span className="block truncate font-medium text-white">{product?.productName || "Unknown product"}</span><span className="mt-1 block text-slate-500">{product?.purchaseDate || "No date"} · {product?.imei || productId.slice(0, 8)}</span><input type="number" min="0" step="0.01" value={form.manualAllocations[productId] || ""} onChange={(event) => onManualAllocationChange(productId, event.target.value)} className="field" /></label>; })}</div> : null}<div className="mt-4 flex items-center justify-between rounded-xl bg-slate-950/50 px-4 py-3 text-sm"><span className="text-slate-400">Allocated</span><span className={`font-semibold ${Math.abs(allocationTotal - amount) < 0.01 ? "text-emerald-300" : "text-amber-300"}`}>{allocationTotal.toFixed(2)} / {amount.toFixed(2)} {form.currency}</span></div></section> : null}

        <label className="block rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm font-medium text-slate-100 sm:p-5">Notes <span className="font-normal text-slate-500">(optional)</span><textarea name="notes" value={form.notes} onChange={onChange} rows={3} placeholder="Add context for this expense..." className="field" /></label>
        <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={onCancel} className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10">Cancel</button><button type="submit" disabled={!canEdit} className="rounded-2xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-600">{editingId ? "Update expense" : "Save expense"}</button></div>
      </form>
    </article>
  );
}
