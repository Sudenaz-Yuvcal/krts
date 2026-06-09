import React, { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { 
  TrendingUp, 
  Scissors, 
  Calendar,
  Layers,
  ArrowUpRight,
  Activity,
  RotateCcw,
  Loader2,
  Users
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
import { supabase } from "../../lib/supabaseClient";

interface TimelineStat {
  label: string;
  dateString: string;
  serviceAmount: number;
}

interface ServiceDetail {
  service_name: string;
}

interface EmployeeDetail {
  full_name: string;
}

interface DbAppointment {
  total_price: number | null;
  appointment_date: string | null;
  status: string;
  services: ServiceDetail | ServiceDetail[] | null;
  employees: EmployeeDetail | EmployeeDetail[] | null;
}

interface ServiceStat {
  name: string;
  count: number;
  totalRevenue: number;
  percentage: number;
}

interface EmployeeStat {
  name: string;
  count: number;
  totalRevenue: number;
}

interface MapItem {
  count: number;
  rev: number;
}

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly'>('weekly');
  const [viewType, setViewType] = useState<'all' | 'service' | 'employee'>('all');

  const [totalSale, setTotalSale] = useState<number>(0);
  const [totalAppointmentsCount, setTotalAppointmentsCount] = useState<number>(0);
  const [totalEmployeesCount, setTotalEmployeesCount] = useState<number>(0);

  const [graphData, setGraphData] = useState<TimelineStat[]>([]);
  const [topServices, setTopServices] = useState<ServiceStat[]>([]);
  const [employeePerformance, setEmployeePerformance] = useState<EmployeeStat[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const { data: dbAppointments, error: appointmentError } = await supabase
          .from("appointments")
          .select(`
            total_price,
            appointment_date,
            status,
            services:service_id (service_name),
            employees:employee_id (full_name)
          `)
          .not("status", "eq", "iptal"); 

        if (appointmentError) throw appointmentError;

        const { count: employeeCount, error: employeeCountError } = await supabase
          .from("employees")
          .select("*", { count: "exact", head: true });

        if (employeeCountError) throw employeeCountError;
        setTotalEmployeesCount(employeeCount || 0);

        const appointmentsArray: DbAppointment[] = (dbAppointments as unknown as DbAppointment[]) || [];
        setTotalAppointmentsCount(appointmentsArray.length);

        const totalAppointmentEarnings = appointmentsArray.reduce(
          (sum, appointment) => sum + (Number(appointment.total_price) || 0), 0
        );
        setTotalSale(totalAppointmentEarnings);

        const serviceMap: Record<string, MapItem> = {};
        const employeeMap: Record<string, MapItem> = {};

        appointmentsArray.forEach((appointment) => {
          let serviceName = "Bilinmeyen Hizmet";
          if (appointment.services) {
            if (Array.isArray(appointment.services) && appointment.services.length > 0) {
              serviceName = appointment.services[0].service_name;
            } else if (!Array.isArray(appointment.services) && appointment.services.service_name) {
              serviceName = appointment.services.service_name;
            }
          }

          if (!serviceMap[serviceName]) serviceMap[serviceName] = { count: 0, rev: 0 };
          serviceMap[serviceName].count += 1;
          serviceMap[serviceName].rev += (Number(appointment.total_price) || 0);

          let employeeName = "Belirtilmemiş Personel";
          if (appointment.employees) {
            if (Array.isArray(appointment.employees) && appointment.employees.length > 0) {
              employeeName = appointment.employees[0].full_name;
            } else if (!Array.isArray(appointment.employees) && appointment.employees.full_name) {
              employeeName = appointment.employees.full_name;
            }
          }

          if (!employeeMap[employeeName]) employeeMap[employeeName] = { count: 0, rev: 0 };
          employeeMap[employeeName].count += 1;
          employeeMap[employeeName].rev += (Number(appointment.total_price) || 0);
        });

        const formattedServices = Object.keys(serviceMap).map((name) => {
          const serviceItem = serviceMap[name];
          return {
            name,
            count: serviceItem.count,
            totalRevenue: serviceItem.rev,
            percentage: Math.round((serviceItem.rev / (totalAppointmentEarnings || 1)) * 100)
          };
        }).sort((firstService, secondService) => secondService.totalRevenue - firstService.totalRevenue);
        setTopServices(formattedServices);

        const formattedEmployees = Object.keys(employeeMap).map((name) => {
          const employeeItem = employeeMap[name];
          return {
            name,
            count: employeeItem.count,
            totalRevenue: employeeItem.rev
          };
        }).sort((firstEmployee, secondEmployee) => secondEmployee.totalRevenue - firstEmployee.totalRevenue);
        setEmployeePerformance(formattedEmployees);

        const daysOfWeek = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
        const dayLimit = timeFilter === 'weekly' ? 7 : 30;
        
        const baseDate = new Date();
        baseDate.setHours(0, 0, 0, 0);

        const timeline = Array.from({ length: dayLimit }).map((_, index) => {
          const targetDate = new Date(baseDate.getTime());
          targetDate.setDate(targetDate.getDate() - index);

          const year = targetDate.getFullYear();
          const month = String(targetDate.getMonth() + 1).padStart(2, '0');
          const day = String(targetDate.getDate()).padStart(2, '0');
          const dateString = `${year}-${month}-${day}`;

          return {
            dateString,
            label: timeFilter === 'weekly' ? daysOfWeek[targetDate.getDay()] : `${targetDate.getDate()} Bld`,
            serviceAmount: 0,
          };
        }).reverse();

        appointmentsArray.forEach((appointment) => {
          if (!appointment.appointment_date) return;
          
          const appointmentDateClean = appointment.appointment_date.split("T")[0];
          const matchedTimelineDay = timeline.find((day) => day.dateString === appointmentDateClean);
          
          if (matchedTimelineDay) {
            matchedTimelineDay.serviceAmount += (Number(appointment.total_price) || 0);
          }
        });

        setGraphData(timeline);
      } catch (error) {
        console.error("Dashboard verileri çekilirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 text-sm text-slate-400 font-bold tracking-wide">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        Canlı kuaför salon raporları analiz ediliyor, lütfen bekleyin...
      </div>
    );
  }

  const CustomTooltip: React.FC<{ active?: boolean; payload?: any[]; label?: string }> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#4e4d75] text-white p-3 rounded-2xl shadow-xl border-none text-center min-w-28">
          <p className="text-sm font-black">₺{payload[0].value.toLocaleString("tr-TR")}</p>
          <p className="text-[10px] font-medium opacity-70 mt-0.5">
            Hizmet Cirosu - {label}
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
          Supabase canlı veritabanı bağlantılı, sadece hizmet ve çalışan odaklı gerçek zamanlı salon analizleri.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        <div onClick={() => setViewType('all')} className="cursor-pointer">
          <Card className={`border p-5 sm:p-6 rounded-3xl sm:rounded-[28px] shadow-xs transition-all duration-200 ${viewType === 'all' ? 'border-emerald-500 bg-emerald-50/5 ring-4 ring-emerald-50' : 'border-slate-100 bg-white hover:border-emerald-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[12px] sm:text-[13px] font-bold text-slate-400 tracking-tight">Toplam Toplanan Ciro</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1.5">
                  ₺{totalSale.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                </h3>
                <span className="text-[11px] font-semibold text-emerald-600 block mt-1">Net Hizmet Kazancı</span>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100/50 shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </Card>
        </div>

        <div onClick={() => setViewType('service')} className="cursor-pointer">
          <Card className={`border p-5 sm:p-6 rounded-3xl sm:rounded-[28px] shadow-xs transition-all duration-200 ${viewType === 'service' ? 'border-indigo-500 bg-indigo-50/5 ring-4 ring-indigo-50' : 'border-slate-100 bg-white hover:border-indigo-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[12px] sm:text-[13px] font-bold text-slate-400 tracking-tight">Toplam Randevu</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1.5">
                  {totalAppointmentsCount} Adet
                </h3>
                <span className="text-[11px] font-semibold text-indigo-600 block mt-1">Hizmet Verilen İşlem</span>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center border border-indigo-100/50 shrink-0">
                <Scissors className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </Card>
        </div>

        <div onClick={() => setViewType('employee')} className="cursor-pointer sm:col-span-2 lg:col-span-1">
          <Card className={`border p-5 sm:p-6 rounded-3xl sm:rounded-[28px] shadow-xs transition-all duration-200 ${viewType === 'employee' ? 'border-purple-500 bg-purple-50/5 ring-4 ring-purple-50' : 'border-slate-100 bg-white hover:border-purple-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[12px] sm:text-[13px] font-bold text-slate-400 tracking-tight">Aktif Çalışanlar</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1.5">
                  {totalEmployeesCount} Personel
                </h3>
                <span className="text-[11px] font-semibold text-purple-600 block mt-1">Kayıtlı Uzman Kadro</span>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center border border-purple-100/50 shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="w-full">
        <Card className="w-full flex flex-col justify-between p-4 sm:p-8 border border-slate-100 bg-white rounded-3xl sm:rounded-[32px]">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <h4 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">Hizmet Analiz Raporu</h4>
              {viewType !== 'all' && (
                <button 
                  onClick={() => setViewType('all')}
                  className="flex items-center gap-1 text-[10px] sm:text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 hover:bg-emerald-100/50 transition-all cursor-pointer font-black"
                >
                  <RotateCcw className="w-3 h-3" /> Tümünü Göster
                </button>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 lg:gap-6 w-full sm:w-auto">
              <div className="flex items-center gap-4 text-[12px] sm:text-[13px] font-bold">
                <span 
                  className={`cursor-pointer transition-colors ${viewType === 'service' ? 'text-indigo-600 underline decoration-2 underline-offset-4' : 'text-slate-400 hover:text-slate-600'}`} 
                  onClick={() => setViewType('service')}
                >
                  Hizmet Kırılımları
                </span>
                <span 
                  className={`cursor-pointer transition-colors ${viewType === 'employee' ? 'text-purple-600 underline decoration-2 underline-offset-4' : 'text-slate-400 hover:text-slate-600'}`} 
                  onClick={() => setViewType('employee')}
                >
                  Çalışan Performansı
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
                  interval={timeFilter === 'monthly' ? 4 : 0} 
                />
                
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(val) => `₺${val >= 1000 ? `${val / 1000}k` : val}`}
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                  dx={-5}
                />
                
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />

                <Area
                  type="monotone"
                  dataKey="serviceAmount"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorService)"
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-100">
            
            {(viewType === 'all' || viewType === 'service') && (
              <div className="space-y-4 animate-fadeIn mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h5 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-indigo-500" /> Hizmet Yoğunluğu ve Ciro Payı Analizi
                  </h5>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md w-fit">En Çok Kazandırandan Sıralı</span>
                </div>

                {topServices.length === 0 ? (
                  <p className="text-xs text-slate-400 font-bold py-4">Henüz tamamlanmış bir hizmet kaydı bulunamadı.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {topServices.map((service, index) => (
                      <div key={index} className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl flex flex-col justify-between gap-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-black text-slate-800 block">{service.name}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">{service.count} Randevuda Yapıldı</span>
                          </div>
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-full shrink-0">
                            %{service.percentage} Pay
                          </span>
                        </div>
                        <div className="w-full bg-slate-200/60 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${service.percentage}%` }}></div>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-black text-slate-700">
                          <span>Kazanılan Tutar:</span>
                          <span className="text-slate-900 font-extrabold">₺{service.totalRevenue.toLocaleString("tr-TR")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(viewType === 'all' || viewType === 'employee') && (
              <div className="space-y-4 animate-fadeIn pt-4 border-t border-dashed border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h5 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-500" /> Çalışan (Personel) Performans ve Ciro Dağılımı
                  </h5>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md w-fit">Salona En Çok Ciro Sağlayandan Sıralı</span>
                </div>

                {employeePerformance.length === 0 ? (
                  <p className="text-xs text-slate-400 font-bold py-4">Henüz randevusu olan bir çalışan verisi gelmedi.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {employeePerformance.map((employee, index) => (
                      <div key={index} className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="space-y-1">
                          <span className="text-xs font-black text-slate-800 block">{employee.name}</span>
                          <span className="text-[10px] text-purple-600 font-bold bg-purple-50/50 border border-purple-100/30 px-1.5 py-0.5 rounded">
                            {employee.count} Başarılı Randevu
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-400 block">Getirdiği Ciro</span>
                          <span className="text-xs sm:text-sm font-black text-slate-800 flex items-center justify-end gap-1">
                            ₺{employee.totalRevenue.toLocaleString("tr-TR")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {viewType === 'all' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 pt-4 border-t border-slate-100">
                <div className="bg-indigo-50/30 border border-indigo-100/50 p-4 sm:p-5 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100 shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wide">En Popüler Hizmet Türü</span>
                    <span className="text-xs sm:text-sm font-black text-slate-800 block">{topServices[0]?.name || "Veri Yok"}</span>
                  </div>
                </div>
                <div className="bg-purple-50/30 border border-purple-100/50 p-4 sm:p-5 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 border border-purple-100 shrink-0">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wide">Zirvedeki Çalışan</span>
                    <span className="text-xs sm:text-sm font-black text-slate-800 block">
                      {employeePerformance[0]?.name || "Veri Yok"}
                    </span>
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