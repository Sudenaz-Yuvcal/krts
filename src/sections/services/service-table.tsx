import { Clock, Power, Edit3, Trash2 } from "lucide-react";
import type { Service } from "../../types/services";

interface ServiceTableProps {
  services: Service[];
  formatDuration: (minutes: number) => string;
  toggleStatusDirectly: (id: string) => void;
  handleOpenEditModal: (service: Service) => void;
  setServiceToDelete: (id: string) => void;
}

export const ServiceTable = ({
  services,
  formatDuration,
  toggleStatusDirectly,
  handleOpenEditModal,
  setServiceToDelete,
}: ServiceTableProps) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-black uppercase tracking-wider bg-slate-50/70">
            <th className="py-4 pl-8 w-24">Görsel</th>
            <th className="py-4 px-4">Hizmet Spesifikasyon Adı</th>
            <th className="py-4 px-4 w-40">İşlem Süresi</th>
            <th className="py-4 px-4 w-36">Hizmet Bedeli</th>
            <th className="py-4 px-4 w-36">Operasyon Statüsü</th>
            <th className="py-4 pr-8 w-32 text-right">İşlemler</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {services.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="py-16 text-center text-slate-400 font-bold text-xs"
              >
                Arama kriterlerinize uygun katalog kaydı bulunmamaktadır.
              </td>
            </tr>
          ) : (
            services.map((service) => (
              <tr
                key={service.id}
                className={`group transition-all duration-200 ${
                  !service.is_active ? "bg-slate-50/60 opacity-65" : "hover:bg-purple-50/10"
                }`}
              >
                <td className="py-4 pl-8">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-100">
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800 tracking-tight">
                      {service.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-300" />
                    <span>{formatDuration(service.duration)}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-black text-slate-800">
                    ₺{service.price}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-lg inline-flex items-center gap-1 ${
                      service.is_active ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        service.is_active ? "bg-emerald-500" : "bg-red-400"
                      }`}
                    />
                    {service.is_active ? "Aktif" : "Hizmet Dışı"}
                  </span>
                </td>
                <td className="py-4 pr-8 text-right">
                  <div className="flex items-center justify-end gap-1 md:opacity-0 group-hover:opacity-100 transition-all duration-150">
                    <button
                      type="button"
                      onClick={() => toggleStatusDirectly(service.id)}
                      title={service.is_active ? "Hizmet Dışı Bırak" : "Aktif Et"}
                      className={`p-2 rounded-lg transition-all cursor-pointer ${
                        service.is_active
                          ? "text-slate-400 hover:text-red-500 hover:bg-red-50"
                          : "text-emerald-600 bg-emerald-50/50 hover:bg-emerald-50"
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(service)}
                      className="p-2 text-slate-400 hover:text-brand-purple rounded-lg hover:bg-purple-50 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setServiceToDelete(service.id)}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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