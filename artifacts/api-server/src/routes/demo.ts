import { count, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { GetDemoOverviewResponse } from "@workspace/api-zod";
import { db, notificationsTable, productsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/demo/overview", async (_req, res): Promise<void> => {
  const [publishedResult, draftResult, unreadResult] = await Promise.all([
    db
      .select({ value: count() })
      .from(productsTable)
      .where(eq(productsTable.status, "published")),
    db
      .select({ value: count() })
      .from(productsTable)
      .where(eq(productsTable.status, "draft")),
    db
      .select({ value: count() })
      .from(notificationsTable)
      .where(eq(notificationsTable.read, false)),
  ]);

  const overview = GetDemoOverviewResponse.parse({
    artisan: {
      name: "Savitri Devi",
      craft: "Handloom",
      region: "Telangana",
      experienceYears: 18,
      initials: "SD",
    },
    publishedProducts: publishedResult[0]?.value ?? 0,
    draftCount: draftResult[0]?.value ?? 0,
    unreadNotifications: unreadResult[0]?.value ?? 0,
    nextPhase: "Photo → Enhance → Voice → Catalog → Price → Review",
  });

  res.json(overview);
});

export default router;