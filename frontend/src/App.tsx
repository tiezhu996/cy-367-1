import { useEffect, useState } from "react";
import { fetchOverview } from "./api/client";
import { APP_CODE, APP_NAME } from "./constants/app";
import { REQUEST_MESSAGES } from "./constants/messages";
import { createFallbackOverview } from "./state/dashboard";
import type { OverviewResponse } from "./types";
import { FeatureStrip } from "./components/FeatureStrip";
import { MetricGrid } from "./components/MetricGrid";
import { OperationsTable } from "./components/OperationsTable";
import { AnnouncementCarousel } from "./components/AnnouncementCarousel";
import { AnnouncementSidebar } from "./components/AnnouncementSidebar";
import { AnnouncementCenter } from "./components/AnnouncementCenter";

export default function App() {
  const [overview, setOverview] = useState<OverviewResponse>(createFallbackOverview());
  const [notice, setNotice] = useState(REQUEST_MESSAGES.overviewFallback);
  const [showAnnouncementCenter, setShowAnnouncementCenter] = useState(false);

  useEffect(() => {
    fetchOverview()
      .then((payload) => {
        setOverview(payload);
        setNotice("后端服务已联通，当前展示实时接口数据。");
      })
      .catch(() => setNotice(REQUEST_MESSAGES.overviewFallback));
  }, []);

  if (showAnnouncementCenter) {
    return (
      <main className="app-shell text-ink">
        <header className="topbar">
          <div className="brand-block">
            <span className="brand-code">{APP_CODE}</span>
            <h1 className="brand-title">{APP_NAME}</h1>
          </div>
          <button
            onClick={() => setShowAnnouncementCenter(false)}
            className="rounded-md bg-accent px-4 py-2 font-bold text-white hover:bg-accent/90"
          >
            返回首页
          </button>
        </header>
        <section className="workspace">
          <AnnouncementCenter
            initialAnnouncements={overview.announcements}
            onClose={() => setShowAnnouncementCenter(false)}
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
        <AnnouncementCarousel announcements={overview.announcements} />

        <div className="lead-grid mt-6">
          <article className="hero-panel">
            <span className="pill">{notice}</span>
            <h2 className="mt-5 text-3xl font-black">{overview.appName}</h2>
            <p>{overview.description}</p>
          </article>
          <div className="flex flex-col gap-4">
            <MetricGrid items={overview.kpis} />
            <AnnouncementSidebar
              announcements={overview.announcements}
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
