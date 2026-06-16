import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import * as crypto from "crypto";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";

// Hash password using SHA256 with salt
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + (process.env.JWT_SECRET || "secret")).digest("hex");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Create a session token (base64 encoded JSON with userId)
function createSessionToken(userId: number): string {
  const payload = JSON.stringify({ userId, iat: Date.now() });
  return Buffer.from(payload).toString("base64");
}

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        shopName: z.string().min(1),
        ownerName: z.string().min(1),
        phone: z.string().min(1),
        orangePhone: z.string().optional(),
        mtnPhone: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if user already exists
      const existingUser = await db.getUserByEmail(input.email);
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already registered",
        });
      }

      // Create new user
      const passwordHash = hashPassword(input.password);
      const result = await db.createUser({
        email: input.email,
        passwordHash,
        shopName: input.shopName,
        ownerName: input.ownerName,
        phone: input.phone,
        orangePhone: input.orangePhone || null,
        mtnPhone: input.mtnPhone || null,
        role: "user",
        verified: false,
      });

      // Fetch the created user to get the ID
      const newUser = await db.getUserByEmail(input.email);
      if (!newUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
        });
      }

      // Create and set session cookie
      const token = createSessionToken(newUser.id);
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, cookieOptions);

      return {
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          shopName: newUser.shopName,
          ownerName: newUser.ownerName,
        },
      };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await db.getUserByEmail(input.email);
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const isPasswordValid = verifyPassword(input.password, user.passwordHash);
      if (!isPasswordValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      // Create and set session cookie
      const token = createSessionToken(user.id);
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, cookieOptions);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          shopName: user.shopName,
          ownerName: user.ownerName,
        },
      };
    }),

  me: publicProcedure.query(({ ctx }) => {
    return ctx.user || null;
  }),

  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true };
  }),
});
