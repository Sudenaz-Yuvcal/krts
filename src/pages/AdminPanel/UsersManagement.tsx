import { useState } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { UserListTable } from "../../sections/admin/user-list-table";

const INITIAL_USERS = [
  {
    id: "USR-001",
    name: "Elif Şimşek",
    email: "elif@example.com",
    phone: "0532 111 22 33",
    joinDate: "12.04.2026",
    appointments: 14,
    status: "Aktif",
  },
  {
    id: "USR-002",
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    phone: "0542 222 33 44",
    joinDate: "18.04.2026",
    appointments: 5,
    status: "Aktif",
  },
  {
    id: "USR-003",
    name: "Ayşe Demir",
    email: "ayse@example.com",
    phone: "0555 333 44 55",
    joinDate: "02.05.2026",
    appointments: 0,
    status: "Askıda",
  },
  {
    id: "USR-004",
    name: "Can Tekin",
    email: "can@example.com",
    phone: "0533 444 55 66",
    joinDate: "20.05.2026",
    appointments: 22,
    status: "Aktif",
  },
];

export function UsersManagementView() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tüm Durumlar");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const toggleUserStatus = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "Aktif" ? "Askıda" : "Aktif" }
          : user,
      ),
    );
  };

  const handleSort = () => {
    const nextDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(nextDirection);
  };

  const filteredAndSortedUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "Tüm Durumlar" ||
        (statusFilter === "Aktif Üyeler" && user.status === "Aktif") ||
        (statusFilter === "Engellenmiş Hesaplar" && user.status === "Askıda");

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      return sortDirection === "asc"
        ? a.appointments - b.appointments
        : b.appointments - a.appointments;
    });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Müşteri Yönetimi
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Uygulama üzerinden kuaför randevusu alan tüm son kullanıcıların hesap
          durumları ve geçmişleri.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Müşteri adı, e-posta, ID veya telefon numarası ile ara..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-purple-500 font-medium text-slate-700"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSort}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition flex items-center gap-1.5"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            Randevu: {sortDirection === "asc" ? "Azdan Çoğa" : "Çoktan Aza"}
          </button>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-600 focus:outline-hidden"
          >
            <option>Tüm Durumlar</option>
            <option>Aktif Üyeler</option>
            <option>Engellenmiş Hesaplar</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <UserListTable
          users={filteredAndSortedUsers}
          onToggleStatus={toggleUserStatus}
        />
      </div>
    </div>
  );
}
