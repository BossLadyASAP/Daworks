import type { Express, Request, Response } from "express";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  // OAuth is disabled - using custom authentication instead
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    res.status(400).json({ error: "OAuth is disabled. Use /api/trpc/auth.login instead" });
  });
}
