import { Op } from "sequelize";
import { Announcement } from "./announcement.model";
import type {
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
  AnnouncementListQuery,
} from "./announcement.types";

const today = new Date().toISOString().split("T")[0];

export class AnnouncementService {
  async create(data: CreateAnnouncementRequest) {
    return Announcement.create({
      title: data.title,
      content: data.content,
      isPinned: data.isPinned ?? false,
      validFrom: data.validFrom,
      validTo: data.validTo,
      status: data.status ?? "published",
      createdBy: data.createdBy ?? "admin",
    });
  }

  async update(id: number, data: UpdateAnnouncementRequest) {
    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return null;
    }
    return announcement.update(data);
  }

  async delete(id: number) {
    const announcement = await Announcement.findByPk(id);
    if (announcement) {
      await announcement.destroy();
      return true;
    }
    return false;
  }

  async getById(id: number) {
    return Announcement.findByPk(id);
  }

  async getActiveAnnouncements(query: AnnouncementListQuery = {}) {
    const { status = "published", includeExpired = false, limit, offset } = query;

    const whereClause: Record<string, unknown> = { status };

    if (!includeExpired) {
      whereClause.validFrom = { [Op.lte]: today };
      whereClause.validTo = { [Op.gte]: today };
    }

    return Announcement.findAll({
      where: whereClause,
      order: [
        ["isPinned", "DESC"],
        ["createdAt", "DESC"],
      ],
      limit,
      offset,
    });
  }

  async getCarouselAnnouncements() {
    return this.getActiveAnnouncements({ status: "published", includeExpired: false });
  }

  async getRecentAnnouncements(limit = 3) {
    return Announcement.findAll({
      where: {
        status: "published",
        validFrom: { [Op.lte]: today },
        validTo: { [Op.gte]: today },
      },
      order: [
        ["isPinned", "DESC"],
        ["createdAt", "DESC"],
      ],
      limit,
    });
  }

  async getAllAnnouncements(query: AnnouncementListQuery = {}) {
    const { status, includeExpired = true, limit, offset } = query;

    const whereClause: Record<string, unknown> = {};
    if (status) {
      whereClause.status = status;
    }
    if (!includeExpired) {
      whereClause.validFrom = { [Op.lte]: today };
      whereClause.validTo = { [Op.gte]: today };
    }

    return Announcement.findAll({
      where: whereClause,
      order: [
        ["isPinned", "DESC"],
        ["createdAt", "DESC"],
      ],
      limit,
      offset,
    });
  }
}
