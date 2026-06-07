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

export interface AnnouncementListQuery {
  status?: string;
  includeExpired?: boolean;
  limit?: number;
  offset?: number;
}
