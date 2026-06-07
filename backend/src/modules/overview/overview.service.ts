import { overviewData } from "./overview.data";
import { AnnouncementService } from "../announcement/announcement.service";
import type { AnnouncementAttributes } from "../announcement/announcement.model";

const fallbackAnnouncements = overviewData.announcements as AnnouncementAttributes[];

export class OverviewService {
  private announcementService: AnnouncementService;

  constructor() {
    this.announcementService = new AnnouncementService();
  }

  async getOverview() {
    let announcements: AnnouncementAttributes[] = fallbackAnnouncements;

    try {
      const dbAnnouncements = await this.announcementService.getActiveAnnouncements({
        status: "published",
        includeExpired: false,
      });
      if (dbAnnouncements && dbAnnouncements.length > 0) {
        announcements = dbAnnouncements.map((a) => a.toJSON() as AnnouncementAttributes);
      }
    } catch {
      announcements = fallbackAnnouncements;
    }

    return {
      ...overviewData,
      announcements,
    };
  }
}
