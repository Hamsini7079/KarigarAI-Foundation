import { pool } from "@workspace/db";
import { ensureDemoData } from "../src/lib/seed.ts";

try {
  await ensureDemoData();
  console.log("Supabase demo seed completed.");
} finally {
  await pool.end();
}