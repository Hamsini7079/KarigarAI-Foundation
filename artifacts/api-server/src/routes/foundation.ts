import { Router, type IRouter } from "express";
import { GetFoundationStatusResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/foundation/status", (_req, res): void => {
  const status = GetFoundationStatusResponse.parse({
    appName: "KarigarAI",
    tagline: "Your AI Business Manager for Handmade India",
    phase: "Phase 1 — Foundation",
    authProvider: "Supabase Auth (configuration-ready)",
    dataProvider: "PostgreSQL with repository-ready schema",
    aiMode: "Provider-independent adapters (mock-ready)",
    roles: ["artisan", "buyer", "admin"],
    supportedLanguages: ["English", "Hindi", "Telugu"],
    storageBuckets: [
      "original-product-images",
      "enhanced-product-images",
      "artisan-profile-photos",
      "voice-recordings",
    ],
  });

  res.json(status);
});

export default router;