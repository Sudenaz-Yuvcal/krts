import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Package, 
  Sparkles, 
  Loader2 
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { supabase } from "../../lib/supabaseClient";

const ORDERS_TABLE_NAME = "product_orders"; 

interface GraphDataPoint {
  label: string;
  dateString: string;
  distributerCiro: number;
  sarfiyatHacmi: number;
}

interface ProductOrder {
  id: string | number;
  total_price: number | null;
  quantity: number | null;
  order_date: string | null;
  product_id: string | number;
}

export const BrandDashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [brandName, setBrandName] = useState<string>("Marka");
  
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [activeBarcodes, setActiveBarcodes] = useState<number>(0);
  const [totalOperations, setTotalOperations] = useState<number>(0);
  
  const [chartData, setChartData] = useState<GraphDataPoint[]>([]);

  const fetchRealData = async () => {
    try {
      setLoading(true);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      let brandFilter = "";
      let detectedBrand = "B2B Ortak";

      if (session?.user) {
        const userEmail = session.user.email?.toLowerCase() || "";
        const metaBrand = session.user.user_metadata?.brand_name;

        if (metaBrand) {
          brandFilter = `brand_name.ilike.%${metaBrand}%`;
          detectedBrand = metaBrand;
        } else if (userEmail.includes("loreal") || userEmail.includes("l'oreal")) {
          brandFilter = "brand_name.ilike.%loreal%,brand_name.ilike.%l'oréal%";
          detectedBrand = "L'Oréal Paris";
        } else if (userEmail.includes("maybelline")) {
          brandFilter = "brand_name.ilike.%maybelline%";
          detectedBrand = "Maybelline New York";
        } else if (userEmail.includes("garnier")) {
          brandFilter = "brand_name.ilike.%garnier%";
          detectedBrand = "Garnier";
        }
      }
      
      setBrandName(detectedBrand);

      if (!brandFilter) {
        setActiveBarcodes(0);
        setTotalRevenue(0);
        setTotalOperations(0);
        setChartData([]);
        setLoading(false);
        return;
      }

      const { data: productsData, error: prodError } = await supabase
        .from("products")
        .select("id")
        .or(brandFilter);

      if (prodError) throw prodError;

      const validProductIds = (productsData || []).map((p) => p.id);
      setActiveBarcodes(validProductIds.length);

      let brandFilteredOrders: ProductOrder[] = [];
      
      if (validProductIds.length > 0) {
        const { data: ordersData, error: ordersError } = await supabase
          .from(ORDERS_TABLE_NAME) 
          .select("id, total_price, quantity, order_date, product_id")
          .in("product_id", validProductIds)
          .returns<ProductOrder[]>();

        if (ordersError) {
          console.warn(`"${ORDERS_TABLE_NAME}" tablosu filtrelenirken hata oluştu:`, ordersError.message);
        } else if (ordersData) {
          brandFilteredOrders = ordersData;
        }
      }

      const realRevenue = brandFilteredOrders.reduce((sum, item) => sum + Number(item.total_price || 0), 0);
      const realOperations = brandFilteredOrders.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

      setTotalRevenue(realRevenue);
      setTotalOperations(realOperations);

      const daysOfWeek = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
      const timeline: GraphDataPoint[] = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateKey = d.toISOString().split("T")[0];

        return {
          dateString: dateKey,
          label: daysOfWeek[d.getDay()],
          distributerCiro: 0,
          sarfiyatHacmi: 0,
        };
      });

      if (brandFilteredOrders.length > 0) {
        brandFilteredOrders.forEach((order) => {
          if (!order.order_date) return;
          const orderDateStr = order.order_date.split("T")[0];
          
          const match = timeline.find((t) => t.dateString === orderDateStr);
          if (match) {
            match.distributerCiro += Number(order.total_price || 0);
            match.sarfiyatHacmi += Number(order.quantity || 0);
          }
        });
      }

      setChartData(timeline);

    } catch (err) {
      console.error("Kullanıcı bazlı veri eşleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-100 flex flex-col items-center justify-center gap-2 text-center text-xs text-purple-600 font-bold tracking-wide">
        <Loader2 className="w-7 h-7 animate-spin" />
        Kullanıcı Yetkileri ve Marka Paneli Senkronize Ediliyor...
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-4 bg-slate-50/50 space-y-6 antialiased text-slate-700">
      
      <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-xs">
        <div>
          <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">
            {brandName} Yetkili Yönetim Paneli
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Sistemde aktif olan distribütör hesabınıza ait güncel envanter, ciro ve operasyonel hacim analitiği.
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-100 px-4 py-1.5 rounded-full w-fit">
          <span className="text-[10px] font-black text-purple-700 uppercase tracking-wider">
            DURUM: {brandName.toUpperCase()} OTURUMU AKTİF
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex justify-between items-center shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
              Marka Toplam Satış Cirosu
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {totalRevenue.toLocaleString("tr-TR")} ₺
            </h3>
            <div className="bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md w-fit flex items-center gap-1">
              <span className="text-[10px] font-black text-emerald-700">↗ Canlı Veri</span>
            </div>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl border border-emerald-100">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border-2 border-purple-400 rounded-2xl p-6 flex justify-between items-center shadow-xs relative overflow-hidden">
          <div className="space-y-1 z-10">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
              Sistemdeki Ürün Sayınız
            </span>
            <h3 className="text-2xl font-black text-purple-600 tracking-tight">
              {activeBarcodes} Tanımlı Ürün
            </h3>
            <span className="text-[10px] font-bold text-slate-400 block">
              {brandName} Kataloğu
            </span>
          </div>
          <div className="bg-purple-600 text-white p-2.5 rounded-xl z-10 shadow-md shadow-purple-200">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex justify-between items-center shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
              Toplam Dağıtılan Adet
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {totalOperations.toLocaleString("tr-TR")} Ürün
            </h3>
            <span className="text-[10px] font-bold text-slate-400 block">
              Salon Sevk ve Çıkış Hacmi
            </span>
          </div>
          <div className="bg-purple-50 text-purple-600 p-2.5 rounded-xl border border-purple-100">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">
              {brandName} Performans Grafiği
            </h4>
            <p className="text-[11px] text-slate-400 font-medium">
              Giriş yaptığınız hesaba ait son 7 günlük sevkiyat cirosu ve hacimsel adet kırılımı.
            </p>
          </div>
          <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
            Filtre: {brandName}
          </div>
        </div>

        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-wider text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
            <span>Distribütör Cirosu (Sol Eksen)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
            <span>Sarfiyat Hacmi (Sağ Eksen)</span>
          </div>
        </div>

        <div className="w-full h-80">
          {activeBarcodes === 0 ? (
            <div className="w-full h-full flex items-center justify-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-xs text-slate-400 font-bold">
              Bu markaya ait henüz bir ürün bulunmadığı için grafik çizilemiyor.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }} 
                />
                <YAxis 
                  yAxisId="left"
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k ₺` : `${v} ₺`}
                  tick={{ fill: "#a855f7", fontSize: 10, fontWeight: 700 }} 
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(v) => `${v} Adet`}
                  tick={{ fill: "#06b6d4", fontSize: 10, fontWeight: 700 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff", fontSize: "11px" }}
                  formatter={(value: any, name: any) => {
                    const numValue = Number(value || 0);
                    if (name === "distributerCiro") {
                      return [`${numValue.toLocaleString("tr-TR")} ₺`, "Distribütör Cirosu"];
                    }
                    if (name === "sarfiyatHacmi") {
                      return [`${numValue} Adet`, "Sarfiyat Hacmi"];
                    }
                    return [numValue, String(name)];
                  }}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="distributerCiro" 
                  stroke="#a855f7" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="sarfiyatHacmi" 
                  stroke="#22d3ee" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
};

export default BrandDashboard;