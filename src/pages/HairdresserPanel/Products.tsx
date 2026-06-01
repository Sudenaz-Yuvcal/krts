import React, { useState, useMemo, useRef } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import type { Product } from "../../types/products";
import { INITIAL_PRODUCTS } from "../../constants/product";
import { Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { ProductTable } from "../../sections/products/product-table";
import { ProductFormModal } from "../../sections/products/product-form-modal";

export const Products = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    "default" | "price-asc" | "price-desc" | "stock-desc"
  >("default");
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);

  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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

  const handleNameChange = (val: string) => {
    const cleanVal = val.replace(/[0-9]/g, "");
    if (cleanVal.includes("  ")) return;
    setName(cleanVal);
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
    setModalMode("add");
    setName("");
    setStock("");
    setPurchasePrice("");
    setSalePrice("");
    setImageFile("");
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setModalMode("edit");
    setEditingProduct(product);
    setName(product.name);
    setStock(product.stock.toString());
    setPurchasePrice(product.purchasePrice.toString());
    setSalePrice(product.salePrice.toString());
    setImageFile(product.image_url);
    setIsActiveStatus(product.is_active);
    setErrors({});
    setIsModalOpen(true);
  };

  const validateForm = (
    stockNum: number,
    pPriceNum: number,
    sPriceNum: number,
  ) => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Ürün adı alanı boş bırakılamaz.";
    if (!stock) newErrors.stock = "Stok miktarı boş bırakılamaz.";
    if (isNaN(stockNum) || stockNum < 0)
      newErrors.stock = "Geçerli bir stok giriniz.";
    if (!purchasePrice)
      newErrors.purchasePrice = "Alış fiyatı boş bırakılamaz.";
    if (isNaN(pPriceNum) || pPriceNum <= 0)
      newErrors.purchasePrice = "Geçerli bir alış fiyatı giriniz.";
    if (!salePrice) newErrors.salePrice = "Satış fiyatı boş bırakılamaz.";
    if (isNaN(sPriceNum) || sPriceNum <= 0)
      newErrors.salePrice = "Geçerli bir satış fiyatı giriniz.";
    if (sPriceNum <= pPriceNum)
      newErrors.salePrice = "Satış fiyatı alış fiyatından yüksek olmalıdır.";
    if (!imageFile) newErrors.image = "Ürün görseli yüklemek zorunludur.";
    return newErrors;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stockNum = Number(stock);
    const pPriceNum = Number(purchasePrice);
    const sPriceNum = Number(salePrice);

    const newErrors = validateForm(stockNum, pPriceNum, sPriceNum);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (modalMode === "add") {
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
      showToast("Ürün envantere başarıyla eklendi.");
    } else if (modalMode === "edit" && editingProduct) {
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
      showToast("Ürün envanteri başarıyla güncellendi.");
    }
    setIsModalOpen(false);
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
        <ProductTable
          products={filteredProducts}
          onToggleStatus={toggleStatusDirectly}
          onEdit={handleOpenEditModal}
          onDelete={setProductToDelete}
        />
      </Card>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        mode={modalMode}
        name={name}
        setName={setName}
        stock={stock}
        setStock={setStock}
        purchasePrice={purchasePrice}
        setPurchasePrice={setPurchasePrice}
        salePrice={salePrice}
        setSalePrice={setSalePrice}
        imageFile={imageFile}
        setImageFile={setImageFile}
        isActiveStatus={isActiveStatus}
        setIsActiveStatus={setIsActiveStatus}
        errors={errors}
        fileInputRef={fileInputRef}
        handleNameChange={handleNameChange}
        handleImageChange={handleImageChange}
      />

      {productToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-sm border border-slate-100 shadow-xl mx-4 text-center">
            <div className="w-12 h-12 bg-red-50 border border-red-100 text-red-500 flex items-center justify-center rounded-2xl mx-auto mb-4">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-slate-800">
              Ürün Silinsin mi?
            </h3>
            <p className="text-slate-400 text-xs font-semibold mt-1 px-2">
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
