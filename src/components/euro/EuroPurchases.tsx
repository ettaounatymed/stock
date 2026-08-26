"use client";

import type { ChangeEvent, FormEvent } from "react";
import type { EuroFormValues, EuroPurchaseRecord } from "@/lib/stock";
import { AddEuroPurchase } from "./AddEuroPurchase";
import { EuroPurchaseHistory } from "./EuroPurchaseHistory";

type EuroPurchasesProps = {
  form: EuroFormValues;
  canEdit: boolean;
  purchases: EuroPurchaseRecord[];
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: (id: string) => void;
};

export function EuroPurchases({ form, canEdit, purchases, onChange, onSubmit, onDelete }: EuroPurchasesProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Euro purchases</p>
          <h2 className="mt-2 text-xl font-semibold text-white">💶 Separate euro buying history</h2>
        </div>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">Average rate source</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <AddEuroPurchase form={form} canEdit={canEdit} onChange={onChange} onSubmit={onSubmit} />
        <EuroPurchaseHistory purchases={purchases} canEdit={canEdit} onDelete={onDelete} />
      </div>
    </article>
  );
}