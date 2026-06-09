import { useState } from "react";
import {
  Search,
  Eye,
  Ban,
  CheckCircle,
  X,
  Copy,
  Check,
  MapPin,
  UserPlus,
  Clock,
  Building2,
  Phone,
  User,
  ShieldCheck,
  FileText,
  Mail,
} from "lucide-react";

type SalonPackage =
  | "2 Yıllık Ekosistem Dev"
  | "1 Yıllık Süper Özel"
  | "6 Aylık Kurumsal";
type SalonStatus = "Aktif" | "Donduruldu";

interface Salon {
  id: number;
  name: string;
  city: string;
  owner: string;
  phone: string;
  package: SalonPackage;
  status: SalonStatus;
  income: string;
  marketplaceVolume: string;
}

interface Application {
  id: number;
  name: string;
  city: string;
  owner: string;
  phone: string;
  email: string;
  taxNumber: string;
  date: string;
  package: SalonPackage;
  description: string;
}

const INITIAL_SALONS: Salon[] = [
  {
    id: 1,
    name: "Glow & Go Studio",
    city: "İstanbul, Beşiktaş",
    owner: "Zeynep Yılmaz",
    phone: "0532 123 45 67",
    package: "1 Yıllık Süper Özel",
    status: "Aktif",
    income: "₺22,788",
    marketplaceVolume: "₺45,000",
  },
  {
    id: 2,
    name: "Gentlemen's Club",
    city: "Ankara, Çankaya",
    owner: "Murat Demir",
    phone: "0542 987 65 43",
    package: "2 Yıllık Ekosistem Dev",
    status: "Aktif",
    income: "₺33,576",
    marketplaceVolume: "₺85,000",
  },
  {
    id: 4,
    name: "Vogue Beauty",
    city: "Bursa, Nilüfer",
    owner: "Selin Şahin",
    phone: "0533 111 22 33",
    package: "1 Yıllık Süper Özel",
    status: "Donduruldu",
    income: "₺4,100",
    marketplaceVolume: "₺32,000",
  },
];

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 101,
    name: "Monaco Hair Design",
    city: "Antalya, Muratpaşa",
    owner: "Caner Tekin",
    phone: "+90 536 777 88 99",
    email: "caner@monacohair.com",
    taxNumber: "4410982231",
    date: "Bugün",
    package: "2 Yıllık Ekosistem Dev",
    description:
      "Antalya merkezli 3 şubeli salon zincirimizin dijital kasa ve B2B tedarik altyapısını KRTS Ekosistemine taşımak istiyoruz.",
  },
  {
    id: 102,
    name: "İzmir Güzellik Sarayı",
    city: "İzmir, Karşıyaka",
    owner: "Merve Aydın",
    phone: "+90 0541 222 33 44",
    email: "merve.aydin@izmirguzellik.com",
    taxNumber: "1120448899",
    date: "Dün",
    package: "6 Aylık Kurumsal",
    description:
      "Yeni açılacak olan lüks segment güzellik merkezimiz için entegre randevu ve B2B pazar yeri modüllerini aktif etmek istiyoruz.",
  },
];

