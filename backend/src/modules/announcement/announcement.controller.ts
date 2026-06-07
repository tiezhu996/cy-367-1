import type { Request, Response } from "express";
import { AnnouncementService } from "./announcement.service";
import type { CreateAnnouncementRequest, UpdateAnnouncementRequest } from "./announcement.types";

const service = new AnnouncementService();

export async function createAnnouncement(request: Request, response: Response) {
  try {
    const data = request.body as CreateAnnouncementRequest;

    if (!data.title || !data.content || !data.validFrom || !data.validTo) {
      return response.status(400).json({
        error: "缺少必要字段: title, content, validFrom, validTo",
      });
    }

    const announcement = await service.create(data);
    return response.status(201).json(announcement);
  } catch (error) {
    return response.status(500).json({ error: "创建公告失败", details: String(error) });
  }
}

export async function updateAnnouncement(request: Request, response: Response) {
  try {
    const id = Number(request.params.id);
    if (Number.isNaN(id)) {
      return response.status(400).json({ error: "无效的公告ID" });
    }

    const data = request.body as UpdateAnnouncementRequest;
    const announcement = await service.update(id, data);

    if (!announcement) {
      return response.status(404).json({ error: "公告不存在" });
    }

    return response.json(announcement);
  } catch (error) {
    return response.status(500).json({ error: "更新公告失败", details: String(error) });
  }
}

export async function deleteAnnouncement(request: Request, response: Response) {
  try {
    const id = Number(request.params.id);
    if (Number.isNaN(id)) {
      return response.status(400).json({ error: "无效的公告ID" });
    }

    const deleted = await service.delete(id);
    if (!deleted) {
      return response.status(404).json({ error: "公告不存在" });
    }

    return response.json({ success: true, message: "删除成功" });
  } catch (error) {
    return response.status(500).json({ error: "删除公告失败", details: String(error) });
  }
}

export async function getAnnouncement(request: Request, response: Response) {
  try {
    const id = Number(request.params.id);
    if (Number.isNaN(id)) {
      return response.status(400).json({ error: "无效的公告ID" });
    }

    const announcement = await service.getById(id);
    if (!announcement) {
      return response.status(404).json({ error: "公告不存在" });
    }

    return response.json(announcement);
  } catch (error) {
    return response.status(500).json({ error: "获取公告失败", details: String(error) });
  }
}

export async function listAnnouncements(request: Request, response: Response) {
  try {
    const { status, includeExpired, limit, offset } = request.query;
    const query = {
      status: status as string | undefined,
      includeExpired: includeExpired === "true",
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    };

    const announcements = await service.getAllAnnouncements(query);
    return response.json(announcements);
  } catch (error) {
    return response.status(500).json({ error: "获取公告列表失败", details: String(error) });
  }
}

export async function getActiveAnnouncements(_request: Request, response: Response) {
  try {
    const announcements = await service.getActiveAnnouncements();
    return response.json(announcements);
  } catch (error) {
    return response.status(500).json({ error: "获取有效公告失败", details: String(error) });
  }
}

export async function getCarouselAnnouncements(_request: Request, response: Response) {
  try {
    const announcements = await service.getCarouselAnnouncements();
    return response.json(announcements);
  } catch (error) {
    return response.status(500).json({ error: "获取轮播公告失败", details: String(error) });
  }
}

export async function getRecentAnnouncements(request: Request, response: Response) {
  try {
    const limit = Number(request.query.limit) || 3;
    const announcements = await service.getRecentAnnouncements(limit);
    return response.json(announcements);
  } catch (error) {
    return response.status(500).json({ error: "获取最近公告失败", details: String(error) });
  }
}
