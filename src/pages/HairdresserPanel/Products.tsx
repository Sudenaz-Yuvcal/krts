import React, { useState, useMemo, useRef } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
  Plus,
  ShoppingBag,
  Trash2,
  Search,
  SlidersHorizontal,
  X,
  AlertCircle,
  Edit3,
  Power,
  Upload,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  stock: number;
  purchasePrice: number;
  salePrice: number;
  image_url: string;
  is_active: boolean;
  totalIncome: number;
  date: string;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Keratin Özlü Saç Bakım Maskesi",
    stock: 12,
    purchasePrice: 100,
    salePrice: 150,
    image_url: "",
    is_active: true,
    totalIncome: 450,
    date: "22 Mayıs 2026",
  },
  {
    id: "2",
    name: "Tuzsuz Profesyonel Şampuan 1L",
    stock: 4,
    purchasePrice: 80,
    salePrice: 125,
    image_url: "",
    is_active: true,
    totalIncome: 625,
    date: "21 Mayıs 2026",
  },
  {
    id: "3",
    name: "Argan Yağlı Yoğun Parlatıcı Serum",
    stock: 25,
    purchasePrice: 150,
    salePrice: 280,
    image_url: "",
    is_active: false,
    totalIncome: 0,
    date: "20 Mayıs 2026",
  },
];

