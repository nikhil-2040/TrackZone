import React from "react";
import { 
  MapPin, 
  Calendar, 
  Sparkles, 
  Send, 
  UserCheck, 
  Lock, 
  PackageSearch,
  Tag as TagIcon
} from "lucide-react";

const formatDate = (value) => {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};

const ItemCard = ({ item, onContact, isOwner, isLogged, hideActions }) => {
  const imageSrc = item.imageData || item.imageUrl || "";
  const isLost = item.status?.toLowerCase() === "lost";

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      
      {/* Media Box */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100/80 text-slate-400">
            <PackageSearch className="w-9 h-9 stroke-[1.5] text-slate-300 mb-1.5" />
            <span className="text-xs font-medium text-slate-400">No reference photo</span>
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-2xs border ${
              isLost
                ? "bg-rose-500/90 text-white border-rose-400/30"
                : "bg-emerald-600/90 text-white border-emerald-400/30"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="capitalize">{item.status || "Item"}</span>
          </span>

          {/* Match Score Badge (if smart match was run) */}
          {item.matchScore !== undefined && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-600/90 text-white backdrop-blur-md border border-indigo-400/30 shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{Math.round(item.matchScore * 100)}% match</span>
            </span>
          )}

          {/* Category Chip (if no match score) */}
          {item.matchScore === undefined && item.category && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/90 text-slate-700 backdrop-blur-md border border-slate-200/80 shadow-2xs">
              <TagIcon className="w-2.5 h-2.5 text-slate-400" />
              <span>{item.category}</span>
            </span>
          )}
        </div>
      </div>

      {/* Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 leading-snug">
            {item.title}
          </h3>

          {/* Description */}
          <p className="mt-1.5 text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {item.description || "No description provided for this item."}
          </p>
        </div>

        {/* Metadata & Actions */}
        <div className="mt-4 pt-3.5 border-t border-slate-100/90 flex flex-col gap-3">
          
          {/* Metadata Row: Date & Location */}
          <div className="flex items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{formatDate(item.lostDate || item.createdAt)}</span>
            </div>

            {item.location && (
              <div className="flex items-center gap-1 text-slate-600 font-medium max-w-[140px] truncate" title={item.location}>
                <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="truncate">{item.location}</span>
              </div>
            )}
          </div>

          {/* Action Row */}
          {!hideActions && (
            <div className="pt-1">
              {isOwner ? (
                <div className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>You posted this</span>
                </div>
              ) : isLogged ? (
                <button
                  type="button"
                  onClick={onContact}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs hover:shadow transition-all duration-150 active:scale-[0.98] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Share Contact</span>
                </button>
              ) : (
                <div className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-slate-300" />
                  <span>Log in to contact</span>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </article>
  );
};

export default ItemCard;
