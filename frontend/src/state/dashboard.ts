import { localFeatures, localKpis, operationRecords, localAnnouncements } from "../data/workbench";
import type { OverviewResponse } from "../types";
import { APP_CODE, APP_NAME } from "../constants/app";

export function createFallbackOverview(): OverviewResponse {
  return {
    appName: APP_NAME,
    appCode: APP_CODE,
    description: "面向付费自习室/共享自习空间，提供座位预约、环境监测和学习社区功能的智能化运营平台。",
    features: localFeatures,
    kpis: localKpis,
    records: operationRecords,
    announcements: localAnnouncements,
  };
}
