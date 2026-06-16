import { systemRouter } from "./_core/systemRouter";
import { router } from "./_core/trpc";
import { authRouter } from "./auth";
import { featuresRouter } from "./features";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  products: featuresRouter.products,
  orders: featuresRouter.orders,
  transactions: featuresRouter.transactions,
  notifications: featuresRouter.notifications,
  stats: featuresRouter.stats,
  profile: featuresRouter.profile,
});

export type AppRouter = typeof appRouter;
