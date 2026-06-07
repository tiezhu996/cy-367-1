import type { Request, Response } from "express";
import { OverviewService } from "./overview.service";
import { overviewData } from "./overview.data";

const service = new OverviewService();

export async function getOverview(_request: Request, response: Response) {
  try {
    const data = await service.getOverview();
    response.json(data);
  } catch {
    response.json(overviewData);
  }
}
