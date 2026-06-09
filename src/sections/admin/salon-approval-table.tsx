import { useState } from "react";
import { Check, X, Building } from "lucide-react";

export function SalonApprovalTable() {
  const [requests, setRequests] = useState([
    { id: 101, name: "Makas Etiler", owner: "Ahmet Yılmaz", package: "Premium", date: "Bugün, 14:22" },
    { id: 102, name: "Güzellik Atölyesi", owner: "Ayşe Demir", package: "Standart", date: "Bugün, 11:05" },
    { id: 103, name: "Mad Labs Barber", owner: "Volkan Kaya", package: "Başlangıç", date: "Dün, 18:40" }
  ]);

  const handleApprove = (id: number, salonName: string) => {
    alert(`${salonName} başarıyla onaylandı ve sisteme dahil edildi!`);
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleReject = (id: number, salonName: string) => {
    if(confirm(`${salonName} başvurusunu reddetmek istediğinize emin misiniz?`)) {
      setRequests(prev => prev.filter(req => req.id !== id));
    }
  };

  if (requests.length === 0) {
    return (
      <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs font-bold flex flex-col items-center gap-2">
        <Building className="w-8 h-8 text-slate-300" />
        Onay bekleyen herhangi bir salon başvurusu bulunmuyor.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
            <th className="p-3">Salon Adı</th>
            <th className="p-3">Yetkili</th>
            <th className="p-3">Seçilen Paket</th>
            <th className="p-3 text-right">Aksiyonlar</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 text-xs">
          {requests.map((req) => (
            <tr key={req.id} className="hover:bg-slate-50/30 transition">
              <td className="p-3 font-bold text-slate-800">
                {req.name}
                <span className="block text-[10px] text-slate-400 font-medium mt-0.5">{req.date}</span>
              </td>
              <td className="p-3 text-slate-600 font-medium">{req.owner}</td>
              <td className="p-3">
                <span className="px-2 py-0.5 bg-purple-50 text-purple-600 font-bold rounded-sm text-[10px]">
                  {req.package}
                </span>
              </td>
              <td className="p-3 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button 
                    onClick={() => handleApprove(req.id, req.name)}
                    title="Başvuruyu Onayla" 
                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleReject(req.id, req.name)}
                    title="Başvuruyu Reddet" 
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}