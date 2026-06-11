import React, { useState, useEffect } from "react";
import {
  Search,
  Handshake,
  X,
  Check,
  Package,
  Percent,
  Clock,
  Eye,
  Sliders,
  Save,
  Building2,
  Phone,
  Mail,
  FileText,
  Loader2,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

// Arayüz için güncellenmiş veri tipleri
interface Brand {
  id: string; // Supabase UUID uyumu için string yapıldı
  name: string;
  category: string;
  activeProducts: number;
  totalSales: number;
}

interface Application {
  id: string; // Supabase UUID uyumu için string yapıldı
  name: string;
  category: string;
  requestedProducts: number;
  date: string;
  taxNumber: string;
  authorizedPerson: string;
  phone: string;
  email: string;
  description: string;
}

export function BrandPartnershipsView() {
  const [loading, setLoading] = useState<boolean>(true);
  const [btnLoading, setBtnLoading] = useState<string | null>(null);

  const [globalCommission, setGlobalCommission] = useState<number>(18);
  const [inputCommission, setInputCommission] = useState<number>(18);

  const [isCommissionModalOpen, setIsCommissionModalOpen] =
    useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Dinamik veritabanı stateleri
  const [brands, setBrands] = useState<Brand[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  // 🔄 VERİTABANINDAN ONAYLI VE ONAY BEKLEYEN MARKALARI ÇEKME
  const fetchPartnershipData = async () => {
    try {
      setLoading(true);

      // 1. Tüm marka rollerini profiles tablosundan durumuna göre çekiyoruz
      const { data: allBrandProfiles, error: profileErr } = await supabase
        .from("profiles")
        .select("id, is_approved, full_name")
        .eq("role", "brand");

      if (profileErr) throw profileErr;

      if (allBrandProfiles && allBrandProfiles.length > 0) {
        const approvedIds = allBrandProfiles
          .filter((p) => p.is_approved)
          .map((p) => p.id);
        const pendingIds = allBrandProfiles
          .filter((p) => !p.is_approved)
          .map((p) => p.id);

        // 2. Onaylı Markaların Detaylarını Çek (brands tablosu)
        if (approvedIds.length > 0) {
          const { data: dbApprovedBrands } = await supabase
            .from("brands")
            .select("id, brand_name, sector")
            .in("id", approvedIds);

          if (dbApprovedBrands) {
            // Arayüze map'leme ve ürün sayıları için mock/gerçek entegrasyonu
            const formattedBrands: Brand[] = dbApprovedBrands.map((b) => ({
              id: b.id,
              name: b.brand_name,
              category: b.sector || "Genel Kozmetik",
              activeProducts: 0, // İleride products tablosundan count çekilebilir
              totalSales: 0, // İleride orders tablosundan sum çekilebilir
            }));
            setBrands(formattedBrands);
          }
        } else {
          setBrands([]);
        }

        // 3. Onay Bekleyen Markaların Detaylarını Çek (brands tablosu)
        if (pendingIds.length > 0) {
          const { data: dbPendingBrands } = await supabase
            .from("brands")
            .select("id, brand_name, sector, created_at, phone, email, website")
            .in("id", pendingIds);

          if (dbPendingBrands) {
            const formattedApps: Application[] = dbPendingBrands.map((b) => {
              const matchedProfile = allBrandProfiles.find(
                (p) => p.id === b.id,
              );
              return {
                id: b.id,
                name: b.brand_name,
                category: b.sector || "Belirtilmedi",
                requestedProducts: 0,
                date: new Date(b.created_at).toLocaleDateString("tr-TR"),
                taxNumber: "Potansiyel Kayıt", // Vergi numarası alanı tablonuza eklendiğinde b.tax_number yapılabilir
                authorizedPerson: matchedProfile?.full_name || "Yetkili Kişi",
                phone: b.phone || "",
                email: b.email || "",
                description: `${b.website || b.brand_name} adresi üzerinden ekosisteme dahil olmak isteyen yeni B2B marka adayı.`,
              };
            });
            setApplications(formattedApps);
          }
        } else {
          setApplications([]);
        }
      }
    } catch (err) {
      console.error("İşbirlikleri yüklenirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnershipData();
  }, []);

  const handleSaveCommission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGlobalCommission(inputCommission);
    setIsCommissionModalOpen(false);
  };

  // 🚀 BAŞVURUYU VERİTABANINDA ONAYLAMA FONKSİYONU
  const handleApprove = async (app: Application) => {
    try {
      setBtnLoading(app.id);

      // profiles tablosunda kilidi kaldırıp is_approved = true yapıyoruz
      const { error } = await supabase
        .from("profiles")
        .update({ is_approved: true })
        .eq("id", app.id);

      if (error) throw error;

      // Local state güncellemesi (Arayüzde anlık yer değiştirme)
      const newApprovedBrand: Brand = {
        id: app.id,
        name: app.name,
        category: app.category,
        activeProducts: app.requestedProducts,
        totalSales: 0,
      };

      setBrands((prev) => [...prev, newApprovedBrand]);
      setApplications((prev) => prev.filter((a) => a.id !== app.id));
      setIsDetailModalOpen(false);
    } catch (err) {
      console.error("İşbirliği onaylanırken hata:", err);
    } finally {
      setBtnLoading(null);
    }
  };

  // ❌ BAŞVURUYU REDDETME / SİLME FONKSİYONU
  const handleReject = async (id: string) => {
    try {
      setBtnLoading(id);

      // Kaydı profiles veya brands tablosundan silebilir ya da statusunu değiştirebilirsiniz
      const { error } = await supabase.from("profiles").delete().eq("id", id);

      if (error) throw error;

      setApplications((prev) => prev.filter((a) => a.id !== id));
      setIsDetailModalOpen(false);
    } catch (err) {
      console.error("Başvuru silinirken hata:", err);
    } finally {
      setBtnLoading(null);
    }
  };

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalCiro = brands.reduce((sum, b) => sum + b.totalSales, 0);
  const totalCommissionEarn = (totalCiro * globalCommission) / 100;

  if (loading) {
    return (
      <div className="min-h-100 flex flex-col items-center justify-center gap-2 text-center py-20 text-xs text-purple-600 font-bold tracking-wide">
        <Loader2 className="w-7 h-7 animate-spin" />
        Ortaklık Matrisi Yükleniyor...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ÜST BAŞLIK */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
            Marka İşbirlikleri & Yönetimi
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Global markaların detaylı başvuru incelemeleri ve pazar yeri
            komisyon politikası.
          </p>
        </div>

        <button
          onClick={() => {
            setInputCommission(globalCommission);
            setIsCommissionModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-100 rounded-2xl text-xs font-black transition-all cursor-pointer uppercase tracking-wider"
        >
          <Sliders className="w-4 h-4" /> Sabit Oranı Güncelle (%{" "}
          {globalCommission})
        </button>
      </div>

      {/* FİNANSAL ÖZET KARTLARI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
            Aktif İşbirlikleri
          </span>
          <h3 className="text-2xl font-black text-slate-800 mt-2 flex items-center gap-2">
            <Handshake className="w-6 h-6 text-purple-500" /> {brands.length}{" "}
            Onaylı Marka
          </h3>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
            Toplam Brüt Satış
          </span>
          <h3 className="text-2xl font-black text-slate-800 mt-2">
            ₺{totalCiro.toLocaleString("tr-TR")}
          </h3>
        </div>
        <div className="p-6 bg-purple-600 rounded-3xl shadow-xl shadow-purple-100">
          <span className="text-[10px] font-black text-purple-100 uppercase tracking-widest block">
            Sizin %{globalCommission} Sabit Komisyon Kazancınız
          </span>
          <h3 className="text-2xl font-black text-white mt-2">
            ₺{totalCommissionEarn.toLocaleString("tr-TR")}
          </h3>
        </div>
      </div>

      {/* ONAY BEKLEYEN BAŞVURULAR (EMPTY STATE DESTEKLİ) */}
      {applications.length > 0 ? (
        <div className="bg-amber-50/40 border border-amber-100/70 p-6 rounded-[32px] space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-black text-amber-800 tracking-tight uppercase">
              Onay Bekleyen Başvurular ({applications.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white p-5 rounded-2xl border border-amber-100 shadow-2xs flex justify-between items-center gap-4 group hover:border-amber-300 transition-all"
              >
                <div className="space-y-1">
                  <div className="font-black text-slate-800 text-sm">
                    {app.name}
                  </div>
                  <div className="text-[11px] text-slate-400 font-bold flex items-center gap-2">
                    <span>{app.category}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="text-purple-600 font-black">
                      {app.requestedProducts} Ürün
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedApp(app);
                    setIsDetailModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-slate-50 hover:bg-purple-50 text-slate-500 hover:text-purple-600 border border-slate-100 hover:border-purple-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4" /> Detayları Gör
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-amber-50/20 border border-amber-100/50 p-6 rounded-[32px] text-center text-xs font-bold text-amber-700 uppercase tracking-wider">
          Onay bekleyen yeni bir kurumsal marka başvurusu bulunmuyor.
        </div>
      )}

      {/* ARAMA ALANI */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4.5 h-4.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Onaylı markalar arasında ara..."
            className="w-full pl-11 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-purple-200 transition-all font-bold text-slate-700"
          />
        </div>
      </div>

      {/* ONAYLI MARKALAR TABLOSU */}
      {filteredBrands.length === 0 ? (
        <div className="bg-white rounded-3xl  border-slate-200 p-12 text-center border-dashed border-2 text-xs font-black uppercase text-slate-400 tracking-wider">
          Sistemde henüz onaylanmış bir B2B tedarikçi marka bulunmuyor.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="p-5 pl-8">Ortak Marka</th>
                <th className="p-5">Kategori</th>
                <th className="p-5">Ürün Havuzu (Canlı)</th>
                <th className="p-5">Uygulanan Sabit Oran</th>
                <th className="p-5">Toplam Satış Hacmi</th>
                <th className="p-5 pr-8 text-right">
                  Net Platform Payı (%{globalCommission})
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-bold text-slate-600">
              {filteredBrands.map((brand) => {
                const platformShare =
                  (brand.totalSales * globalCommission) / 100;
                return (
                  <tr
                    key={brand.id}
                    className="hover:bg-slate-50/60 transition-all"
                  >
                    <td className="p-5 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-black">
                          {brand.name.charAt(0)}
                        </div>
                        <span className="text-slate-800 font-black text-sm">
                          {brand.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] uppercase">
                        {brand.category}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className="text-slate-700 flex items-center gap-1.5 bg-slate-50 w-fit px-3 py-1 rounded-xl border border-slate-100">
                        <Package className="w-3.5 h-3.5 text-slate-400" />{" "}
                        {brand.activeProducts} Ürün
                      </span>
                    </td>
                    <td className="p-5">
                      <span className="text-purple-600 font-black flex items-center gap-0.5">
                        <Percent className="w-3 h-3" /> {globalCommission} Sabit
                      </span>
                    </td>
                    <td className="p-5 text-slate-800">
                      ₺{brand.totalSales.toLocaleString("tr-TR")}
                    </td>
                    <td className="p-5 pr-8 text-right font-black text-emerald-600 text-sm">
                      ₺{platformShare.toLocaleString("tr-TR")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* SABİT ORAN MODAL */}
      {isCommissionModalOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden border border-slate-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-5 bg-purple-600 rounded-full" />
                <h3 className="text-base font-black text-slate-800 tracking-tight">
                  Global Pazar Yeri Sabit Komisyon Ayarı
                </h3>
              </div>
              <button
                onClick={() => setIsCommissionModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveCommission} className="p-8 space-y-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60 space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  Yeni Ortak Pazar Yeri Yüzdesi (%)
                </label>
                <div className="relative max-w-xs">
                  <Percent className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="number"
                    min="0"
                    max="100"
                    value={inputCommission}
                    onChange={(e) => setInputCommission(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-800 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCommissionModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl text-xs font-black cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Yeni Sabit Oranı Tüm Sistemde
                  Aktif Et
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAY BAŞVURU MODAL */}
      {isDetailModalOpen && selectedApp && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-[36px] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800 tracking-tight">
                    Marka Başvuru Detay İncelemesi
                  </h3>
                  <p className="text-[11px] text-slate-400 font-bold">
                    Kayıt Başvuru Tarihi: {selectedApp.date}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-50">
                    <Building2 className="w-3.5 h-3.5 text-purple-500" /> Resmi
                    Künye Bilgileri
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">
                        Firma / Marka Ticari Adı
                      </span>
                      <span className="text-sm font-black text-slate-800">
                        {selectedApp.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">
                        Faaliyet Alanı / Kategori
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {selectedApp.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-50">
                    <Phone className="w-3.5 h-3.5 text-purple-500" /> Yetkili
                    İletişim Noktası
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">
                        Başvuru Sahibi / Yetkili
                      </span>
                      <span className="text-sm font-black text-slate-800">
                        {selectedApp.authorizedPerson}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />{" "}
                      {selectedApp.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />{" "}
                      {selectedApp.phone}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-50">
                  <FileText className="w-3.5 h-3.5 text-purple-500" /> Marka Ön
                  Yazısı & Detaylar
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed font-bold">
                    {selectedApp.description}
                  </p>
                </div>
              </div>

              {/* Aksiyon Butonları */}
              <div className="flex gap-3 pt-2">
                <button
                  disabled={btnLoading !== null}
                  onClick={() => handleReject(selectedApp.id)}
                  className="flex-1 px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-black border border-rose-100 cursor-pointer"
                >
                  Başvuruyu Reddet
                </button>
                <button
                  disabled={btnLoading !== null}
                  onClick={() => handleApprove(selectedApp)}
                  className="flex-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  {btnLoading === selectedApp.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Başvuruyu Onayla ve İşbirliğini Başlat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