export const Products: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    "default" | "price-asc" | "price-desc" | "stock-desc"
  >("default");
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [name, setName] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [purchasePrice, setPurchasePrice] = useState<string>("");
  const [salePrice, setSalePrice] = useState<string>("");
  const [imageFile, setImageFile] = useState<string>("");
  const [isActiveStatus, setIsActiveStatus] = useState<boolean>(true);

  const [errors, setErrors] = useState<{
    name?: string;
    stock?: string;
    purchasePrice?: string;
    salePrice?: string;
    image?: string;
  }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNameChange = (val: string, currentVal: string): string => {
    const cleanVal = val.replace(/[0-9]/g, "");
    if (cleanVal.includes("  ")) return currentVal;
    return cleanVal;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setImageFile(localUrl);
      if (errors.image) setErrors({ ...errors, image: undefined });
    }
  };

  const handleOpenAddModal = () => {
    setName("");
    setStock("");
    setPurchasePrice("");
    setSalePrice("");
    setImageFile("");
    setErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setStock(product.stock.toString());
    setPurchasePrice(product.purchasePrice.toString());
    setSalePrice(product.salePrice.toString());
    setImageFile(product.image_url);
    setIsActiveStatus(product.is_active);
    setErrors({});
    setIsEditModalOpen(true);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!name.trim()) newErrors.name = "Ürün adı alanı boş bırakılamaz.";

    const stockNum = Number(stock);
    if (!stock) newErrors.stock = "Stok miktarı boş bırakılamaz.";
    if (isNaN(stockNum) || stockNum < 0)
      newErrors.stock = "Geçerli bir stok giriniz.";

    const pPriceNum = Number(purchasePrice);
    if (!purchasePrice)
      newErrors.purchasePrice = "Alış fiyatı boş bırakılamaz.";
    if (isNaN(pPriceNum) || pPriceNum <= 0)
      newErrors.purchasePrice = "Geçerli bir alış fiyatı giriniz.";

    const sPriceNum = Number(salePrice);
    if (!salePrice) newErrors.salePrice = "Satış fiyatı boş bırakılamaz.";
    if (isNaN(sPriceNum) || sPriceNum <= 0)
      newErrors.salePrice = "Geçerli bir satış fiyatı giriniz.";
    if (sPriceNum <= pPriceNum)
      newErrors.salePrice = "Satış fiyatı alış fiyatından yüksek olmalıdır.";

    if (!imageFile) newErrors.image = "Ürün görseli yüklemek zorunludur.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newProduct: Product = {
      id: Math.random().toString(),
      name: name.trim(),
      stock: stockNum,
      purchasePrice: pPriceNum,
      salePrice: sPriceNum,
      image_url: imageFile,
      is_active: true,
      totalIncome: 0,
      date: "22 Mayıs 2026",
    };

    setProducts([newProduct, ...products]);
    setIsAddModalOpen(false);
    showToast("Ürün envantere başarıyla eklendi.");
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const newErrors: typeof errors = {};

    if (!name.trim()) newErrors.name = "Ürün adı alanı boş bırakılamaz.";

    const stockNum = Number(stock);
    if (!stock) newErrors.stock = "Stok miktarı boş bırakılamaz.";
    if (isNaN(stockNum) || stockNum < 0)
      newErrors.stock = "Geçerli bir stok giriniz.";

    const pPriceNum = Number(purchasePrice);
    if (!purchasePrice)
      newErrors.purchasePrice = "Alış fiyatı boş bırakılamaz.";
    if (isNaN(pPriceNum) || pPriceNum <= 0)
      newErrors.purchasePrice = "Geçerli bir alış fiyatı giriniz.";

    const sPriceNum = Number(salePrice);
    if (!salePrice) newErrors.salePrice = "Satış fiyatı boş bırakılamaz.";
    if (isNaN(sPriceNum) || sPriceNum <= 0)
      newErrors.salePrice = "Geçerli bir satış fiyatı giriniz.";
    if (sPriceNum <= pPriceNum)
      newErrors.salePrice = "Satış fiyatı alış fiyatından yüksek olmalıdır.";

    if (!imageFile) newErrors.image = "Ürün görseli yüklemek zorunludur.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setProducts(
      products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: name.trim(),
              stock: stockNum,
              purchasePrice: pPriceNum,
              salePrice: sPriceNum,
              image_url: imageFile,
              is_active: isActiveStatus,
            }
          : p,
      ),
    );

    setIsEditModalOpen(false);
    setEditingProduct(null);
    showToast("Ürün envanteri başarıyla güncellendi.");
  };

  const confirmDeleteProduct = () => {
    if (!productToDelete) return;
    setProducts(products.filter((p) => p.id !== productToDelete));
    setProductToDelete(null);
    showToast("Ürün katalogdan silindi.");
  };

  const toggleStatusDirectly = (id: string) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, is_active: !p.is_active } : p,
      ),
    );
    showToast("Ürün satış durumu değiştirildi.");
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    if (sortBy === "price-asc")
      result = [...result].sort((a, b) => a.salePrice - b.salePrice);
    if (sortBy === "price-desc")
      result = [...result].sort((a, b) => b.salePrice - a.salePrice);
    if (sortBy === "stock-desc")
      result = [...result].sort((a, b) => b.stock - a.stock);
    return result;
  }, [products, searchQuery, sortBy]);

  return (
    <div className="space-y-8 relative">
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-slate-900 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-xl z-50 flex items-center gap-2 border border-slate-800">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          {toastMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-800">
            Ürün Satış Envanteri
          </h2>
          <p className="text-slate-400 text-xs font-semibold mt-1">
            Salon içerisinde satılan ekstra kozmetik ürün takibi, stok yönetimi
            ve perakende gelir analizi.
          </p>
        </div>
        <Button
          onClick={handleOpenAddModal}
          variant="primary"
          className="cursor-pointer shadow-lg shadow-purple-100 h-11 px-5"
        >
          <Plus className="w-4 h-4" /> Yeni Ürün Ekle
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100/80 p-3 rounded-3xl shadow-xs">
        <div className="flex items-center gap-2 w-full sm:max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Envanter listesinde ürün ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-purple-200 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`p-2 border rounded-xl bg-slate-50 transition-colors cursor-pointer ${showFilterMenu ? "border-purple-200 text-brand-purple bg-purple-50/30" : "border-slate-100 text-slate-400 hover:text-slate-600"}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            {showFilterMenu && (
              <div className="absolute right-0 top-11 bg-white border border-slate-100 p-2 rounded-2xl shadow-xl z-10 w-48">
                <span className="text-[10px] font-black text-slate-400 px-3 py-1.5 block uppercase tracking-wider">
                  Filtrele & Sırala
                </span>
                <button
                  onClick={() => {
                    setSortBy("default");
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors ${sortBy === "default" ? "bg-purple-50 text-brand-purple" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  Varsayılan
                </button>
                <button
                  onClick={() => {
                    setSortBy("price-asc");
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors ${sortBy === "price-asc" ? "bg-purple-50 text-brand-purple" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  Satış Fiyatı (Artan)
                </button>
                <button
                  onClick={() => {
                    setSortBy("price-desc");
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors ${sortBy === "price-desc" ? "bg-purple-50 text-brand-purple" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  Satış Fiyatı (Azalan)
                </button>
                <button
                  onClick={() => {
                    setSortBy("stock-desc");
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors ${sortBy === "stock-desc" ? "bg-purple-50 text-brand-purple" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  En Yüksek Stok
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Card className="p-0 border border-slate-100/80 bg-white rounded-[28px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-black uppercase tracking-wider bg-slate-50/70">
                <th className="py-4 pl-8 w-24">Görsel</th>
                <th className="py-4 px-4">Ürün Adı</th>
                <th className="py-4 px-4 w-36">Toplam Gelir</th>
                <th className="py-4 px-4 w-32">Kalan Stok</th>
                <th className="py-4 px-4 w-32">Tarih</th>
                <th className="py-4 px-4 w-32">Stok Durumu</th>
                <th className="py-4 pr-8 w-28 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center text-slate-400 font-bold text-xs"
                  >
                    Envanter kaydı bulunmamaktadır.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
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
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => toggleStatusDirectly(product.id)}
                          title={
                            product.is_active ? "Satıştan Kaldır" : "Satışa Aç"
                          }
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${product.is_active ? "text-slate-400 hover:text-red-500 hover:bg-red-50" : "text-emerald-600 bg-emerald-50/50 hover:bg-emerald-50"}`}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-1.5 text-slate-400 hover:text-brand-purple rounded-lg hover:bg-purple-50 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setProductToDelete(product.id)}
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
      </Card>

      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-6 w-full max-w-2xl border border-slate-100 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-50 shrink-0">
              <div>
                <h3 className="text-lg font-black text-slate-800">
                  {isAddModalOpen
                    ? "Envantere Yeni Ürün Ekle"
                    : "Ürün Detaylarını Düzenle"}
                </h3>
                <p className="text-slate-400 text-[11px] font-medium mt-0.5">
                  Rakamlar ve ardışık boşluklar güvenlik protokolünce
                  engellenmiştir.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  setErrors({});
                }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={
                isAddModalOpen ? handleCreateProduct : handleUpdateProduct
              }
              className="flex-1 overflow-y-auto py-4 space-y-3 pr-1"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Ürün Spesifikasyon Adı
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(handleNameChange(e.target.value, name))
                      }
                      className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white transition-all ${errors.name ? "border-red-300 focus:border-red-400 bg-red-50/10" : "border-slate-100 focus:border-purple-200"}`}
                      placeholder="Örn: Profesyonel Şampuan"
                    />
                    {errors.name && (
                      <div className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" /> {errors.name}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Alış Fiyatı (₺)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={purchasePrice}
                        onChange={(e) =>
                          setPurchasePrice(e.target.value.replace(/\D/g, ""))
                        }
                        className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white transition-all ${errors.purchasePrice ? "border-red-300 focus:border-red-400 bg-red-50/10" : "border-slate-100 focus:border-purple-200"}`}
                        placeholder="Örn: 80"
                      />
                      {errors.purchasePrice && (
                        <div className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3" />{" "}
                          {errors.purchasePrice}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Satış Fiyatı (₺)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={salePrice}
                        onChange={(e) =>
                          setSalePrice(e.target.value.replace(/\D/g, ""))
                        }
                        className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white transition-all ${errors.salePrice ? "border-red-300 focus:border-red-400 bg-red-50/10" : "border-slate-100 focus:border-purple-200"}`}
                        placeholder="Örn: 125"
                      />
                      {errors.salePrice && (
                        <div className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3" /> {errors.salePrice}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Mevcut Stok Adedi
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={stock}
                      onChange={(e) =>
                        setStock(e.target.value.replace(/\D/g, ""))
                      }
                      className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white transition-all ${errors.stock ? "border-red-300 focus:border-red-400 bg-red-50/10" : "border-slate-100 focus:border-purple-200"}`}
                      placeholder="Örn: 20"
                    />
                    {errors.stock && (
                      <div className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" /> {errors.stock}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Ürün Görseli <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    {imageFile ? (
                      <div className="relative w-full h-9.5 rounded-xl overflow-hidden border border-slate-100 group">
                        <img
                          src={imageFile}
                          alt="Önizleme"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setImageFile("")}
                          className="absolute top-1 right-1 p-1 bg-slate-900/70 text-white rounded-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full h-9.5 border border-dashed rounded-xl flex items-center justify-center gap-2 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer ${errors.image ? "border-red-300 bg-red-50/10" : "border-slate-200 hover:border-purple-200"}`}
                      >
                        <Upload className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-600">
                          Görsel Yüklemek Zorunludur
                        </span>
                      </button>
                    )}
                    {errors.image && (
                      <div className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" /> {errors.image}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isEditModalOpen && (
                <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3 rounded-xl mt-4! shrink-0">
                  <div>
                    <span className="text-xs font-bold text-slate-700 block">
                      Katalog Satış Durumu
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 block">
                      Kapatılırsa kasada satışı gerçekleştirilemez.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsActiveStatus(!isActiveStatus)}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-hidden cursor-pointer ${isActiveStatus ? "bg-emerald-500 flex justify-end" : "bg-slate-300 flex justify-start"}`}
                  >
                    <div className="bg-white w-4.5 h-4.5 rounded-full shadow-xs" />
                  </button>
                </div>
              )}

              <div className="flex gap-3 border-t border-slate-50 pt-4 mt-4! shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    setErrors({});
                  }}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-purple hover:bg-purple-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  {isAddModalOpen
                    ? "Envantere Kaydet"
                    : "Değişiklikleri Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {productToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-sm border border-slate-100 shadow-xl mx-4 text-center">
            <div className="w-12 h-12 bg-red-50 border border-red-100 text-red-500 flex items-center justify-center rounded-2xl mx-auto mb-4">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-slate-800">
              Ürün Silinsin mi?
            </h3>
            <p className="text-slate-400 text-xs font-semibold mt-1 px-2 '">
              Bu işlemi gerçekleştirmek istediğinize emin misiniz? Ürün envanter
              kaydı tamamen silinecektir.
            </p>
            <div className="flex gap-3 mt-6 border-t border-slate-50 pt-4">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer"
              >
                İptal
              </button>
              <button
                onClick={confirmDeleteProduct}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md shadow-red-100 transition-all cursor-pointer"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
