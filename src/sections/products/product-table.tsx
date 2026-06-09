import { ShoppingBag, Power, Edit3, Trash2 } from "lucide-react";
import type { Product } from "../../types/products";

interface ProductTableProps {
  products: Product[];
  onToggleStatus: (id: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductTable = ({
  products,
  onToggleStatus,
  onEdit,
  onDelete,
}: ProductTableProps) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse min-w-212.5">
        <thead>
          <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-black uppercase tracking-wider bg-slate-50/70">
            <th className="py-4 pl-8 w-24">Görsel</th>
            <th className="py-4 px-4">Ürün Adı</th>
            <th className="py-4 px-4 w-28">Alış Fiyatı</th>
            <th className="py-4 px-4 w-28">Satış Fiyatı</th>
            <th className="py-4 px-4 w-36">Toplam Gelir</th>
            <th className="py-4 px-4 w-32">Kalan Stok</th>
            <th className="py-4 px-4 w-32">Tarih</th>
            <th className="py-4 px-4 w-32">Stok Durumu</th>
            <th className="py-4 pr-8 w-28 text-right">İşlemler</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {products.length === 0 ? (
            <tr>
              <td
                colSpan={9}
                className="py-16 text-center text-slate-400 font-bold text-xs"
              >
                Envanter kaydı bulunmamaktadır.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr
                key={product.id}
                className={`group transition-all duration-200 ${!product.is_active ? "bg-slate-50/60 opacity-65" : "hover:bg-purple-50/10"}`}
              >
                <td className="py-4 pl-8">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-brand-purple overflow-hidden border border-slate-100">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="w-4 h-4" />
                    )}
                  </div>
                </td>

                <td className="py-4 px-4 font-bold text-slate-800 text-xs">
                  {product.name}
                </td>

                <td className="py-4 px-4 text-xs font-semibold text-slate-600">
                  ₺{product.purchasePrice}
                </td>

                <td className="py-4 px-4 text-xs font-bold text-slate-900">
                  ₺{product.salePrice}
                </td>

                <td className="py-4 px-4 text-xs font-black text-brand-purple">
                  ₺{product.totalIncome}
                </td>

                <td className="py-4 px-4 text-xs font-bold text-slate-500">
                  {product.stock} adet
                </td>

                <td className="py-4 px-4 text-xs font-medium text-slate-400">
                  {product.date}
                </td>

                <td className="py-4 px-4">
                  {product.stock <= 5 && product.is_active ? (
                    <span className="text-[10px] font-black bg-red-50 text-red-500 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                      Kritik Stok
                    </span>
                  ) : product.is_active ? (
                    <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                      Satışta
                    </span>
                  ) : (
                    <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                      Satışta Değil
                    </span>
                  )}
                </td>

                <td className="py-4 pr-8 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-100 transition-all duration-200">
                    
                    <button
                      type="button"
                      onClick={() => onToggleStatus(product.id)}
                      title={
                        product.is_active ? "Satıştan Kaldır" : "Satışa Aç"
                      }
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${product.is_active ? "text-slate-400 hover:text-red-500 hover:bg-red-50" : "text-emerald-600 bg-emerald-50/50 hover:bg-emerald-50"}`}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      title="Ürünü Düzenle"
                      className="p-1.5 text-slate-400 hover:text-brand-purple rounded-lg hover:bg-purple-50 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => onDelete(product.id)}
                      title="Ürünü Sil"
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
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