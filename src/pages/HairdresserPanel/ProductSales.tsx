import React from 'react';
import { Card } from '../../components/ui/Card';
import { ShoppingBag } from 'lucide-react';

export const ProductSales: React.FC = () => {
  const sales = [
    { id: '1', productName: 'Keratin Özlü Saç Bakım Maskesi', quantity: 3, totalIncome: 450, date: '20 Mayıs 2026' },
    { id: '2', productName: 'Tuzsuz Profesyonel Şampuan 1L', quantity: 5, totalIncome: 625, date: '19 Mayıs 2026' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-lg font-bold text-slate-800">Ürün Satış Envanteri</h3>
        <p className="text-xs text-slate-400">Salon içerisinde satılan ekstra kozmetik ürün takibi</p>
      </div>

      <Card className="overflow-hidden p-0 border border-slate-100/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-wider font-bold border-b border-slate-100">
                <th className="py-4 px-6">Ürün Adı</th>
                <th className="py-4 px-6">Adet</th>
                <th className="py-4 px-6">Toplam Gelir</th>
                <th className="py-4 px-6">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-600">
              {sales.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/40 transition-all">
                  <td className="py-4 px-6 flex items-center gap-3 font-bold text-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-brand-purple">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    {item.productName}
                  </td>
                  <td className="py-4 px-6">{item.quantity} adet</td>
                  <td className="py-4 px-6 font-extrabold text-brand-purple">₺{item.totalIncome}</td>
                  <td className="py-4 px-6 text-slate-400">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};