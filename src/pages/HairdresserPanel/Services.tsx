import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Plus, Scissors, Clock, Trash2 } from 'lucide-react';

export const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Kadın' | 'Erkek'>('Kadın');

  const [services, setServices] = useState([
    { id: '1', name: 'Detaylı Saç Kesimi & Yıkama', price: 350, category: 'Kadın', duration: 45 },
    { id: '2', name: 'Profesyonel Ombre / Balayaj', price: 1800, category: 'Kadın', duration: 150 },
    { id: '3', name: 'Keratin Bakımı & Fön', price: 600, category: 'Kadın', duration: 60 },
    { id: '4', name: 'Saç Kesimi & Sakal Tıraşı', price: 250, category: 'Erkek', duration: 30 },
    { id: '5', name: 'Damat Tıraşı Özel Paket', price: 1200, category: 'Erkek', duration: 90 },
  ]);

  const filteredServices = services.filter(s => s.category === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex bg-white border border-slate-100 p-1.5 rounded-2xl shadow-sm w-fit">
          <button 
            onClick={() => setActiveTab('Kadın')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'Kadın' ? 'bg-brand-purple text-white shadow-md' : 'text-slate-400 hover:text-slate-700'}`}
          >
            👩‍🎨 Kadın Hizmetleri
          </button>
          <button 
            onClick={() => setActiveTab('Erkek')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'Erkek' ? 'bg-brand-purple text-white shadow-md' : 'text-slate-400 hover:text-slate-700'}`}
          >
            👨‍🎨 Erkek Hizmetleri
          </button>
        </div>

        <Button variant="primary">
          <Plus className="w-4 h-4" /> Yeni Hizmet Ekle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="flex flex-col justify-between hover:border-purple-100 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-brand-purple mb-4">
                <Scissors className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-800 tracking-tight">{service.name}</h4>
              <div className="flex items-center gap-2 text-slate-400 text-xs mt-2">
                <Clock className="w-3.5 h-3.5" />
                <span>{service.duration} dakika</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-6">
              <span className="text-lg font-extrabold text-slate-800">₺{service.price}</span>
              <button className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};