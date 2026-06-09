import { Card } from "../../components/ui/Card";
import {
  Award,
  BarChart3,
  Filter,
  ChevronDown,
  Calendar,
  Star,
  MessageSquare,
} from "lucide-react";
import React from "react";

interface SummaryProps {
  averageRating: string;
  totalReviews: number;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  ratingFilter: string;
  setRatingFilter: (val: string) => void;
  sortOrder: string;
  setSortOrder: (val: string) => void;
}

export const ReviewsSummary = ({
  averageRating,
  totalReviews,
  statusFilter,
  setStatusFilter,
  ratingFilter,
  setRatingFilter,
  sortOrder,
  setSortOrder,
}: SummaryProps) => {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4 flex items-center justify-between border border-slate-100/80 bg-white shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-amber-50/60 rounded-xl text-amber-500">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Salon Ortalaması
              </span>
              <span className="text-xl font-black text-slate-800 mt-0.5 block">
                {averageRating}{" "}
                <span className="text-xs text-slate-400 font-normal">
                  / 5.0
                </span>
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between border border-slate-100/80 bg-white shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-purple-50/60 rounded-xl text-purple-500">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Toplam Yorum
              </span>
              <span className="text-xl font-black text-slate-800 mt-0.5 block">
                {totalReviews}{" "}
                <span className="text-xs text-slate-400 font-normal">Adet</span>
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-3 bg-slate-50/60 border border-slate-100 rounded-xl">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold self-start sm:self-center pl-1">
          <Filter className="w-3.5 h-3.5 text-brand-purple" />
          <span>Yorumları Filtrele</span>
        </div>

        <div className="grid grid-cols-1 sm:flex gap-2 w-full sm:w-auto">
          <div className="relative flex items-center">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto text-xs font-semibold text-slate-600 bg-white pl-9 pr-8 py-2 rounded-xl border border-slate-200/80 focus:outline-none focus:border-brand-purple appearance-none shadow-2xs cursor-pointer transition-all"
            >
              <option value="all">Tüm Yorumlar</option>
              <option value="unreplied"> Yanıt Bekleyenler</option>
              <option value="replied"> Yanıtlananlar</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-3 pointer-events-none" />
          </div>

          <div className="relative flex items-center">
            <Star className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              value={ratingFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRatingFilter(e.target.value)}
              className="w-full sm:w-auto text-xs font-semibold text-slate-600 bg-white pl-9 pr-8 py-2 rounded-xl border border-slate-200/80 focus:outline-none focus:border-brand-purple appearance-none shadow-2xs cursor-pointer transition-all"
            >
              <option value="all">Tüm Puanlar</option>
              <option value="high"> Yüksek Puanlar (4-5)</option>
              <option value="low"> Düşük Puanlar (1-3)</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-3 pointer-events-none" />
          </div>

          <div className="relative flex items-center">
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              value={sortOrder}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortOrder(e.target.value)}
              className="w-full sm:w-auto text-xs font-semibold text-slate-600 bg-white pl-9 pr-8 py-2 rounded-xl border border-slate-200/80 focus:outline-none focus:border-brand-purple appearance-none shadow-2xs cursor-pointer transition-all"
            >
              <option value="newest">En Yeni Yorumlar</option>
              <option value="oldest">En Eski Yorumlar</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-3 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};