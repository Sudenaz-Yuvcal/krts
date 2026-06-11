import React, { useState, useEffect } from "react";
import {
  Check,
  Sparkles,
  Pencil,
  X,
  Save,
  ShieldCheck,
  BadgePercent,
  Loader2,
  Building2,
  Store,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

interface PackagePlan {
  id: string;
  name: string;
  months: number;
  monthly_price: number;
  discount_badge?: string;
  is_popular?: boolean;
  admin_note?: string;
  target_audience: "brand" | "salon";
  slug?: string;
  created_at?: string;
}

export function PackagesView() {
  const [loading, setLoading] = useState<boolean>(true);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"salon" | "brand">("salon");

  const [plans, setPlans] = useState<PackagePlan[]>([]);

  const [coreFeatures] = useState<string[]>([
    "Sınırsız Koltuk, Personel & Şube Yönetimi",
    "Yapay Zeka Destekli Akıllı Randevu Altyapısı",
    "Ücretsiz Gelişmiş WhatsApp & SMS Otomasyonu",
    "Admin Canlı Finansal Ciro & Prim Analizi",
    "Müşteri Sadakat, Hediye Puan & VIP Kart Sistemi",
    "Ortak Pazar Yeri Mağazasına Sınırsız Ürün Listeleme",
  ]);

  const [inputPlans, setInputPlans] = useState<PackagePlan[]>([]);

  // 🔄 SUPABASE'DEN VERİLERİ ÇEKME VE POPÜLARİTE HESAPLAMA
  const fetchPackagesAndPopularity = async () => {
    try {
      setLoading(true);

      // 1. `package_plans` tablosundaki tüm kolonları tam olarak çekiyoruz
      const { data: dbPlans, error: plansError } = await supabase
        .from("package_plans")
        .select(
          "id, name, months, monthly_price, discount_badge, admin_note, target_audience, slug, is_popular, created_at",
        )
        .order("months", { ascending: true });

      if (plansError) throw plansError;

      // 2. Markalar ve Salonlar tablolarından hangi paketlerin seçildiğini sayıyoruz
      const { data: brandPlans } = await supabase
        .from("brands")
        .select("package_plan_id");
      const { data: salonPlans } = await supabase
        .from("salons")
        .select("package_plan_id");

      const allSelections = [
        ...(brandPlans || []).map((b) => b.package_plan_id),
        ...(salonPlans || []).map((s) => s.package_plan_id),
      ].filter(Boolean);

      const counts: { [key: string]: number } = {};
      allSelections.forEach((id) => {
        counts[id] = (counts[id] || 0) + 1;
      });

      let topPlanId = "";
      let maxCount = -1;
      Object.entries(counts).forEach(([id, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topPlanId = id;
        }
      });

      // 3. Gelen veriyi state'e atarken bulduğumuz popüler ID ile eşleştiriyoruz
      if (dbPlans) {
        const finalPlans = dbPlans.map((plan) => ({
          ...plan,
          is_popular: topPlanId ? plan.id === topPlanId : plan.is_popular,
        }));
        setPlans(finalPlans);
      }
    } catch (err) {
      console.error("Paket verileri yüklenirken hata oluştu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackagesAndPopularity();
  }, []);

  const openModal = () => {
    setInputPlans(plans.map((p) => ({ ...p })));
    setIsModalOpen(true);
  };

  const handlePriceChange = (id: string, newPrice: number) => {
    setInputPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, monthly_price: newPrice } : p)),
    );
  };

  const handleAdminNoteChange = (id: string, newNote: string) => {
    setInputPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, admin_note: newNote } : p)),
    );
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaveLoading(true);

      for (const plan of inputPlans) {
        const { error } = await supabase
          .from("package_plans")
          .update({
            monthly_price: plan.monthly_price,
            admin_note: plan.admin_note,
          })
          .eq("id", plan.id);

        if (error) throw error;
      }

      await fetchPackagesAndPopularity();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Planlar güncellenirken hata oluştu:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  // 🎯 Sekmeye göre süzülen veritabanı paketleri
  const filteredPlans = plans.filter((p) => p.target_audience === activeTab);

  if (loading) {
    return (
      <div className="min-h-100 flex flex-col items-center justify-center gap-2 text-center py-20 text-xs text-purple-600 font-bold tracking-wide">
        <Loader2 className="w-7 h-7 animate-spin" />
        Supabase Paket Verileri Yükleniyor...
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 space-y-6 py-2 bg-white text-slate-800 antialiased overflow-hidden">
      {/* ÜST BAŞLIK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-purple-600">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Admin Yetkili Paneli
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
            Abonelik & Kontrat Yapılandırması
          </h1>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">
            `package_plans` tablosundaki dinamik alanlar gerçek zamanlı
            listelenmektedir.
          </p>
        </div>

        <button
          onClick={openModal}
          className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 font-black rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs uppercase tracking-wider"
        >
          <Pencil className="w-3.5 h-3.5" /> Fiyat Matrisini Düzenle
        </button>
      </div>

      {/* SEKMELER */}
      <div className="flex gap-2 border-b border-slate-100 pb-1">
        <button
          onClick={() => setActiveTab("salon")}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${activeTab === "salon" ? "border-purple-600 text-purple-600 font-black" : "border-transparent text-slate-400 hover:text-slate-600"}`}
        >
          <Store className="w-4 h-4" /> Salon Paketleri (
          {plans.filter((p) => p.target_audience === "salon").length})
        </button>
        <button
          onClick={() => setActiveTab("brand")}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${activeTab === "brand" ? "border-purple-600 text-purple-600 font-black" : "border-transparent text-slate-400 hover:text-slate-600"}`}
        >
          <Building2 className="w-4 h-4" /> Marka Paketleri (
          {plans.filter((p) => p.target_audience === "brand").length})
        </button>
      </div>

      {/* VERİTABANINDAN GELEN PAKET KARTLARI LİSTESİ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPlans.length === 0 ? (
          <div className="col-span-1 md:col-span-3 text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl text-xs font-black uppercase text-slate-400 tracking-wider">
            Veritabanında bu kitleye ait paket bulunamadı.
          </div>
        ) : (
          filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl border p-5 relative shadow-xs transition-all duration-300 flex flex-col justify-between ${
                plan.is_popular
                  ? "border-purple-500 ring-2 ring-purple-500/10 shadow-lg shadow-purple-100/50"
                  : "border-slate-100 hover:border-slate-200"
              }`}
            >
              {/* Popüler Rozeti */}
              {plan.is_popular && (
                <span className="absolute -top-2.5 left-4 font-black text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-xs flex items-center gap-1 bg-purple-600 text-white">
                  <Sparkles className="w-2.5 h-2.5" /> En Çok Tercih Edilen
                  (Popüler)
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    {plan.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono font-bold mt-0.5 uppercase tracking-wide">
                    Slug: {plan.slug || "ozel-plan"}
                  </p>
                </div>

                <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900 tracking-tight">
                      ₺{Number(plan.monthly_price).toLocaleString("tr-TR")}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      / aylık
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold mt-1.5 pt-1.5 border-t border-slate-200/40 flex justify-between items-center">
                    <span>Abonelik Süresi:</span>
                    <span className="text-purple-600 font-black">
                      {plan.months} Ay
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold mt-1 flex justify-between items-center">
                    <span>Toplam Sözleşme Değeri:</span>
                    <span className="text-slate-700 font-black">
                      ₺
                      {(
                        Number(plan.monthly_price) * plan.months
                      ).toLocaleString("tr-TR")}
                    </span>
                  </div>
                </div>

                {/* discount_badge sütunu veritabanından çekiliyor */}
                {plan.discount_badge && (
                  <div className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-wider w-fit px-2 py-0.5 rounded">
                    {plan.discount_badge}
                  </div>
                )}

                {/* admin_note sütunu veritabanından çekiliyor */}
                {plan.admin_note && (
                  <div className="bg-purple-50/50 border border-purple-100/60 text-purple-700 text-[10px] font-bold p-2 rounded-lg flex items-center gap-1.5">
                    <BadgePercent className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <span className="truncate">{plan.admin_note}</span>
                  </div>
                )}

                <hr className="border-slate-100" />

                <ul className="space-y-2">
                  {coreFeatures.map((feat, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[11px] text-slate-600 font-medium leading-relaxed"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL ALANI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-purple-600 rounded-full" />
                <h3 className="text-sm font-black text-slate-800 tracking-tight">
                  Global Fiyat Matrisi Değişimi (
                  {activeTab === "salon" ? "Salonlar" : "Markalar"})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveAll}
              className="p-6 space-y-5 max-h-[85vh] overflow-y-auto"
            >
              <div className="space-y-2">
                <span className="text-[9px] font-black text-purple-600 uppercase tracking-widest block">
                  01. Fiyatları Güncelleme
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                  {inputPlans
                    .filter((p) => p.target_audience === activeTab)
                    .map((plan) => (
                      <div
                        key={plan.id}
                        className="space-y-2 bg-white p-3 rounded-lg border border-slate-100"
                      >
                        <label className="text-[10px] font-bold text-slate-500 block truncate uppercase">
                          {plan.name}
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-2.5 text-[11px] font-bold text-slate-400">
                            ₺
                          </span>
                          <input
                            required
                            type="number"
                            value={plan.monthly_price}
                            onChange={(e) =>
                              handlePriceChange(plan.id, Number(e.target.value))
                            }
                            className="w-full pl-6 pr-3 py-1.5 bg-slate-50/40 border border-slate-200 rounded-lg text-xs font-black text-slate-800 focus:outline-none focus:border-purple-500 transition"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <label className="text-[8px] font-bold text-slate-400 block uppercase">
                            Plan Bilgi Notu
                          </label>
                          <input
                            type="text"
                            value={plan.admin_note || ""}
                            onChange={(e) =>
                              handleAdminNoteChange(plan.id, e.target.value)
                            }
                            placeholder="Örn: Özel Koşul Desteği"
                            className="w-full px-2 py-1 bg-slate-50/40 border border-slate-200 rounded-md text-[10px] font-bold text-slate-700 focus:outline-none focus:border-purple-500 transition"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="flex-2 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                >
                  {saveLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}{" "}
                  Değişiklikleri Veritabanına Yaz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
