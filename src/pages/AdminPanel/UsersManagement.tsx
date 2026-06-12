import { useState, useEffect } from "react";
import { Search, ArrowUpDown, Loader2 } from "lucide-react";
import { UserListTable } from "../../sections/admin/user-list-table";
import { supabase } from "../../lib/supabaseClient";
import type { DbUser, TableUser } from "../../types/admin";

export function UsersManagementView() {
  const [dbUsers, setDbUsers] = useState<DbUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tüm Durumlar");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "customer")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setDbUsers(data);
    } catch (err) {
      console.error("Müşteri verileri çekilirken hata oluştu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const toggleUserStatus = async (userId: string) => {
    const currentUser = dbUsers.find((u) => u.id === userId);
    if (!currentUser) return;

    const nextStatus = !currentUser.is_approved;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_approved: nextStatus })
        .eq("id", userId);

      if (error) throw error;

      setDbUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, is_approved: nextStatus } : u,
        ),
      );
    } catch (err) {
      console.error("Kullanıcı durumu güncellenirken hata oluştu:", err);
      alert("Durum güncellenemedi, lütfen tekrar deneyin.");
    }
  };

  const handleSort = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const mappedUsers: TableUser[] = dbUsers.map((user) => {
    const formattedDate = user.created_at
      ? new Date(user.created_at).toLocaleDateString("tr-TR")
      : "Belirtilmedi";

    return {
      id: user.id.slice(0, 8).toUpperCase(),
      originalId: user.id,
      name: user.full_name || "İsimsiz Kullanıcı",
      email: user.email || "E-posta Yok",
      phone: user.phone || "Telefon Yok",
      joinDate: formattedDate,
      appointments: 0,
      status: user.is_approved ? "Aktif" : "Askıda",
    };
  });

  const filteredAndSortedUsers = mappedUsers
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

  if (loading) {
    return (
      <div className="min-h-100 flex flex-col items-center justify-center gap-2 text-center py-20 text-xs text-purple-600 font-bold tracking-wide">
        <Loader2 className="w-7 h-7 animate-spin" />
        Müşteri Veritabanı Yükleniyor...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Müşteri Yönetimi
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          `profiles` tablosundaki "customer" rolüne sahip son kullanıcıların
          gerçek zamanlı hesap durumları.
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
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            Randevu: {sortDirection === "asc" ? "Azdan Çoğa" : "Çoktan Aza"}
          </button>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-600 focus:outline-hidden cursor-pointer"
          >
            <option>Tüm Durumlar</option>
            <option>Aktif Üyeler</option>
            <option>Engellenmiş Hesaplar</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {filteredAndSortedUsers.length === 0 ? (
          <div className="text-center py-12 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Filtrelere uygun müşteri bulunamadı.
          </div>
        ) : (
          <UserListTable
            users={filteredAndSortedUsers}
            onToggleStatus={toggleUserStatus}
          />
        )}
      </div>
    </div>
  );
}
