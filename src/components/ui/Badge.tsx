interface BadgeProps {
  type:
    | "Yaklaşan"
    | "Tamamlandı"
    | "İptal"
    | "Blocked"
    | "Released"
    | "Refunded";
}

export function Badge({ type }: BadgeProps) {
  const styles: Record<string, string> = {
    Yaklaşan: "bg-indigo-50 text-indigo-600",
    Tamamlandı: "bg-emerald-50 text-emerald-600",
    İptal: "bg-red-50 text-red-600",
    Blocked: "bg-amber-50 text-amber-600 border border-amber-200/50",
    Released: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
    Refunded: "bg-slate-100 text-slate-500",
  };

  const labels: Record<string, string> = {
    Yaklaşan: "Yaklaşan",
    Tamamlandı: "Tamamlandı",
    İptal: "İptal Edildi",
    Blocked: "Havuzda Bloke",
    Released: "Hesaba Aktarıldı",
    Refunded: "İade Edildi",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${styles[type]}`}
    >
      {labels[type]}
    </span>
  );
}
