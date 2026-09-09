import { Router, type Request, type Response } from "express";
import { db, productsTable, artisansTable, categoriesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

// POST /api/products/draft
router.post("/products/draft", async (req: Request, res: Response) => {
  const { artisanId, categoryId, title, titleHindi, description, descriptionHindi, craft, material, region, price, quantity } = req.body;

  // Basic validation
  if (!artisanId || !categoryId || !title || !price || !quantity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Check artisan exists
  const artisan = await db.select().from(artisansTable).where(eq(artisansTable.id, artisanId)).limit(1);
  if (artisan.length === 0) {
    return res.status(404).json({ error: "Artisan not found" });
  }

  // Check category exists
  const category = await db.select().from(categoriesTable).where(eq(categoriesTable.id, categoryId)).limit(1);
  if (category.length === 0) {
    return res.status(404).json({ error: "Category not found" });
  }

  const newProduct = {
    id: randomUUID(),
    artisanId,
    categoryId,
    title,
    titleHindi: titleHindi || "",
    description: description || "",
    descriptionHindi: descriptionHindi || "",
    craft: craft || "",
    material: material || "",
    region: region || "",
    price: parseFloat(price),
    quantity: parseInt(quantity, 10),
    status: "draft",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.insert(productsTable).values(newProduct);
  res.status(201).json(newProduct);
});

// POST /api/products/:productId/publish
router.post("/products/:productId/publish", async (req: Request, res: Response) => {
  const { productId } = req.params;

  const product = await db.select().from(productsTable).where(eq(productsTable.id, productId)).limit(1);
  if (product.length === 0) {
    return res.status(404).json({ error: "Product not found" });
  }
  if (product[0].status !== "draft") {
    return res.status(409).json({ error: "Product is not in draft state" });
  }

  await db.update(productsTable).set({ status: "published", updatedAt: new Date() }).where(eq(productsTable.id, productId));
  res.json({ success: true, status: "published" });
});

export default router;