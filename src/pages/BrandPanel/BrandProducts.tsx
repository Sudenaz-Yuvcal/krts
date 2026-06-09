import React, { useState, useMemo, useRef, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import type { Product } from "../../types/products";
import { Plus, Search, SlidersHorizontal, Trash2, Loader2, Filter, X, Upload, Check, ImageIcon } from "lucide-react";
import { ProductTable } from "../../sections/products/product-table";
import { supabase } from "../../lib/supabaseClient";

const CATEGORIES = [
  "Makyaj",
  "Cilt Bakımı",
  "Saç Bakımı",
  "Parfüm",
  "Kişisel Bakım",
  "Aksesuar",
  "Genel"
];

interface ExtendedProduct extends Product {
  category?: string;
}

interface SupabaseProductItem {
  id: string | number;
  product_name: string;
  brand_name: string;
  brand_id: string;
  price: number | null;
  purchase_price?: number | null;
  stock_count: number;
  category: string;
  image_url: string | string[] | null;
  is_active: boolean;
  created_at?: string;
}

interface SupabaseBrandItem {
  id: string;
  brand_name?: string | null;
  name?: string | null;
}

export const BrandProduct = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [brandId, setBrandId] = useState<string | null>("00000000-0000-0000-0000-000000000000");
  const [realBrandName, setRealBrandName] = useState<string>("Maybelline New York");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("Hepsi");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "stock-desc">("default");
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);

  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ExtendedProduct | null>(null);

  const [name, setName] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [purchasePrice, setPurchasePrice] = useState<string>(""); 
  const [salePrice, setSalePrice] = useState<string>("");
  const [category, setCategory] = useState<string>("Makyaj"); 
  const [images, setImages] = useState<string[]>([]);
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

  const fetchBrandFromSupabase = async (): Promise<string> => {
    try {
      const { data: brandData, error } = await supabase
        .from("brands") 
        .select("*")    
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (brandData) {
        const safeBrand = brandData as SupabaseBrandItem; 
        setBrandId(safeBrand.id);
        setRealBrandName(safeBrand.brand_name || safeBrand.name || "Maybelline New York"); 
        return safeBrand.id;
      } else {
        setBrandId("00000000-0000-0000-0000-000000000000");
        setRealBrandName("Maybelline New York");
        return "00000000-0000-0000-0000-000000000000";
      }
    } catch (e) {
      console.error("Error fetching brand from Supabase:", e);
      return "00000000-0000-0000-0000-000000000000";
    }
  };

  const fetchProducts = async (targetBrandId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("brand_id", targetBrandId) 
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedProducts: ExtendedProduct[] = (data as SupabaseProductItem[]).map((item) => {
          let parsedImages: string[] = [];
          if (Array.isArray(item.image_url)) {
            parsedImages = item.image_url;
          } else if (typeof item.image_url === "string" && item.image_url.trim() !== "") {
            const cleanStr = item.image_url.trim();
            if (cleanStr.startsWith("[") && cleanStr.endsWith("]")) {
              try {
                parsedImages = JSON.parse(cleanStr);
              } catch {
                parsedImages = [cleanStr];
              }
            } else {
              parsedImages = cleanStr.includes(",") ? cleanStr.split(",") : [cleanStr];
            }
          }

          return {
            id: item.id.toString(),
            name: item.product_name,
            stock: item.stock_count,
            purchasePrice: item.purchase_price ? Number(item.purchase_price) : 0, 
            salePrice: item.price ? Number(item.price) : 0, 
            image_url: parsedImages[0] || "",
            images: parsedImages,
            category: item.category || "Genel", 
            is_active: item.is_active !== false,
            totalIncome: 0,
            date: item.created_at ? new Date(item.created_at).toLocaleDateString("tr-TR") : "Bugün",
          };
        });
        setProducts(mappedProducts);
      }
    } catch (err: unknown) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const activeBrandId = await fetchBrandFromSupabase();
      if (activeBrandId) {
        await fetchProducts(activeBrandId);
      } else {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const handleNameChange = (val: string) => {
    const cleanVal = val.replace(/[0-9]/g, "");
    if (cleanVal.includes("  ")) return;
    setName(cleanVal);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);

    if (images.length + filesArray.length > 3) {
      setErrors((prev) => ({
        ...prev,
        image: `Bir ürün için en fazla 3 fotoğraf yükleyebilirsiniz. En fazla ${3 - images.length} adet daha seçebilirsiniz.`,
      }));
      return;
    }

    try {
      setIsUploading(true);
      const uploadedUrls: string[] = [];

      for (const file of filesArray) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("brand-logos")
          .upload(filePath, file, { cacheControl: "3600", upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("brand-logos")
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          uploadedUrls.push(publicUrlData.publicUrl);
        }
      }

      if (uploadedUrls.length > 0) {
        setImages((prev) => {
          const updated = [...prev, ...uploadedUrls];
          if (updated.length >= 1) setErrors((err) => ({ ...err, image: undefined }));
          return updated;
        });
        showToast(`${uploadedUrls.length} adet ürün görseli başarıyla yüklendi.`);
      }
    } catch (err: unknown) {
      alert("Görsel yüklenemedi. Storage alanını kontrol edin.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeUploadedImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setErrors((prev) => ({ ...prev, image: undefined }));
  };

  const handleOpenAddModal = () => {
    if (!brandId) {
      alert("Kayıtlı bir marka bulunamadığı için ürün eklenemez.");
      return;
    }
    setModalMode("add");
    setName("");
    setStock("");
    setPurchasePrice(""); 
    setSalePrice("");
    setCategory("Makyaj"); 
    setImages([]);
    setIsActiveStatus(true);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: ExtendedProduct) => {
    setModalMode("edit");
    setEditingProduct(product);
    setName(product.name);
    setStock(product.stock.toString());
    setPurchasePrice(product.purchasePrice ? product.purchasePrice.toString() : ""); 
    setSalePrice(product.salePrice.toString());
    setCategory(product.category || "Makyaj"); 

    const productWithImages = product as ExtendedProduct & { images?: string[] };
    setImages(
      Array.isArray(productWithImages.images)
        ? productWithImages.images
        : product.image_url ? product.image_url.split(",") : []
    );
    setIsActiveStatus(product.is_active);
    setErrors({});
    setIsModalOpen(true);
  };

  const validateForm = (stockNum: number, pPriceNum: number, sPriceNum: number) => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Ürün adı alanı boş bırakılamaz.";
    if (!stock) newErrors.stock = "Stok miktarı boş bırakılamaz.";
    if (isNaN(stockNum) || stockNum < 0) newErrors.stock = "Geçerli bir stok giriniz.";
    if (!purchasePrice) newErrors.purchasePrice = "Alış fiyatı boş bırakılamaz.";
    if (isNaN(pPriceNum) || pPriceNum < 0) newErrors.purchasePrice = "Geçerli bir alış fiyatı giriniz.";
    if (!salePrice) newErrors.salePrice = "Satış fiyatı boş bırakılamaz.";
    if (isNaN(sPriceNum) || sPriceNum <= 0) newErrors.salePrice = "Geçerli bir satış fiyatı giriniz.";
    if (images.length === 0) {
      newErrors.image = "En az 1 adet ürün fotoğrafı yüklemek zorunludur.";
    }
    return newErrors;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || isUploading || !brandId) return;

    const stockNum = Number(stock);
    const pPriceNum = Number(purchasePrice);
    const sPriceNum = Number(salePrice);

    const newErrors = validateForm(stockNum, pPriceNum, sPriceNum);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSaving(true);
      const finalImageUrl = images.length > 0 ? images.join(",") : "";

      if (modalMode === "add") {
        const { error } = await supabase.from("products").insert([
          {
            brand_id: brandId, 
            product_name: name.trim(),
            brand_name: realBrandName,
            stock_count: stockNum,
            purchase_price: pPriceNum, 
            price: sPriceNum,
            category: category, 
            image_url: finalImageUrl, 
            is_active: isActiveStatus 
          },
        ]);

        if (error) throw error;
        showToast("Ürün envantere başarıyla eklendi.");
      } else if (modalMode === "edit" && editingProduct) {
        const { error } = await supabase
          .from("products")
          .update({
            product_name: name.trim(),
            brand_name: realBrandName,
            stock_count: stockNum,
            purchase_price: pPriceNum, 
            price: sPriceNum,
            category: category, 
            image_url: finalImageUrl,
            is_active: isActiveStatus 
          })
          .eq("id", editingProduct.id);

        if (error) throw error;
        showToast("Ürün envanteri başarıyla güncellendi.");
      }

      setIsModalOpen(false);
      fetchProducts(brandId);
    } catch (err: unknown) {
      console.error("Database save error:", err);
      alert("Ürün kaydedilirken veri tabanı hatası oluştu. Lütfen veri tabanında 'purchase_price' ve 'category' sütunlarının açıldığından emin olun.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatusDirectly = async (productId: string) => {
    if (!brandId) return;
    const currentProduct = products.find((p) => p.id === productId);
    if (!currentProduct) return;

    const newStatus = !currentProduct.is_active;

    try {
      const { error } = await supabase
        .from("products")
        .update({ is_active: newStatus })
        .eq("id", productId);

      if (error) throw error;
      setProducts((prev) =>
        prev.map((p) => p.id === productId ? { ...p, is_active: newStatus } : p)
      );
      showToast(newStatus ? "Ürün yayına aldı." : "Ürün yayından kaldırıldı.");
    } catch (err) {
      console.error("Durum güncellenirken hata oluştu:", err);
    }
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete || !brandId) return;
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productToDelete);

      if (error) throw error;
      setProductToDelete(null);
      showToast("Ürün katalogdan silindi.");
      fetchProducts(brandId);
    } catch (err: unknown) {
      alert("Ürün silinirken bir hata oluştu.");
    }
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedCategoryFilter !== "Hepsi") {
      result = result.filter((p) => p.category === selectedCategoryFilter);
    }

    if (sortBy === "price-asc") result = [...result].sort((a, b) => a.salePrice - b.salePrice);
    if (sortBy === "price-desc") result = [...result].sort((a, b) => b.salePrice - a.salePrice);
    if (sortBy === "stock-desc") result = [...result].sort((a, b) => b.stock - a.stock);
    return result;
  }, [products, searchQuery, selectedCategoryFilter, sortBy]);

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
            Ürün Satış Envanteri ({realBrandName})
          </h2>
          <p className="text-slate-400 text-xs font-semibold mt-1">
            Markaya ait perakende ürünlerin stok miktarları, fiyatlandırma politikaları ve kategori yönetimi.
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-100/80 p-3 rounded-3xl shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Envanter listesinde ürün ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-purple-200 focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1.5 gap-1.5">
            <Filter className="w-3.5 h-3.5 text-purple-500" />
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 outline-hidden cursor-pointer"
            >
              <option value="Hepsi">Tüm Kategoriler</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`p-2 border rounded-xl bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer ${showFilterMenu ? "border-purple-200 text-brand-purple bg-purple-50/30" : "border-slate-100 text-slate-400 hover:text-slate-600"}`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Sırala
            </button>
            {showFilterMenu && (
              <div className="absolute right-0 top-11 bg-white border border-slate-100 p-2 rounded-2xl shadow-xl z-10 w-48">
                <span className="text-[10px] font-black text-slate-400 px-3 py-1.5 block uppercase tracking-wider">
                  Sıralama Seçenekleri
                </span>
                <button
                  type="button"
                  onClick={() => { setSortBy("default"); setShowFilterMenu(false); }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors ${sortBy === "default" ? "bg-purple-50 text-brand-purple" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  Varsayılan
                </button>
                <button
                  type="button"
                  onClick={() => { setSortBy("price-asc"); setShowFilterMenu(false); }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors ${sortBy === "price-asc" ? "bg-purple-50 text-brand-purple" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  Satış Fiyatı (Artan)
                </button>
                <button
                  type="button"
                  onClick={() => { setSortBy("price-desc"); setShowFilterMenu(false); }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors ${sortBy === "price-desc" ? "bg-purple-50 text-brand-purple" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  Satış Fiyatı (Azalan)
                </button>
                <button
                  type="button"
                  onClick={() => { setSortBy("stock-desc"); setShowFilterMenu(false); }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors ${sortBy === "stock-desc" ? "bg-purple-50 text-brand-purple" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  En Yüksek Stok
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Card className="p-0 border border-slate-100/80 bg-white rounded-[28px] overflow-hidden shadow-xs min-h-60 flex flex-col justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-slate-400 font-bold text-xs">
            <Loader2 className="w-7 h-7 text-purple-600 animate-spin" />
            Ürün envanteri yükleniyor...
          </div>
        ) : (
          <ProductTable
            products={filteredProducts as Product[]}
            onToggleStatus={toggleStatusDirectly}
            onEdit={handleOpenEditModal}
            onDelete={setProductToDelete}
          />
        )}
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-[32px] border border-slate-100 p-6 md:p-8 w-full max-w-lg shadow-2xl relative my-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-1">
              {modalMode === "add" ? "Kataloğa Yeni Ürün Ekle" : "Ürün Bilgilerini Güncelle"}
            </h3>
            <p className="text-slate-400 text-xs font-semibold mb-6">
              Lütfen ürün bilgilerini, maliyetini ve doğru kategoriyi seçtiğinizden emin olun.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ürün Adı</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Örn: Lash Sensational Maskara"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-purple-300 focus:bg-white transition-all"
                />
                {errors.name && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ürün Kategorisi</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-purple-300 focus:bg-white transition-all cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 whitespace-nowrap">Stok Miktarı</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-purple-300 focus:bg-white transition-all"
                  />
                  {errors.stock && <p className="text-[9px] font-bold text-red-500 mt-1">{errors.stock}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 whitespace-nowrap">Alış Fiyatı (₺)</label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-purple-300 focus:bg-white transition-all"
                  />
                  {errors.purchasePrice && <p className="text-[9px] font-bold text-red-500 mt-1">{errors.purchasePrice}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 whitespace-nowrap">Satış Fiyatı (₺)</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-purple-300 focus:bg-white transition-all"
                  />
                  {errors.salePrice && <p className="text-[9px] font-bold text-red-500 mt-1">{errors.salePrice}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ürün Fotoğrafları (Maks 3)</label>
                
                {images.length < 3 ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-100 hover:border-purple-200 bg-slate-50 hover:bg-purple-50/10 rounded-2xl p-4 text-center cursor-pointer transition-all"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-1 justify-center text-xs text-slate-400 font-bold">
                        <Loader2 className="w-5 h-5 text-purple-600 animate-spin" /> Yükleniyor...
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 justify-center text-xs text-slate-400 font-bold">
                        <Upload className="w-5 h-5 text-slate-400" /> Görsel Seç ({3 - images.length} adet kaldı)
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border border-amber-100 bg-amber-50/50 rounded-2xl p-3.5 flex items-center gap-2.5 text-amber-600 text-xs font-bold">
                    <ImageIcon className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Maksimum yükleme sınırına ulaştınız (3/3).</span>
                  </div>
                )}
                {errors.image && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.image}</p>}

                {images.length > 0 && (
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 border border-slate-100 rounded-xl overflow-hidden bg-slate-50 group shadow-2xs">
                        <img src={img} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeUploadedImage(idx)}
                          className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between bg-slate-50 border border-slate-100/50 p-3 rounded-2xl">
                <div>
                  <span className="block text-xs font-bold text-slate-700">Ürün Durumu</span>
                  <span className="text-[10px] font-semibold text-slate-400">Ürün mağazada doğrudan yayına alınsın mı?</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActiveStatus(!isActiveStatus)}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-hidden cursor-pointer ${isActiveStatus ? "bg-purple-600" : "bg-slate-200"}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${isActiveStatus ? "left-6" : "left-1"}`} />
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold py-3.5 rounded-xl transition-all cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-xs font-bold py-3.5 rounded-xl shadow-lg shadow-purple-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {modalMode === "add" ? "Ürünü Ekle" : "Değişiklikleri Kaydet"}
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
            <h3 className="text-lg font-black text-slate-800">Ürün Silinsin mi?</h3>
            <p className="text-slate-400 text-xs font-semibold mt-1 px-2">
              Bu işlemi gerçekleştirmek istediğinize emin misiniz? Ürün envanter kaydı tamamen silinecektir.
            </p>
            <div className="flex gap-3 mt-6 border-t border-slate-50 pt-4">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
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

export default BrandProduct;