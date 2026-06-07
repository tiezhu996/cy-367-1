import { API_BASE_URL } from "../constants/app";
import type {
  OverviewResponse,
  Announcement,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
} from "../types";

export async function fetchOverview(): Promise<OverviewResponse> {
  const response = await fetch(`${API_BASE_URL}/overview`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Overview request failed: ${response.status}`);
  }

  return response.json() as Promise<OverviewResponse>;
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const response = await fetch(`${API_BASE_URL}/announcements`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Announcements request failed: ${response.status}`);
  }

  return response.json() as Promise<Announcement[]>;
}

export async function fetchActiveAnnouncements(): Promise<Announcement[]> {
  const response = await fetch(`${API_BASE_URL}/announcements/active`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Active announcements request failed: ${response.status}`);
  }

  return response.json() as Promise<Announcement[]>;
}

export async function fetchCarouselAnnouncements(): Promise<Announcement[]> {
  const response = await fetch(`${API_BASE_URL}/announcements/carousel`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Carousel announcements request failed: ${response.status}`);
  }

  return response.json() as Promise<Announcement[]>;
}

export async function fetchRecentAnnouncements(limit = 3): Promise<Announcement[]> {
  const response = await fetch(`${API_BASE_URL}/announcements/recent?limit=${limit}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Recent announcements request failed: ${response.status}`);
  }

  return response.json() as Promise<Announcement[]>;
}

export async function createAnnouncement(
  data: CreateAnnouncementRequest
): Promise<Announcement> {
  const response = await fetch(`${API_BASE_URL}/announcements`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Create announcement failed: ${response.status}`);
  }

  return response.json() as Promise<Announcement>;
}

export async function updateAnnouncement(
  id: number,
  data: UpdateAnnouncementRequest
): Promise<Announcement> {
  const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Update announcement failed: ${response.status}`);
  }

  return response.json() as Promise<Announcement>;
}

export async function deleteAnnouncement(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Delete announcement failed: ${response.status}`);
  }
}
