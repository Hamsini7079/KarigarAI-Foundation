import { Router, type Request, type Response } from "express";
import { db, notificationsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

// GET /api/notifications?profileId=...
router.get("/notifications", async (req: Request, res: Response) => {
  const { profileId } = req.query;
  if (!profileId || typeof profileId !== "string") {
    return res.status(400).json({ error: "profileId is required" });
  }

  try {
    const result = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.profileId, profileId))
      .orderBy(desc(notificationsTable.createdAt));
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/notifications/:id/read
router.patch("/notifications/:id/read", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { profileId } = req.body;

  if (!profileId || typeof profileId !== "string") {
    return res.status(400).json({ error: "profileId is required in body" });
  }

  try {
    const existing = await db
      .select()
      .from(notificationsTable)
      .where(
        and(
          eq(notificationsTable.id, id),
          eq(notificationsTable.profileId, profileId)
        )
      )
      .limit(1);

    if (existing.length === 0) {
      return res.status(404).json({ error: "Notification not found or not owned" });
    }

    await db
      .update(notificationsTable)
      .set({ read: true })
      .where(eq(notificationsTable.id, id));

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;