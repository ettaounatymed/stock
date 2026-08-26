"use client";

import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase, SUPABASE_TABLES } from "@/lib/supabase";
import { emptyEuroForm, emptyProductForm, getProductStatus, type EuroFormValues, type EuroPurchaseRecord, type ProductFormValues, type ProductRecord, type StockSummary, type TabId } from "@/lib/stock";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Menu, X } from "lucide-react";
import { UserProfile } from "@/components/layout/UserProfile";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ProductForm } from "@/components/products/ProductForm";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductList } from "@/components/products/ProductList";
import { ProductCard } from "@/components/products/ProductCard";
import { InStockProducts } from "@/components/stock/InStockProducts";
import { SoldProducts } from "@/components/sold/SoldProducts";
import { StatisticsPage } from "@/components/statistics/StatisticsPage";
import { ExportPanel } from "@/components/export/ExportPanel";
import { AddEuroPurchase } from "@/components/euro/AddEuroPurchase";
import { EuroPurchaseHistory } from "@/components/euro/EuroPurchaseHistory";
import { EuroPurchases } from "@/components/euro/EuroPurchases";
import Swal from "sweetalert2";
import type { Session } from "@supabase/supabase-js";

export default function Home() {
  const [records, setRecords] = useState<ProductRecord[]>([]);
  const [euroPurchases, setEuroPurchases] = useState<EuroPurchaseRecord[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormValues>(emptyProductForm);
  const [euroForm, setEuroForm] = useState<EuroFormValues>(emptyEuroForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authStatus, setAuthStatus] = useState("");
  const [ownerLoggedIn, setOwnerLoggedIn] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const canEdit = isOwner;
  const showOwnerGate = !ownerLoggedIn;
  const viewerTabs: TabId[] = ["products", "in-stock", "sold", "statistics", "euro-history"];

  const isOwnerSession = (session: Session | null) => {
    const user = session?.user;
    const configuredOwnerEmail = process.env.NEXT_PUBLIC_OWNER_EMAIL?.trim().toLowerCase();
    const role = typeof user?.app_metadata?.role === "string" ? user.app_metadata.role : undefined;

    return role === "owner" || Boolean(configuredOwnerEmail && user?.email?.toLowerCase() === configuredOwnerEmail);
  };

  const getSyncErrorMessage = (
    productsError: { code?: string; message?: string } | null,
    euroError: { code?: string; message?: string } | null,
  ) => {
    const message = [productsError?.message, euroError?.message].filter(Boolean).join(" \n");
    const isRlsError = [productsError?.code, euroError?.code].filter(Boolean).includes("42501");

    return isRlsError
      ? "Supabase is blocking writes because Row Level Security is not allowing your owner account to save records. Enable RLS policies for stock_records and euro_purchases in Supabase, then try again."
      : `Supabase sync failed: ${message || "Unknown error"}`;
  };

  const syncToSupabase = async (nextRecords: ProductRecord[], nextEuroPurchases: EuroPurchaseRecord[]) => {
    if (!isSupabaseConfigured || !supabase) {
      return { ok: false, message: "Supabase is not configured yet. Add your project URL and anon key first." };
    }

    if (!isOwner) {
      return { ok: false, message: "Sign in as the Supabase owner before saving records." };
    }

    const [productsResult, euroPurchasesResult] = await Promise.all([
      supabase.from(SUPABASE_TABLES.products).upsert(nextRecords, { onConflict: "id" }),
      supabase.from(SUPABASE_TABLES.euroPurchases).upsert(nextEuroPurchases, { onConflict: "id" }),
    ]);

    if (productsResult.error || euroPurchasesResult.error) {
      return {
        ok: false,
        message: getSyncErrorMessage(productsResult.error, euroPurchasesResult.error),
      };
    }

    return { ok: true, message: "" };
  };

  useEffect(() => {
    const loadFromStorage = () => {
      const saved = window.localStorage.getItem("stock-tracker-records");
      if (saved) {
        try {
          setRecords(JSON.parse(saved) as ProductRecord[]);
        } catch {
          window.localStorage.removeItem("stock-tracker-records");
        }
      }

      const savedEuroPurchases = window.localStorage.getItem("stock-tracker-euro-purchases");
      if (savedEuroPurchases) {
        try {
          setEuroPurchases(JSON.parse(savedEuroPurchases) as EuroPurchaseRecord[]);
        } catch {
          window.localStorage.removeItem("stock-tracker-euro-purchases");
        }
      }
    };

    const loadFromSupabase = async () => {
      if (!supabase) {
        loadFromStorage();
        setLoadingData(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      setOwnerLoggedIn(Boolean(session));
      const sessionIsOwner = isOwnerSession(session);
      setIsOwner(sessionIsOwner);
      if (session && !sessionIsOwner) {
        setActiveTab("products");
      }

      const [recordsResult, euroPurchasesResult] = await Promise.all([
        supabase.from(SUPABASE_TABLES.products).select("*").order("purchaseDate", { ascending: false }),
        supabase.from(SUPABASE_TABLES.euroPurchases).select("*").order("purchaseDate", { ascending: false }),
      ]);

      if (recordsResult.error) {
        console.error("Unable to load products from Supabase", recordsResult.error);
      } else if (recordsResult.data) {
        setRecords(recordsResult.data as ProductRecord[]);
      }

      if (euroPurchasesResult.error) {
        console.error("Unable to load euro purchases from Supabase", euroPurchasesResult.error);
      } else if (euroPurchasesResult.data) {
        setEuroPurchases(euroPurchasesResult.data as EuroPurchaseRecord[]);
      }

      setLoadingData(false);
    };

    void loadFromSupabase();

    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setOwnerLoggedIn(Boolean(session));
        const sessionIsOwner = isOwnerSession(session);
        setIsOwner(sessionIsOwner);
        if (session && !sessionIsOwner) {
          setActiveTab("products");
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  useEffect(() => {
    if (loadingData) {
      return;
    }

    if (isSupabaseConfigured && supabase && ownerLoggedIn) {
      void syncToSupabase(records, euroPurchases).catch((error) => {
        console.error("Supabase save failed", error);
      });
    }

    window.localStorage.setItem("stock-tracker-records", JSON.stringify(records));
    window.localStorage.setItem("stock-tracker-euro-purchases", JSON.stringify(euroPurchases));
  }, [records, euroPurchases, loadingData, ownerLoggedIn]);

  const averageEuroRate = useMemo(() => {
    const totalEUR = euroPurchases.reduce((sum, item) => sum + Number(item.euroAmount || 0), 0);
    const totalMAD = euroPurchases.reduce((sum, item) => sum + Number(item.euroPriceMAD || 0), 0);

    return totalEUR > 0 ? totalMAD / totalEUR : 0;
  }, [euroPurchases]);

  const summary: StockSummary = useMemo(() => {
    const totalBuyMAD = records.reduce((sum, item) => {
      const rate = averageEuroRate > 0 ? averageEuroRate : 0;
      const buy = rate > 0 ? Number(item.buyPriceEUR || 0) * rate : 0;
      return sum + buy;
    }, 0);

    const totalPurchasedEUR = euroPurchases.reduce((sum, item) => sum + Number(item.euroAmount || 0), 0);
    const totalPurchasedEURMAD = euroPurchases.reduce((sum, item) => sum + Number(item.euroPriceMAD || 0), 0);

    const inStockItems = records.filter((item) => getProductStatus(item) === "in-stock");
    const soldItems = records.filter((item) => getProductStatus(item) === "sold");

    const stockValue = inStockItems.reduce((sum, item) => {
      const euroRate = averageEuroRate > 0 ? averageEuroRate : 0;
      const buyCostMAD = euroRate > 0 ? Number(item.buyPriceEUR || 0) * euroRate : 0;
      const sellPriceMAD = Number(item.salePriceMAD || 0);

      return sum + (sellPriceMAD > 0 ? sellPriceMAD : buyCostMAD);
    }, 0);

    const soldProfit = soldItems.reduce((sum, item) => {
      const rate = averageEuroRate > 0 ? averageEuroRate : 0;
      const buyCostMAD = rate > 0 ? Number(item.buyPriceEUR || 0) * rate : 0;

      return sum + (Number(item.salePriceMAD || 0) - buyCostMAD);
    }, 0);

    const soldBuyCostMAD = soldItems.reduce((sum, item) => {
      const rate = averageEuroRate > 0 ? averageEuroRate : 0;
      return sum + (rate > 0 ? Number(item.buyPriceEUR || 0) * rate : 0);
    }, 0);

    const totalSellMAD = records.reduce((sum, item) => sum + Number(item.salePriceMAD || 0), 0);
    const averageProfitPerSoldItem = soldItems.length > 0 ? soldProfit / soldItems.length : 0;
    const profitMargin = soldBuyCostMAD > 0 ? (soldProfit / soldBuyCostMAD) * 100 : 0;
    const sellThroughRate = records.length > 0 ? (soldItems.length / records.length) * 100 : 0;
    const lowStockThreshold = 4;
    const lowStockCount = inStockItems.length;
    const lowStockAlert = lowStockCount > 0 && lowStockCount <= lowStockThreshold;

    return {
      totalItems: records.length,
      inStockCount: inStockItems.length,
      soldCount: soldItems.length,
      totalBuyMAD,
      totalSellMAD,
      stockValue,
      euroRemaining: Math.max(totalPurchasedEUR - records.reduce((sum, item) => sum + Number(item.buyPriceEUR || 0), 0), 0),
      totalProfit: soldProfit,
      averageEuroRate,
      totalEuroBought: totalPurchasedEUR,
      totalEuroBoughtMAD: totalPurchasedEURMAD,
      averageProfitPerSoldItem,
      profitMargin,
      sellThroughRate,
      lowStockCount,
      lowStockThreshold,
      lowStockAlert,
    };
  }, [records, euroPurchases, averageEuroRate]);

  const effectiveEuroRate = averageEuroRate > 0 ? averageEuroRate : 0;
  const currentBuyPriceEUR = Number(form.buyPriceEUR || 0);
  const estimatedBuyCostMAD = effectiveEuroRate > 0 ? currentBuyPriceEUR * effectiveEuroRate : 0;

  const filteredRecords = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      return records;
    }

    return records.filter((item) => {
      const haystack = [item.productName, item.category, item.sourceCountry, item.notes, item.imei || "", item.purchaseDate, item.saleDate]
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [records, searchTerm]);

  const inStockRecords = filteredRecords.filter((item) => getProductStatus(item) === "in-stock");
  const soldRecords = filteredRecords.filter((item) => getProductStatus(item) === "sold");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!canEdit) {
      setAuthStatus("Owner sign-in is required to edit records.");
      return;
    }

    if (!form.productName || !form.purchaseDate) {
      return;
    }

    const buyPriceEUR = Number(form.buyPriceEUR || 0);
    const euroRate = averageEuroRate > 0 ? averageEuroRate : Number(form.euroRate || 0);
    const salePriceMAD = Number(form.salePriceMAD || 0);
    const saleDate = form.saleDate.trim();
    const shouldBeSold = Boolean(saleDate && salePriceMAD > 0);

    const purchaseCostMAD = euroRate > 0 ? buyPriceEUR * euroRate : 0;
    const profitMAD = euroRate > 0 ? salePriceMAD - purchaseCostMAD : 0;

    const nextItem: ProductRecord = {
      id: editingId || crypto.randomUUID(),
      ...form,
      purchaseDate: form.purchaseDate.trim(),
      saleDate,
      buyPriceEUR: String(buyPriceEUR),
      euroRate: String(euroRate || Number(form.euroRate || 0)),
      salePriceMAD: String(salePriceMAD),
      notes: form.notes.trim(),
      imei: form.imei.trim(),
      status: shouldBeSold ? "sold" : "in-stock",
    };

    const nextRecords = editingId ? records.map((item) => (item.id === editingId ? nextItem : item)) : [nextItem, ...records];

    setRecords(nextRecords);

    const syncResult = await syncToSupabase(nextRecords, euroPurchases);
    if (!syncResult.ok) {
      setAuthStatus(syncResult.message);
    } else {
      setAuthStatus("Saved to Supabase successfully.");
    }

    setEditingId(null);
    setForm(emptyProductForm);
    setActiveTab("products");
    window.alert(
      euroRate > 0
        ? `${form.productName} ${editingId ? "updated" : "added"}. Estimated profit: ${profitMAD.toFixed(2)} MAD.`
        : `${form.productName} ${editingId ? "updated" : "added"}. Profit will be calculated when euro purchase history is available.`,
    );
  };

  const handleEuroChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setEuroForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEuroSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!canEdit) {
      setAuthStatus("Owner sign-in is required to edit records.");
      return;
    }

    if (!euroForm.purchaseDate || !euroForm.euroAmount || !euroForm.euroPriceMAD) {
      return;
    }

    const nextEuroPurchases = [
      {
        id: crypto.randomUUID(),
        purchaseDate: euroForm.purchaseDate,
        euroAmount: String(Number(euroForm.euroAmount || 0)),
        euroPriceMAD: String(Number(euroForm.euroPriceMAD || 0)),
        notes: euroForm.notes.trim(),
      },
      ...euroPurchases,
    ];

    setEuroPurchases(nextEuroPurchases);

    const syncResult = await syncToSupabase(records, nextEuroPurchases);
    if (!syncResult.ok) {
      setAuthStatus(syncResult.message);
    } else {
      setAuthStatus("Euro purchase saved to Supabase successfully.");
    }

    setEuroForm(emptyEuroForm);
    setActiveTab("euro");
  };

  const handleDelete = (id: string) => {
    if (!canEdit) {
      setAuthStatus("Owner sign-in is required to edit records.");
      return;
    }

    Swal.fire({
      title: "Do you want to delete this product?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: "Don't delete",
    }).then((result) => {
      if (result.isConfirmed) {
        if (supabase && isSupabaseConfigured) {
          void supabase
            .from(SUPABASE_TABLES.products)
            .delete()
            .eq("id", id)
            .then((deleteResult) => {
              if (deleteResult.error) {
                setAuthStatus(`Failed to delete product from Supabase: ${deleteResult.error.message}`);
              } else {
                setAuthStatus("Product deleted from Supabase successfully.");
              }
            });
        }

        setRecords((prev) => prev.filter((item) => item.id !== id));
      } else if (result.isDenied) {
        Swal.fire("Changes are not deleted", "", "info");
      }
    });
  };

  const handleEdit = (item: ProductRecord) => {
    if (!canEdit) {
      setAuthStatus("Owner sign-in is required to edit records.");
      return;
    }

    setEditingId(item.id);
    setForm({
      productName: item.productName,
      category: item.category,
      sourceCountry: item.sourceCountry,
      purchaseDate: item.purchaseDate,
      saleDate: item.saleDate,
      buyPriceEUR: item.buyPriceEUR,
      euroRate: item.euroRate,
      salePriceMAD: item.salePriceMAD,
      notes: item.notes,
      imei: item.imei || "",
    });
    setActiveTab("add-product");
  };

  const handleDeleteEuro = (id: string) => {
    if (!canEdit) {
      setAuthStatus("Owner sign-in is required to edit records.");
      return;
    }

    setEuroPurchases((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOwnerSignIn = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isSupabaseConfigured || !supabase) {
      setAuthStatus("Supabase is not configured yet. Add your project URL and anon key to enable owner-only access.");
      return;
    }

    setAuthStatus("Signing in as owner...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail.trim(),
      password: authPassword,
    });

    if (error) {
      setAuthStatus(error.message);
      setOwnerLoggedIn(false);
      return;
    }

    const sessionIsOwner = isOwnerSession(data.session);
    setOwnerLoggedIn(Boolean(data.session));
    setIsOwner(sessionIsOwner);
    setActiveTab(sessionIsOwner ? "overview" : "products");
    setAuthEmail("");
    setAuthPassword("");
    setAuthStatus("Owner access enabled. You can now open the dashboard.");
  };

  const handleOwnerSignOut = async () => {
    if (!supabase) {
      setOwnerLoggedIn(false);
      setAuthStatus("Supabase is not configured yet. Add your project URL and anon key to enable owner-only access.");
      return;
    }

    await supabase.auth.signOut();
    setOwnerLoggedIn(false);
    setIsOwner(false);
    setAuthStatus("Signed out. Sign in again to reopen the dashboard.");
  };

  const exportCsv = () => {
    const header = ["Product", "Category", "Country", "Buy Date", "Sell Date", "Buy Price EUR", "EUR Rate", "Buy Cost MAD", "Sell Price MAD", "Status", "IMEI", "Profit MAD", "Notes"];

    const rows = records.map((item) => {
      const euroRate = averageEuroRate > 0 ? averageEuroRate : 0;
      const buyCostMAD = euroRate > 0 ? Number(item.buyPriceEUR || 0) * euroRate : 0;
      const profitMAD = euroRate > 0 ? Number(item.salePriceMAD || 0) - buyCostMAD : 0;

      return [
        item.productName,
        item.category,
        item.sourceCountry,
        item.purchaseDate,
        item.saleDate,
        item.buyPriceEUR,
        euroRate.toFixed(2),
        buyCostMAD.toFixed(2),
        item.salePriceMAD,
        getProductStatus(item) === "sold" ? "Sold" : "In stock",
        item.imei || "",
        profitMAD.toFixed(2),
        item.notes,
      ];
    });

    const csv = [header, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "stock-tracker.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (showOwnerGate) {
    return (
      <main className="min-h-screen bg-[linear-gradient(135deg,#0f172a_0%,#111827_45%,#1f2937_100%)] text-white">
        <section className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <UserProfile
            isSupabaseConfigured={isSupabaseConfigured}
            authEmail={authEmail}
            authPassword={authPassword}
            authStatus={authStatus}
            onEmailChange={setAuthEmail}
            onPasswordChange={setAuthPassword}
            onSubmit={handleOwnerSignIn}
          />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#0f172a_0%,#111827_45%,#1f2937_100%)] text-white">
      <section className="mx-auto flex w-full max-w-10xl flex-col gap-4 px-3 py-4 sm:gap-8 sm:px-6 sm:py-8 lg:px-8">
        <Header signOut={handleOwnerSignOut} />

        <div className="flex items-center justify-between gap-3 sm:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            Menu
          </button>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-100">
            {activeTab === "overview" ? "Dashboard" : activeTab}
          </span>
        </div>

        <div className="sm:hidden">
          <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} visibleTabs={isOwner ? undefined : viewerTabs} isMobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />
        </div>

   

        <section className="grid gap-4 xl:grid-cols-[280px_1fr] xl:gap-6">
          <div className="hidden sm:block">
            <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} visibleTabs={isOwner ? undefined : viewerTabs} />
          </div>

          <div className="space-y-6">
            {activeTab === "overview" && (
              <article className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
                <div className="flex items-center justify-between gap-3 sm:hidden">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Mobile dashboard</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">Quick actions</h2>
                  </div>
                </div>

                <div className="mt-5 hidden gap-4 sm:grid md:grid-cols-2 xl:grid-cols-3">
                  {[
                    { id: "products", title: "🔎 Products", text: "Search all records and switch to the dedicated stock views.", tone: "cyan" },
                    { id: "in-stock", title: "🟢 In Stock", text: "See only current available products.", tone: "amber" },
                    { id: "sold", title: "✅ Sold", text: "See only products that have already been sold.", tone: "emerald" },
                    { id: "add-product", title: "➕ Add Product", text: "Enter a new item, add IMEI when needed, and mark it sold automatically.", tone: "cyan" },
                    { id: "euro", title: "💶 Euro Purchases", text: "Track every euro buy and keep the average exchange rate used for profit.", tone: "cyan" },
                    { id: "statistics", title: "📊 Statistics", text: "Review stock value, sold items, profit, and euro remaining at a glance.", tone: "cyan" },
                  ].map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setActiveTab(card.id as TabId)}
                      className={`rounded-3xl border p-5 text-left transition ${
                        card.tone === "emerald"
                          ? "border-emerald-400/30 bg-emerald-400/10 hover:bg-emerald-400/15"
                          : card.tone === "amber"
                            ? "border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/15"
                            : "border-cyan-400/30 bg-cyan-400/10 hover:bg-emerald-400/15"
                      }`}
                    >
                      <p className="text-sm uppercase tracking-[0.25em] text-cyan-100">{card.title}</p>
                      <p className="mt-2 text-base text-white">{card.text}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-4 grid gap-3 sm:hidden">
                  {[
                    { id: "products", label: "Products", hint: `${records.length} total` },
                    { id: "in-stock", label: "In Stock", hint: `${summary.inStockCount} active` },
                    { id: "sold", label: "Sold", hint: `${summary.soldCount} sold` },
                    { id: "add-product", label: "Add product", hint: "New entry" },
                    { id: "add-euro", label: "Add euro purchase", hint: "New entry" },
                    { id: "euro-history", label: "Purchase history", hint: "Filtered list" },
                    { id: "statistics", label: "Statistics", hint: "Overview" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id as TabId)}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4 text-left text-sm font-semibold text-white"
                    >
                      <span>
                        <span className="block">{item.label}</span>
                        <span className="mt-1 block text-xs font-normal text-slate-300">{item.hint}</span>
                      </span>
                      <span className="text-cyan-200">→</span>
                    </button>
                  ))}
                </div>
              </article>
            )}

            {activeTab === "add-product" && (
              <ProductForm
                form={form}
                canEdit={canEdit}
                editingId={editingId}
                effectiveEuroRate={effectiveEuroRate}
                estimatedBuyCostMAD={estimatedBuyCostMAD}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
            )}

            {activeTab === "add-euro" && (
              <AddEuroPurchase form={euroForm} canEdit={canEdit} onChange={handleEuroChange} onSubmit={handleEuroSubmit} />
            )}

            {activeTab === "euro-history" && <EuroPurchaseHistory purchases={euroPurchases} canEdit={canEdit} onDelete={handleDeleteEuro} />}

            {activeTab === "euro" && (
              <EuroPurchases form={euroForm} canEdit={canEdit} purchases={euroPurchases} onChange={handleEuroChange} onSubmit={handleEuroSubmit} onDelete={handleDeleteEuro} />
            )}

            {activeTab === "products" && (
              <article className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="mt-2 text-xl font-semibold text-white">Search all products</h2>
                  </div>
                </div>

                <ProductFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} visibleCount={filteredRecords.length} totalCount={records.length} />

                <ProductList
                  items={filteredRecords}
                  emptyMessage="No products found."
                  pageSize={4}
                  renderItem={(item) => (
                    <ProductCard key={item.id} item={item} averageEuroRate={averageEuroRate} canEdit={canEdit} onEdit={handleEdit} onDelete={handleDelete} />
                  )}
                />
              </article>
            )}

            {activeTab === "in-stock" && (
              <article className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">In Stock</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Available products</h2>
                <ProductFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} visibleCount={inStockRecords.length} totalCount={records.length} />
                <div className="mt-5 space-y-3">
                  <InStockProducts items={inStockRecords} averageEuroRate={averageEuroRate} canEdit={canEdit} onEdit={handleEdit} onDelete={handleDelete} pageSize={4} />
                </div>
              </article>
            )}

            {activeTab === "sold" && (
              <article className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
                <h2 className="mt-2 text-xl font-semibold text-white">Sold products</h2>
                <ProductFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} visibleCount={soldRecords.length} totalCount={records.length} />
                <div className="mt-5 space-y-3">
                  <SoldProducts items={soldRecords} averageEuroRate={averageEuroRate} canEdit={canEdit} onEdit={handleEdit} onDelete={handleDelete} pageSize={4} />
                </div>
              </article>
            )}

            {activeTab === "statistics" && <StatisticsPage summary={summary} onSelectTab={setActiveTab} />}

            {activeTab === "export" && <ExportPanel onExport={exportCsv} disabled={records.length === 0} totalCount={records.length} />}
          </div>
        </section>

        <footer className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/10 px-4 py-4 text-sm text-slate-200/90 shadow-2xl shadow-black/20 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>{authStatus || "Ready."}</p>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1">{isOwner ? "Owner mode" : "Read only"}</span>
            <button type="button" onClick={handleOwnerSignOut} className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1 transition hover:border-cyan-400/40 hover:bg-cyan-400/10">
              Sign out
            </button>
          </div>
        </footer>
      </section>
    </main>
  );
}