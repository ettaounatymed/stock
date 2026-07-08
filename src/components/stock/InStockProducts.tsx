"use client";

import type { ProductRecord } from "@/lib/stock";
import { StockProductCard } from "@/components/stock/StockProductCard";
import { ProductList } from "@/components/products/ProductList";

type InStockProductsProps = {
  items: ProductRecord[];
  averageEuroRate: number;
  canEdit: boolean;
  onEdit: (item: ProductRecord) => void;
  onDelete: (id: string) => void;
  pageSize?: number;
};

export function InStockProducts({ items, averageEuroRate, canEdit, onEdit, onDelete, pageSize }: InStockProductsProps) {
  return (
    <ProductList
      items={items}
      emptyMessage="No available products found."
      renderItem={(item) => (
        <StockProductCard
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