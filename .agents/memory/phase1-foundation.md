---
name: KarigarAI Phase 1 foundation
description: Durable decisions for the first KarigarAI build and its external-service boundary.
---

KarigarAI Phase 1 intentionally ships a real PostgreSQL-backed foundation and deterministic demo data while keeping Supabase Auth/Storage and external AI providers configuration-ready rather than substituting local authentication.

**Why:** The product brief requires Supabase-compatible architecture, but no Supabase connection is available in the workspace yet; the app must remain runnable and honest without inventing credentials or claiming auth that is not connected.

**How to apply:** Complete the Supabase connector setup before implementing authenticated user flows, storage uploads, RLS enforcement, or the Phase 2 golden flow. Keep provider-specific logic behind server-side adapters.