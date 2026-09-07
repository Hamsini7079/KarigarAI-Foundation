import { and, asc, eq, ilike, or, sql } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  ListCategoriesResponse,
  ListMarketplaceProductsQueryParams,
  ListMarketplaceProductsResponse,
} from "@workspace/api-zod";
import {
  artisansTable,
  categoriesTable,
  db,
  productImagesTable,
  profilesTable,
  productsTable,
} from "@workspace/db";

const router: IRouter = Router();

router.get("/categories", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      nameHindi: categoriesTable.nameHindi,
      icon: categoriesTable.icon,
      productCount: sql<number>`count(${productsTable.id})::int`,
    })
    .from(categoriesTable)
    .leftJoin(
      productsTable,
      and(
        eq(productsTable.categoryId, categoriesTable.id),
        eq(productsTable.status, "published"),
      ),
    )
    .groupBy(categoriesTable.id)
    .orderBy(asc(categoriesTable.name));

  res.json(ListCategoriesResponse.parse(rows));
});

router.get("/marketplace/products", async (req, res): Promise<void> => {
  const parsedQuery = ListMarketplaceProductsQueryParams.safeParse(req.query);
  if (!parsedQuery.success) {
    res.status(400).json({ error: parsedQuery.error.message });
    return;
  }

  const { search, category, limit } = parsedQuery.data;
  const filters = [eq(productsTable.status, "published")];

  if (category) {
    filters.push(eq(productsTable.categoryId, category));
  }

  if (search) {
    filters.push(
      or(
        ilike(productsTable.title, `%${search}%`),
        ilike(productsTable.titleHindi, `%${search}%`),
        ilike(productsTable.craft, `%${search}%`),
        ilike(productsTable.region, `%${search}%`),
      )!,
    );
  }

  const rows = await db
    .select({
      id: productsTable.id,
      title: productsTable.title,
      titleHindi: productsTable.titleHindi,
      category: categoriesTable.name,
      craft: productsTable.craft,
      region: productsTable.region,
      price: productsTable.price,
      quantity: productsTable.quantity,
      artisanName: profilesTable.displayName,
      imageUrl: productImagesTable.storagePath,
      imageAlt: productsTable.title,
      status: productsTable.status,
    })
    .from(productsTable)
    .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .innerJoin(artisansTable, eq(productsTable.artisanId, artisansTable.id))
    .innerJoin(profilesTable, eq(artisansTable.profileId, profilesTable.id))
    .leftJoin(
      productImagesTable,
      and(
        eq(productImagesTable.productId, productsTable.id),
        eq(productImagesTable.imageRole, "original"),
      ),
    )
    .where(and(...filters))
    .orderBy(asc(productsTable.createdAt))
    .limit(limit);

  const response = rows.map((row) => ({
    ...row,
    price: Number(row.price),
    imageUrl: row.imageUrl ?? "",
  }));

  res.json(ListMarketplaceProductsResponse.parse(response));
});

export default router;