export function SalonsManagementView() {
  const [salons, setSalons] = useState<Salon[]>(INITIAL_SALONS);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);

  const [searchQuery, setSearchQuery] = useState("");
  const [packageFilter, setPackageFilter] = useState("Tüm Paketler");
  const [statusFilter, setStatusFilter] = useState("Tüm Durumlar");

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const [isSalonModalOpen, setIsSalonModalOpen] = useState(false);
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);

  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://ekosistem.salon/b2b-kayit-ol");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApproveApplication = (app: Application) => {
    const newSalon: Salon = {
      id: Date.now(),
      name: app.name,
      city: app.city,
      owner: app.owner,
      phone: app.phone,
      package: app.package,
      status: "Aktif",
      income:
        app.package === "2 Yıllık Ekosistem Dev"
          ? "₺33,576"
          : app.package === "1 Yıllık Süper Özel"
            ? "₺22,788"
            : "₺14,994",
      marketplaceVolume: "₺0",
    };

    setSalons((prev) => [newSalon, ...prev]);
    setApplications((prev) => prev.filter((a) => a.id !== app.id));
    setIsDetailModalOpen(false);
  };

  const handleRejectApplication = (id: number) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    setIsDetailModalOpen(false);
  };

  const toggleSalonStatus = (id: number) => {
    setSalons((prev) =>
      prev.map((salon) => {
        if (salon.id === id) {
          return {
            ...salon,
            status:
              salon.status === "Aktif"
                ? ("Donduruldu" as SalonStatus)
                : ("Aktif" as SalonStatus),
          };
        }
        return salon;
      }),
    );
  };

  const filteredSalons = salons.filter((salon) => {
    const matchesSearch =
      salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salon.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salon.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPackage =
      packageFilter === "Tüm Paketler" || salon.package === packageFilter;
    const matchesStatus =
      statusFilter === "Tüm Durumlar" || salon.status === statusFilter;

    return matchesSearch && matchesPackage && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Salon ve Bayi Altyapı Yönetimi
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Sisteme dışarıdan başvuran salonların dijital sözleşme onayları ve
            lisans takipleri.
          </p>
        </div>
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl text-xs transition-all shadow-xs cursor-pointer"
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
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {app.city}
                    </span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="text-purple-600 font-black">
                      {app.package}
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
      )}

      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4.5 h-4.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Onaylı salon adı, yetkili veya konum ara..."
            className="w-full pl-11 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-purple-200 transition-all font-bold text-slate-700"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={packageFilter}
            onChange={(e) => setPackageFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-100 rounded-xl font-black text-slate-600 focus:outline-none"
          >
            <option>Tüm Paketler</option>
            <option>2 Yıllık Ekosistem Dev</option>
            <option>1 Yıllık Süper Özel</option>
            <option>6 Aylık Kurumsal</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-100 rounded-xl font-black text-slate-600 focus:outline-none"
          >
            <option>Tüm Durumlar</option>
            <option>Aktif</option>
            <option>Donduruldu</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <th className="p-5 pl-8">Sistemdeki Salon</th>
              <th className="p-5">Konum / Şehir</th>
              <th className="p-5">Aktif Paket</th>
              <th className="p-5">Kasa Lisans Bedeli</th>
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
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {salon.owner} • {salon.phone}
                  </div>
                </td>
                <td className="p-5">
                  <span className="text-slate-500 font-medium">
                    {salon.city}
                  </span>
                </td>
                <td className="p-5">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] border ${
                      salon.package === "2 Yıllık Ekosistem Dev"
                        ? "bg-indigo-50 border-indigo-100 text-indigo-600"
                        : salon.package === "1 Yıllık Süper Özel"
                          ? "bg-purple-50 border-purple-100 text-purple-600"
                          : "bg-slate-100 border-slate-200 text-slate-600"
                    }`}
                  >
                    {salon.package}
                  </span>
                </td>
                <td className="p-5 text-slate-800 font-black">
                  {salon.income}
                </td>
                <td className="p-5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                      salon.status === "Aktif"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {salon.status}
                  </span>
                </td>
                <td className="p-5 pr-8 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedSalon(salon);
                        setIsSalonModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
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

      {isDetailModalOpen && selectedApp && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-[36px] shadow-2xl overflow-hidden border border-slate-100">
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
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">
                        Hizmet Konumu
                      </span>
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {selectedApp.city}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">
                        Vergi / Kimlik Numarası
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-600">
                        {selectedApp.taxNumber}
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
                  <FileText className="w-3.5 h-3.5 text-purple-500" /> İşletme
                  Notu & Başvuru Amacı
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed font-bold">
                    {selectedApp.description}
                  </p>
                  <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-100 flex justify-between items-center">
                    <span className="text-xs font-black text-purple-900">
                      Talep Edilen Altyapı Lisans Modeli:
                    </span>
                    <span className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-black">
                      {selectedApp.package}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 font-medium">
                Bu dijital sözleşmeyi onayladığınızda, salonun B2B yönetim
                paneli aktif edilecek ve seçmiş olduğu lisans paketine ait
                faturası otomatik kesilecektir.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleRejectApplication(selectedApp.id)}
                  className="flex-1 px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-black transition cursor-pointer border border-rose-100"
                >
                  Başvuruyu Reddet
                </button>
                <button
                  onClick={() => handleApproveApplication(selectedApp)}
                  className="flex-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Sözleşmeyi Onayla ve Kurulumu
                  Başlat
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
                <p className="text-slate-400 font-medium mt-0.5">
                  {selectedSalon.city}
                </p>
              </div>
              <hr className="border-slate-100" />
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block">
                    Sözleşme Sahibi
                  </span>
                  <span className="font-black text-slate-800 block mt-0.5">
                    {selectedSalon.owner}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block">
                    İletişim Hattı
                  </span>
                  <span className="font-black text-slate-800 block mt-0.5">
                    {selectedSalon.phone}
                  </span>
                </div>
                <div className="bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/50">
                  <span className="text-[10px] text-indigo-500 font-black block">
                    Ödenen Lisans Bedeli
                  </span>
                  <span className="font-black text-indigo-700 text-sm block mt-0.5">
                    {selectedSalon.income}
                  </span>
                </div>
                <div className="bg-purple-50/50 p-2.5 rounded-xl border border-purple-100/50">
                  <span className="text-[10px] text-purple-500 font-black block">
                    B2B Pazar Yeri Hacmi
                  </span>
                  <span className="font-black text-purple-700 text-sm block mt-0.5">
                    {selectedSalon.marketplaceVolume}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}