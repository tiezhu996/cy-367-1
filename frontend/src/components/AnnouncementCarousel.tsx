import { useState, useEffect, useCallback } from "react";
import type { Announcement } from "../types";

interface AnnouncementCarouselProps {
  announcements: Announcement[];
  autoPlay?: boolean;
  interval?: number;
}

export function AnnouncementCarousel({
  announcements,
  autoPlay = true,
  interval = 5000,
}: AnnouncementCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const validAnnouncements = announcements.filter((a) => {
    const today = new Date().toISOString().split("T")[0];
    return a.status === "published" && a.validFrom <= today && a.validTo >= today;
  });

  const sortedAnnouncements = [...validAnnouncements].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const goToNext = useCallback(() => {
    if (sortedAnnouncements.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % sortedAnnouncements.length);
  }, [sortedAnnouncements.length]);

  const goToPrev = useCallback(() => {
    if (sortedAnnouncements.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + sortedAnnouncements.length) % sortedAnnouncements.length);
  }, [sortedAnnouncements.length]);

  useEffect(() => {
    if (!autoPlay || isPaused || sortedAnnouncements.length <= 1) return;

    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, isPaused, interval, goToNext, sortedAnnouncements.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [sortedAnnouncements.length]);

  if (sortedAnnouncements.length === 0) {
    return null;
  }

  const current = sortedAnnouncements[currentIndex];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div
      className="announcement-carousel relative overflow-hidden rounded-lg border border-ink/10 bg-gradient-to-r from-accent/10 to-ember/10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-ink/5 border-b border-ink/10">
        <div className="flex items-center gap-2">
          <span className="pill bg-accent/20 text-accent text-xs">公告</span>
          <span className="text-sm text-ink/70">
            {currentIndex + 1} / {sortedAnnouncements.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrev}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-ink/10 transition-colors"
            aria-label="上一条"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-ink/10 transition-colors"
            aria-label="下一条"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-5 min-h-[100px]">
        <div
          key={current.id}
          className="carousel-item"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {current.isPinned && (
                  <span className="text-xs px-2 py-0.5 rounded bg-accent text-white font-bold">
                    置顶
                  </span>
                )}
                <h4 className="font-bold text-lg">{current.title}</h4>
              </div>
              <p className="text-ink/75 leading-relaxed">{current.content}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-ink/50">
                <span>有效期: {formatDate(current.validFrom)} ~ {formatDate(current.validTo)}</span>
                <span>发布时间: {formatDate(current.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {sortedAnnouncements.length > 1 && (
        <div className="flex justify-center gap-2 pb-3">
          {sortedAnnouncements.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-accent w-6"
                  : "bg-ink/30 hover:bg-ink/50"
              }`}
              aria-label={`跳转到第 ${index + 1} 条`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
