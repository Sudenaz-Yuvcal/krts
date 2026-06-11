import React, { useState, useEffect } from "react";
import {
  Handshake,
  ArrowUpRight,
  ChevronRight,
  Loader2,
  Check,
  Globe,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "../../lib/supabaseClient";

// Arayüz için yerel veri tipleri
interface BrandRow {
  id: string;
  brand_name: string;
  sector: string;
  logo_url: string | null;
  phone: string;
  email: string;
  website: string;
  created_at: string;
  package_plan_id: string;
}

interface TimelineStat {
  dateString: string;
  label: string;
  commissionAmount: number;
  packageAmount: number;
}

interface FormattedOrder {
  id: number;
  total_price: number;
  order_date: string;
  product_name: string;
  brand_name: string;
  purchase_price: number;
  quantity: number;
}

interface TopBrandStat {
  name: string;
  salesVolume: number;
  earnedCommission: number;
  percentage: number;
}

export const AdminDashboardView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [btnLoading, setBtnLoading] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<"weekly" | "monthly">("weekly");
  const [viewType, setViewType] = useState<"all" | "product" | "service">(
    "all",
  );

  // Finansal Stateler
  const [commissionProfit, setCommissionProfit] = useState<number>(0);
  const [packageProfit, setPackageProfit] = useState<number>(0);

  // Grafik ve Tablo Verileri
  const [graphData, setGraphData] = useState<TimelineStat[]>([]);
  const [topBrands, setTopBrands] = useState<TopBrandStat[]>([]);
  const [activeSalonsCount, setActiveSalonsCount] = useState<number>(0);
  const [ecosystemCustomersCount, setEcosystemCustomersCount] =
    useState<number>(0);

  // 🔔 Onay bekleyen yeni markaları tutacak dinamik liste state'i
  const [pendingBrands, setPendingBrands] = useState<BrandRow[]>([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Onay Bekleyen Markaları Çekiyoruz (profiles tablosunda is_approved = false olan markalar)
      const { data: approvedProfiles, error: profileErr } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "brand")
        .eq("is_approved", false);

      if (!profileErr && approvedProfiles) {
        const pendingIds = approvedProfiles.map((p) => p.id);

        if (pendingIds.length > 0) {
          const { data: brandData } = await supabase
            .from("brands")
            .select(
              "id, brand_name, sector, logo_url, phone, email, website, created_at, package_plan_id",
            )
            .in("id", pendingIds);

          if (brandData) setPendingBrands(brandData);
        } else {
          setPendingBrands([]);
        }
      }

      // 2. Sistem Sayaçları
      const { count: salonCount } = await supabase
        .from("salons")
        .select("*", { count: "exact", head: true });
      if (salonCount) setActiveSalonsCount(salonCount);

      const { count: customerCount } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });
      if (customerCount) setEcosystemCustomersCount(customerCount);

      // 3. Sipariş Verileri
      const { data: dbOrders, error: ordersError } = await supabase
        .from("orders")
        .select(
          `
          id,
          total_price,
          order_date,
          quantity,
          products ( product_name, brand_name, purchase_price )
        `,
        )
        .order("order_date", { ascending: false });

      if (ordersError) throw ordersError;

      const formattedOrders: FormattedOrder[] = (dbOrders || []).map(
        (o: any) => ({
          id: o.id,
          total_price: Number(o.total_price || 0),
          order_date: o.order_date
            ? o.order_date.split("T")[0]
            : new Date().toISOString().split("T")[0],
          product_name: o.products?.product_name || "Bilinmeyen Ürün",
          brand_name: o.products?.brand_name || "Bilinmeyen Marka",
          purchase_price: Number(o.products?.purchase_price || 0),
          quantity: Number(o.quantity || 0),
        }),
      );

      // 4. Lisans Gelirleri
      const { data: dbPackages, error: pkgError } = await supabase
        .from("package_orders")
        .select(
          `
          package_price,
          order_date,
          salons ( salon_name )
        `,
        )
        .order("order_date", { ascending: false });

      if (pkgError) throw pkgError;

      const formattedPackages = (dbPackages || []).map((p: any) => ({
        salon_name: p.salons?.salon_name || "Bilinmeyen Salon",
        package_price: Number(p.package_price || 0),
        order_date: p.order_date
          ? p.order_date.split("T")[0]
          : new Date().toISOString().split("T")[0],
      }));

      const totalPackageEarnings = formattedPackages.reduce(
        (sum, item) => sum + item.package_price,
        0,
      );
      const totalCommissionEarnings = formattedOrders.reduce(
        (sum, item) => sum + (item.total_price * 18) / 100,
        0,
      );

      setCommissionProfit(totalCommissionEarnings);
      setPackageProfit(totalPackageEarnings);

      // 5. Marka Dağılım Map'i
      const brandMap: { [key: string]: { volume: number; comm: number } } = {};
      formattedOrders.forEach((o) => {
        if (!brandMap[o.brand_name])
          brandMap[o.brand_name] = { volume: 0, comm: 0 };
        const calculatedComm = (o.total_price * 18) / 100;
        brandMap[o.brand_name].volume += o.total_price;
        brandMap[o.brand_name].comm += calculatedComm;
      });

      setTopBrands(
        Object.keys(brandMap)
          .map((name) => ({
            name,
            salesVolume: brandMap[name].volume,
            earnedCommission: brandMap[name].comm,
            percentage:
              totalCommissionEarnings > 0
                ? Math.round(
                    (brandMap[name].comm / totalCommissionEarnings) * 100,
                  )
                : 0,
          }))
          .sort((a, b) => b.earnedCommission - a.earnedCommission),
      );

      // 6. Grafik Zaman Çizelgesi
      const daysOfWeek = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
      const limit = timeFilter === "weekly" ? 7 : 12;

      const timeline: TimelineStat[] = Array.from({ length: limit })
        .map((_, i) => {
          const d = new Date();
          timeFilter === "weekly"
            ? d.setDate(d.getDate() - i)
            : d.setDate(d.getDate() - i * 2);
          return {
            dateString: d.toISOString().split("T")[0],
            label:
              timeFilter === "weekly"
                ? daysOfWeek[d.getDay()]
                : `${d.getDate()} Haz`,
            commissionAmount: 0,
            packageAmount: 0,
          };
        })
        .reverse();

      formattedPackages.forEach((item) => {
        const match = timeline.find((t) => t.dateString === item.order_date);
        if (match) match.packageAmount += item.package_price;
      });

      formattedOrders.forEach((item) => {
        const match = timeline.find((t) => t.dateString === item.order_date);
        if (match) match.commissionAmount += (item.total_price * 18) / 100;
      });

      setGraphData(timeline);
    } catch (err) {
      console.error("Dashboard verileri çekilirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 ADMİNİN MARKAYI ONAYLADIĞI TETİKLEYİCİ FONKSİYON
  const handleApproveBrand = async (brandId: string) => {
    try {
      setBtnLoading(brandId);

      const { error } = await supabase
        .from("profiles")
        .update({ is_approved: true })
        .eq("id", brandId);

      if (error) throw error;

      setPendingBrands((prev) => prev.filter((b) => b.id !== brandId));
    } catch (err) {
      console.error("Marka onaylanırken hata oluştu:", err);
    } finally {
      setBtnLoading(null);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeFilter]);

  if (loading) {
    return (
      <div className="min-h-100 flex flex-col items-center justify-center gap-2 text-center py-20 text-xs text-purple-600 font-bold tracking-wide">
        <Loader2 className="w-7 h-7 animate-spin" />
        Sistem Matrisi Hizalanıyor...
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 space-y-6 py-2 bg-white text-slate-800 antialiased overflow-hidden">
      {/* BAŞLIK ALANI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900">
            Admin Konsolu
          </h2>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">
            Sisteme yeni katılan markaların onayı ve ekosistem finansal takip
            merkezi.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 p-1 rounded-xl w-fit shrink-0">
          <button
            onClick={() => setTimeFilter("weekly")}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${timeFilter === "weekly" ? "bg-white text-purple-600 shadow-xs font-black border border-slate-100" : "text-slate-400 hover:text-slate-600"}`}
          >
            Haftalık
          </button>
          <button
            onClick={() => setTimeFilter("monthly")}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${timeFilter === "monthly" ? "bg-white text-purple-600 shadow-xs font-black border border-slate-100" : "text-slate-400 hover:text-slate-600"}`}
          >
            Aylık
          </button>
        </div>
      </div>

      {/* 🔔 ONAY BEKLEYEN MARKALAR LİSTESİ */}
      {pendingBrands.length > 0 && (
        <div className="bg-amber-50/40 border border-amber-200/60 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
            <h3 className="text-xs font-black text-amber-900 uppercase tracking-wider">
              Ağa Katılmak İsteyen Yeni Markalar ({pendingBrands.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingBrands.map((brand) => (
              <div
                key={brand.id}
                className="bg-white p-5 rounded-2xl border border-amber-100 shadow-3xs flex flex-col justify-between gap-4 group"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="font-black text-slate-900 text-sm">
                      {brand.brand_name}
                    </h4>
                    <p className="text-[10px] text-purple-600 font-black uppercase tracking-wide bg-purple-50 px-2 py-0.5 rounded w-fit">
                      {brand.sector}
                    </p>
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold">
                    {new Date(brand.created_at).toLocaleDateString("tr-TR")}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-bold border-t border-slate-50 pt-3">
                  <div className="flex items-center gap-1.5 truncate">
                    <PhoneIcon className="w-3.5 h-3.5 text-slate-400" />{" "}
                    {brand.phone}
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MailIcon className="w-3.5 h-3.5 text-slate-400" />{" "}
                    {brand.email}
                  </div>
                  <div className="flex items-center gap-1.5 truncate col-span-2">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />{" "}
                    {brand.website || "Belirtilmedi"}
                  </div>
                </div>

                <button
                  onClick={() => handleApproveBrand(brand.id)}
                  disabled={btnLoading === brand.id}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer uppercase tracking-wider mt-1"
                >
                  {btnLoading === brand.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-3" /> Markayı Ağa Dahil
                      Et (Onayla)
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MALİ KARTLAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Brüt Ekosistem Hacmi
          </span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            ₺{(commissionProfit + packageProfit).toLocaleString("tr-TR")}
          </h3>
          <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold mt-0.5">
            <ArrowUpRight className="w-3 h-3" /> Canlı Veri Akışı Aktif
          </p>
        </div>
        <div
          onClick={() =>
            setViewType(viewType === "product" ? "all" : "product")
          }
          className={`cursor-pointer p-3 rounded-xl transition-all border ${viewType === "product" ? "bg-purple-50/40 border-purple-200" : "border-transparent hover:bg-slate-50/60"}`}
        >
          <span className="text-[10px] font-black text-purple-600 uppercase tracking-wider">
            Pazar Yeri Komisyon Geliri (%18)
          </span>
          <h3 className="text-xl font-black text-slate-800 mt-0.5">
            ₺{commissionProfit.toLocaleString("tr-TR")}
          </h3>
        </div>
        <div
          onClick={() =>
            setViewType(viewType === "service" ? "all" : "service")
          }
          className={`cursor-pointer p-3 rounded-xl transition-all border ${viewType === "service" ? "bg-indigo-50/40 border-indigo-200" : "border-transparent hover:bg-slate-50/60"}`}
        >
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">
            Peşin Salon Lisans Havuzu
          </span>
          <h3 className="text-xl font-black text-slate-800 mt-0.5">
            ₺{packageProfit.toLocaleString("tr-TR")}
          </h3>
        </div>
      </div>

      {/* GRAFİK ALANI */}
      <div className="w-full min-w-0">
        <div style={{ width: "100%", height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={graphData}
              margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
            >
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                dy={5}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) =>
                  `₺${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`
                }
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (
                    active &&
                    payload &&
                    payload.length > 0 &&
                    payload[0]?.value !== undefined
                  ) {
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-lg border-none text-xs">
                        <p className="opacity-70 mb-0.5">{label}</p>
                        <p className="font-black">
                          ₺{Number(payload[0].value).toLocaleString("tr-TR")}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {(viewType === "all" || viewType === "product") && (
                <Area
                  type="monotone"
                  dataKey="commissionAmount"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fill="none"
                />
              )}
              {(viewType === "all" || viewType === "service") && (
                <Area
                  type="monotone"
                  dataKey="packageAmount"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="none"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ALT SEKMELER VE SİSTEM ÖZETLERİ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
            <Handshake className="w-3.5 h-3.5 text-purple-500" />
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Gerçek Tedarik Dağılımı
            </h4>
          </div>
          <div className="space-y-2">
            {topBrands.slice(0, 4).map((brand, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800 block">
                    {brand.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Ciro: ₺{brand.salesVolume.toLocaleString("tr-TR")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900 block">
                    ₺{brand.earnedCommission.toLocaleString("tr-TR")}
                  </span>
                  <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1 rounded">
                    % {brand.percentage} pay
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">           
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-50/60 rounded-lg border border-slate-100 text-xs">
              <span className="font-semibold text-slate-600">Aktif Salon</span>
              <span className="font-black text-slate-900">
                {activeSalonsCount}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-50/60 rounded-lg border border-slate-100 text-xs">
              <span className="font-semibold text-slate-600">
                Müşteri Havuzu
              </span>
              <span className="font-black text-slate-900">
                {ecosystemCustomersCount}
              </span>
            </div>
            <button
              onClick={() =>
                alert("Canlı Sipariş Logları Modülü Hazırlanıyor.")
              }
              className="w-full flex items-center justify-between p-1.5 text-[11px] text-purple-600 font-black hover:bg-purple-50 rounded-lg transition-all cursor-pointer border border-purple-100/50 bg-purple-50/20"
            >
              <span>Gerçek İşlem Loglarını İncele</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
  );
};

export default AdminDashboardView;
