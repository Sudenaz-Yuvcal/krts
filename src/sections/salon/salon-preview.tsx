import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Edit3, Globe, Phone, MapPin, FileText, Info, Mail, Store, X, ChevronLeft, ChevronRight, Clock } from "lucide-react";

interface SalonPreviewProps {
  salonName: string;
  mail: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  about: string;
  images: string[];
  workingHours?: string; 
  openingTime?: string;
  closingTime?: string; 
  onEditClick: () => void;
}

export const SalonPreview = ({
  salonName,
  mail,
  phone,
  city,
  district,
  address,
  about,
  images = [],
  openingTime = "", 
  closingTime = "", 
  onEditClick,
}: SalonPreviewProps) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const safeImages = Array.isArray(images) ? images : [];
  const hasMoreThanThree = safeImages.length > 3;
  const remainingCount = safeImages.length - 2;

  const openGallery = (index: number) => {
    setActiveImageIndex(index);
    setIsGalleryOpen(true);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % safeImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-800 flex items-center gap-2">
            <Store className="w-6 h-6 text-indigo-600" /> {salonName || "Salon Profili"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Müşterilerinizin mobil uygulamada göreceği canlı vitrin kartı.
          </p>
        </div>
        <button
          onClick={onEditClick}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer shrink-0"
        >
          <Edit3 className="w-4 h-4" /> Profili Düzenle
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {safeImages.length > 0 ? (
          safeImages.slice(0, 3).map((url, index) => {
            const isThirdCardWithMore = index === 2 && hasMoreThanThree;

            return (
              <div
                key={index}
                onClick={() => openGallery(index)}
                className="relative h-48 rounded-2xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer group"
              >
                <img
                  src={url}
                  alt={`Salon Vitrin ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {isThirdCardWithMore && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px] flex flex-col items-center justify-center text-white transition-all group-hover:bg-slate-900/70">
                    <span className="text-lg font-black">+{remainingCount} Fotoğraf</span>
                    <span className="text-[10px] font-medium text-slate-300">Tümünü İncele</span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-1 sm:col-span-2 md:col-span-3 h-48 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs">
            <Info className="w-6 h-6 mb-1 text-slate-300" /> Henüz bir vitrin görseli yüklenmedi.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-1 space-y-4">
          <Card className="p-5 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-500" /> İletişim & Künye
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

              <div className="flex items-start gap-2.5 border-t border-slate-100 pt-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">
                    E-Posta
                  </span>
                  <span className="font-black text-slate-700 break-all">
                    {mail || "Belirtilmedi"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 border-t border-slate-100 pt-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">
                    Bölge
                  </span>
                  <span className="font-black text-slate-700">
                    {city && district ? `${city} / ${district}` : "Belirtilmedi"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 border-t border-slate-100 pt-3">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">
                    Çalışma Saatleri
                  </span>
                  <span className="font-black text-indigo-600">
                    {openingTime && closingTime 
                      ? `${openingTime} - ${closingTime}` 
                      : "Belirtilmedi"}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-slate-900 text-white space-y-1 rounded-2xl">
            <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 block">
              Canlı Durum
            </span>
            <p className="text-xs font-medium text-slate-300 leading-relaxed">
              Profiliniz eksiksiz ve arama listelerinde aktif olarak gösteriliyor.
            </p>
          </Card>
        </div>

        <Card className="md:col-span-2 p-6 space-y-5">
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" /> Salon Hakkında
            </h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-line bg-slate-50/60 p-4 rounded-xl border border-slate-100/50">
              {about || "Salonunuza ait bir açıklama yazısı bulunmuyor."}
            </p>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Açık Adres
            </h4>
            <p className="text-xs text-slate-700 font-bold leading-relaxed bg-slate-50/30 p-3 rounded-xl border border-dashed border-slate-100">
              {address || "Açık adres tanımı yapılmadı."}
            </p>
          </div>
        </Card>
      </div>

      {isGalleryOpen && safeImages.length > 0 && (
        <div 
          className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsGalleryOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all cursor-pointer"
            onClick={() => setIsGalleryOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>

          {safeImages.length > 1 && (
            <button 
              className="absolute left-4 md:left-8 text-white/70 hover:text-white p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all cursor-pointer"
              onClick={prevImage}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div className="max-w-4xl max-h-[80vh] flex flex-col items-center gap-4">
            <img 
              src={safeImages[activeImageIndex]} 
              alt={`Galeri Büyük Boy ${activeImageIndex + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl select-none"
              onClick={(e) => e.stopPropagation()}
            />
            <span className="text-white/60 text-xs font-bold bg-white/5 px-4 py-1.5 rounded-full">
              {activeImageIndex + 1} / {safeImages.length}
            </span>
          </div>

          {safeImages.length > 1 && (
            <button 
              className="absolute right-4 md:right-8 text-white/70 hover:text-white p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all cursor-pointer"
              onClick={nextImage}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SalonPreview;