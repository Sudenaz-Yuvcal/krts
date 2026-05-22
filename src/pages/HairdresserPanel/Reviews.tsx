import React, { useState } from "react";
import { ReviewsSummary } from "../../sections/reviews/reviews-summary";
import { ReviewsList } from "../../sections/reviews/reviews-list";
import { ReviewsReplyModal } from "../../sections/reviews/reviews-reply-modal";

export const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState([
    {
      id: "rev-1",
      rating: 5,
      full_name: "Melisa Yılmaz",
      created_at: "2026-05-20T10:30:00Z",
      comment: "Harika bir renklendirme oldu!",
      review_image: null,
      reply_comment: "Teşekkürler!",
    },
    {
      id: "rev-2",
      rating: 2,
      full_name: "Buse Karaca",
      created_at: "2026-05-18T14:15:00Z",
      comment: "Çok bekledim.",
      review_image: null,
      reply_comment: null,
    },
  ]);

  const [statusFilter, setStatusFilter] = useState<
    "all" | "unreplied" | "replied"
  >("all");
  const [ratingFilter, setRatingFilter] = useState<"all" | "high" | "low">(
    "all",
  );
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [activeId, setActiveId] = useState<string | null>(null);

  const filteredReviews = reviews
    .filter(
      (r) =>
        (statusFilter === "all" ||
          (statusFilter === "replied" ? r.reply_comment : !r.reply_comment)) &&
        (ratingFilter === "all" ||
          (ratingFilter === "high" ? r.rating >= 4 : r.rating <= 3)),
    )
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

  const handleSendReply = (text: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === activeId ? { ...r, reply_comment: text } : r)),
    );
    setActiveId(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            Müşteri Yorumları
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Yorumları buradan yönetebilirsiniz.
          </p>
        </div>
      </div>

      <ReviewsSummary
        averageRating="4.8"
        totalReviews={reviews.length}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
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
