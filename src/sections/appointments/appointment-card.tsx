import React from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
  User,
  Calendar,
  Clock,
  ChevronUp,
  ChevronDown,
  Ban,
  CheckCircle2,
  Timer,
  Phone,
  AlertTriangle,
  UserCheck,
} from "lucide-react";

interface AppointmentItem {
  status: string;
  rawStatus: string;
  paymentStatus: string;
  customerName: string;
  serviceName: string;
  category?: string;
  date: string;
  time: string;
  price: number | string;
  duration?: string;
  staffName?: string;
  customerPhone?: string;
  cancelReason?: string;
}

interface AppointmentCardProps {
  item: AppointmentItem;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onOpenCancel: () => void;
  onComplete: () => void;
  onConfirmApp: () => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  item,
  isExpanded,
  onToggleExpand,
  onOpenCancel,
  onComplete,
  onConfirmApp,
}) => {
  
  const maskLastName = (fullName: string): string => {
    if (!fullName) return "Müşteri";
    const parts = fullName.trim().split(" ");
    if (parts.length <= 1) return fullName;
    const lastName = parts[parts.length - 1];
    const firstName = parts.slice(0, parts.length - 1).join(" ");
    return `${firstName} ${lastName.charAt(0).toUpperCase()}.`;
  };

  const getPaymentBadge = (): React.ReactNode => {
    if (item.status === "İptal" || item.rawStatus === "iptal") {
      return (
        <span className="text-[10px] font-black bg-red-50 text-red-500 px-2 py-1 rounded-md border border-red-100/50 whitespace-nowrap">
          İptal Edildi
        </span>
      );
    }

    if (item.paymentStatus === "Hesaba Aktarıldı" || item.paymentStatus === "odendi") {
      return (
        <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md border border-emerald-100/50 whitespace-nowrap">
          Hesaba Aktarıldı
        </span>
      );
    }

    return (
      <span className="text-[10px] font-black bg-amber-50 text-amber-600 px-2 py-1 rounded-md border border-amber-100/50 whitespace-nowrap">
        Beklemede
      </span>
    );
  };

  const isActionable = item.rawStatus === "beklemede" || item.rawStatus === "onaylandi";

  return (
    <Card className="flex flex-col border border-slate-100 bg-white rounded-[28px] shadow-xs group hover:border-purple-100 transition-all duration-200 p-0 overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 px-6">
        
        <div className="flex items-center gap-4 min-w-55">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100/30 shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              {maskLastName(item.customerName)}
            </h4>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              {item.serviceName}{" "}
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md ml-1 font-bold">
                {item.category || "Genel"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{item.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{item.time}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:min-w-40">
          <span className="text-sm font-black text-slate-800 whitespace-nowrap">
            ₺{Number(item.price).toLocaleString("tr-TR")}
          </span>
          {getPaymentBadge()}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-50 lg:border-t-0 pt-3 lg:pt-0 shrink-0 h-9">
          <button
            type="button"
            onClick={onToggleExpand}
            className="h-full px-3 text-[11px] font-bold text-slate-500 hover:text-purple-600 bg-slate-50 hover:bg-purple-50 rounded-xl transition-all cursor-pointer flex items-center gap-1 border-none"
          >
            {isExpanded ? (
              <>
                Detayları Kapat <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Detayları Gör <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {isActionable && (
            <>
              <button
                type="button"
                onClick={onOpenCancel}
                className="h-full px-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer flex items-center justify-center border border-transparent hover:border-red-100 bg-transparent"
                title="Randevuyu İptal Et"
              >
                <Ban className="w-4 h-4 mr-1" />
                <span className="text-[11px] font-bold">İptal Et</span>
              </button>
              
              {item.rawStatus === "beklemede" ? (
                <button
                  type="button"
                  onClick={onConfirmApp}
                  className="h-full py-0 px-3.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 transition-all border-none"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Onayla
                </button>
              ) : (
                <Button
                  onClick={onComplete}
                  variant="success"
                  className="h-full py-0 px-3.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tamamla
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="bg-slate-50/50 border-t border-slate-50 p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <Timer className="w-4 h-4 text-slate-400 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                Hizmet Süresi
              </span>
              <span className="text-xs font-bold text-slate-700">
                {item.duration || "45 Dk"}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <User className="w-4 h-4 text-slate-400 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                Hizmet Edecek Personel
              </span>
              <span className="text-xs font-bold text-slate-700">
                {item.staffName || "Uzman Personel"}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                Müşteri Telefon Numarası
              </span>
              <span className="text-xs font-bold text-slate-700 tracking-wide">
                {item.customerPhone || "Telefon Belirtilmedi"}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="w-4 h-4 border border-slate-400 rounded-sm flex items-center justify-center text-[9px] font-black text-slate-400 mt-0.5">
              ₺
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                Ödeme Yöntemi
              </span>
              <span className="text-xs font-bold text-slate-700">
                Online / Kart
              </span>
            </div>
          </div>

          {(item.status === "İptal" || item.rawStatus === "iptal") && item.cancelReason && (
            <div className="col-span-full bg-red-50/60 border border-red-100 p-3 rounded-xl flex gap-2 mt-1">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-black text-red-600 block uppercase tracking-wider">
                  İptal Gerekçesi
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  {item.cancelReason}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};