import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { parseSessionToken } from "./auth-routes";
import * as db from "../db";
import { COOKIE_NAME } from "@shared/const";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Get session token from cookies parsed by cookie-parser middleware
    // The cookie-parser middleware automatically parses cookies into req.cookies
    const cookies = (opts.req as any).cookies || {};
    const sessionCookie = cookies[COOKIE_NAME];

    if (sessionCookie) {
      const session = parseSessionToken(sessionCookie);
      if (session) {
        const fetchedUser = await db.getUserById(session.userId);
        user = fetchedUser || null;
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    console.error("[Auth] Error parsing session:", error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
