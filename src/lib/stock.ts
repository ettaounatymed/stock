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
  totalEuroBought: number;
  totalEuroBoughtMAD: number;
  averageProfitPerSoldItem: number;
  profitMargin: number;
  sellThroughRate: number;
  lowStockCount: number;
  lowStockThreshold: number;
  lowStockAlert: boolean;
};

export type TabId =
  | "overview"
  | "products"
  | "in-stock"
  | "sold"
  | "add-product"
  | "euro"
  | "add-euro"
  | "euro-history"
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

export const normalizeDateForInput = (value: string | null | undefined) => {
  const date = value?.trim() ?? "";
  const isoDate = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoDate) {
    return `${isoDate[1]}-${isoDate[2]}-${isoDate[3]}`;
  }

  const europeanDate = date.match(/^(\d{2})[-/]([0-1]\d)[-/](\d{4})/);
  return europeanDate ? `${europeanDate[3]}-${europeanDate[2]}-${europeanDate[1]}` : "";
};

export const STOCK_TABS: Array<{ id: TabId; label: string; icon: React.ReactNode | React.ElementType }> = [
  { id: "overview", label: "Overview", icon: TableOfContents },
  { id: "products", label: "Products", icon: PackageSearch  },
  { id: "in-stock", label: "In Stock", icon: PackageCheck },
  { id: "sold", label: "Sold", icon: ShoppingCart },
  { id: "add-product", label: "Add Product", icon: PlusCircle },
  { id: "add-euro", label: "Add Euro Purchase", icon: BadgeEuro },
  { id: "euro-history", label: "Purchase History", icon: BadgeEuro },
  { id: "statistics", label: "Statistics", icon: BarChart3  },
  { id: "export", label: "Export", icon: Download  },
];

export const getProductStatus = (item: Pick<ProductRecord, "status" | "saleDate" | "salePriceMAD">) => {
  if (item.saleDate && Number(item.salePriceMAD || 0) > 0) {
    return "sold";
  }

  return item.status === "sold" ? "sold" : "in-stock";
};