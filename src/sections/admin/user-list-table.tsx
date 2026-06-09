import React from "react";
import { MoreVertical, ShieldAlert, UserCheck } from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  appointments: number;
  status: string;
}

interface UserListTableProps {
  users: UserItem[];
  onToggleStatus: (id: string) => void;
}

export const UserListTable: React.FC<UserListTableProps> = ({ users, onToggleStatus }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <th className="p-4 pl-6">Müşteri Bilgisi</th>
            <th className="p-4">Telefon</th>
            <th className="p-4">Kayıt Tarihi</th>
            <th className="p-4">Toplam Randevu</th>
            <th className="p-4">Durum</th>
            <th className="p-4 pr-6 text-right">Aksiyon</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 text-xs text-slate-600">
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                Aranan kriterlere uygun müşteri bulunamadı.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition">
                <td className="p-4 pl-6">
                  <div className="font-bold text-slate-800 text-sm">{user.name}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{user.email}</div>
                </td>
                <td className="p-4 font-medium text-slate-700">{user.phone}</td>
                <td className="p-4 text-slate-500">{user.joinDate}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded-md">
                    {user.appointments} Randevu
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md ${
                    user.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 pr-6 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button 
                      onClick={() => onToggleStatus(user.id)}
                      title={user.status === 'Aktif' ? "Hesabı Askıya Al" : "Hesabı Aktifleştir"} 
                      className={`p-1.5 rounded-md transition ${
                        user.status === 'Aktif' ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {user.status === 'Aktif' ? <ShieldAlert className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};