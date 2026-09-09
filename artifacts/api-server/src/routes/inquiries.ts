import { Router, type Request, type Response } from "express";
import { db, productsTable, profilesTable, inquiriesTable, inquiryMessagesTable, notificationsTable, artisansTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

router.post("/inquiries", async (req: Request, res: Response) => {
  const { productId, buyerProfileId, message, quantity, company, expectedDeliveryDate } = req.body;

  if (!productId || !buyerProfileId || !message || !quantity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const product = await db.select().from(productsTable).where(eq(productsTable.id, productId)).limit(1);
  if (product.length === 0) {
    return res.status(404).json({ error: "Product not found" });
  }
  if (product[0].status !== "published") {
    return res.status(409).json({ error: "Product is not published" });
  }

  const buyer = await db.select().from(profilesTable).where(eq(profilesTable.id, buyerProfileId)).limit(1);
  if (buyer.length === 0) {
    return res.status(404).json({ error: "Buyer profile not found" });
  }

  const inquiryId = randomUUID();

  const inquiry = {
    id: inquiryId,
    productId: productId,
    buyerProfileId: buyerProfileId,
    buyerName: buyer[0].displayName || "Buyer",
    company: company || null,
    quantity: parseInt(quantity, 10),
    message: message,
    expectedDeliveryDate: typeof expectedDeliveryDate === "string" && expectedDeliveryDate.trim() !== ""
      ? expectedDeliveryDate
      : null,
    status: "new",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const messageRecord = {
    id: randomUUID(),
    inquiryId: inquiryId,
    senderProfileId: buyerProfileId,
    message: message,
    createdAt: new Date(),
  };

  const artisanId = product[0].artisanId;
  const artisanRecord = await db
    .select({ profileId: artisansTable.profileId })
    .from(artisansTable)
    .where(eq(artisansTable.id, artisanId))
    .limit(1);

  let artisanProfileId = artisanRecord.length > 0 ? artisanRecord[0].profileId : null;
  if (!artisanProfileId) {
    const profileCheck = await db.select().from(profilesTable).where(eq(profilesTable.id, artisanId)).limit(1);
    if (profileCheck.length > 0) {
      artisanProfileId = artisanId;
    }
  }

  const notification = {
    id: randomUUID(),
    profileId: artisanProfileId,
    type: "inquiry",
    title: "New inquiry received",
    body: `You have a new inquiry for ${product[0].title}`,
    read: false,
    createdAt: new Date(),
  };

  await db.transaction(async (tx) => {
    await tx.insert(inquiriesTable).values(inquiry);
    await tx.insert(inquiryMessagesTable).values(messageRecord);
    if (artisanProfileId) {
      await tx.insert(notificationsTable).values(notification);
    }
  });

  res.status(201).json({ inquiryId, status: "created" });
});

export default router;