import { useState, useEffect, useMemo } from "react";
import { ReviewsSummary } from "../../sections/reviews/reviews-summary";
import { ReviewsList } from "../../sections/reviews/reviews-list";
import { ReviewsReplyModal } from "../../sections/reviews/reviews-reply-modal";
import { supabase } from "../../lib/supabaseClient";
import type { ReviewItem, ReviewStatusFilter, ReviewRatingFilter, ReviewSortOrder } from "../../types/salon";
import { Loader2 } from "lucide-react";

const SALON_ID = "c719841b-0da9-4545-b510-c1d8f97a4890";

export const Reviews = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [statusFilter, setStatusFilter] = useState<ReviewStatusFilter>("all");
  const [ratingFilter, setRatingFilter] = useState<ReviewRatingFilter>("all");
  const [sortOrder, setSortOrder] = useState<ReviewSortOrder>("newest");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("salon_id", SALON_ID);

      if (error) throw error;

      if (data) {
        const formatted: ReviewItem[] = data.map((r) => ({
          id: r.id.toString(),
          rating: r.rating,
          full_name: r.full_name || "Gizli Kullanıcı",
          created_at: r.created_at,
          comment: r.comment || "",
          review_image: r.review_image || null,
          reply_comment: r.reply_comment || null,
        }));
        setReviews(formatted);
      }
    } catch (err) {
      console.error("Yorumlar yüklenirken hata oluştu:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (text: string) => {
    if (!activeId) return;
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ reply_comment: text })
        .eq("id", activeId);

      if (error) throw error;

      setReviews((prev) =>
        prev.map((r) => (r.id === activeId ? { ...r, reply_comment: text } : r)),
      );
      setActiveId(null);
    } catch (err) {
      console.error("Yorum yanıtlanırken hata oluştu:", err);
      alert("Yanıt kaydedilirken bir hata oluştu.");
    }
  };

  const filteredReviews = reviews
    .filter(
      (r) =>
        (statusFilter === "all" || (statusFilter === "replied" ? r.reply_comment : !r.reply_comment)) &&
        (ratingFilter === "all" || (ratingFilter === "high" ? r.rating >= 4 : r.rating <= 3)),
    )
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return "0.0";
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col justify-center items-center gap-2 text-slate-400 font-semibold text-xs tracking-widest">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        <span>YORUMLAR YÜKLENİYOR...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Müşteri Yorumları</h3>
          <p className="text-xs text-slate-400 mt-0.5">Yorumları buradan yönetebilirsiniz.</p>
        </div>
      </div>

      <ReviewsSummary
        averageRating={averageRating}
        totalReviews={reviews.length}
        statusFilter={statusFilter}
        setStatusFilter={(val) => setStatusFilter(val as ReviewStatusFilter)}
        ratingFilter={ratingFilter}
        setRatingFilter={(val) => setRatingFilter(val as ReviewRatingFilter)}
        sortOrder={sortOrder}
        setSortOrder={(val) => setSortOrder(val as ReviewSortOrder)}
      />

      <ReviewsList reviews={filteredReviews} onReplyClick={setActiveId} />

      {activeId && (
        <ReviewsReplyModal
          reviewComment={reviews.find((r) => r.id === activeId)?.comment || ""}
          onClose={() => setActiveId(null)}
          onSend={handleSendReply}
        />
      )}
    </div>
  );
};