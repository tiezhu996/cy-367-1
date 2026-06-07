import { useState } from "react";
import type { Announcement } from "../types";

interface AnnouncementSidebarProps {
  announcements: Announcement[];
  limit?: number;
  onViewAll?: () => void;
}

export function AnnouncementSidebar({
  announcements,
  limit = 3,
  onViewAll,
}: AnnouncementSidebarProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const validAnnouncements = announcements
    .filter(
      (a) =>
        a.status === "published" &&
        a.validFrom <= today &&
        a.validTo >= today
    )
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, limit);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getDaysRemaining = (validTo: string) => {
    const end = new Date(validTo);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "今天到期";
    if (diffDays === 1) return "明天到期";
    return `${diffDays}天后到期`;
  };

  if (validAnnouncements.length === 0) {
    return null;
  }

  return (
    <aside className="announcement-sidebar">
      <div className="hero-panel" style={{ padding: "20px" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-accent"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            最新公告
          </h3>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-sm text-accent font-bold hover:underline"
            >
              查看全部
            </button>
          )}
        </div>

        <div className="space-y-3">
          {validAnnouncements.map((announcement) => (
            <article
              key={announcement.id}
              className="sidebar-announcement-item p-3 rounded-lg border border-ink/10 bg-paper/60 hover:bg-paper transition-colors cursor-pointer"
              onClick={() =>
                setExpandedId(expandedId === announcement.id ? null : announcement.id)
              }
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {announcement.isPinned && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-accent/20 text-accent font-bold">
                        置顶
                      </span>
                    )}
                    <h4 className="font-bold text-sm truncate">
                      {announcement.title}
                    </h4>
                  </div>

                  {expandedId === announcement.id ? (
                    <p className="text-xs text-ink/75 leading-relaxed mt-2">
                      {announcement.content}
                    </p>
                  ) : (
                    <p className="text-xs text-ink/60 line-clamp-1">
                      {announcement.content}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-ink/50">
                      {formatDate(announcement.createdAt)}
                    </span>
                    <span
                      className={`font-medium ${
                        getDaysRemaining(announcement.validTo).includes("今天") ||
                        getDaysRemaining(announcement.validTo).includes("明天")
                          ? "text-red"
                          : "text-ink/50"
                      }`}
                    >
                      {getDaysRemaining(announcement.validTo)}
                    </span>
                  </div>
                </div>

                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`text-ink/40 transition-transform flex-shrink-0 mt-1 ${
                    expandedId === announcement.id ? "rotate-180" : ""
                  }`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </article>
          ))}
        </div>

        {validAnnouncements.length >= limit && onViewAll && (
          <button
            onClick={onViewAll}
            className="w-full mt-4 py-2 text-sm text-center text-accent font-bold border border-accent/30 rounded-md hover:bg-accent/5 transition-colors"
          >
            查看全部公告 →
          </button>
        )}
      </div>
    </aside>
  );
}
