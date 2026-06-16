import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";

// Demo data for public access
const DEMO_PRODUCTS = [
  {
    id: 1,
    userId: 0,
    name: "Laptop Pro",
    description: "High-performance laptop for professionals",
    category: "Electronics",
    costPrice: "500000",
    salePrice: "750000",
    stock: 15,
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    userId: 0,
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with long battery life",
    category: "Accessories",
    costPrice: "5000",
    salePrice: "12000",
    stock: 50,
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    userId: 0,
    name: "USB-C Cable",
    description: "Durable USB-C charging and data cable",
    category: "Accessories",
    costPrice: "2000",
    salePrice: "5000",
    stock: 100,
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    userId: 0,
    name: "Monitor 27 inch",
    description: "4K UHD monitor with HDR support",
    category: "Electronics",
    costPrice: "150000",
    salePrice: "250000",
    stock: 8,
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    userId: 0,
    name: "Keyboard Mechanical",
    description: "RGB mechanical keyboard with custom switches",
    category: "Accessories",
    costPrice: "30000",
    salePrice: "75000",
    stock: 25,
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const DEMO_ORDERS = [
  {
    id: 1,
    userId: 0,
    customerPhone: "+237123456789",
    totalAmount: "1500000",
    paymentMethod: "mtn" as const,
    status: "completed",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    userId: 0,
    customerPhone: "+237987654321",
    totalAmount: "250000",
    paymentMethod: "orange" as const,
    status: "completed",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    userId: 0,
    customerPhone: "+237111222333",
    totalAmount: "500000",
    paymentMethod: "mtn" as const,
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

const DEMO_TRANSACTIONS = [
  {
    id: 1,
    userId: 0,
    amount: "750000",
    operator: "mtn" as const,
    status: "completed",
    orderId: 1,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    userId: 0,
    amount: "250000",
    operator: "orange" as const,
    status: "completed",
    orderId: 2,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    userId: 0,
    amount: "500000",
    operator: "mtn" as const,
    status: "pending",
    orderId: 3,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 4,
    userId: 0,
    amount: "300000",
    operator: "orange" as const,
    status: "completed",
    orderId: null,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

export const featuresRouter = router({
  // Product routes
  products: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getProductsByUserId(ctx.user.id);
    }),

    listPublic: publicProcedure.query(async () => {
      return DEMO_PRODUCTS;
    }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const product = await db.getProductById(input.id);
        if (!product) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
        }
        return product;
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          category: z.string().optional(),
          costPrice: z.string(),
          salePrice: z.string(),
          stock: z.number().default(0),
          imageUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return await db.createProduct({
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
          category: input.category,
          costPrice: input.costPrice,
          salePrice: input.salePrice,
          stock: input.stock,
          imageUrl: input.imageUrl,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          category: z.string().optional(),
          costPrice: z.string().optional(),
          salePrice: z.string().optional(),
          stock: z.number().optional(),
          imageUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const product = await db.getProductById(input.id);
        if (!product || product.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
        }
        const { id, ...data } = input;
        return await db.updateProduct(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const product = await db.getProductById(input.id);
        if (!product || product.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
        }
        return await db.deleteProduct(input.id);
      }),

    updateStock: protectedProcedure
      .input(z.object({ productId: z.number(), stock: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const product = await db.getProductById(input.productId);
        if (!product || product.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
        }
        return await db.updateProduct(input.productId, { stock: parseInt(input.stock) });
      }),
  }),

  // Order routes
  orders: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getOrdersByUserId(ctx.user.id);
    }),

    listPublic: publicProcedure.query(async () => {
      return DEMO_ORDERS;
    }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const order = await db.getOrderById(input.id);
        if (!order || order.userId !== ctx.user.id) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
        }
        return order;
      }),

    create: protectedProcedure
      .input(
        z.object({
          customerPhone: z.string(),
          totalAmount: z.string(),
          paymentMethod: z.enum(["mtn", "orange", "cash"]),
          items: z.array(z.object({ productId: z.number(), quantity: z.number() })),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const order = await db.createOrder({
          userId: ctx.user.id,
          customerPhone: input.customerPhone,
          totalAmount: input.totalAmount,
          paymentMethod: input.paymentMethod,
          status: "pending",
        });

        // Create order items and update stock
        for (const item of input.items) {
          const product = await db.getProductById(item.productId);
          if (product && product.userId === ctx.user.id) {
            // Create order item
            await db.createOrderItem({
              orderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: product.salePrice,
            });
            // Decrement stock
            const newStock = Math.max(0, product.stock - item.quantity);
            await db.updateProduct(item.productId, { stock: newStock });
          }
        }

        return order;
      }),

    updateStatus: protectedProcedure
      .input(z.object({ id: z.number(), status: z.enum(["pending", "processing", "completed", "failed", "cancelled"]) }))
      .mutation(async ({ input, ctx }) => {
        const order = await db.getOrderById(input.id);
        if (!order || order.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
        }
        return await db.updateOrder(input.id, { status: input.status });
      }),
  }),

  // Transaction routes
  transactions: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getTransactionsByUserId(ctx.user.id);
    }),

    listPublic: publicProcedure.query(async () => {
      return DEMO_TRANSACTIONS;
    }),

    create: protectedProcedure
      .input(
        z.object({
          amount: z.string(),
          operator: z.enum(["mtn", "orange"]),
          orderId: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return await db.createTransaction({
          userId: ctx.user.id,
          amount: input.amount,
          operator: input.operator,
          status: "pending",
          orderId: input.orderId,
        });
      }),
  }),

  // Notification routes
  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getNotificationsByUserId(ctx.user.id);
    }),

    listPublic: publicProcedure.query(async () => {
      return [];
    }),

    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.markNotificationAsRead(input.id);
      }),
  }),

  // Dashboard stats
  stats: router({
    dashboardPublic: publicProcedure.query(async () => {
      const orders = DEMO_ORDERS;
      const products = DEMO_PRODUCTS;
      const transactions = DEMO_TRANSACTIONS;

      const totalRevenue = transactions
        .filter((t) => t.status === "completed")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const completedOrders = orders.filter((o) => o.status === "completed").length;
      const lowStockProducts = products.filter((p) => (typeof p.stock === 'string' ? parseInt(p.stock) : p.stock) < 5).length;

      return {
        totalRevenue,
        totalOrders: orders.length,
        completedOrders,
        lowStockProducts,
        totalProducts: products.length,
      };
    }),

    dashboard: protectedProcedure.query(async ({ ctx }) => {
      const orders = await db.getOrdersByUserId(ctx.user.id);
      const products = await db.getProductsByUserId(ctx.user.id);
      const transactions = await db.getTransactionsByUserId(ctx.user.id);

      const totalRevenue = transactions
        .filter((t) => t.status === "completed")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const completedOrders = orders.filter((o) => o.status === "completed").length;
      const lowStockProducts = products.filter((p) => (typeof p.stock === 'string' ? parseInt(p.stock) : p.stock) < 5).length;

      return {
        totalRevenue,
        totalOrders: orders.length,
        completedOrders,
        lowStockProducts,
        totalProducts: products.length,
      };
    }),

    revenueChartPublic: publicProcedure.query(async () => {
      const transactions = DEMO_TRANSACTIONS;

      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const data = days.map((day, index) => {
        const dayTransactions = transactions.filter((t) => {
          const txDate = new Date(t.createdAt);
          const dayOfWeek = (txDate.getDay() + 6) % 7;
          return dayOfWeek === index;
        });

        const mtnTx = dayTransactions.filter((t) => (t.operator as string) === "mtn");
        const orangeTx = dayTransactions.filter((t) => (t.operator as string) === "orange");

        return {
          day,
          mtn: mtnTx.reduce((sum, t) => sum + parseFloat(t.amount), 0),
          orange: orangeTx.reduce((sum, t) => sum + parseFloat(t.amount), 0),
        };
      });

      return data;
    }),

    revenueChart: protectedProcedure.query(async ({ ctx }) => {
      const transactions = await db.getTransactionsByUserId(ctx.user.id);

      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const data = days.map((day, index) => {
        const dayTransactions = transactions.filter((t) => {
          const txDate = new Date(t.createdAt);
          const dayOfWeek = (txDate.getDay() + 6) % 7;
          return dayOfWeek === index;
        });

        const mtnTx = dayTransactions.filter((t) => (t.operator as string) === "mtn");
        const orangeTx = dayTransactions.filter((t) => (t.operator as string) === "orange");

        return {
          day,
          mtn: mtnTx.reduce((sum, t) => sum + parseFloat(t.amount), 0),
          orange: orangeTx.reduce((sum, t) => sum + parseFloat(t.amount), 0),
        };
      });

      return data;
    }),

    topProductsPublic: publicProcedure.query(async () => {
      return [
        { name: DEMO_PRODUCTS[0].name, sales: 5 },
        { name: DEMO_PRODUCTS[1].name, sales: 12 },
        { name: DEMO_PRODUCTS[2].name, sales: 8 },
      ];
    }),

    topProducts: protectedProcedure.query(async ({ ctx }) => {
      const orders = await db.getOrdersByUserId(ctx.user.id);
      const orderItems = await Promise.all(
        orders.map((o) => db.getOrderItemsByOrderId(o.id))
      );

      const productSales: Record<number, number> = {};
      orderItems.flat().forEach((item) => {
        productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
      });

      const topProductIds = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id]) => parseInt(id));

      const topProducts = await Promise.all(
        topProductIds.map((id) => db.getProductById(id))
      );

      return topProducts
        .filter((p) => p !== undefined)
        .map((p) => ({
          name: p!.name,
          sales: productSales[p!.id],
        }));
    }),
  }),

  // Profile routes
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return ctx.user;
    }),

    getPublic: publicProcedure.query(async () => {
      return null;
    }),

    update: protectedProcedure
      .input(
        z.object({
          shopName: z.string().optional(),
          ownerName: z.string().optional(),
          phone: z.string().optional(),
          orangePhone: z.string().optional(),
          mtnPhone: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const updateData: Record<string, any> = {};
        if (input.shopName) updateData.shopName = input.shopName;
        if (input.ownerName) updateData.ownerName = input.ownerName;
        if (input.phone) updateData.phone = input.phone;
        if (input.orangePhone !== undefined) updateData.orangePhone = input.orangePhone;
        if (input.mtnPhone !== undefined) updateData.mtnPhone = input.mtnPhone;

        if (Object.keys(updateData).length > 0) {
          await db.updateUser(ctx.user.id, updateData);
        }

        const updated = await db.getUserById(ctx.user.id);
        return { success: true, user: updated };
      })
  }),
});
