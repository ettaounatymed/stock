"use client";

import type { ProductRecord } from "@/lib/stock";
import { ProductCard } from "@/components/products/ProductCard";

type StockProductCardProps = {
  item: ProductRecord;
  averageEuroRate: number;
  allocatedExpenseMAD?: number;
  canEdit: boolean;
  onEdit: (item: ProductRecord) => void;
  onDelete: (id: string) => void;
};

export function StockProductCard(props: StockProductCardProps) {
  return <ProductCard {...props} />;
}