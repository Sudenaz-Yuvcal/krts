import { useState } from "react";
import { createPortal } from "react-dom"; 
import {
  Bell,
  Check,
  Calendar,
  MessageSquare,
  AlertTriangle,
  TrendingDown,
  ShoppingBag,
  X,
  ShieldAlert,
  HeadphonesIcon,
  Bot,
  Send,
  Phone,
  Star,
  User,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

interface NotificationItem {
  id: string;
  type:
    | "appointment"
    | "cancel"
    | "review"
    | "sale"
    | "stock"
    | "finance"
    | "report";
  text: string;
  time: string;
  isRead: boolean;
  day: "today" | "yesterday";
  date: string;
}

interface Message {
  sender: "bot" | "user";
  text: string;
  showSupportNumber?: boolean;
  showRating?: boolean;
  time: string;
}

export function Header() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n-1",
      type: "appointment",
      text: "Yeni randevu alındı: Melisa Y. (Fön & Kesim)",
      time: "10 dk önce",
      date: "22 Mayıs 2026",
      isRead: false,
      day: "today",
    },
    {
      id: "n-2",
      type: "cancel",
      text: "Randevu iptal edildi: Buse K. saat 15:30 randevusunu iptal etti.",
      time: "1 saat önce",
      date: "22 Mayıs 2026",
      isRead: false,
      day: "today",
    },
    {
      id: "n-3",
      type: "review",
      text: "Yeni yorum yapıldı: Ceren T. salonunuza 5 yıldız verdi.",
      time: "3 saat önce",
      date: "22 Mayıs 2026",
      isRead: false,
      day: "today",
    },
    {
      id: "n-4",
      type: "sale",
      text: "Ürün satıldı: 1 adet Keratin Şampuan satışı yapıldı.",
      time: "4 saat önce",
      date: "22 Mayıs 2026",
      isRead: true,
      day: "today",
    },
    {
      id: "n-5",
      type: "stock",
      text: "Kritik Stok Uyarı: Saç Açıcı Pudra stokta 2 adet kaldı!",
      time: "Dün",
      date: "21 Mayıs 2026",
      isRead: true,
      day: "yesterday",
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [isFullPageOpen, setIsFullPageOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "yesterday">(
    "all",
  );
  const [fullPanelFilter, setFullPanelFilter] = useState<
    "all" | "unread" | "read"
  >("all");

  // --- CANLI DESTEK & KRTS ASİSTAN STATE YAPISI ---
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [otherClickCount, setOtherClickCount] = useState(0);
  const [chatStep, setChatStep] = useState<
    "options" | "answered" | "rating" | "completed"
  >("options");

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Merhaba! Ben KRTS Akıllı Asistanı. Size yardımcı olmamı istediğiniz konuyu aşağıdaki hazır başlıklardan seçebilirsiniz:",
      time: getCurrentTime(),
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const filteredNotifications = notifications.filter(
    (n) => timeFilter === "all" || n.day === timeFilter,
  );
  const fullPanelNotifications = notifications.filter((n) => {
    if (fullPanelFilter === "unread") return !n.isRead;
    if (fullPanelFilter === "read") return n.isRead;
    return true;
  });

  const handleQuestionSelect = (question: string, type: "system" | "other") => {
    const userMsg: Message = {
      sender: "user",
      text: question,
      time: getCurrentTime(),
    };
    let botReplyText = "";
    let systemRequiresPhone = false;

    if (type === "other") {
      const newCount = otherClickCount + 1;
      setOtherClickCount(newCount);

      if (newCount >= 2) {
        botReplyText =
          "Aradığınız konuyu KRTS sisteminde bulamadık. Lütfen müşteri hizmetlerini arayabilirsiniz.";
        systemRequiresPhone = true;
      } else {
        botReplyText =
          "Diğer teknik konular için KRTS arka plan kontrolü yapılıyor. Yardımcı olmamı istediğiniz başka bir şey var mı?";
      }
    } else {
      switch (question) {
        case "Kasa ve Ödeme Entegrasyonu":
          botReplyText =
            "Kasa ve POS cihazı entegrasyonunuz aktif durumdadır. Günlük cironuzu finans panelinden anlık izleyebilirsiniz.";
          break;
        case "Personel ve Vardiya Ayarları":
          botReplyText =
            "Personelinizin çalışma saatlerini, izin günlerini ve prim oranlarını 'Çalışan Yönetimi' sekmesinden düzenleyebilirsiniz.";
          break;
        case "Stok & Ürün Yönetimi":
          botReplyText =
            "Ürünlerinizin kritik stok seviyesi altına düşmesi durumunda sistem size otomatik bildirim atacaktır. Envanter panelinden manuel ekleme yapabilirsiniz.";
          break;
        default:
          botReplyText =
            "Talebiniz KRTS sistemine kaydedildi. Yardımcı olmamı istediğiniz başka bir şey var mı?";
      }
    }

    setChatMessages((prev) => [
      ...prev,
      userMsg,
      {
        sender: "bot",
        text: botReplyText,
        showSupportNumber: systemRequiresPhone,
        time: getCurrentTime(),
      },
    ]);
    setChatStep("answered");
  };

  const handleFollowUp = (answer: "yes" | "no") => {
    if (answer === "yes") {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "user",
          text: "Evet, başka bir sorum var.",
          time: getCurrentTime(),
        },
        {
          sender: "bot",
          text: "Tabii ki, size yardımcı olabileceğim konuları tekrar aşağıya listeliyorum:",
          time: getCurrentTime(),
        },
      ]);
      setChatStep("options");
    } else {
      setChatMessages((prev) => [
        ...prev,
        { sender: "user", text: "Hayır, teşekkürler.", time: getCurrentTime() },
        {
          sender: "bot",
          text: "Harika! KRTS hizmet kalitesini değerlendirmek için bu görüşmeyi puanlayabilir misiniz?",
          showRating: true,
          time: getCurrentTime(),
        },
      ]);
      setChatStep("rating");
    }
  };

  const handleRatingSubmit = (score: number) => {
    setChatMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: `Değerlendirmeniz sisteme kaydedildi! (${score}/5 Yıldız). Başka bir sorunuz yoksa görüşmeyi sonlandırabilirsiniz.`,
        time: getCurrentTime(),
      },
    ]);
    setChatStep("completed");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return (
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Calendar className="w-4 h-4" />
          </div>
        );
      case "cancel":
        return (
          <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl">
            <X className="w-4 h-4" />
          </div>
        );
      case "review":
        return (
          <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl">
            <MessageSquare className="w-4 h-4" />
          </div>
        );
      case "sale":
        return (
          <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl">
            <ShoppingBag className="w-4 h-4" />
          </div>
        );
      case "stock":
        return (
          <div className="p-2.5 bg-orange-50 text-orange-500 rounded-xl">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      case "finance":
        return (
          <div className="p-2.5 bg-red-50 text-red-500 rounded-xl">
            <TrendingDown className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
            <Calendar className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <header className="h-24 bg-linear-to-b from-slate-50 to-slate-50/30 border-b border-slate-100/80 backdrop-blur-xs flex items-center justify-between px-12 z-20 relative">
      <div>
        <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase leading-none">
          Fiem Kuaför & Güzellik Salonu
        </h1>
        <p className="text-xs text-slate-400 font-bold tracking-widest mt-1 uppercase">
          Sistem Yönetim & Envanter Paneli
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            setIsAssistantOpen(true);
            setIsOpen(false);
          }}
          className="flex items-center gap-2 bg-white border border-slate-100 px-4 py-2 rounded-xl shadow-2xs hover:border-purple-200 hover:text-purple-600 transition-all group cursor-pointer h-11"
        >
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <HeadphonesIcon className="w-4 h-4" />
          </div>
          <span className="text-xs font-black text-slate-600 group-hover:text-purple-600 transition-colors">
            Canlı Destek & Asistan
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 bg-white rounded-xl border border-slate-100 shadow-2xs text-slate-400 hover:text-slate-700 transition-all relative cursor-pointer h-11 w-11 flex items-center justify-center"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-3 right-3 ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn">
              <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <span className="text-xs font-black text-slate-800">
                  Bildirimler ({unreadCount})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[10px] font-bold text-purple-600 hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <Check className="w-3 h-3" /> Tümünü Okundu Say
                  </button>
                )}
              </div>
              <div className="p-2 border-b border-slate-50 flex gap-1 bg-white">
                {["all", "today", "yesterday"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter as any)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer capitalize ${timeFilter === filter ? "bg-purple-50 text-purple-600" : "text-slate-400 hover:bg-slate-50"}`}
                  >
                    {filter === "all"
                      ? "Tümü"
                      : filter === "today"
                        ? "Bugün"
                        : "Dün"}
                  </button>
                ))}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50/60">
                {filteredNotifications.slice(0, 4).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif.id)}
                    className={`p-3.5 flex items-start gap-3 transition-all cursor-pointer hover:bg-slate-50/60 ${notif.isRead ? "opacity-45 bg-white" : "bg-purple-50/10"}`}
                  >
                    {getIcon(notif.type)}
                    <div className="flex-1 space-y-0.5">
                      <p className="text-[11px] font-semibold text-slate-700 leading-snug">
                        {notif.text}
                      </p>
                      <span className="text-[9px] text-slate-400 block font-medium">
                        {notif.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2.5 border-t border-slate-50 text-center bg-slate-50/30">
                <button
                  onClick={() => {
                    setIsFullPageOpen(true);
                    setIsOpen(false);
                  }}
                  className="w-full text-[11px] font-black text-slate-500 hover:text-purple-600 transition-all py-1.5 rounded-lg hover:bg-slate-100/60 cursor-pointer"
                >
                  Tümünü Gör
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isAssistantOpen &&
        createPortal(
          <div className="fixed inset-0 w-screen h-screen bg-slate-100 z-999999 flex flex-col md:flex-row overflow-hidden animate-fadeIn select-none left-0 top-0 right-0 bottom-0 m-0 p-0">
            <div className="w-full md:w-80 bg-purple-900 text-white p-6 flex flex-col justify-between shrink-0 border-r border-black/10">
              <div className="space-y-6">
                <button
                  onClick={() => setIsAssistantOpen(false)}
                  className="flex items-center gap-2 text-xs font-black bg-white/10 hover:bg-white/20 transition-all px-4 py-2.5 rounded-xl cursor-pointer w-full justify-center md:w-auto"
                >
                  <ArrowLeft className="w-4 h-4" /> Geri Dön
                </button>

                <div className="pt-2 text-center md:text-left">
                  <h2 className="text-xl font-black tracking-tight uppercase leading-tight">
                    KRTS PANEL
                  </h2>
                  <p className="text-[11px] text-purple-200 font-bold tracking-wider uppercase mt-0.5">
                    Akıllı Asistan Altyapısı
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-700 font-bold shadow-md">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black">KRTS Canlı Bot</h4>
                      <p className="text-[10px] text-emerald-300 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />{" "}
                        Çevrimiçi Modül
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-purple-100/80 leading-normal font-medium">
                    Salon otomasyonu, kasa ve vardiya sorularınıza anlık
                    otomatik yanıtlar hazırlar.
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 text-[11px] text-purple-200/60 font-bold border-t border-white/10 pt-4">
                <ShieldCheck className="w-4 h-4" /> KRTS Altyapısı ile
                Korunmaktadır
              </div>
            </div>

            <div className="flex-1 flex flex-col h-full bg-[#f4f2f7] overflow-hidden">
              <div className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center shadow-xs shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-purple-600 text-white rounded-full flex items-center justify-center font-black text-xs shadow-xs">
                    KRTS
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-800">
                      KRTS Asistanı
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold">
                      Hazır ve otomatik cevap sistemi
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAssistantOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 bg-[radial-gradient(#e1dbec_1px,transparent_1px)] background-size:[16px_16px]">
                <div className="max-w-3xl mx-auto space-y-6">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex items-end gap-3 max-w-xl ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto flex-row"}`}
                    >
                      {msg.sender === "bot" ? (
                        <div className="w-8 h-8 bg-purple-700 text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0 shadow-2xs">
                          AI
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-slate-700 text-white rounded-full flex items-center justify-center shrink-0 shadow-2xs">
                          <User className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`relative rounded-2xl p-4 text-xs font-semibold leading-relaxed shadow-xs ${
                          msg.sender === "user"
                            ? "bg-[#ebdffd] text-purple-950 rounded-tr-none border border-[#decbfa]"
                            : "bg-white text-slate-700 border border-slate-200/60 rounded-tl-none"
                        }`}
                      >
                        <p className="pr-12">{msg.text}</p>

                        <span className="text-[9px] text-slate-400 font-medium absolute bottom-1 right-2 block">
                          {msg.time}
                        </span>

                        {msg.showSupportNumber && (
                          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-xl flex flex-col sm:flex-row items-center justify-between font-bold gap-3 text-slate-800">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-purple-600" />
                              <span className="text-xs font-black text-purple-900">
                                Müşteri Hizmetleri: 0850 305 45 45
                              </span>
                            </div>
                            <a
                              href="tel:08503054545"
                              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-black px-4 py-2 rounded-xl transition-colors text-center shadow-2xs"
                            >
                              Hemen Ara
                            </a>
                          </div>
                        )}

                        {msg.showRating && (
                          <div className="mt-3 flex justify-center gap-3 border-t border-slate-100 pt-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => handleRatingSubmit(star)}
                                className="text-slate-300 hover:text-amber-500 p-1 transition-colors cursor-pointer group"
                              >
                                <Star className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-200 shrink-0 flex justify-center w-full">
                <div className="w-full max-w-3xl bg-white p-5 rounded-2xl shadow-xs border border-slate-200/60">
                  {chatStep === "options" && (
                    <div className="space-y-3">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block text-center mb-1">
                        Lütfen sormak istediğiniz hazır konu başlığını seçiniz:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          "Kasa ve Ödeme Entegrasyonu",
                          "Personel ve Vardiya Ayarları",
                          "Stok & Ürün Yönetimi",
                        ].map((q) => (
                          <button
                            key={q}
                            onClick={() => handleQuestionSelect(q, "system")}
                            className="text-left bg-slate-50 border border-slate-200 hover:border-purple-600 hover:bg-purple-50/20 text-slate-700 text-xs font-bold py-2.5 px-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
                          >
                            <span>{q}</span>
                            <Send className="w-3 h-3 text-slate-300 group-hover:text-purple-600 transition-colors" />
                          </button>
                        ))}
                        <button
                          onClick={() =>
                            handleQuestionSelect(
                              "Sistem Dışı Diğer Sorunlar",
                              "other",
                            )
                          }
                          className="text-left bg-slate-50 border border-slate-200 hover:border-purple-400 hover:bg-purple-50/20 text-slate-600 text-xs font-bold py-2.5 px-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group sm:col-span-2"
                        >
                          <span className="text-purple-700 font-black">
                            Diğer Teknik Destek Talepleri (Müşteri Hizmetleri)
                          </span>
                          <Send className="w-3 h-3 text-slate-300 group-hover:text-purple-600 transition-colors" />
                        </button>
                      </div>
                    </div>
                  )}

                  {chatStep === "answered" && (
                    <div className="space-y-3 text-center">
                      <span className="text-[11px] text-slate-500 font-black uppercase tracking-wider block">
                        Yardımcı olmamı istediğiniz başka bir şey var mı?
                      </span>
                      <div className="flex gap-3 max-w-md mx-auto">
                        <button
                          onClick={() => handleFollowUp("yes")}
                          className="flex-1 bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white text-xs font-black py-2.5 rounded-xl transition-all border border-purple-200 cursor-pointer"
                        >
                          Evet, Var
                        </button>
                        <button
                          onClick={() => handleFollowUp("no")}
                          className="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-black py-2.5 rounded-xl transition-all border border-slate-300 cursor-pointer"
                        >
                          Hayır, Teşekkürler
                        </button>
                      </div>
                    </div>
                  )}

                  {chatStep === "completed" && (
                    <div className="text-center">
                      <button
                        onClick={() => {
                          setIsAssistantOpen(false);
                          setChatStep("options");
                          setOtherClickCount(0);
                          setChatMessages([
                            {
                              sender: "bot",
                              text: "Merhaba! Ben KRTS Akıllı Asistanı. Size yardımcı olmamı istediğiniz konuyu aşağıdaki hazır başlıklardan seçebilirsiniz:",
                              time: getCurrentTime(),
                            },
                          ]);
                        }}
                        className="bg-purple-900 hover:bg-purple-800 text-white text-xs font-black py-3 px-8 rounded-xl transition-all cursor-pointer inline-block shadow-2xs"
                      >
                        KRTS Görüşmesini Kapat ve Panele Dön
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body, 
        )}

      {isFullPageOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex justify-end z-99999 p-6 animate-fadeIn">
          <div className="w-full max-w-4xl bg-white h-full rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-slideLeft">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">
                    Tüm Bildirim Geçmişi
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Salonunuzdaki hareketlerin filtreli ve detaylı tam listesi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFullPageOpen(false)}
                className="p-2 hover:bg-slate-200/60 rounded-xl text-slate-400 hover:text-slate-700 transition-all cursor-pointer border border-slate-200/40 bg-white shadow-2xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between text-xs font-bold">
              <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/40 w-full sm:w-auto">
                <button
                  onClick={() => setFullPanelFilter("all")}
                  className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${fullPanelFilter === "all" ? "bg-white text-purple-600 shadow-xs" : "text-slate-500"}`}
                >
                  Tümü ({notifications.length})
                </button>
                <button
                  onClick={() => setFullPanelFilter("unread")}
                  className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${fullPanelFilter === "unread" ? "bg-white text-rose-500 shadow-xs" : "text-slate-500"}`}
                >
                  Okunmamış ({notifications.filter((n) => !n.isRead).length})
                </button>
                <button
                  onClick={() => setFullPanelFilter("read")}
                  className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${fullPanelFilter === "read" ? "bg-white text-emerald-600 shadow-xs" : "text-slate-500"}`}
                >
                  Okunanlar
                </button>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-600 px-4 py-2 rounded-xl transition-all border border-purple-100 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Check className="w-4 h-4" /> Tümünü Okundu İşaretle
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-slate-50/30">
              {fullPanelNotifications.length === 0 ? (
                <div className="text-center py-24 text-sm font-medium text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                  <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto mb-2" />{" "}
                  Bildirim kaydı bulunamadı.
                </div>
              ) : (
                fullPanelNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif.id)}
                    className={`p-4 rounded-2xl border border-slate-100/70 shadow-2xs flex items-center justify-between gap-4 transition-all cursor-pointer bg-white hover:border-purple-200 ${notif.isRead ? "opacity-50" : "border-l-2 border-l-purple-600"}`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {getIcon(notif.type)}
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-700">
                          {notif.text}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                          <span>{notif.date}</span>
                          <span>•</span>
                          <span>{notif.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
