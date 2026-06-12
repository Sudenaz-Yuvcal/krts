import  { useState, useEffect, useMemo } from "react";
import { Card } from "../../components/ui/Card";
import {
  ShoppingBag,
  Search,
  Loader2,
  Clock,
  Package,
  Truck,
  CheckCircle2,
  Printer,
  User,
  Calendar,
  Hash,
  NotepadText,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export type OrderStatus = "new" | "preparing" | "shipped" | "completed";

interface SupabaseProductQuery {
  product_name: string | null;
  image_url: string | string[] | null;
  brand_id: string | null;
}

interface SupabaseOrderQueryRow {
  id: string | number;
  customer_id: string;
  product_id: string;
  quantity: number;
  total_price: number;
  payment_intent_id: string | null;
  order_date: string;
  status: OrderStatus | null;
  preparation_note: string | null;
  products: SupabaseProductQuery | null;
}

export interface SupabaseOrderRow {
  id: string | number;
  customer_id: string;
  product_id: string;
  quantity: number;
  total_price: number;
  payment_intent_id: string | null;
  order_date: string;
  product_name: string;
  image_url: string;
  customer_name: string;
  status: OrderStatus;
  preparation_note: string;
}

export const BrandOrders = () => {
  const [orders, setOrders] = useState<SupabaseOrderRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<SupabaseOrderRow | null>(
    null,
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) return;

      const { data, error } = await supabase
        .from("product_orders")
        .select(
          `
          id,
          customer_id,
          product_id,
          quantity,
          total_price,
          payment_intent_id,
          order_date,
          status,
          preparation_note,
          products!inner (
            product_name,
            image_url,
            brand_id
          )
        `,
        )
        .eq("products.brand_id", user.id)
        .order("order_date", { ascending: false });

      if (error) throw error;

      if (data) {
        const rawRows = data as unknown as SupabaseOrderQueryRow[];

        const mappedData: SupabaseOrderRow[] = rawRows.map((row) => {
          const productData = row.products;

          let imageUrl = "";
          if (productData?.image_url) {
            if (Array.isArray(productData.image_url)) {
              imageUrl = productData.image_url[0] || "";
            } else {
              imageUrl = productData.image_url.split(",")[0] || "";
            }
          }

          return {
            id: row.id,
            customer_id: row.customer_id,
            product_id: row.product_id,
            quantity: row.quantity,
            total_price: row.total_price,
            payment_intent_id: row.payment_intent_id,
            order_date: row.order_date,
            product_name: productData?.product_name || "Bilinmeyen Ürün",
            image_url: imageUrl,
            customer_name: `Müşteri #${row.customer_id?.substring(0, 5) || "Uzak"}`,
            status: row.status || "new",
            preparation_note: row.preparation_note || "",
          };
        });

        setOrders(mappedData);

        if (selectedOrder) {
          const updatedSelected = mappedData.find(
            (o) => o.id === selectedOrder.id,
          );
          if (updatedSelected) setSelectedOrder(updatedSelected);
        }
      }
    } catch (err) {
      console.error("Siparişler veritabanından çekilirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (
    orderId: string | number,
    newStatus: OrderStatus,
  ) => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);

      let noteToSave = selectedOrder?.preparation_note || "";
      if (
        (newStatus === "preparing" || newStatus === "completed") &&
        !noteToSave
      ) {
        noteToSave =
          "Standart korumalı kozmetik patpat poşetine sarılarak paketlenecek. Yanına 1 adet tester ürün eklenecek.";
      }

      const { error } = await supabase
        .from("product_orders")
        .update({
          status: newStatus,
          preparation_note: noteToSave,
        })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus, preparation_note: noteToSave }
            : order,
        ),
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) =>
          prev
            ? { ...prev, status: newStatus, preparation_note: noteToSave }
            : null,
        );
      }

      const statusTexts: Record<OrderStatus, string> = {
        new: "Sipariş yeni olarak işaretlendi.",
        preparing: "Sipariş hazırlık masasına gönderildi!",
        shipped: "Ürün kargoya teslim edildi.",
        completed: "Teslimat tamamlandı, sipariş kapatıldı.",
      };
      showToast(statusTexts[newStatus] || "Durum güncellendi.");
    } catch (err) {
      console.error("Sipariş güncellenirken hata:", err);
      alert("Durum güncellenemedi.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrintReceipt = (order: SupabaseOrderRow) => {
    if (!order) return;

    const oldFrame = document.getElementById("thermal-print-frame");
    if (oldFrame) oldFrame.remove();

    const iframe = document.createElement("iframe");
    iframe.id = "thermal-print-frame";
    iframe.style.position = "fixed";
    iframe.style.right = "100%";
    iframe.style.bottom = "100%";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) return;

    const preparationNoteText =
      order.status === "new"
        ? "Sipariş henüz hazırlık aşamasına alınmadı."
        : order.preparation_note || "Özel talimat bulunmuyor.";

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Siparis Makbuzu #${order.id}</title>
        <style>
          @page { margin: 0; }
          body {
            margin: 0;
            padding: 4mm;
            width: 76mm;
            background: #ffffff;
            color: #000000;
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            line-height: 1.4;
          }
          .text-center { text-align: center; }
          .border-bottom { border-bottom: 1px dashed #000000; padding-bottom: 8px; margin-bottom: 8px; }
          .flex-row { display: flex; justify-content: space-between; margin-top: 4px; }
          .bold { font-weight: bold; }
          .uppercase { text-transform: uppercase; }
          .italic { font-style: italic; }
        </style>
      </head>
      <body>
        <div class="text-center" style="border-bottom: 1px dashed #000000; padding-bottom: 8px; margin-bottom: 8px;">
          <h2 style="font-size: 15px; margin: 0; font-weight: bold; letter-spacing: 1px;">SİPARİŞ SÜREÇ FİŞİ</h2>
          <p style="font-size: 10px; margin: 4px 0 0 0;">Baskı: ${new Date().toLocaleString("tr-TR")}</p>
        </div>

        <div style="border-bottom: 1px dashed #000000; padding-bottom: 8px; margin-bottom: 8px; font-size: 11px;">
          <div class="flex-row">
            <span><strong class="bold">Sipariş No:</strong></span>
            <span>#${order.id}</span>
          </div>
          <div class="flex-row">
            <span><strong class="bold">Müşteri ID:</strong></span>
            <span style="font-family: monospace; word-break: break-all; max-width: 150px; text-align: right;">${order.customer_id}</span>
          </div>
          <div class="flex-row">
            <span><strong class="bold">Sipariş Tar:</strong></span>
            <span>${new Date(order.order_date).toLocaleString("tr-TR")}</span>
          </div>
          <div class="flex-row">
            <span><strong class="bold">Mevcut Durum:</strong></span>
            <span class="uppercase bold">${order.status || "new"}</span>
          </div>
        </div>

        <div style="border-bottom: 1px dashed #000000; padding-bottom: 8px; margin-bottom: 8px;">
          <span class="bold" style="display: block; font-size: 12px;">${order.product_name}</span>
          <div class="flex-row" style="font-size: 11px;">
            <span>${order.quantity} Adet</span>
            <span class="bold">${order.total_price?.toLocaleString("tr-TR")} ₺</span>
          </div>
        </div>

        <div style="border-bottom: 1px dashed #000000; padding-bottom: 8px; margin-bottom: 8px; font-size: 11px;">
          <span class="bold" style="display: block; font-size: 10px; letter-spacing: 0.5px;">HAZIRLANIŞ / PAKETLEME TALİMATI:</span>
          <p style="margin: 4px 0 0 0; line-height: 1.3;" class="italic">
            ${preparationNoteText}
          </p>
        </div>

        <div class="flex-row" style="font-size: 13px; font-weight: bold; margin-top: 8px;">
          <span>GENEL TOPLAM:</span>
          <span>${order.total_price?.toLocaleString("tr-TR")} ₺</span>
        </div>

        <div class="text-center" style="margin-top: 16px; font-size: 10px; border-top: 1px dashed #000000; padding-top: 8px;">
          <p style="margin: 0;">Veritabanı Senkronize Çıktıdır.</p>
          <p style="margin: 2px 0 0 0; font-weight: bold;">Teşekkür Ederiz!</p>
        </div>

        <script>
          window.onload = function() {
            window.focus();
            window.print();
            setTimeout(function() { window.frameElement.remove(); }, 1000);
          };
        </script>
      </body>
      </html>
    `);
    doc.close();
  };

  const getStatusBadge = (order: SupabaseOrderRow) => {
    const status = order.status || "new";
    const config: Record<
      OrderStatus,
      { bg: string; label: string; icon: typeof Clock }
    > = {
      new: {
        bg: "bg-blue-50 text-blue-600 border-blue-100",
        label: "Yeni Sipariş",
        icon: Clock,
      },
      preparing: {
        bg: "bg-amber-50 text-amber-600 border-amber-100",
        label: "Hazırlanıyor",
        icon: Package,
      },
      shipped: {
        bg: "bg-purple-50 text-purple-600 border-purple-100",
        label: "Kargoda",
        icon: Truck,
      },
      completed: {
        bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
        label: "Tamamlandı",
        icon: CheckCircle2,
      },
    };

    const current = config[status] || config.new;
    const Icon = current.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${current.bg}`}
      >
        <Icon className="w-3 h-3" />
        {current.label}
      </span>
    );
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const currentStatus = order.status || "new";
      const matchesSearch =
        order.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toString().includes(searchQuery);

      const matchesTab =
        activeTab === "all" ? true : currentStatus === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [orders, searchQuery, activeTab]);

  const currentStatus = selectedOrder?.status || "new";

  return (
    <div className="space-y-8 relative">
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-slate-900 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-xl z-50 flex items-center gap-2 border border-slate-800">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          {toastMessage}
        </div>
      )}

      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-800 uppercase">
          Gelen Sipariş Envanteri
        </h2>
        <p className="text-slate-400 text-xs font-semibold mt-1">
          Sadece size ait olan, gerçek veri şemasına tam bağlı anlık mağaza
          sipariş ve paketleme takibi.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-slate-100/80 p-3 rounded-3xl shadow-xs">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "all", label: "Tüm Siparişler" },
            { id: "new", label: "Yeni" },
            { id: "preparing", label: "Hazırlananlar" },
            { id: "shipped", label: "Kargodakiler" },
            { id: "completed", label: "Tamamlananlar" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === tab.id ? "bg-purple-600 text-white shadow-md shadow-purple-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Ürün adı veya Sipariş ID ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
          />
        </div>
      </div>

      <Card className="p-0 border border-slate-100/80 bg-white rounded-[28px] overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400 font-bold text-xs gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-purple-600" /> Sipariş
            kayıtları taranıyor...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingBag className="w-8 h-8 text-slate-200 mb-2" />
            <h3 className="text-xs font-bold text-slate-600 uppercase">
              Sipariş Filtresi Boş
            </h3>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-180">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="py-4 px-6">Sipariş Detayı / Ürün</th>
                  <th className="py-4 px-4">Ödeme Kimliği (Intent)</th>
                  <th className="py-4 px-4">Tarih</th>
                  <th className="py-4 px-4">Miktar</th>
                  <th className="py-4 px-4 text-right">Toplam Tutar</th>
                  <th className="py-4 px-4">Durum</th>
                  <th className="py-4 px-6 text-center">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/40 transition-colors"
                  >
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                        {order.image_url && (
                          <img
                            src={order.image_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 leading-tight">
                          {order.product_name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                          Sipariş ID: #{order.id}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-500">
                      {order.payment_intent_id
                        ? order.payment_intent_id.substring(0, 14) + "..."
                        : "N/A"}
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      {new Date(order.order_date).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {order.quantity} Adet
                    </td>
                    <td className="py-4 px-4 font-black text-slate-900 text-right">
                      {order.total_price?.toLocaleString("tr-TR")} ₺
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(order)}</td>
                    <td className="py-4 px-6 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-purple-50 text-slate-500 hover:text-purple-600 rounded-xl transition-all cursor-pointer text-[11px] font-bold"
                      >
                        İncele & Hazırla
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end">
          <div className="flex-1" onClick={() => setSelectedOrder(null)} />

          <div className="w-full max-w-md bg-white h-screen border-l border-slate-100 flex flex-col justify-between shadow-2xl">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-black text-purple-600 font-mono block">
                  ID: #{selectedOrder.id}
                </span>
                <h3 className="text-sm font-black text-slate-800 uppercase mt-0.5">
                  Sipariş Paketleme Ekranı
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="flex items-center gap-4 py-2 border-b border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                  {selectedOrder.image_url && (
                    <img
                      src={selectedOrder.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">
                    Satın Alınan Ürün
                  </span>
                  <h4 className="text-sm font-black text-slate-800 leading-tight">
                    {selectedOrder.product_name}
                  </h4>
                  <span className="text-xs text-slate-600 font-bold block mt-1">
                    {selectedOrder.quantity} Adet x{" "}
                    {(
                      selectedOrder.total_price / selectedOrder.quantity
                    ).toLocaleString("tr-TR")}{" "}
                    ₺
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-4 h-4" />
                  <span className="text-xs font-bold">Müşteri ID:</span>
                  <span className="text-xs font-mono text-slate-500">
                    {selectedOrder.customer_id}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Hash className="w-4 h-4" />
                  <span className="text-xs font-bold">Ürün ID:</span>
                  <span className="text-xs font-mono text-slate-500">
                    {selectedOrder.product_id}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-bold">Sipariş Zamanı:</span>
                  <span className="text-xs font-mono text-slate-500">
                    {new Date(selectedOrder.order_date).toLocaleString("tr-TR")}
                  </span>
                </div>
              </div>

              {currentStatus !== "completed" && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    Süreç Yönetimi
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {currentStatus === "new" && (
                      <button
                        disabled={isUpdating}
                        onClick={() =>
                          handleUpdateStatus(selectedOrder.id, "preparing")
                        }
                        className="p-2.5 rounded-xl border bg-white border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer flex items-center justify-center gap-1 transition-all"
                      >
                        <Package className="w-3.5 h-3.5 text-amber-500" />{" "}
                        Hazırlanmaya Başla
                      </button>
                    )}

                    {(currentStatus === "new" ||
                      currentStatus === "preparing") && (
                      <button
                        disabled={isUpdating}
                        onClick={() =>
                          handleUpdateStatus(selectedOrder.id, "shipped")
                        }
                        className="p-2.5 rounded-xl border bg-white border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer flex items-center justify-center gap-1 transition-all"
                      >
                        <Truck className="w-3.5 h-3.5 text-purple-500" />{" "}
                        Kuryeye/Kargoya Teslim Et
                      </button>
                    )}
                  </div>

                  <button
                    disabled={isUpdating}
                    onClick={() =>
                      handleUpdateStatus(selectedOrder.id, "completed")
                    }
                    className="w-full mt-1 p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md disabled:bg-emerald-400 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Siparişi Tamamla
                    (Kapat)
                  </button>
                </div>
              )}

              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  Ürün Hazırlanış Detayı
                </span>
                <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-3.5 flex items-start gap-2">
                  <NotepadText className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div className="text-[11px]">
                    <span className="font-black text-purple-700 block uppercase tracking-wide text-[9px]">
                      Paketleme & Hazırlık Talimatı:
                    </span>
                    <p className="text-slate-600 font-semibold mt-1 italic leading-relaxed">
                      {currentStatus === "new"
                        ? "Sipariş henüz hazırlık aşamasına alınmadı."
                        : selectedOrder.preparation_note ||
                          "Özel talimat bulunmuyor."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase block">
                  Toplam Tahsilat
                </span>
                <span className="text-lg font-black text-slate-900">
                  {selectedOrder.total_price?.toLocaleString("tr-TR")} ₺
                </span>
              </div>
              <button
                type="button"
                onClick={() => handlePrintReceipt(selectedOrder)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-slate-50"
              >
                <Printer className="w-3.5 h-3.5" /> Fiş Yazdır
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandOrders;
