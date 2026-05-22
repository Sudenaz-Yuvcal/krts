import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { MessageCircle, X, Send } from "lucide-react";

interface ModalProps {
  reviewComment: string;
  onClose: () => void;
  onSend: (text: string) => void;
}

export const ReviewsReplyModal: React.FC<ModalProps> = ({
  reviewComment,
  onClose,
  onSend,
}) => {
  const [text, setText] = useState("");

  const handleTextChange = (val: string) => {
    let filtered = val;
    if (filtered.startsWith(" ")) filtered = filtered.trimStart();
    filtered = filtered.replace(/ {2,}/g, " ");
    setText(filtered);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <Card className="w-full max-w-lg p-6 space-y-4 shadow-2xl border border-slate-100 animate-scaleUp">
        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-brand-purple" />
            <h4 className="text-sm font-black text-slate-800">Cevap Yaz</h4>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-slate-500 italic">
          "{reviewComment}"
        </div>
        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Yanıtınızı buraya yazın..."
          className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple bg-slate-50/10 min-h-25"
          rows={3}
        />
        <div className="flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl cursor-pointer"
          >
            Vazgeç
          </button>
          <Button
            onClick={() => onSend(text)}
            disabled={!text.trim()}
            className="bg-brand-purple text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" /> Gönder
          </Button>
        </div>
      </Card>
    </div>
  );
};
