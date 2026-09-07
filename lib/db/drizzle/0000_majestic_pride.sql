CREATE TABLE "ai_processing_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text,
	"service" text NOT NULL,
	"provider" text NOT NULL,
	"status" text NOT NULL,
	"error_code" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analytics_events" (
	"id" text PRIMARY KEY NOT NULL,
	"profile_id" text,
	"event_name" text NOT NULL,
	"metadata" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artisans" (
	"id" text PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"craft" text NOT NULL,
	"region" text NOT NULL,
	"experience_years" integer DEFAULT 0 NOT NULL,
	"story" text,
	"story_hindi" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "artisans_experience_years_check" CHECK ("artisans"."experience_years" >= 0)
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"name_hindi" text NOT NULL,
	"icon" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"buyer_profile_id" text NOT NULL,
	"buyer_name" text NOT NULL,
	"company" text,
	"quantity" integer NOT NULL,
	"message" text NOT NULL,
	"expected_delivery_date" text,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inquiries_quantity_check" CHECK ("inquiries"."quantity" > 0),
	CONSTRAINT "inquiries_status_check" CHECK ("inquiries"."status" in ('new', 'responded', 'accepted', 'rejected', 'completed'))
);
--> statement-breakpoint
CREATE TABLE "inquiry_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"inquiry_id" text NOT NULL,
	"sender_profile_id" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "market_reference_prices" (
	"id" text PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"craft" text NOT NULL,
	"material" text NOT NULL,
	"region" text NOT NULL,
	"unit" text NOT NULL,
	"reference_price" numeric(12, 2) NOT NULL,
	"source_label" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "market_reference_prices_price_check" CHECK ("market_reference_prices"."reference_price" >= 0)
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pricing_recommendations" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"recommended_price" numeric(12, 2) NOT NULL,
	"minimum_price" numeric(12, 2) NOT NULL,
	"maximum_price" numeric(12, 2) NOT NULL,
	"confidence" text NOT NULL,
	"reasoning" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pricing_recommendations_prices_check" CHECK ("pricing_recommendations"."minimum_price" >= 0 and "pricing_recommendations"."recommended_price" >= "pricing_recommendations"."minimum_price" and "pricing_recommendations"."maximum_price" >= "pricing_recommendations"."recommended_price")
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"storage_path" text NOT NULL,
	"image_role" text DEFAULT 'original' NOT NULL,
	"mime_type" text,
	"byte_size" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_images_role_check" CHECK ("product_images"."image_role" in ('original', 'enhanced')),
	CONSTRAINT "product_images_byte_size_check" CHECK ("product_images"."byte_size" is null or "product_images"."byte_size" >= 0)
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"artisan_id" text NOT NULL,
	"category_id" text NOT NULL,
	"title" text NOT NULL,
	"title_hindi" text NOT NULL,
	"description" text,
	"description_hindi" text,
	"craft" text NOT NULL,
	"material" text,
	"region" text NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_price_check" CHECK ("products"."price" >= 0),
	CONSTRAINT "products_quantity_check" CHECK ("products"."quantity" >= 0),
	CONSTRAINT "products_status_check" CHECK ("products"."status" in ('draft', 'published', 'archived'))
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"email" text,
	"preferred_language" text DEFAULT 'en' NOT NULL,
	"avatar_path" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_roles_user_role_unique" UNIQUE("user_id","role"),
	CONSTRAINT "user_roles_role_check" CHECK ("user_roles"."role" in ('artisan', 'buyer', 'admin'))
);
--> statement-breakpoint
ALTER TABLE "ai_processing_logs" ADD CONSTRAINT "ai_processing_logs_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artisans" ADD CONSTRAINT "artisans_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_buyer_profile_id_profiles_id_fk" FOREIGN KEY ("buyer_profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiry_messages" ADD CONSTRAINT "inquiry_messages_inquiry_id_inquiries_id_fk" FOREIGN KEY ("inquiry_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiry_messages" ADD CONSTRAINT "inquiry_messages_sender_profile_id_profiles_id_fk" FOREIGN KEY ("sender_profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pricing_recommendations" ADD CONSTRAINT "pricing_recommendations_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_artisan_id_artisans_id_fk" FOREIGN KEY ("artisan_id") REFERENCES "public"."artisans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_processing_logs_product_id_idx" ON "ai_processing_logs" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "ai_processing_logs_status_idx" ON "ai_processing_logs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ai_processing_logs_created_at_idx" ON "ai_processing_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "analytics_events_profile_id_idx" ON "analytics_events" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "analytics_events_event_name_idx" ON "analytics_events" USING btree ("event_name");--> statement-breakpoint
CREATE INDEX "analytics_events_created_at_idx" ON "analytics_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "artisans_profile_id_idx" ON "artisans" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "inquiries_product_id_idx" ON "inquiries" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "inquiries_buyer_profile_id_idx" ON "inquiries" USING btree ("buyer_profile_id");--> statement-breakpoint
CREATE INDEX "inquiries_status_idx" ON "inquiries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "inquiry_messages_inquiry_id_idx" ON "inquiry_messages" USING btree ("inquiry_id");--> statement-breakpoint
CREATE INDEX "inquiry_messages_sender_profile_id_idx" ON "inquiry_messages" USING btree ("sender_profile_id");--> statement-breakpoint
CREATE INDEX "inquiry_messages_created_at_idx" ON "inquiry_messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "market_reference_prices_category_idx" ON "market_reference_prices" USING btree ("category");--> statement-breakpoint
CREATE INDEX "market_reference_prices_craft_idx" ON "market_reference_prices" USING btree ("craft");--> statement-breakpoint
CREATE INDEX "market_reference_prices_region_idx" ON "market_reference_prices" USING btree ("region");--> statement-breakpoint
CREATE INDEX "notifications_profile_id_idx" ON "notifications" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "notifications_profile_unread_idx" ON "notifications" USING btree ("profile_id","read");--> statement-breakpoint
CREATE INDEX "notifications_created_at_idx" ON "notifications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "pricing_recommendations_product_id_idx" ON "pricing_recommendations" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_images_product_id_idx" ON "product_images" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_images_product_role_idx" ON "product_images" USING btree ("product_id","image_role");--> statement-breakpoint
CREATE INDEX "products_status_idx" ON "products" USING btree ("status");--> statement-breakpoint
CREATE INDEX "products_status_category_id_idx" ON "products" USING btree ("status","category_id");--> statement-breakpoint
CREATE INDEX "products_artisan_id_idx" ON "products" USING btree ("artisan_id");--> statement-breakpoint
CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "user_roles_user_id_idx" ON "user_roles" USING btree ("user_id");