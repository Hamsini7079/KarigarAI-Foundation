import {
  boolean,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const profilesTable = pgTable("profiles", {
  id: text("id").primaryKey(),
  displayName: text("display_name").notNull(),
  email: text("email"),
  preferredLanguage: text("preferred_language").notNull().default("en"),
  avatarPath: text("avatar_path"),
  ...timestamps,
});

export const userRolesTable = pgTable(
  "user_roles",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => profilesTable.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    ...timestamps,
  },
  (table) => [unique("user_roles_user_role_unique").on(table.userId, table.role)],
);

export const artisansTable = pgTable("artisans", {
  id: text("id").primaryKey(),
  profileId: text("profile_id")
    .notNull()
    .references(() => profilesTable.id, { onDelete: "cascade" }),
  craft: text("craft").notNull(),
  region: text("region").notNull(),
  experienceYears: integer("experience_years").notNull().default(0),
  story: text("story"),
  storyHindi: text("story_hindi"),
  ...timestamps,
});

export const categoriesTable = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nameHindi: text("name_hindi").notNull(),
  icon: text("icon").notNull(),
  ...timestamps,
});

export const productsTable = pgTable("products", {
  id: text("id").primaryKey(),
  artisanId: text("artisan_id")
    .notNull()
    .references(() => artisansTable.id, { onDelete: "cascade" }),
  categoryId: text("category_id")
    .notNull()
    .references(() => categoriesTable.id),
  title: text("title").notNull(),
  titleHindi: text("title_hindi").notNull(),
  description: text("description"),
  descriptionHindi: text("description_hindi"),
  craft: text("craft").notNull(),
  material: text("material"),
  region: text("region").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(0),
  status: text("status").notNull().default("draft"),
  ...timestamps,
});

export const productImagesTable = pgTable("product_images", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => productsTable.id, { onDelete: "cascade" }),
  storagePath: text("storage_path").notNull(),
  imageRole: text("image_role").notNull().default("original"),
  mimeType: text("mime_type"),
  byteSize: integer("byte_size"),
  ...timestamps,
});

export const pricingRecommendationsTable = pgTable("pricing_recommendations", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => productsTable.id, { onDelete: "cascade" }),
  recommendedPrice: numeric("recommended_price", { precision: 12, scale: 2 }).notNull(),
  minimumPrice: numeric("minimum_price", { precision: 12, scale: 2 }).notNull(),
  maximumPrice: numeric("maximum_price", { precision: 12, scale: 2 }).notNull(),
  confidence: text("confidence").notNull(),
  reasoning: text("reasoning"),
  ...timestamps,
});

export const inquiriesTable = pgTable("inquiries", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => productsTable.id),
  buyerProfileId: text("buyer_profile_id")
    .notNull()
    .references(() => profilesTable.id),
  buyerName: text("buyer_name").notNull(),
  company: text("company"),
  quantity: integer("quantity").notNull(),
  message: text("message").notNull(),
  expectedDeliveryDate: text("expected_delivery_date"),
  status: text("status").notNull().default("new"),
  ...timestamps,
});

export const inquiryMessagesTable = pgTable("inquiry_messages", {
  id: text("id").primaryKey(),
  inquiryId: text("inquiry_id")
    .notNull()
    .references(() => inquiriesTable.id, { onDelete: "cascade" }),
  senderProfileId: text("sender_profile_id")
    .notNull()
    .references(() => profilesTable.id),
  message: text("message").notNull(),
  ...timestamps,
});

export const marketReferencePricesTable = pgTable("market_reference_prices", {
  id: text("id").primaryKey(),
  category: text("category").notNull(),
  craft: text("craft").notNull(),
  material: text("material").notNull(),
  region: text("region").notNull(),
  unit: text("unit").notNull(),
  referencePrice: numeric("reference_price", { precision: 12, scale: 2 }).notNull(),
  sourceLabel: text("source_label").notNull(),
  ...timestamps,
});

export const notificationsTable = pgTable("notifications", {
  id: text("id").primaryKey(),
  profileId: text("profile_id")
    .notNull()
    .references(() => profilesTable.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  read: boolean("read").notNull().default(false),
  ...timestamps,
});

export const analyticsEventsTable = pgTable("analytics_events", {
  id: text("id").primaryKey(),
  profileId: text("profile_id").references(() => profilesTable.id),
  eventName: text("event_name").notNull(),
  metadata: text("metadata"),
  ...timestamps,
});

export const aiProcessingLogsTable = pgTable("ai_processing_logs", {
  id: text("id").primaryKey(),
  productId: text("product_id").references(() => productsTable.id),
  service: text("service").notNull(),
  provider: text("provider").notNull(),
  status: text("status").notNull(),
  errorCode: text("error_code"),
  ...timestamps,
});

export const insertProfileSchema = createInsertSchema(profilesTable);
export const insertUserRoleSchema = createInsertSchema(userRolesTable);
export const insertArtisanSchema = createInsertSchema(artisansTable);
export const insertCategorySchema = createInsertSchema(categoriesTable);
export const insertProductSchema = createInsertSchema(productsTable);
export const insertProductImageSchema = createInsertSchema(productImagesTable);
export const insertPricingRecommendationSchema = createInsertSchema(
  pricingRecommendationsTable,
);
export const insertInquirySchema = createInsertSchema(inquiriesTable);
export const insertInquiryMessageSchema = createInsertSchema(inquiryMessagesTable);
export const insertMarketReferencePriceSchema = createInsertSchema(
  marketReferencePricesTable,
);
export const insertNotificationSchema = createInsertSchema(notificationsTable);
export const insertAnalyticsEventSchema = createInsertSchema(analyticsEventsTable);
export const insertAiProcessingLogSchema = createInsertSchema(aiProcessingLogsTable);

export type Profile = typeof profilesTable.$inferSelect;
export type UserRole = typeof userRolesTable.$inferSelect;
export type Artisan = typeof artisansTable.$inferSelect;
export type Category = typeof categoriesTable.$inferSelect;
export type Product = typeof productsTable.$inferSelect;
export type ProductImage = typeof productImagesTable.$inferSelect;
export type PricingRecommendation = typeof pricingRecommendationsTable.$inferSelect;
export type Inquiry = typeof inquiriesTable.$inferSelect;
export type InquiryMessage = typeof inquiryMessagesTable.$inferSelect;
export type MarketReferencePrice = typeof marketReferencePricesTable.$inferSelect;
export type Notification = typeof notificationsTable.$inferSelect;
export type AnalyticsEvent = typeof analyticsEventsTable.$inferSelect;
export type AiProcessingLog = typeof aiProcessingLogsTable.$inferSelect;

export const userRoleValues = z.enum(["artisan", "buyer", "admin"]);
export const productStatusValues = z.enum(["draft", "published", "archived"]);
export const inquiryStatusValues = z.enum([
  "new",
  "responded",
  "accepted",
  "rejected",
  "completed",
]);