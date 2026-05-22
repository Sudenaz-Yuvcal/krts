import React from "react";
import { Card } from "../../components/ui/Card";
import {
  Star,
  MessageSquare,
  CornerDownRight,
  MessageCircle,
  Calendar,
} from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  review_image: string | null;
  reply_comment: string | null;
  created_at: string;
  full_name: string;
}

interface ListProps {
  reviews: Review[];
  onReplyClick: (id: string) => void;
}

export const ReviewsList: React.FC<ListProps> = ({ reviews, onReplyClick }) => {
  const maskName = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length < 2) return fullName;
    return `${parts.slice(0, -1).join(" ")} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <div className="text-center py-12 text-sm font-medium text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          Kriterlere uygun yorum bulunamadı.
        </div>
      ) : (
        reviews.map((rev) => (
          <Card key={rev.id} className="space-y-3 p-5 border border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-800 tracking-tight">
                {maskName(rev.full_name)}
              </h4>
              <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100/60 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {formatDate(rev.created_at)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                  />
                ))}
              </div>
              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded-md border uppercase tracking-wider ${rev.reply_comment ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-rose-500 bg-rose-50 border-rose-100"}`}
              >
                {rev.reply_comment ? "Cevaplandı" : "Cevap Bekliyor"}
              </span>
            </div>

            {rev.comment && (
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100/60 flex gap-2.5 italic">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />{" "}
                "{rev.comment}"
              </p>
            )}

            {rev.reply_comment ? (
              <div className="flex gap-2.5 bg-purple-50/40 p-3.5 rounded-xl border border-purple-100/40 ml-4 shadow-xs">
                <CornerDownRight className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-black text-brand-purple block uppercase tracking-wider">
                    Salonun Cevabı
                  </span>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {rev.reply_comment}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => onReplyClick(rev.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-brand-purple bg-purple-50 hover:bg-brand-purple hover:text-white px-4 py-2 rounded-xl transition-all cursor-pointer border border-purple-100 shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Cevap Yaz
                </button>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );
};
