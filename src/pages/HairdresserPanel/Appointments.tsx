import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Calendar, Clock, User, CheckCircle2 } from 'lucide-react';

export const Appointments: React.FC = () => {
  const [subTab, setSubTab] = useState<'yaklasan' | 'iptal'>('yaklasan');

  const appointments = [
    { id: '1', customerName: 'Melisa Yılmaz', serviceName: 'Saç Kesimi & Fön', category: 'Kadın', date: '21 Mayıs 2026', time: '14:30', price: 350, status: 'Yaklaşan', paymentStatus: 'Blocked' },
    { id: '2', customerName: 'Can Tekin', serviceName: 'Damat Tıraşı', category: 'Erkek', date: '22 Mayıs 2026', time: '11:00', price: 1200, status: 'Yaklaşan', paymentStatus: 'Blocked' },
    { id: '3', customerName: 'Ayşe Demir', serviceName: 'Ombre', category: 'Kadın', date: '18 Mayıs 2026', time: '10:00', price: 1800, status: 'İptal', paymentStatus: 'Refunded' },
  ];

  const filteredArr = appointments.filter(a => subTab === 'yaklasan' ? a.status === 'Yaklaşan' : a.status === 'İptal');

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-100 gap-6">
        <button 
          onClick={() => setSubTab('yaklasan')}
          className={`pb-3 text-sm font-bold transition-all relative ${subTab === 'yaklasan' ? 'text-brand-purple' : 'text-slate-400'}`}
        >
          ⏰ Yaklaşan Randevular
          {subTab === 'yaklasan' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full"></span>}
        </button>
        <button 
          onClick={() => setSubTab('iptal')}
          className={`pb-3 text-sm font-bold transition-all relative ${subTab === 'iptal' ? 'text-brand-purple' : 'text-slate-400'}`}
        >
          ❌ İptal Edilenler
          {subTab === 'iptal' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full"></span>}
        </button>
      </div>

      <div className="space-y-4">
        {filteredArr.map((item) => (
          <Card key={item.id} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 px-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">{item.customerName}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{item.serviceName} ({item.category})</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{item.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{item.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-extrabold text-slate-800">₺{item.price}</span>
              <Badge type={item.paymentStatus as any} />
            </div>

            {item.status === 'Yaklaşan' && (
              <div className="flex items-center justify-end border-t lg:border-t-0 pt-3 lg:pt-0">
                <Button variant="success" className="py-1.5 px-3.5 rounded-lg text-xs">
                  <CheckCircle2 className="w-4 h-4" /> Hizmeti Tamamladım
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};