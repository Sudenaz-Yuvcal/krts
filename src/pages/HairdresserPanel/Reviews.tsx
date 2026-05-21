import React from 'react';
import { Card } from '../../components/ui/Card';
import { Star, MessageSquare } from 'lucide-react';

export const Reviews: React.FC = () => {
  const reviews = [
    { id: '1', customerName: 'Sudenaz Y.', rating: 5, comment: 'Saç kesimi harika oldu, tam istediğim gibi katlı kesim yapıldı. İlgi ve alaka için çok teşekkürler.', date: '19 Mayıs 2026' },
    { id: '2', customerName: 'Elif Ş.', rating: 4, comment: 'Ombre işlemi çok başarılı temiz çalışıyorlar fakat yoğunluktan biraz bekledim.', date: '15 Mayıs 2026' }
  ];

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="mb-2">
        <h3 className="text-lg font-bold text-slate-800">Müşteri Değerlendirmeleri</h3>
        <p className="text-xs text-slate-400">Hizmet sonu havuz onayı veren müşterilerin yorumları</p>
      </div>

      {reviews.map((rev) => (
        <Card key={rev.id} className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800">{rev.customerName}</h4>
            <span className="text-[11px] text-slate-400 font-medium">{rev.date}</span>
          </div>

          <div className="flex items-center gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
            ))}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex gap-2">
            <MessageSquare className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            "{rev.comment}"
          </p>
        </Card>
      ))}
    </div>
  );
};