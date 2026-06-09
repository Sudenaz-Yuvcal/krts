import React, { useState } from "react";
import { 
  Search, 
  Building2, 
  X, 
  Check, 
  Plus,
  Clock,
  Eye,
  Save,
  Phone,
  Mail,
  FileText,
  MapPin,
  User,
  Briefcase,
  ShieldAlert,
  UserCheck
} from "lucide-react";

interface Branch {
  id: number;
  name: string;
  manager: string;
  district: string;
  city: string;
  phone: string;
  email: string;
  taxNumber: string;
  status: "Aktif" | "Pasif";
  joinedDate: string;
  performance: string;
}

interface Application {
  id: number;
  name: string;
  category: string;
  date: string;
  taxNumber: string;
  authorizedPerson: string;
  phone: string;
  email: string;
  district: string;
  city: string;
  description: string;
}

export function BrandBranches() {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<Application | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    category: "Franchise İstasyonu",
    city: "",
    district: "",
    taxNumber: "",
    authorizedPerson: "",
    email: "",
    phone: "",
    description: ""
  });

  const [branches, setBrands] = useState<Branch[]>([
    { id: 1, name: "Nişantaşı L'Oréal Premium Salon", manager: "Ahmet Yılmaz", district: "Şişli", city: "İstanbul", phone: "0212 211 00 11", email: "nisantasi@lorealsalon.com", taxNumber: "9820341122", status: "Aktif", joinedDate: "12.04.2024", performance: "Yüksek Sarfiyat Skoru (%92 Envanter Verimliliği)" },
    { id: 2, name: "Bağdat Caddesi Maybelline Hub", manager: "Elif Demir", district: "Kadıköy", city: "İstanbul", phone: "0216 311 22 33", email: "cadde@maybellinehub.com", taxNumber: "1120459988", status: "Aktif", joinedDate: "05.01.2025", performance: "Bölgesel Lider (%88 Satış Başarısı)" },
    { id: 3, name: "Tunalı Garnier Doğa Kuaför", manager: "Can Tekin", district: "Çankaya", city: "Ankara", phone: "0312 411 44 55", email: "tunali@garnierhair.com", taxNumber: "4450128833", status: "Pasif", joinedDate: "18.09.2025", performance: "Sürdürülebilir Ürün Sarfiyatı (%81)" },
  ]);

  const [applications, setApplications] = useState<Application[]>([
    { 
      id: 101, 
      name: "Alsancak Saç Tasarım Merkezi", 
      category: "Franchise Adayı",
      date: "Bugün",
      taxNumber: "5560912233",
      authorizedPerson: "Merve Kaya",
      phone: "+90 232 511 66 77",
      email: "alsancak.tasarim@gmail.com",
      district: "Konak",
      city: "İzmir",
      description: "İzmir bölgesinde L'Oréal ve Maybelline stand alanlarımızı genişletmek, KRTS B2B envanter ağına dahil olmak için resmi franchise başvurusu yapıyoruz."
    }
  ]);

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLiveBranch: Branch = {
      id: Date.now(),
      name: formData.name,
      manager: formData.authorizedPerson,
      district: formData.district,
      city: formData.city,
      phone: formData.phone,
      email: formData.email,
      taxNumber: formData.taxNumber,
      status: "Aktif",
      joinedDate: "Bugün",
      performance: "Manuel Eklenen İstasyon (Canlı Veri Bekleniyor)"
    };

    setBrands(prev => [...prev, newLiveBranch]);
    setIsAddModalOpen(false);
    
    setFormData({
      name: "", category: "Franchise İstasyonu", city: "", district: "",
      taxNumber: "", authorizedPerson: "", email: "", phone: "", description: ""
    });
  };

  const handleToggleBranchStatus = (id: number) => {
    setBrands(prev => prev.map(branch => {
      if (branch.id === id) {
        const nextStatus = branch.status === "Aktif" ? "Pasif" : "Aktif";
        return { ...branch, status: nextStatus };
      }
      return branch;
    }));
  };

  const handleApprove = (app: Application) => {
    const professionallyApprovedBranch: Branch = {
      id: app.id,
      name: app.name,
      manager: app.authorizedPerson,
      district: app.district,
      city: app.city,
      phone: app.phone,
      email: app.email,
      taxNumber: app.taxNumber,
      status: "Aktif",
      joinedDate: "Bugün",
      performance: "Sistem Onaylı Dağıtım İstasyonu"
    };
    
    setBrands(prev => [...prev, professionallyApprovedBranch]);
    setApplications(prev => prev.filter(a => a.id !== app.id));
    setIsDetailModalOpen(false);
  };

  const handleReject = (id: number) => {
    setApplications(prev => prev.filter(a => a.id !== id));
    setIsDetailModalOpen(false);
  };

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 p-2">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Franchise Şube Yönetimi</h1>
          <p className="text-sm text-slate-400 mt-1">Sisteme bağlı tüm alt şubelerin performans, resmi künye ve operasyonel entegrasyon takibi.</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-100 rounded-2xl text-xs font-black transition-all cursor-pointer uppercase tracking-wider"
        >
          <Plus className="w-4 h-4 stroke-3" /> Yeni Şube Tanımla
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Aktif Operasyonel Nokta</span>
          <h3 className="text-2xl font-black text-slate-800 mt-2 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-purple-500" /> {branches.filter(b => b.status === "Aktif").length} Aktif Şube
          </h3>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">İnceleme Bekleyen Dağıtım Noktası</span>
          <h3 className="text-2xl font-black text-slate-800 mt-2 flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-500" /> {applications.length} Yeni İstek
          </h3>
        </div>
        <div className="p-6 bg-purple-600 rounded-3xl shadow-xl shadow-purple-100">
          <span className="text-[10px] font-black text-purple-100 uppercase tracking-widest block">Durdurulan İstasyon Sayısı</span>
          <h3 className="text-2xl font-black text-white mt-2 flex items-center gap-1.5">
            <ShieldAlert className="w-5 h-5 text-purple-200" /> {branches.filter(b => b.status === "Pasif").length} Askıda
          </h3>
        </div>
      </div>

      {applications.length > 0 && (
        <div className="bg-amber-50/40 border border-amber-100/70 p-6 rounded-[32px] space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-black text-amber-800 tracking-tight uppercase">Onay Bekleyen Şube Başvuruları ({applications.length})</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white p-5 rounded-2xl border border-amber-100 shadow-2xs flex justify-between items-center gap-4 group hover:border-amber-300 transition-all">
                <div className="space-y-1">
                  <div className="font-black text-slate-800 text-sm">{app.name}</div>
                  <div className="text-[11px] text-slate-400 font-bold flex items-center gap-2">
                    <span>{app.district}, {app.city}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="text-purple-600 font-black">{app.category}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => { setSelectedBranch(app); setIsDetailModalOpen(true); }}
                  className="px-3.5 py-2 bg-slate-50 hover:bg-purple-50 text-slate-500 hover:text-purple-600 border border-slate-100 hover:border-purple-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4" /> Detayları İncele
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4.5 h-4.5" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Şube adı, ilçe veya lokasyon bazlı ara..." 
            className="w-full pl-11 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-purple-200 transition-all font-bold text-slate-700"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <th className="p-5 pl-8">Franchise Şube Adı</th>
              <th className="p-5">Şube Sorumlusu</th>
              <th className="p-5">Lokasyon / Bölge</th>
              <th className="p-5">Resmi Vergi No</th>
              <th className="p-5 text-center">Ağ Durumu</th>
              <th className="p-5 pr-8 text-right">Yönetim</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs font-bold text-slate-600">
            {filteredBranches.map((branch) => {
              return (
                <tr key={branch.id} className="hover:bg-slate-50/60 transition-all group">
                  <td className="p-5 pl-8">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black transition-colors ${
                        branch.status === "Aktif" ? "bg-purple-50 text-purple-600" : "bg-slate-100 text-slate-400"
                      }`}>
                        {branch.name.charAt(0)}
                      </div>
                      <span className={`font-black text-sm transition-colors ${
                        branch.status === "Aktif" ? "text-slate-800" : "text-slate-400 line-through"
                      }`}>{branch.name}</span>
                    </div>
                  </td>
                  <td className={`p-5 ${branch.status === "Aktif" ? "text-slate-700" : "text-slate-400"}`}>
                    {branch.manager}
                  </td>
                  <td className="p-5">
                    <span className="text-slate-500 flex items-center gap-1.5 bg-slate-50 w-fit px-3 py-1 rounded-xl border border-slate-100">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {branch.district}, <span className="uppercase font-black text-slate-700">{branch.city}</span>
                    </span>
                  </td>
                  <td className="p-5">
                    <span className="text-slate-500 font-mono font-bold">{branch.taxNumber}</span>
                  </td>
                  <td className="p-5 text-center">
                    <span className={`inline-flex items-center gap-1 border px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      branch.status === 'Aktif' 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                        : 'bg-rose-50 border-rose-100 text-rose-700'
                    }`}>
                      {branch.status === 'Aktif' ? <Check className="w-3 h-3 stroke-3" /> : <X className="w-3 h-3 stroke-3" />}
                      {branch.status}
                    </span>
                  </td>
                  <td className="p-5 pr-8 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => handleToggleBranchStatus(branch.id)}
                        title={branch.status === 'Aktif' ? "Şube Operasyonunu Durdur" : "Şubeyi Tekrar Aktifleştir"} 
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          branch.status === 'Aktif' 
                            ? 'bg-slate-50 border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50' 
                            : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50'
                        }`}
                      >
                        {branch.status === 'Aktif' ? <ShieldAlert className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-[36px] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-5 bg-purple-600 rounded-full" />
                <h3 className="text-base font-black text-slate-800 tracking-tight">Merkez Ağına Yeni İstasyon Kaydet</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-50">
                    <Building2 className="w-3.5 h-3.5 text-purple-500" /> Resmi Künye Girişi
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Salon / Şube Ünvanı</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Örn: Nişantaşı Premium İstasyonu" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500 transition" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 block uppercase">Şehir</label>
                        <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="İstanbul" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500 transition" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 block uppercase">İlçe</label>
                        <input required type="text" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} placeholder="Şişli" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500 transition" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Vergi Numarası</label>
                      <input required type="text" value={formData.taxNumber} onChange={e => setFormData({...formData, taxNumber: e.target.value})} placeholder="9820341122" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-purple-500 transition" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-50">
                    <User className="w-3.5 h-3.5 text-purple-500" /> Sorumlu Personel Atama
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Yetkili Adı Soyadı</label>
                      <input required type="text" value={formData.authorizedPerson} onChange={e => setFormData({...formData, authorizedPerson: e.target.value})} placeholder="Ahmet Yılmaz" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500 transition" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">E-Posta Adresi</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="ahmet@salon.com" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500 transition" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Telefon Numarası</label>
                      <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+90 532 123 45 67" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500 transition" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-50">
                  <FileText className="w-3.5 h-3.5 text-purple-500" /> İstasyon Tanım Gerekçesi & Entegrasyon Notu
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                  <textarea required rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Şubenin ağ içindeki dağıtım rolü..." className="w-full p-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500 transition resize-none leading-relaxed" />
                  <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-100 flex justify-between items-center">
                    <span className="text-xs font-black text-purple-900 flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-purple-500" /> Tip / Kategori:</span>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="px-3 py-1 bg-white border border-purple-200 text-purple-900 rounded-lg text-xs font-black focus:outline-none cursor-pointer">
                      <option value="Franchise İstasyonu">Franchise İstasyonu</option>
                      <option value="Premium Dağıtım Ağı">Premium Dağıtım Ağı</option>
                      <option value="Pilot Bölge Laboratuvarı">Pilot Bölge Laboratuvarı</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl text-xs font-black cursor-pointer">Vazgeç</button>
                <button type="submit" className="flex-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm cursor-pointer">
                  <Save className="w-4 h-4" /> Yeni İstasyon Kurulumunu Tamamla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDetailModalOpen && selectedBranch && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-[36px] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800 tracking-tight">Franchise İstasyon Başvuru Detayı</h3>
                  <p className="text-[11px] text-slate-400 font-bold">Kayıt İstek Tarihi: {selectedBranch.date}</p>
                </div>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-50">
                    <Building2 className="w-3.5 h-3.5 text-purple-500" /> Resmi Künye Bilgileri
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Salon / Şube Ticari Adı</span>
                      <span className="text-sm font-black text-slate-800">{selectedBranch.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Kurulacak Lokasyon</span>
                      <span className="text-xs font-bold text-slate-700">{selectedBranch.district}, {selectedBranch.city}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Potansiyel Vergi Numarası</span>
                      <span className="text-xs font-mono font-bold text-slate-600">{selectedBranch.taxNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-50">
                    <User className="w-3.5 h-3.5 text-purple-500" /> Atanmış Şube Sorumlusu
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Şube Müdürü / Sorumlu</span>
                      <span className="text-sm font-black text-slate-800">{selectedBranch.authorizedPerson}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedBranch.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedBranch.phone}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-50">
                  <FileText className="w-3.5 h-3.5 text-purple-500" /> Şube Talep Gerekçesi & Entegrasyon Notu
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed font-bold">{selectedBranch.description}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => handleReject(selectedBranch.id)}
                  className="flex-1 px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-black transition cursor-pointer border border-rose-100"
                >
                  Başvuruyu Reddet
                </button>
                <button 
                  onClick={() => handleApprove(selectedBranch)}
                  className="flex-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Şubeyi Onayla ve Ağı Başlat
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}