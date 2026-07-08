"use client";

import type { ProductRecord } from "@/lib/stock";
import { SoldProductCard } from "@/components/sold/SoldProductCard";
import { ProductList } from "@/components/products/ProductList";

type SoldProductsProps = {
  items: ProductRecord[];
  averageEuroRate: number;
  canEdit: boolean;
  onEdit: (item: ProductRecord) => void;
  onDelete: (id: string) => void;
  pageSize?: number;
};

export function SoldProducts({ items, averageEuroRate, canEdit, onEdit, onDelete, pageSize }: SoldProductsProps) {
  return (
    <ProductList
      items={items}
      emptyMessage="No sold products found."
      renderItem={(item) => (
        <SoldProductCard
          key={item.id}
          item={item}
          averageEuroRate={averageEuroRate}
          canEdit={canEdit}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      layout="stack"
      pageSize={pageSize}
    />
  );
}