import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { EmployeesList } from "../../sections/emloyees/emloyees-list";
import { EmployeesDetail } from "../../sections/emloyees/emloyees-detail";
import { EmployeesAdd } from "../../sections/emloyees/emloyees-add";
import type { StaffMember } from "../../types/emloyees";

export const Staff = () => {
  const [viewMode, setViewMode] = useState<"list" | "detail" | "add">("list");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: 1,
      name: "Sudenaz Yuvcal",
      role: "Kurucu / Master Hair Stylist & Renklendirme Uzmanı",
      status: "Aktif",
      rating: 5.0,
      activeAppointments: 4,
      revenue: "₺42,500",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150",
      services: [
        "Micro Kaynak",
        "Ombre/Sombre",
        "Kreatif Kesim",
        "Keratin Bakım",
      ],
    },
  ]);

  const handleSaveStaff = (newStaff: StaffMember) => {
    setStaffMembers([...staffMembers, newStaff]);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setViewMode("list");
    }, 2000);
  };

  const openDetail = (member: StaffMember) => {
    setSelectedStaff(member);
    setViewMode("detail");
  };

  return (
    <div className="relative w-full">
      {showToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-4 rounded-2xl shadow-xl animate-slideIn">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          <div>
            <h4 className="text-sm font-bold">Personel Kaydedildi</h4>
            <p className="text-xs text-emerald-600/90 mt-0.5">
              Yeni ekip üyesi başarıyla sisteme eklendi.
            </p>
          </div>
        </div>
      )}

      {viewMode === "list" && (
        <EmployeesList
          staffMembers={staffMembers}
          onAddClick={() => setViewMode("add")}
          onDetailClick={openDetail}
        />
      )}

      {viewMode === "detail" && selectedStaff && (
        <EmployeesDetail
          selectedStaff={selectedStaff}
          onBackClick={() => setViewMode("list")}
        />
      )}

      {viewMode === "add" && (
        <EmployeesAdd
          onSave={handleSaveStaff}
          onCancel={() => setViewMode("list")}
        />
      )}
    </div>
  );
};
