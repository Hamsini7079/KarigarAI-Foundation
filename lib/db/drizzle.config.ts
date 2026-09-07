import { defineConfig } from "drizzle-kit";
import path from "path";

const databaseTarget = process.env.DB_TARGET === "supabase" ? "supabase" : "local";
const databaseUrl =
  databaseTarget === "supabase"
    ? process.env.SUPABASE_DATABASE_URL
    : process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    databaseTarget === "supabase"
      ? "SUPABASE_DATABASE_URL must be set when DB_TARGET=supabase."
      : "DATABASE_URL must be set. Ensure the local database is provisioned.",
  );
}

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "postgresql",
  out: path.join(__dirname, "./drizzle"),
  dbCredentials: {
    url: databaseUrl,
  },
});
