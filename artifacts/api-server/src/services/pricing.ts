import { randomUUID } from "node:crypto";
import { and, eq, type SQL } from "drizzle-orm";
import {
  categoriesTable,
  db,
  marketReferencePricesTable,
  pricingRecommendationsTable,
  productsTable,
} from "@workspace/db";

export type PricingRecommendationInput = {
  currentPrice?: number;
  quantity?: number;
  craft?: string;
  material?: string;
  region?: string;
};

type PricingReference = {
  referencePrice: string;
};

export class ProductNotFoundError extends Error {
  constructor(productId: string) {
    super(`Product not found: ${productId}`);
    this.name = "ProductNotFoundError";
  }
}

export interface PricingProvider {
  recommend(
    productId: string,
    input: PricingRecommendationInput,
  ): Promise<{
    id: string;
    productId: string;
    minimumPrice: number;
    recommendedPrice: number;
    maximumPrice: number;
    confidence: "low" | "medium" | "high";
    reasoning: string;
    marketReferenceCount: number;
  }>;
}

const roundPrice = (value: number): number =>
  Math.max(10, Math.round(value / 10) * 10);

const averageReferencePrice = (references: PricingReference[]): number =>
  references.reduce((sum, reference) => sum + Number(reference.referencePrice), 0) /
  references.length;

export class RuleBasedPricingProvider implements PricingProvider {
  async recommend(
    productId: string,
    input: PricingRecommendationInput,
  ): Promise<{
    id: string;
    productId: string;
    minimumPrice: number;
    recommendedPrice: number;
    maximumPrice: number;
    confidence: "low" | "medium" | "high";
    reasoning: string;
    marketReferenceCount: number;
  }> {
    const [product] = await db
      .select({
        id: productsTable.id,
        price: productsTable.price,
        quantity: productsTable.quantity,
        craft: productsTable.craft,
        material: productsTable.material,
        region: productsTable.region,
        category: categoriesTable.name,
      })
      .from(productsTable)
      .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(eq(productsTable.id, productId))
      .limit(1);

    if (!product) {
      throw new ProductNotFoundError(productId);
    }

    const currentPrice = input.currentPrice ?? Number(product.price);
    const quantity = input.quantity ?? product.quantity;
    const craft = input.craft ?? product.craft;
    const material = input.material ?? product.material ?? undefined;
    const region = input.region ?? product.region;

    const findReferences = async (conditions: SQL<unknown>[]) =>
      db
        .select({ referencePrice: marketReferencePricesTable.referencePrice })
        .from(marketReferencePricesTable)
        .where(and(...conditions))
        .limit(25);

    let references: PricingReference[] = [];
    let matchedOn = "";

    const exactConditions: SQL<unknown>[] = [
      eq(marketReferencePricesTable.category, product.category),
      eq(marketReferencePricesTable.craft, craft),
      eq(marketReferencePricesTable.region, region),
    ];

    if (material) {
      exactConditions.push(eq(marketReferencePricesTable.material, material));
    }

    references = await findReferences(exactConditions);
    if (references.length > 0) {
      matchedOn = material
        ? "category, craft, material, and region"
        : "category, craft, and region";
    }

    if (references.length === 0) {
      references = await findReferences([
        eq(marketReferencePricesTable.craft, craft),
        eq(marketReferencePricesTable.region, region),
      ]);
      if (references.length > 0) {
        matchedOn = "craft and region";
      }
    }

    if (references.length === 0) {
      references = await findReferences([eq(marketReferencePricesTable.craft, craft)]);
      if (references.length > 0) {
        matchedOn = "craft";
      }
    }

    const marketPrice =
      references.length > 0 ? averageReferencePrice(references) : currentPrice;
    const anchorPrice =
      references.length > 0 ? currentPrice * 0.4 + marketPrice * 0.6 : currentPrice;
    const stockAdjustment = quantity <= 5 ? 1.05 : quantity >= 25 ? 0.95 : 1;
    const recommendedPrice = roundPrice(anchorPrice * stockAdjustment);
    const minimumPrice = roundPrice(recommendedPrice * 0.9);
    const maximumPrice = roundPrice(recommendedPrice * 1.1);
    const confidence =
      references.length >= 3 ? "high" : references.length > 0 ? "medium" : "low";

    const referenceReason = references.length
      ? `Used ${references.length} ${matchedOn} market reference price${references.length === 1 ? "" : "s"} with an average of ₹${marketPrice.toFixed(2)}.`
      : "No matching market reference prices were found, so the current product price was used as the anchor.";
    const stockReason =
      quantity <= 5
        ? "The low stock level increased the recommendation by 5%."
        : quantity >= 25
          ? "The high stock level reduced the recommendation by 5%."
          : "The available stock level did not change the recommendation.";

    const reasoning = `${referenceReason} ${stockReason} The recommendation blends transparent pricing rules and is not a trained ML model or external AI result.`;
    const id = `pricing-${productId}-${randomUUID()}`;

    await db.insert(pricingRecommendationsTable).values({
      id,
      productId,
      minimumPrice: minimumPrice.toFixed(2),
      recommendedPrice: recommendedPrice.toFixed(2),
      maximumPrice: maximumPrice.toFixed(2),
      confidence,
      reasoning,
    });

    return {
      id,
      productId,
      minimumPrice,
      recommendedPrice,
      maximumPrice,
      confidence,
      reasoning,
      marketReferenceCount: references.length,
    };
  }
}

export const pricingProvider: PricingProvider = new RuleBasedPricingProvider();