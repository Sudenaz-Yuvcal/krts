import React, { useState } from "react";
import {
  Check,
  Sparkles,
  Pencil,
  X,
  Save,
  Plus,
  Trash2,
  ShieldCheck,
  BadgePercent,
} from "lucide-react";

interface PackagePlan {
  id: string;
  name: string;
  months: number;
  monthlyPrice: string;
  discountBadge?: string;
  isPopular?: boolean;
  adminNote?: string;
}

export function PackagesView() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [plans, setPlans] = useState<PackagePlan[]>([
    {
      id: "6-months",
      name: "6 Aylık Kurumsal Başlangıç",
      months: 6,
      monthlyPrice: "2499",
      discountBadge: "Standart Giriş",
      adminNote: "%18 Sabit Pazar Yeri Komisyonu",
    },
    {
      id: "1-year",
      name: "1 Yıllık Süper Özel Pro",
      months: 12,
      monthlyPrice: "1899",
      discountBadge: "%25 Süper Avantaj",
      isPopular: true,
      adminNote: "Pazar Yeri Ürünlerinde Öncü Tedarik Hakkı",
    },
    {
      id: "2-year",
      name: "2 Yıllık Ekosistem Dev",
      months: 24,
      monthlyPrice: "1399",
      discountBadge: "%45 Maksimum Kâr",
      adminNote: "Özel Komisyon Oranı (%15) Desteği",
    },
  ]);

  const [coreFeatures, setCoreFeatures] = useState([
    "Sınırsız Koltuk, Personel & Şube Yönetimi",
    "Yapay Zeka Destekli Akıllı Randevu Altyapısı",
    "Ücretsiz Gelişmiş WhatsApp & SMS Otomasyonu",
    "Admin Canlı Finansal Ciro & Prim Analizi",
    "Müşteri Sadakat, Hediye Puan & VIP Kart Sistemi",
    "Ortak Pazar Yeri Mağazasına Sınırsız Ürün Listeleme",
  ]);

  const [inputPlans, setInputPlans] = useState<PackagePlan[]>([]);
  const [inputFeatures, setInputFeatures] = useState<string[]>([]);
  const [newFeatureText, setNewFeatureText] = useState("");

  const openModal = () => {
    setInputPlans(plans.map((p) => ({ ...p })));
    setInputFeatures([...coreFeatures]);
    setNewFeatureText("");
    setIsModalOpen(true);
  };

  const handlePriceChange = (id: string, newPrice: string) => {
    setInputPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, monthlyPrice: newPrice } : p)),
    );
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setPlans([...inputPlans]);
    setCoreFeatures([...inputFeatures]);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 space-y-6 py-2 bg-white text-slate-800 antialiased overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-purple-600">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Admin Yetkili Paneli
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
            Üst Segment Abonelik Yapılandırması
          </h1>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">
            Salonları platform ekosistemine bağlayan yüksek cirolu ve taahhütlü
            premium plan yönetimi.
          </p>
        </div>

        <button
          onClick={openModal}
          className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 font-black rounded-xl text-xs transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <Pencil className="w-3.5 h-3.5" /> Stratejik Fiyatları Düzenle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-2xl border p-5 relative shadow-xs transition-all duration-300 flex flex-col justify-between ${
              plan.isPopular
                ? "border-purple-500 ring-2 ring-purple-500/10 shadow-lg shadow-purple-100/50"
                : "border-slate-100 hover:border-slate-200"
            }`}
          >
            {plan.discountBadge && (
              <span
                className={`absolute -top-2.5 left-4 font-black text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-xs flex items-center gap-1 ${
                  plan.isPopular
                    ? "bg-purple-600 text-white"
                    : "bg-slate-900 text-white"
                }`}
              >
                {plan.isPopular && <Sparkles className="w-2.5 h-2.5" />}{" "}
                {plan.discountBadge}
              </span>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  {plan.name}
                </h3>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {plan.months} Aylık peşin/taksitli ekosistem kilidi.
                </p>
              </div>

              <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    ₺{Number(plan.monthlyPrice).toLocaleString("tr-TR")}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    / aylık
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-bold mt-1.5 pt-1.5 border-t border-slate-200/40 flex justify-between items-center">
                  <span>Toplam Sözleşme:</span>
                  <span className="text-purple-600 font-black">
                    ₺
                    {(Number(plan.monthlyPrice) * plan.months).toLocaleString(
                      "tr-TR",
                    )}
                  </span>
                </div>
              </div>

              {plan.adminNote && (
                <div className="bg-purple-50/50 border border-purple-100/60 text-purple-700 text-[10px] font-bold p-2 rounded-lg flex items-center gap-1.5">
                  <BadgePercent className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span className="truncate">{plan.adminNote}</span>
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
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-purple-600 rounded-full" />
                <h3 className="text-sm font-black text-slate-800 tracking-tight">
                  Admin: Küresel Fiyat Matrisi Değişimi
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveAll}
              className="p-6 space-y-5 max-h-[80vh] overflow-y-auto"
            >
              <div className="space-y-2">
                <span className="text-[9px] font-black text-purple-600 uppercase tracking-widest block">
                  01. Ağ Geneli Aylık Taban Fiyatlandırma
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                  {inputPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="space-y-1 bg-white p-3 rounded-lg border border-slate-100"
                    >
                      <label className="text-[10px] font-bold text-slate-500 block truncate">
                        {plan.name}
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-2.5 text-[11px] font-bold text-slate-400">
                          ₺
                        </span>
                        <input
                          required
                          type="number"
                          value={plan.monthlyPrice}
                          onChange={(e) =>
                            handlePriceChange(plan.id, e.target.value)
                          }
                          className="w-full pl-6 pr-3 py-1.5 bg-slate-50/40 border border-slate-200 rounded-lg text-xs font-black text-slate-800 focus:outline-hidden focus:border-purple-500 focus:bg-white transition"
                        />
                      </div>
                      <span className="text-[9px] text-purple-600 font-bold block mt-0.5">
                        {plan.discountBadge} Etkisi
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-black text-purple-600 uppercase tracking-widest block">
                  02. Ekosistem Yetki ve Altyapı Havuzu
                </span>
                <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100 space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Tüm Salonlara Sağlanan Haklar
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                      {inputFeatures.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-white p-2 px-3 rounded-lg border border-slate-100 text-[11px] font-bold text-slate-700"
                        >
                          <span className="truncate mr-2">{feat}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setInputFeatures((prev) =>
                                prev.filter((_, i) => i !== idx),
                              )
                            }
                            className="text-slate-300 hover:text-rose-500 transition p-0.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex gap-2">
                    <input
                      type="text"
                      value={newFeatureText}
                      onChange={(e) => setNewFeatureText(e.target.value)}
                      placeholder="Örn: Yapay Zeka Destekli Randevu Tahminleme"
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-hidden focus:border-purple-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newFeatureText.trim() !== "") {
                          setInputFeatures((prev) => [
                            ...prev,
                            newFeatureText.trim(),
                          ]);
                          setNewFeatureText("");
                        }
                      }}
                      className="px-3 bg-purple-50 border border-purple-100 text-purple-600 rounded-lg text-xs font-black transition flex items-center gap-1 hover:bg-purple-100 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" /> Ekle
                    </button>
                  </div>
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
                  className="flex-2 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Yeni Fiyat Tarifesini Devreye Al
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
