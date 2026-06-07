export interface FeatureItem {
  id: number;
  title: string;
  description: string;
  status: string;
  metric: string;
}

export interface KpiItem {
  label: string;
  value: string;
  trend: string;
  tone: string;
}

export interface OperationRecord {
  key: string;
  name: string;
  owner: string;
  status: string;
  metric: string;
  priority: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  isPinned: boolean;
  validFrom: string;
  validTo: string;
  status: "draft" | "published" | "archived";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  isPinned?: boolean;
  validFrom: string;
  validTo: string;
  status?: "draft" | "published" | "archived";
  createdBy?: string;
}

export interface UpdateAnnouncementRequest {
  title?: string;
  content?: string;
  isPinned?: boolean;
  validFrom?: string;
  validTo?: string;
  status?: "draft" | "published" | "archived";
}

export interface OverviewResponse {
  appName: string;
  appCode: string;
  description: string;
  features: FeatureItem[];
  kpis: KpiItem[];
  records: OperationRecord[];
  announcements: Announcement[];
}
