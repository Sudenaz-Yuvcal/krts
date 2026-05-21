import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Upload, MapPin } from 'lucide-react';

export const SalonDetails: React.FC = () => {
  const [about, setAbout] = useState('Salonumuz 2018 yılından beri Bursa Nilüfer bölgesinde modern saç tasarımları, renklendirme ve kişisel bakım hizmetleri sunmaktadır. Müşteri memnuniyeti ve hijyen en büyük önceliğimizdir.');

  return (
    <Card className="max-w-3xl">
      <h3 className="text-xl font-bold text-slate-800 mb-2">Salon Profili Ayarları</h3>
      <p className="text-xs text-slate-400 mb-6">Müşterilerin arama listesinde göreceği vitrin bilgileri</p>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">Salon Görseli</label>
          <div className="flex items-center gap-6">
            <img 
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=300&auto=format&fit=crop" 
              alt="Salon Vitrin" 
              className="w-40 h-28 rounded-2xl object-cover border border-slate-100 shadow-sm"
            />
            <div className="flex-1 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-all">
              <Upload className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-semibold text-slate-600">Yeni Resim Yükle</span>
              <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG (Maks. 5MB)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Şehir</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input type="text" value="Bursa" disabled className="w-full bg-slate-50 pl-9 pr-4 py-2 rounded-xl text-sm border border-slate-100 text-slate-600" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">İlçe</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input type="text" value="Nilüfer" disabled className="w-full bg-slate-50 pl-9 pr-4 py-2 rounded-xl text-sm border border-slate-100 text-slate-600" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-1.5">Salon Hakkında Açıklama</label>
          <textarea 
            rows={4} 
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full border border-slate-100 p-4 rounded-xl text-sm focus:outline-none focus:border-purple-300 shadow-sm resize-none"
          />
        </div>

        <div className="flex justify-end border-t border-slate-50 pt-4">
          <Button variant="primary">Değişiklikleri Kaydet</Button>
        </div>
      </div>
    </Card>
  );
};