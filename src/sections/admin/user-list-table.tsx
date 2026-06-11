import React, { useState } from "react";
import { MoreVertical, ShieldAlert, UserCheck, Copy, Info, X, Mail, Phone, Calendar, User } from "lucide-react";

interface UserItem {
  id: string;        
  originalId: string; 
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
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedModalUser, setSelectedModalUser] = useState<UserItem | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Orijinal Kullanıcı UUID panoya kopyalandı!");
    setActiveMenuId(null);
  };

  return (
    <div className="overflow-x-auto relative min-h-62.5">
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
              <tr key={user.originalId} className="hover:bg-slate-50/50 transition">
                <td className="p-4 pl-6">
                  <div className="font-bold text-slate-800 text-sm">{user.name}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{user.email}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">Kısa ID: {user.id}</div>
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
                <td className="p-4 pr-6 text-right relative">
                  <div className="flex items-center justify-end gap-1">
                    <button 
                      type="button"
                      onClick={() => onToggleStatus(user.originalId)}
                      title={user.status === 'Aktif' ? "Hesabı Askıya Al" : "Hesabı Aktifleştir"} 
                      className={`p-1.5 rounded-md transition cursor-pointer ${
                        user.status === 'Aktif' ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {user.status === 'Aktif' ? <ShieldAlert className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>

                    <button 
                      type="button"
                      onClick={() => setActiveMenuId(activeMenuId === user.originalId ? null : user.originalId)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {activeMenuId === user.originalId && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setActiveMenuId(null)} />
                      <div className="absolute right-6 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-30 text-left animate-in fade-in slide-in-from-top-1 duration-100">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(user.originalId)}
                          className="w-full px-3 py-2 text-left text-[11px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 text-blue-500" />
                          Orijinal ID Kopyala
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedModalUser(user);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-2 text-left text-[11px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5 text-purple-500" />
                          Hızlı Bilgiler
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedModalUser && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedModalUser(null)}
          >
            <div 
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()} 
            >
              <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                    <User className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-sm text-slate-800 tracking-tight">Müşteri Kartı Detayı</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedModalUser(null)}
                  className="p-1.5 hover:bg-slate-200/70 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Müşteri Adı</div>
                  <div className="text-sm font-black text-slate-800 mt-0.5">{selectedModalUser.name}</div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">E-posta Adresi</div>
                      <div className="text-xs font-semibold text-slate-700 mt-0.5">{selectedModalUser.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Telefon Numarası</div>
                      <div className="text-xs font-semibold text-slate-700 mt-0.5">{selectedModalUser.phone}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Sisteme Kayıt Tarihi</div>
                      <div className="text-xs font-semibold text-slate-700 mt-0.5">{selectedModalUser.joinDate}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400 space-y-1">
                  <div>Kısa Kod: {selectedModalUser.id}</div>
                  <div className="break-all">Tam UUID: {selectedModalUser.originalId}</div>
                </div>
              </div>

              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-right">
                <button
                  type="button"
                  onClick={() => setSelectedModalUser(null)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-[11px] transition shadow-xs cursor-pointer active:scale-95"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};