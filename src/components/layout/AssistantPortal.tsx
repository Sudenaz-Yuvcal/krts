import { useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Bot, ShieldCheck, X, User, Phone, Star, Send } from "lucide-react";

interface Message {
  sender: "bot" | "user";
  text: string;
  showSupportNumber?: boolean;
  showRating?: boolean;
  time: string;
}

interface AssistantPortalProps {
  onClose: () => void;
}

export function AssistantPortal({ onClose }: AssistantPortalProps) {
  const [otherClickCount, setOtherClickCount] = useState(0);
  const [chatStep, setChatStep] = useState<"options" | "answered" | "rating" | "completed">("options");

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  };

  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Merhaba! Ben KRTS Akıllı Asistanı. Size yardımcı olmamı istediğiniz konuyu aşağıdaki hazır başlıklardan seçebilirsiniz:",
      time: getCurrentTime(),
    },
  ]);

  const handleQuestionSelect = (question: string, type: "system" | "other") => {
    const userMsg: Message = { sender: "user", text: question, time: getCurrentTime() };
    let botReplyText = "";
    let systemRequiresPhone = false;

    if (type === "other") {
      const newCount = otherClickCount + 1;
      setOtherClickCount(newCount);

      if (newCount >= 2) {
        botReplyText = "Aradığınız konuyu KRTS sisteminde bulamadık. Lütfen müşteri hizmetlerini arayabilirsiniz.";
        systemRequiresPhone = true;
      } else {
        botReplyText = "Diğer teknik konular için KRTS arka plan kontrolü yapılıyor. Yardımcı olmamı istediğiniz başka bir şey var mı?";
      }
    } else {
      switch (question) {
        case "Kasa ve Ödeme Entegrasyonu":
          botReplyText = "Kasa ve POS cihazı entegrasyonunuz aktif durumdadır. Günlük cironuzu finans panelinden anlık izleyebilirsiniz.";
          break;
        case "Personel ve Vardiya Ayarları":
          botReplyText = "Personelinizin çalışma saatlerini, izin günlerini ve prim oranlarını 'Çalışan Yönetimi' sekmesinden düzenleyebilirsiniz.";
          break;
        case "Stok & Ürün Yönetimi":
          botReplyText = "Ürünlerinizin kritik stok seviyesi altına düşmesi durumunda sistem size otomatik bildirim atacaktır. Envanter panelinden manuel ekleme yapabilirsiniz.";
          break;
        default:
          botReplyText = "Talebiniz KRTS sistemine kaydedildi. Yardımcı olmamı istediğiniz başka bir şey var mı?";
      }
    }

    setChatMessages(prev => [...prev, userMsg, { sender: "bot", text: botReplyText, showSupportNumber: systemRequiresPhone, time: getCurrentTime() }]);
    setChatStep("answered");
  };

  const handleFollowUp = (answer: "yes" | "no") => {
    if (answer === "yes") {
      setChatMessages(prev => [...prev, { sender: "user", text: "Evet, başka bir sorum var.", time: getCurrentTime() }, { sender: "bot", text: "Tabii ki, size yardımcı olabileceğim konuları tekrar aşağıya listeliyorum:", time: getCurrentTime() }]);
      setChatStep("options");
    } else {
      setChatMessages(prev => [...prev, { sender: "user", text: "Hayır, teşekkürler.", time: getCurrentTime() }, { sender: "bot", text: "Harika! KRTS hizmet kalitesini değerlendirmek için bu görüşmeyi puanlayabilir misiniz?", showRating: true, time: getCurrentTime() }]);
      setChatStep("rating");
    }
  };

  const handleRatingSubmit = (score: number) => {
    setChatMessages(prev => [...prev, { sender: "bot", text: `Değerlendirmeniz sisteme kaydedildi! (${score}/5 Yıldız). Başka bir sorunuz yoksa görüşmeyi sonlandırabilirsiniz.`, time: getCurrentTime() }]);
    setChatStep("completed");
  };

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen bg-slate-100 z-999999 flex flex-col md:flex-row overflow-hidden left-0 top-0 right-0 bottom-0 m-0 p-0">
      <div className="w-full md:w-80 bg-purple-900 text-white p-6 flex flex-col justify-between shrink-0 border-r border-black/10">
        <div className="space-y-6">
          <button onClick={onClose} className="flex items-center gap-2 text-xs font-black bg-white/10 hover:bg-white/20 transition-all px-4 py-2.5 rounded-xl cursor-pointer w-full justify-center md:w-auto">
            <ArrowLeft className="w-4 h-4" /> Geri Dön
          </button>
          <div className="pt-2 text-center md:text-left">
            <h2 className="text-xl font-black tracking-tight uppercase leading-tight">KRTS PANEL</h2>
            <p className="text-[11px] text-purple-200 font-bold tracking-wider uppercase mt-0.5">Akıllı Asistan Altyapısı</p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-700 font-bold shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black">KRTS Canlı Bot</h4>
                <p className="text-[10px] text-emerald-300 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Çevrimiçi Modül
                </p>
              </div>
            </div>
            <p className="text-[11px] text-purple-100/80 leading-normal font-medium">Salon otomasyonu, kasa ve vardiya sorularınıza anlık otomatik yanıtlar hazırlar.</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[11px] text-purple-200/60 font-bold border-t border-white/10 pt-4">
          <ShieldCheck className="w-4 h-4" /> KRTS Altyapısı ile Korunmaktadır
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full bg-[#f4f2f7] overflow-hidden">
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center shadow-xs shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-600 text-white rounded-full flex items-center justify-center font-black text-xs shadow-xs">KRTS</div>
            <div>
              <h3 className="text-xs font-black text-slate-800">KRTS Asistanı</h3>
              <p className="text-[10px] text-slate-400 font-bold">Hazır ve otomatik cevap sistemi</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 bg-[radial-gradient(#e1dbec_1px,transparent_1px)] bg-size-[16px_16px]">
          <div className="max-w-3xl mx-auto space-y-6">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex items-end gap-3 max-w-xl ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto flex-row"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 shadow-xs ${msg.sender === "bot" ? "bg-purple-700 text-white" : "bg-slate-700 text-white"}`}>
                  {msg.sender === "bot" ? "AI" : <User className="w-4 h-4" />}
                </div>
                <div className={`relative rounded-2xl p-4 text-xs font-semibold leading-relaxed shadow-xs ${msg.sender === "user" ? "bg-[#ebdffd] text-purple-950 rounded-tr-none border border-[#decbfa]" : "bg-white text-slate-700 border border-slate-200/60 rounded-tl-none"}`}>
                  <p className="pr-12">{msg.text}</p>
                  <span className="text-[9px] text-slate-400 font-medium absolute bottom-1 right-2 block">{msg.time}</span>
                  
                  {msg.showSupportNumber && (
                    <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-xl flex flex-col sm:flex-row items-center justify-between font-bold gap-3 text-slate-800">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-black text-purple-900">Müşteri Hizmetleri: 0850 305 45 45</span>
                      </div>
                      <a href="tel:08503054545" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-black px-4 py-2 rounded-xl transition-colors text-center shadow-xs">Hemen Ara</a>
                    </div>
                  )}

                  {msg.showRating && (
                    <div className="mt-3 flex justify-center gap-3 border-t border-slate-100 pt-3">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} onClick={() => handleRatingSubmit(star)} className="text-slate-300 hover:text-amber-500 p-1 transition-colors cursor-pointer group">
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
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block text-center mb-1">Lütfen sormak istediğiniz hazır konu başlığını seçiniz:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {["Kasa ve Ödeme Entegrasyonu", "Personel ve Vardiya Ayarları", "Stok & Ürün Yönetimi"].map(q => (
                    <button key={q} onClick={() => handleQuestionSelect(q, "system")} className="text-left bg-slate-50 border border-slate-200 hover:border-purple-600 hover:bg-purple-50/20 text-slate-700 text-xs font-bold py-2.5 px-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group">
                      <span>{q}</span><Send className="w-3 h-3 text-slate-300 group-hover:text-purple-600 transition-colors" />
                    </button>
                  ))}
                  <button onClick={() => handleQuestionSelect("Sistem Dışı Diğer Sorunlar", "other")} className="text-left bg-slate-50 border border-slate-200 hover:border-purple-400 hover:bg-purple-50/20 text-slate-600 text-xs font-bold py-2.5 px-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group sm:col-span-2">
                    <span className="text-purple-700 font-black">Diğer Teknik Destek Talepleri (Müşteri Hizmetleri)</span>
                    <Send className="w-3 h-3 text-slate-300 group-hover:text-purple-600 transition-colors" />
                  </button>
                </div>
              </div>
            )}

            {chatStep === "answered" && (
              <div className="space-y-3 text-center">
                <span className="text-[11px] text-slate-500 font-black uppercase tracking-wider block">Yardımcı olmamı istediğiniz başka bir şey var mı?</span>
                <div className="flex gap-3 max-w-md mx-auto">
                  <button onClick={() => handleFollowUp("yes")} className="flex-1 bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white text-xs font-black py-2.5 rounded-xl transition-all border border-purple-200 cursor-pointer">Evet, Var</button>
                  <button onClick={() => handleFollowUp("no")} className="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-black py-2.5 rounded-xl transition-all border border-slate-300 cursor-pointer">Hayır, Teşekkürler</button>
                </div>
              </div>
            )}

            {chatStep === "completed" && (
              <div className="text-center">
                <button
                  onClick={() => {
                    onClose();
                    setChatStep("options");
                    setOtherClickCount(0);
                    setChatMessages([{ sender: "bot", text: "Merhaba! Ben KRTS Akıllı Asistanı. Size yardımcı olmamı istediğiniz konuyu aşağıdaki hazır başlıklardan seçebilirsiniz:", time: getCurrentTime() }]);
                  }}
                  className="bg-purple-900 hover:bg-purple-800 text-white text-xs font-black py-3 px-8 rounded-xl transition-all cursor-pointer inline-block shadow-xs"
                >
                  KRTS Görüşmesini Kapat ve Panele Dön
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}