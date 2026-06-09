import React, { useState, useEffect } from "react";
import {
  Layers,
  Building2,
  Handshake,
  ArrowUpRight,
  ChevronRight,
  X,
  Store,
  Loader2,
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

// Oluşturduğumuz harici dosyadan tipleri içe aktarıyoruz
import type {
  TimelineStat,
  FormattedOrder,
  FormattedPackage,
  TopBrandStat,
  TopPackageStat,
  SupabaseOrder,
  SupabasePackage,
  CustomTooltipProps,
} from "../../types/admin";

export const AdminDashboardView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [timeFilter, setTimeFilter] = useState<"weekly" | "monthly">("weekly");
  const [viewType, setViewType] = useState<"all" | "product" | "service">(
    "all",
  );
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  const [commissionProfit, setCommissionProfit] = useState<number>(0);
  const [packageProfit, setPackageProfit] = useState<number>(0);

  const [graphData, setGraphData] = useState<TimelineStat[]>([]);
  const [topBrands, setTopBrands] = useState<TopBrandStat[]>([]);
  const [topPackages, setTopPackages] = useState<TopPackageStat[]>([]);

  const [activeSalonsCount, setActiveSalonsCount] = useState<number>(0);
  const [ecosystemCustomersCount, setEcosystemCustomersCount] =
    useState<number>(0);

  const [realOrders, setRealOrders] = useState<FormattedOrder[]>([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const { count: salonCount } = await supabase
        .from("salons")
        .select("*", { count: "exact", head: true });
      if (salonCount) setActiveSalonsCount(salonCount);

      const { count: customerCount } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });
      if (customerCount) setEcosystemCustomersCount(customerCount);

      const { data: dbOrders, error: ordersError } = await supabase
        .from("orders")
        .select(
          `
          id,
          total_price,
          order_date,
          quantity,
          products (
            product_name,
            brand_name,
            purchase_price
          )
        `,
        )
        .order("order_date", { ascending: false });

      if (ordersError) throw ordersError;

      const typedDbOrders = (dbOrders as unknown as SupabaseOrder[]) || [];

      const formattedOrders: FormattedOrder[] = typedDbOrders.map((o) => ({
        id: o.id,
        total_price: Number(o.total_price || 0),
        order_date: o.order_date
          ? o.order_date.split("T")[0]
          : new Date().toISOString().split("T")[0],
        product_name: o.products?.product_name || "Bilinmeyen Ürün",
        brand_name: o.products?.brand_name || "Bilinmeyen Marka",
        purchase_price: Number(o.products?.purchase_price || 0),
        quantity: Number(o.quantity || 0),
      }));
      setRealOrders(formattedOrders);

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

      const typedDbPackages =
        (dbPackages as unknown as SupabasePackage[]) || [];

      const formattedPackages: FormattedPackage[] = typedDbPackages.map(
        (p) => ({
          salon_name: p.salons?.salon_name || "Bilinmeyen Salon",
          package_price: Number(p.package_price || 0),
          order_date: p.order_date
            ? p.order_date.split("T")[0]
            : new Date().toISOString().split("T")[0],
        }),
      );

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

      const brandMap: { [key: string]: { volume: number; comm: number } } = {};
      formattedOrders.forEach((o) => {
        if (!brandMap[o.brand_name])
          brandMap[o.brand_name] = { volume: 0, comm: 0 };
        const calculatedComm = (o.total_price * 18) / 100;
        brandMap[o.brand_name].volume += o.total_price;
        brandMap[o.brand_name].comm += calculatedComm;
      });

      const formattedBrands: TopBrandStat[] = Object.keys(brandMap)
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
        .sort((a, b) => b.earnedCommission - a.earnedCommission);
      setTopBrands(formattedBrands);

      const packMap: { [key: string]: { count: number; rev: number } } = {};
      formattedPackages.forEach((p) => {
        let packName = "6 Aylık Başlangıç";
        if (p.package_price > 30000) packName = "2 Yıllık Ekosistem Dev";
        else if (p.package_price > 20000) packName = "1 Yıllık Süper Özel";

        if (!packMap[packName]) packMap[packName] = { count: 0, rev: 0 };
        packMap[packName].count += 1;
        packMap[packName].rev += p.package_price;
      });

      setTopPackages(
        Object.keys(packMap)
          .map((name) => ({
            name,
            count: packMap[name].count,
            totalRevenue: packMap[name].rev,
            percentage:
              totalPackageEarnings > 0
                ? Math.round((packMap[name].rev / totalPackageEarnings) * 100)
                : 0,
          }))
          .sort((a, b) => b.totalRevenue - a.totalRevenue),
      );

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
      console.error("Gerçek veriler yüklenirken hata oluştu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeFilter]);

  if (loading) {
    return (
      <div className="min-h-100 flex flex-col items-center justify-center gap-2 text-center py-20 text-xs text-purple-600 font-bold tracking-wide">
        <Loader2 className="w-7 h-7 animate-spin" />
        Gerçek Veritabanı Matrisi Hizalanıyor...
      </div>
    );
  }

  const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-lg border-none text-xs">
          <p className="opacity-70 mb-0.5">{label}</p>
          <p className="font-black">
            ₺{payload[0].value.toLocaleString("tr-TR")}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 space-y-6 py-2 bg-white text-slate-800 antialiased overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900">
            Admin Konsolu
          </h2>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">
            `orders` ve `products` tablolarından beslenen anlık finansal veri
            paneli.
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-slate-100">
        <div className="p-1">
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
          <span className="text-[10px] font-black text-purple-600 uppercase tracking-wider flex items-center gap-1">
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
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1">
            Peşin Salon Lisans Havuzu
          </span>
          <h3 className="text-xl font-black text-slate-800 mt-0.5">
            ₺{packageProfit.toLocaleString("tr-TR")}
          </h3>
        </div>
      </div>

      <div className="w-full min-w-0">
        <div style={{ width: "100%", height: "400px" }}>
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
              <Tooltip content={<CustomTooltip />} />
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
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Paket Penetrasyonu
            </h4>
          </div>
          <div className="space-y-2.5">
            {topPackages.map((pack, i) => (
              <div key={i} className="space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 truncate max-w-45">
                    {pack.name} ({pack.count})
                  </span>
                  <span className="font-black text-slate-900">
                    ₺{pack.totalRevenue.toLocaleString("tr-TR")}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full"
                    style={{ width: `${pack.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Sistem Özetleri
            </h4>
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
              onClick={() => setIsReportModalOpen(true)}
              className="w-full flex items-center justify-between p-1.5 text-[11px] text-purple-600 font-black hover:bg-purple-50 rounded-lg transition-all cursor-pointer border border-purple-100/50 bg-purple-50/20"
            >
              <span>Gerçek İşlem Loglarını İncele</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {isReportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh] relative animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/60">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Gerçek Veritabanı Sipariş Logları
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">
                  `orders` tablosundaki anlık kayıtlar listeleniyor.
                </p>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="space-y-2">
                <h4 className="text-[11px] font-black text-purple-600 uppercase tracking-wider flex items-center gap-1">
                  <Store className="w-3.5 h-3.5" /> Son Gerçekleşen Mağaza
                  Satışları
                </h4>
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        <th className="p-3">Sipariş ID</th>
                        <th className="p-3">Marka / Ürün</th>
                        <th className="p-3">Adet / Fiyat</th>
                        <th className="p-3 text-right">
                          Tahsil Edilen Komisyon (%18)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700 bg-white">
                      {realOrders.map((order, index) => (
                        <tr
                          key={index}
                          className="hover:bg-slate-50/80 transition"
                        >
                          <td className="p-3 font-mono text-[10px] text-slate-400">
                            #{String(order.id).slice(0, 8)}
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-slate-900 block">
                              {order.brand_name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {order.product_name}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-slate-900 block font-bold">
                              ₺{order.total_price.toLocaleString("tr-TR")}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {order.quantity} Adet
                            </span>
                          </td>
                          <td className="p-3 text-right font-black text-purple-600">
                            ₺
                            {((order.total_price * 18) / 100).toLocaleString(
                              "tr-TR",
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardView;
