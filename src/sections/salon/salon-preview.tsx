import { Card } from "../../components/ui/Card";
import { Edit3, Globe, Phone, MapPin, FileText, Info } from "lucide-react";

interface SalonPreviewProps {
  phone: string;
  city: string;
  district: string;
  address: string;
  about: string;
  images: string[];
  onEditClick: () => void;
}

export const SalonPreview = ({
  phone,
  city,
  district,
  address,
  about,
  images,
  onEditClick,
}: SalonPreviewProps) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-800">
            Salon Profili
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Müşterilerinizin mobil uygulamada göreceği canlı vitrin kartı.
          </p>
        </div>
        <button
          onClick={onEditClick}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          <Edit3 className="w-4 h-4" /> Profili Düzenle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {images.length > 0 ? (
          images.slice(0, 3).map((url, index) => (
            <div
              key={index}
              className="relative h-48 rounded-2xl overflow-hidden shadow-sm border border-slate-100"
            >
              <img
                src={url}
                alt="Salon Vitrin"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))
        ) : (
          <div className="col-span-3 h-48 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs">
            <Info className="w-6 h-6 mb-1 text-slate-300" /> Henüz bir vitrin
            görseli yüklenmedi.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-1 space-y-4">
          <Card className="p-5 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-500" /> İletişim & Konum
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">
                    Telefon
                  </span>
                  <span className="font-black text-slate-700">
                    {phone || "Belirtilmedi"}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 border-t border-slate-50 pt-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">
                    Bölge
                  </span>
                  <span className="font-black text-slate-700">
                    {city && district
                      ? `${city} / ${district}`
                      : "Belirtilmedi"}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-linear-to-br from-slate-800 to-slate-900 text-white space-y-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 block">
              Canlı Durum
            </span>
            <p className="text-xs font-medium text-slate-300 leading-relaxed">
              Profiliniz eksiksiz ve arama listelerinde gösteriliyor.
            </p>
          </Card>
        </div>

        <Card className="md:col-span-2 p-6 space-y-5">
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" /> Salon
              Hakkında
            </h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-line bg-slate-50/60 p-4 rounded-xl border border-slate-100/50">
              {about || "Salonunuza ait bir açıklama yazısı bulunmuyor."}
            </p>
          </div>

          <div className="space-y-2 border-t border-slate-50 pt-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Açık Adres
            </h4>
            <p className="text-xs text-slate-700 font-bold leading-relaxed">
              {address || "Açık adres tanımı yapılmadı."}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
