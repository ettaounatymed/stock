import { BadgeEuro,TableOfContents,PackageSearch, PackageCheck, ShoppingCart, PlusCircle, BarChart3, Download } from 'lucide-react';

export type ProductRecord = {
  id: string;
  productName: string;
  category: string;
  sourceCountry: string;
  purchaseDate: string;
  saleDate: string;
  buyPriceEUR: string;
  euroRate: string;
  salePriceMAD: string;
  notes: string;
  imei?: string;
  status: "in-stock" | "sold";
};

export type EuroPurchaseRecord = {
  id: string;
  purchaseDate: string;
  euroAmount: string;
  euroPriceMAD: string;
  notes: string;
};

export type ProductFormValues = {
  productName: string;
  category: string;
  sourceCountry: string;
  purchaseDate: string;
  saleDate: string;
  buyPriceEUR: string;
  euroRate: string;
  salePriceMAD: string;
  notes: string;
  imei: string;
};

export type EuroFormValues = {
  purchaseDate: string;
  euroAmount: string;
  euroPriceMAD: string;
  notes: string;
};

export type StockSummary = {
  totalItems: number;
  inStockCount: number;
  soldCount: number;
  totalBuyMAD: number;
  totalSellMAD: number;
  stockValue: number;
  euroRemaining: number;
  totalProfit: number;
  averageEuroRate: number;
};

export type TabId =
  | "overview"
  | "products"
  | "in-stock"
  | "sold"
  | "add-product"
  | "euro"
  | "statistics"
  | "export";

export const emptyProductForm: ProductFormValues = {
  productName: "",
  category: "Phone",
  sourceCountry: "Spain",
  purchaseDate: "",
  saleDate: "",
  buyPriceEUR: "",
  euroRate: "",
  salePriceMAD: "",
  notes: "",
  imei: "",
};

export const emptyEuroForm: EuroFormValues = {
  purchaseDate: "",
  euroAmount: "",
  euroPriceMAD: "",
  notes: "",
};

export const STOCK_TABS: Array<{ id: TabId; label: string; icon: React.ReactNode | React.ElementType }> = [
  { id: "overview", label: "Overview", icon: TableOfContents },
  { id: "products", label: "Products", icon: PackageSearch  },
  { id: "in-stock", label: "In Stock", icon: PackageCheck },
  { id: "sold", label: "Sold", icon: ShoppingCart },
  { id: "add-product", label: "Add Product", icon: PlusCircle },
  { id: "euro", label: "Euro Purchases", icon: BadgeEuro },
  { id: "statistics", label: "Statistics", icon: BarChart3  },
  { id: "export", label: "Export", icon: Download  },
];

export const getProductStatus = (item: Pick<ProductRecord, "status" | "saleDate" | "salePriceMAD">) => {
  if (item.saleDate && Number(item.salePriceMAD || 0) > 0) {
    return "sold";
  }

  return item.status === "sold" ? "sold" : "in-stock";
};