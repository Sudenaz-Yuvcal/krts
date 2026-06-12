import { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Ban,
  CheckCircle,
  X,
  Copy,
  Check,
  UserPlus,
  Clock,
  Building2,
  User,
  ShieldCheck,
  FileText,
  Loader2,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import type { Salon, Applications } from "../../types/admin";

export function SalonsManagementView() {
  const [loading, setLoading] = useState<boolean>(true);
  const [btnLoading, setBtnLoading] = useState<string | null>(null);

  const [salons, setSalons] = useState<Salon[]>([]);
  const [applications, setApplications] = useState<Applications[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tüm Durumlar");

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Applications | null>(null);

  const [isSalonModalOpen, setIsSalonModalOpen] = useState(false);
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);

  const [copied, setCopied] = useState(false);

  const fetchSalonsData = async () => {
    try {
      setLoading(true);

      const { data: profiles, error: profileErr } = await supabase
        .from("profiles")
        .select("id, is_approved, full_name")
        .eq("role", "salon");

      if (profileErr) throw profileErr;

      if (profiles && profiles.length > 0) {
        const approvedIds = profiles
          .filter((p) => p.is_approved)
          .map((p) => p.id);
        const pendingIds = profiles
          .filter((p) => !p.is_approved)
          .map((p) => p.id);

        if (approvedIds.length > 0) {
          const { data: dbSalons } = await supabase
            .from("salons")
            .select(
              `
              salon_id,
              salon_name,
              package_plan_id,
              package_plans ( name, monthly_price, months )
            `,
            )
            .in("salon_id", approvedIds);

          if (dbSalons) {
            const formattedSalons: Salon[] = dbSalons.map((s: any) => {
              const matchedProfile = profiles.find((p) => p.id === s.salon_id);
              const monthly = s.package_plans?.monthly_price || 0;
              const months = s.package_plans?.months || 1;
              return {
                id: s.salon_id,
                name: s.salon_name,
                city: "Belirtilmedi",
                owner: matchedProfile?.full_name || "Yetkili",
                phone: "Sistem Kayıtlı",
                package_name: s.package_plans?.name || "Özel Plan",
                status: "Aktif",
                income: `₺${(monthly * months).toLocaleString("tr-TR")}`,
              };
            });
            setSalons(formattedSalons);
          }
        } else {
          setSalons([]);
        }

        if (pendingIds.length > 0) {
          const { data: dbPending } = await supabase
            .from("salons")
            .select(
              `
              salon_id,
              salon_name,
              created_at,
              package_plan_id,
              package_plans ( name )
            `,
            )
            .in("salon_id", pendingIds);

          if (dbPending) {
            const formattedApps: Applications[] = dbPending.map((s: any) => {
              const matchedProfile = profiles.find((p) => p.id === s.salon_id);
              return {
                id: s.salon_id,
                name: s.salon_name,
                city: "Lokasyon Girişi Bekleniyor",
                owner: matchedProfile?.full_name || "Salon Sahibi",
                phone: "İletişim Hattı",
                email: "E-Posta Adresi",
                taxNumber: "Potansiyel Künye",
                date: new Date(s.created_at).toLocaleDateString("tr-TR"),
                package_name: s.package_plans?.name || "Başlangıç Paketi",
                package_id: s.package_plan_id || "",
              };
            });
            setApplications(formattedApps);
          }
        } else {
          setApplications([]);
        }
      }
    } catch (err) {
      console.error("Salon verileri yüklenirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalonsData();
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("http://localhost:3000/salon/kayit");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApproveApplication = async (app: Applications) => {
    try {
      setBtnLoading(app.id);

      const { error } = await supabase
        .from("profiles")
        .update({ is_approved: true })
        .eq("id", app.id);

      if (error) throw error;

      const newSalon: Salon = {
        id: app.id,
        name: app.name,
        city: app.city,
        owner: app.owner,
        phone: app.phone,
        package_name: app.package_name,
        status: "Aktif",
        income: "Hesaplanıyor",
      };

      setSalons((prev) => [newSalon, ...prev]);
      setApplications((prev) => prev.filter((a) => a.id !== app.id));
      setIsDetailModalOpen(false);
    } catch (err) {
      console.error("Salon onaylanırken hata oluştu:", err);
    } finally {
      setBtnLoading(null);
    }
  };

  const handleRejectApplication = async (id: string) => {
    try {
      setBtnLoading(id);

      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (error) throw error;

      setApplications((prev) => prev.filter((a) => a.id !== id));
      setIsDetailModalOpen(false);
    } catch (err) {
      console.error("Başvuru reddedilirken hata:", err);
    } finally {
      setBtnLoading(null);
    }
  };

  const toggleSalonStatus = (id: string) => {
    setSalons((prev) =>
      prev.map((salon) => {
        if (salon.id === id) {
          return {
            ...salon,
            status: salon.status === "Aktif" ? "Donduruldu" : "Aktif",
          };
        }
        return salon;
      }),
    );
  };

  const filteredSalons = salons.filter((salon) => {
    const matchesSearch =
      salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salon.owner.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "Tüm Durumlar" || salon.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-100 flex flex-col items-center justify-center gap-2 text-center py-20 text-xs text-purple-600 font-bold tracking-wide">
        <Loader2 className="w-7 h-7 animate-spin" />
        Salon Altyapı Matrisi Bağlanıyor...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
            Salon ve Bayi Altyapı Yönetimi
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Sisteme dışarıdan başvuran salonların dijital sözleşme onayları ve
            lisans takipleri.
          </p>
        </div>
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl text-xs transition-all shadow-xs cursor-pointer uppercase tracking-wider"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span>
            {copied ? "Linki Kopyalandı!" : "Dış Kayıt Linkini Kopyala"}
          </span>
        </button>
      </div>

      {applications.length > 0 && (
        <div className="bg-purple-50/40 border border-purple-100/70 p-6 rounded-[32px] space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600 animate-pulse" />
            <h2 className="text-sm font-black text-purple-800 tracking-tight uppercase">
              Onay Bekleyen Salon Sözleşmeleri ({applications.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs flex justify-between items-center gap-4 group hover:border-purple-300 transition-all"
              >
                <div className="space-y-1">
                  <div className="font-black text-slate-800 text-sm">
                    {app.name}
                  </div>
                  <div className="text-[11px] text-slate-400 font-bold flex items-center gap-2">
                    <span className="text-purple-600 font-black">
                      {app.package_name}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
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
      )}

      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4.5 h-4.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Onaylı salon adı veya yetkili ara..."
            className="w-full pl-11 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-purple-200 transition-all font-bold text-slate-700"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-100 rounded-xl font-black text-slate-600 focus:outline-none cursor-pointer"
          >
            <option>Tüm Durumlar</option>
            <option>Aktif</option>
            <option>Donduruldu</option>
          </select>
        </div>
      </div>

      {filteredSalons.length === 0 ? (
        <div className="bg-white rounded-3xl border-slate-200 p-12 text-center border-dashed border-2 text-xs font-black uppercase text-slate-400 tracking-wider">
          Sistemde henüz aktif bir kuaför salonu bulunmuyor.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="p-5 pl-8">Sistemdeki Salon</th>
                <th className="p-5">Salon Sorumlusu</th>
                <th className="p-5">Aktif Paket</th>
                <th className="p-5">Toplam Kontrat Değeri</th>
                <th className="p-5">Durum</th>
                <th className="p-5 pr-8 text-right">Eylemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-bold text-slate-600">
              {filteredSalons.map((salon) => (
                <tr
                  key={salon.id}
                  className="hover:bg-slate-50/60 transition-all"
                >
                  <td className="p-5 pl-8">
                    <div className="font-black text-slate-800 text-sm">
                      {salon.name}
                    </div>
                  </td>
                  <td className="p-5 text-slate-500 font-medium">
                    {salon.owner}
                  </td>
                  <td className="p-5">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] border bg-purple-50 border-purple-100 text-purple-600 uppercase">
                      {salon.package_name}
                    </span>
                  </td>
                  <td className="p-5 text-slate-800 font-black">
                    {salon.income}
                  </td>
                  <td className="p-5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black ${salon.status === "Aktif" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                    >
                      {salon.status}
                    </span>
                  </td>
                  <td className="p-5 pr-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSalon(salon);
                          setIsSalonModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSalonStatus(salon.id)}
                        className={`p-2 rounded-xl transition cursor-pointer ${salon.status === "Aktif" ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50" : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"}`}
                      >
                        {salon.status === "Aktif" ? (
                          <Ban className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isDetailModalOpen && selectedApp && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-[36px] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800 tracking-tight">
                    Salon Sözleşme Başvuru İncelemesi
                  </h3>
                  <p className="text-[11px] text-slate-400 font-bold">
                    Talep Tarihi: {selectedApp.date}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-50">
                    <Building2 className="w-3.5 h-3.5 text-purple-500" /> Salon
                    Künye Bilgileri
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">
                        Salon / İşletme Adı
                      </span>
                      <span className="text-sm font-black text-slate-800">
                        {selectedApp.name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-50">
                    <User className="w-3.5 h-3.5 text-purple-500" /> Lisans
                    Sahibi Sorumlusu
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">
                        Sözleşme Yetkilisi
                      </span>
                      <span className="text-sm font-black text-slate-800">
                        {selectedApp.owner}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-50">
                  <FileText className="w-3.5 h-3.5 text-purple-500" /> Seçilen
                  Lisans Modeli Detayı
                </div>
                <div className="bg-slate-50 rounded-2xl text-center p-4">
                  <span className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-black uppercase">
                    {selectedApp.package_name}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={btnLoading !== null}
                  onClick={() => handleRejectApplication(selectedApp.id)}
                  className="flex-1 px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-black border border-rose-100 cursor-pointer"
                >
                  Başvuruyu Reddet
                </button>
                <button
                  type="button"
                  disabled={btnLoading !== null}
                  onClick={() => handleApproveApplication(selectedApp)}
                  className="flex-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm cursor-pointer uppercase tracking-wider"
                >
                  {btnLoading === selectedApp.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}{" "}
                  Sözleşmeyi Onayla ve Kurulumu Başlat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSalonModalOpen && selectedSalon && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-black uppercase text-slate-800 tracking-tight">
                  Oto-Kayıt Salon Analizi
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSalonModalOpen(false)}
                className="p-1.5 hover:bg-slate-200 text-slate-400 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {selectedSalon.name}
                </h3>
              </div>
              <hr className="border-slate-100" />
              <div className="bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/50 text-center">
                <span className="text-[10px] text-indigo-500 font-black block">
                  Toplam Taahhüt Edilen Lisans Hacmi
                </span>
                <span className="font-black text-indigo-700 text-sm block mt-0.5">
                  {selectedSalon.income}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
