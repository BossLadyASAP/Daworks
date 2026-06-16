import type { Express, Request, Response } from "express";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./cookies";

/**
 * Custom authentication routes for the Store Manager app.
 * Replaces Manus OAuth with simple email/password authentication.
 */
export function registerAuthRoutes(app: Express) {
  // Login endpoint - handled by tRPC auth.login
  // Register endpoint - handled by tRPC auth.register
  // Logout endpoint - handled by tRPC auth.logout

  // Simple health check
  app.get("/api/auth/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
  });
}

/**
 * Create a session token for storing in cookies.
 * In production, use proper JWT signing.
 */
export function createSessionToken(userId: number): string {
  const payload = JSON.stringify({ userId, iat: Date.now() });
  return Buffer.from(payload).toString("base64");
}

/**
 * Parse and validate a session token.
 */
export function parseSessionToken(token: string): { userId: number } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    if (payload.userId && typeof payload.userId === "number") {
      return { userId: payload.userId };
    }
  } catch (error) {
    console.error("[Auth] Failed to parse session token:", error);
  }
  return null;
}
