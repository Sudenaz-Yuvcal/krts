import React from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Star } from "lucide-react";
import type { StaffMember } from "../../types/emloyees";

interface ListSectionProps {
  staffMembers: StaffMember[];
  onAddClick: () => void;
  onDetailClick: (member: StaffMember) => void;
}

export const EmployeesList: React.FC<ListSectionProps> = ({
  staffMembers,
  onAddClick,
  onDetailClick,
}) => {
  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-800">
            Ekibimiz
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Detayları ve analizleri görmek için personelin yanındaki butona
            tıklayın.
          </p>
        </div>
        <Button type="button" variant="primary" onClick={onAddClick}>
          Yeni Çalışan Ekle
        </Button>
      </div>

      <Card className="p-8">
        <h4 className="text-lg font-black text-slate-800 tracking-tight mb-6">
          Aktif Personel Listesi
        </h4>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="pb-4">Çalışan</th>
                <th className="pb-4">Uzmanlık Unvanı</th>
                <th className="pb-4">Durum</th>
                <th className="pb-4 text-center">Müşteri Puanı</th>
                <th className="pb-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {staffMembers.map((member) => (
                <tr
                  key={member.id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.img}
                        alt={member.name}
                        className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-100"
                      />
                      <div>
                        <h5 className="text-xs font-black text-slate-800 flex items-center gap-1">
                          {member.name}
                        </h5>
                        <span className="text-[10px] font-bold text-slate-400">
                          {member.activeAppointments} Aktif Randevu
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-xs font-bold text-slate-600">
                    {member.role}
                  </td>
                  <td className="py-4">
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600">
                      {member.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-1 text-amber-500 text-xs font-black">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {member.rating.toFixed(1)}
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => onDetailClick(member)}
                      className="bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs font-bold py-2 px-4 rounded-xl transition-all cursor-pointer border border-slate-100"
                    >
                      Yönet & İncele
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
