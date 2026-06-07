import { useEffect, useState, useCallback } from "react";
import {
  fetchOverview,
  fetchCarouselAnnouncements,
  fetchRecentAnnouncements,
} from "./api/client";
import { APP_CODE, APP_NAME } from "./constants/app";
import { REQUEST_MESSAGES } from "./constants/messages";
import { createFallbackOverview } from "./state/dashboard";
import { localAnnouncements } from "./data/workbench";
import type { OverviewResponse, Announcement } from "./types";
import { FeatureStrip } from "./components/FeatureStrip";
import { MetricGrid } from "./components/MetricGrid";
import { OperationsTable } from "./components/OperationsTable";
import { AnnouncementCarousel } from "./components/AnnouncementCarousel";
import { AnnouncementSidebar } from "./components/AnnouncementSidebar";
import { AnnouncementCenter } from "./components/AnnouncementCenter";

export default function App() {
  const [overview, setOverview] = useState<OverviewResponse>(createFallbackOverview());
  const [carouselAnnouncements, setCarouselAnnouncements] = useState<Announcement[]>(localAnnouncements);
  const [sidebarAnnouncements, setSidebarAnnouncements] = useState<Announcement[]>(localAnnouncements);
  const [notice, setNotice] = useState(REQUEST_MESSAGES.overviewFallback);
  const [showAnnouncementCenter, setShowAnnouncementCenter] = useState(false);

  const loadOverview = async () => {
    try {
      const payload = await fetchOverview();
      setOverview(payload);
      setNotice("后端服务已联通，当前展示实时接口数据。");
    } catch {
      setNotice(REQUEST_MESSAGES.overviewFallback);
    }
  };

  const loadCarouselAnnouncements = useCallback(async () => {
    try {
      const data = await fetchCarouselAnnouncements();
      if (data.length > 0) {
        setCarouselAnnouncements(data);
      }
    } catch {
      setCarouselAnnouncements(localAnnouncements);
    }
  }, []);

  const loadSidebarAnnouncements = useCallback(async () => {
    try {
      const data = await fetchRecentAnnouncements(3);
      if (data.length > 0) {
        setSidebarAnnouncements(data);
      }
    } catch {
      setSidebarAnnouncements(localAnnouncements);
    }
  }, []);

  const loadAllData = useCallback(async () => {
    await Promise.all([
      loadOverview(),
      loadCarouselAnnouncements(),
      loadSidebarAnnouncements(),
    ]);
  }, [loadCarouselAnnouncements, loadSidebarAnnouncements]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleAnnouncementDataChange = () => {
    loadAllData();
  };

  const handleCloseAnnouncementCenter = () => {
    setShowAnnouncementCenter(false);
    loadAllData();
  };

  if (showAnnouncementCenter) {
    return (
      <main className="app-shell text-ink">
        <header className="topbar">
          <div className="brand-block">
            <span className="brand-code">{APP_CODE}</span>
            <h1 className="brand-title">{APP_NAME}</h1>
          </div>
          <button
            onClick={handleCloseAnnouncementCenter}
            className="rounded-md bg-accent px-4 py-2 font-bold text-white hover:bg-accent/90"
          >
            返回首页
          </button>
        </header>
        <section className="workspace">
          <AnnouncementCenter
            initialAnnouncements={carouselAnnouncements}
            onClose={handleCloseAnnouncementCenter}
            onDataChange={handleAnnouncementDataChange}
          />
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell text-ink">
      <header className="topbar">
        <div className="brand-block">
          <span className="brand-code">{APP_CODE}</span>
          <h1 className="brand-title">{APP_NAME}</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAnnouncementCenter(true)}
            className="rounded-md bg-ink/5 px-4 py-2 font-bold hover:bg-ink/10 transition-colors"
          >
            公告中心
          </button>
          <a className="rounded-md bg-accent px-4 py-2 font-bold text-white" href={REQUEST_MESSAGES.healthPath}>API Health</a>
        </div>
      </header>
      <section className="workspace">
        <AnnouncementCarousel announcements={carouselAnnouncements} />

        <div className="lead-grid mt-6">
          <article className="hero-panel">
            <span className="pill">{notice}</span>
            <h2 className="mt-5 text-3xl font-black">{overview.appName}</h2>
            <p>{overview.description}</p>
          </article>
          <div className="flex flex-col gap-4">
            <MetricGrid items={overview.kpis} />
            <AnnouncementSidebar
              announcements={sidebarAnnouncements}
              limit={3}
              onViewAll={() => setShowAnnouncementCenter(true)}
            />
          </div>
        </div>

        <FeatureStrip items={overview.features} />

        <section className="work-panel">
          <h2 className="mb-5 text-2xl font-black">运营任务流</h2>
          <OperationsTable records={overview.records} />
        </section>
      </section>
    </main>
  );
}
