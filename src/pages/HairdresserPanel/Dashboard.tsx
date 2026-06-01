import React, { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { 
  TrendingUp, 
  Package, 
  Scissors, 
  Calendar,
  Layers,
  ArrowUpRight,
  Activity,
  RotateCcw
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface TimelineStat {
  label: string;
  dateString: string;
  productAmount: number;
  serviceAmount: number;
}

const MOCK_APPOINTMENTS = [
  { service_name: "Saç Kesimi & Fön", total_price: 350, appointment_date: new Date().toISOString().split("T")[0] },
  { service_name: "Saç Kesimi & Fön", total_price: 350, appointment_date: new Date().toISOString().split("T")[0] },
  { service_name: "Damat Tıraşı", total_price: 1200, appointment_date: new Date(Date.now() - 86400000).toISOString().split("T")[0] },
  { service_name: "Ombre", total_price: 1800, appointment_date: new Date(Date.now() - 172800000).toISOString().split("T")[0] },
  { service_name: "Saç Boyama", total_price: 950, appointment_date: new Date(Date.now() - 259200000).toISOString().split("T")[0] },
  { service_name: "Keratin Bakım", total_price: 1500, appointment_date: new Date(Date.now() - 432000000).toISOString().split("T")[0] }
];

const MOCK_PRODUCT_ORDERS = [
  { product_name: "Saç Bakım Yağı", sale_price: 250, buy_price: 120, qty: 3, order_date: new Date().toISOString() },
  { product_name: "Profesyonel Wax", sale_price: 450, buy_price: 200, qty: 2, order_date: new Date(Date.now() - 86400000).toISOString() },
  { product_name: "Morfose Saç Spreyi", sale_price: 300, buy_price: 110, qty: 5, order_date: new Date(Date.now() - 172800000).toISOString() },
  { product_name: "Sakal Bakım Serumu", sale_price: 600, buy_price: 250, qty: 1, order_date: new Date(Date.now() - 345600000).toISOString() }
];

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly'>('weekly');
  const [viewType, setViewType] = useState<'all' | 'product' | 'service'>('all');

  const [totalSale, setTotalSale] = useState<number>(0);
  const [productSale, setProductSale] = useState<number>(0);
  const [serviceSale, setServiceSale] = useState<number>(0);

  const [graphData, setGraphData] = useState<TimelineStat[]>([]);
  const [topProducts, setTopProducts] = useState<{name: string, soldQty: number, totalRevenue: number, totalProfit: number, margin: number}[]>([]);
  const [topServices, setTopServices] = useState<{name: string, count: number, totalRevenue: number, percentage: number}[]>([]);

  useEffect(() => {
    try {
      setLoading(true);

      const totalAppEarnings = MOCK_APPOINTMENTS.reduce((sum, item) => sum + item.total_price, 0);
      const totalProductEarnings = MOCK_PRODUCT_ORDERS.reduce((sum, item) => sum + (item.sale_price * item.qty), 0);
      
      setTotalSale(totalAppEarnings + totalProductEarnings);
      setProductSale(totalProductEarnings);
      setServiceSale(totalAppEarnings);

      const prodMap: { [key: string]: { qty: number, rev: number, cost: number } } = {};
      MOCK_PRODUCT_ORDERS.forEach(p => {
        if (!prodMap[p.product_name]) prodMap[p.product_name] = { qty: 0, rev: 0, cost: 0 };
        prodMap[p.product_name].qty += p.qty;
        prodMap[p.product_name].rev += (p.sale_price * p.qty);
        prodMap[p.product_name].cost += (p.buy_price * p.qty);
      });
      const formattedProducts = Object.keys(prodMap).map(name => {
        const item = prodMap[name];
        const profit = item.rev - item.cost;
        return {
          name,
          soldQty: item.qty,
          totalRevenue: item.rev,
          totalProfit: profit,
          margin: Math.round((profit / (item.rev || 1)) * 100)
        };
      }).sort((a, b) => b.totalProfit - a.totalProfit);
      setTopProducts(formattedProducts);

      const servMap: { [key: string]: { count: number, rev: number } } = {};
      MOCK_APPOINTMENTS.forEach(a => {
        if (!servMap[a.service_name]) servMap[a.service_name] = { count: 0, rev: 0 };
        servMap[a.service_name].count += 1;
        servMap[a.service_name].rev += a.total_price;
      });
      const formattedServices = Object.keys(servMap).map(name => {
        const item = servMap[name];
        return {
          name,
          count: item.count,
          totalRevenue: item.rev,
          percentage: Math.round((item.rev / (totalAppEarnings || 1)) * 100)
        };
      }).sort((a, b) => b.totalRevenue - a.totalRevenue);
      setTopServices(formattedServices);

      const daysOfWeek = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
      const limit = timeFilter === 'weekly' ? 7 : 12;
      
      const timeline = Array.from({ length: limit }).map((_, i) => {
        const d = new Date();
        if (timeFilter === 'weekly') {
          d.setDate(d.getDate() - i);
        } else {
          d.setDate(d.getDate() - (i * 2));
        }
        return {
          dateString: d.toISOString().split("T")[0],
          label: timeFilter === 'weekly' ? daysOfWeek[d.getDay()] : `${d.getDate()} Bld`,
          productAmount: 0,
          serviceAmount: 0,
        };
      }).reverse();

      MOCK_APPOINTMENTS.forEach(item => {
        const match = timeline.find(t => t.dateString === item.appointment_date);
        if (match) match.serviceAmount += item.total_price;
      });

      MOCK_PRODUCT_ORDERS.forEach(item => {
        const orderDateStr = item.order_date.split("T")[0];
        const match = timeline.find(t => t.dateString === orderDateStr);
        if (match) match.productAmount += (item.sale_price * item.qty);
      });

      setGraphData(timeline);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [timeFilter]);

  if (loading) {
    return (
      <div className="text-center py-24 text-sm text-slate-400 font-bold animate-pulse tracking-wide">
        Analiz verileri işleniyor, lütfen bekleyin...
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#4e4d75] text-white p-3 rounded-2xl shadow-xl border-none text-center min-w-28 animate-fadeIn">
          <p className="text-sm font-black">₺{payload[0].value}</p>
          <p className="text-[10px] font-medium opacity-70 mt-0.5">
            {viewType === 'product' ? 'Ürün Satışı' : viewType === 'service' ? 'Hizmet' : 'Toplam Satış'} - {label}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 sm:space-y-9 w-full px-2 sm:px-0">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800">Panel Raporları</h2>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Salon performans grafikleri ve kârlılık kırılımları paneli.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        <div onClick={() => setViewType('all')} className="cursor-pointer">
          <Card className={`border p-5 sm:p-6 rounded-3xl sm:rounded-[28px] shadow-xs transition-all duration-200 ${viewType === 'all' ? 'border-emerald-500 bg-emerald-50/5 ring-4 ring-emerald-50' : 'border-slate-100 bg-white hover:border-emerald-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[12px] sm:text-[13px] font-bold text-slate-400 tracking-tight">Toplam Genel Satış</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1.5">
                  ₺{totalSale.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                </h3>
                <span className="text-[11px] font-semibold text-emerald-600 block mt-1">Hizmet + Ürün Cirosu</span>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100/50 shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </Card>
        </div>

        <div onClick={() => setViewType('product')} className="cursor-pointer">
          <Card className={`border p-5 sm:p-6 rounded-3xl sm:rounded-[28px] shadow-xs transition-all duration-200 ${viewType === 'product' ? 'border-purple-500 bg-purple-50/5 ring-4 ring-purple-50' : 'border-slate-100 bg-white hover:border-purple-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[12px] sm:text-[13px] font-bold text-slate-400 tracking-tight">Ürün Satış Geliri</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1.5">
                  ₺{productSale.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                </h3>
                <span className="text-[11px] font-semibold text-purple-600 block mt-1">Sadece Ürün Satışları</span>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center border border-purple-100/50 shrink-0">
                <Package className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </Card>
        </div>

        <div onClick={() => setViewType('service')} className="cursor-pointer sm:col-span-2 lg:col-span-1">
          <Card className={`border p-5 sm:p-6 rounded-3xl sm:rounded-[28px] shadow-xs transition-all duration-200 ${viewType === 'service' ? 'border-indigo-500 bg-indigo-50/5 ring-4 ring-indigo-50' : 'border-slate-100 bg-white hover:border-indigo-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[12px] sm:text-[13px] font-bold text-slate-400 tracking-tight">Hizmet Cirosu</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1.5">
                  ₺{serviceSale.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                </h3>
                <span className="text-[11px] font-semibold text-indigo-600 block mt-1">Sadece Randevular</span>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center border border-indigo-100/50 shrink-0">
                <Scissors className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="w-full">
        <Card className="w-full flex flex-col justify-between p-4 sm:p-8 border border-slate-100 bg-white rounded-3xl sm:rounded-[32px]">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <h4 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">Analiz Raporu</h4>
              {viewType !== 'all' && (
                <button 
                  onClick={() => setViewType('all')}
                  className="flex items-center gap-1 text-[10px] sm:text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 hover:bg-emerald-100/50 transition-all cursor-pointer font-black animate-fadeIn"
                >
                  <RotateCcw className="w-3 h-3" /> Tümünü Göster
                </button>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 lg:gap-6 w-full sm:w-auto">
              <div className="flex items-center gap-4 text-[12px] sm:text-[13px] font-bold">
                <span 
                  className={`cursor-pointer transition-colors ${viewType === 'product' ? 'text-purple-600 underline decoration-2 underline-offset-4' : 'text-slate-400 hover:text-slate-600'}`} 
                  onClick={() => setViewType('product')}
                >
                  Ürünler
                </span>
                <span 
                  className={`cursor-pointer transition-colors ${viewType === 'service' ? 'text-indigo-600 underline decoration-2 underline-offset-4' : 'text-slate-400 hover:text-slate-600'}`} 
                  onClick={() => setViewType('service')}
                >
                  Hizmetler
                </span>
              </div>

              <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 p-1 rounded-xl w-fit">
                <button 
                  onClick={() => setTimeFilter('weekly')}
                  className={`px-3 sm:px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${timeFilter === 'weekly' ? 'bg-white text-slate-800 shadow-xs border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Calendar className="w-3.5 h-3.5" /> Haftalık
                </button>
                <button 
                  onClick={() => setTimeFilter('monthly')}
                  className={`px-3 sm:px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${timeFilter === 'monthly' ? 'bg-white text-slate-800 shadow-xs border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Layers className="w-3.5 h-3.5" /> Aylık
                </button>
              </div>
            </div>
          </div>

          <div className="h-60 sm:h-72 w-full pr-2 sm:pr-4 min-w-0 overflow-x-auto">
            <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={240}>
              <AreaChart
                data={graphData}
                margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorProduct" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.00}/>
                  </linearGradient>
                  <linearGradient id="colorService" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.00}/>
                  </linearGradient>
                </defs>
                
                <CartesianGrid vertical={false} stroke="#f1f5f9" strokeWidth={1.5} />
                
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                  dy={10}
                />
                
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(val) => `₺${val >= 1000 ? `${val / 1000}k` : val}`}
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                  dx={-5}
                />
                
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />

                {(viewType === 'all' || viewType === 'product') && (
                  <Area
                    type="monotone"
                    dataKey="productAmount"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorProduct)"
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#8b5cf6' }}
                  />
                )}

                {(viewType === 'all' || viewType === 'service') && (
                  <Area
                    type="monotone"
                    dataKey="serviceAmount"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorService)"
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-100">
            
            {viewType === 'product' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h5 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Package className="w-4 h-4 text-purple-500" /> Ürün Bazlı Net Kâr ve Satış Performansı
                  </h5>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md w-fit">En Çok Kâr Getirenden Sıralı</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {topProducts.map((prod, i) => (
                    <div key={i} className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="space-y-1">
                        <span className="text-xs font-black text-slate-800 block">{prod.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold bg-white border border-slate-100 px-1.5 py-0.5 rounded">
                          {prod.soldQty} Adet Satıldı
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-400 block">Ciro: ₺{prod.totalRevenue}</span>
                        <span className="text-xs sm:text-sm font-black text-purple-600 flex items-center justify-end gap-1">
                          Net Kâr: ₺{prod.totalProfit} <span className="text-[10px] text-emerald-500 font-bold">(%{prod.margin})</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewType === 'service' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h5 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-indigo-500" /> Hizmet Yoğunluğu ve Ciro Payı Analizi
                  </h5>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md w-fit">Ciro Payına Göre Sıralı</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {topServices.map((serv, i) => (
                    <div key={i} className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl flex flex-col justify-between gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-black text-slate-800 block">{serv.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{serv.count} Randevuda Yapıldı</span>
                        </div>
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-full shrink-0">
                          %{serv.percentage} Pay
                        </span>
                      </div>
                      <div className="w-full bg-slate-200/60 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${serv.percentage}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-black text-slate-700">
                        <span>Kazanılan Tutar:</span>
                        <span className="text-slate-900 font-extrabold">₺{serv.totalRevenue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewType === 'all' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-purple-50/30 border border-purple-100/50 p-4 sm:p-5 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 border border-purple-100 shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wide">En Çok Satan Ürün</span>
                    <span className="text-xs sm:text-sm font-black text-slate-800 block">{topProducts[0]?.name || "Veri Yok"}</span>
                  </div>
                </div>
                <div className="bg-indigo-50/30 border border-indigo-100/50 p-4 sm:p-5 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100 shrink-0">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wide">En Popüler Hizmet</span>
                    <span className="text-xs sm:text-sm font-black text-slate-800 block">{topServices[topServices.length - 1]?.name || "Veri Yok"}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </Card>
      </div>
    </div>
  );
};