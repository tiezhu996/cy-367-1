import { Router } from "express";
import {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncement,
  listAnnouncements,
  getActiveAnnouncements,
  getCarouselAnnouncements,
  getRecentAnnouncements,
} from "./announcement.controller";

export const announcementRouter = Router();

announcementRouter.post("/announcements", createAnnouncement);
announcementRouter.get("/announcements", listAnnouncements);
announcementRouter.get("/announcements/active", getActiveAnnouncements);
announcementRouter.get("/announcements/carousel", getCarouselAnnouncements);
announcementRouter.get("/announcements/recent", getRecentAnnouncements);
announcementRouter.get("/announcements/:id", getAnnouncement);
announcementRouter.put("/announcements/:id", updateAnnouncement);
announcementRouter.delete("/announcements/:id", deleteAnnouncement);
