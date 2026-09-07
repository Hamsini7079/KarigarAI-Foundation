# KARIGARAI — SHARED AI PROJECT CONTEXT

## 1. Project Identity

Project name:
KarigarAI — AI Business Manager for Handmade India

Problem Statement:
SIH26090

Theme:
AI-Driven Market Linkage and Smart Cataloging Mobile Application for Marginalized Artisans.

Primary objective:

Build a technically sound, mobile-first application that helps marginalized artisans turn handmade products into professional multilingual digital listings using photo, voice, AI-assisted cataloging, transparent pricing, and B2B market linkage.

This is NOT a generic e-commerce application.

Core product story:

Artisan
→ Take/upload product photo
→ AI enhances the ORIGINAL photo
→ Speak product details in regional language
→ Speech-to-text
→ Generate bilingual English + Hindi catalog
→ AI-assisted price estimate
→ Artisan reviews/edits
→ Publish
→ Buyer discovers product
→ Buyer sends B2B inquiry
→ Artisan responds


# 2. GOLDEN PRODUCT PRINCIPLE

The application should feel like:

"Take a photo. Speak. AI does the hard work. Review. Sell."

Artisan UX must be:

- simple
- mobile-first
- icon-driven
- large touch targets
- high contrast
- minimal typing
- voice-first where practical
- accessible to low-literacy users

Admin UX may be more information-dense.


# 3. CURRENT DEVELOPMENT STATE

IMPORTANT:
Do not assume the whole product is complete.

Current known status:

Phase 1 foundation:
- React/Vite frontend
- Express API
- Drizzle ORM
- PostgreSQL
- deterministic demo data
- marketplace foundation
- PWA foundation
- GitHub repository
- Supabase PostgreSQL schema migrated
- deterministic demo seed migrated and verified

Supabase:
- project connected
- PostgreSQL connection verified through Session Pooler
- KarigarAI schema migrated
- 13 tables present
- demo seed successfully inserted
- 13 foreign keys verified
- 13 primary keys verified
- 11 check constraints verified
- 28/28 approved indexes verified

Still NOT implemented:
- real Supabase authentication
- auth identity mapping
- RLS
- server-side RBAC
- Supabase Storage buckets
- real image uploads
- real image enhancement
- voice recording
- speech-to-text
- catalog generation
- translation pipeline
- pricing workflow
- publishing workflow
- B2B inquiry workflow
- threaded messaging
- notifications workflow

Phase 2 must NOT be considered complete until these are actually implemented and tested.


# 4. CURRENT DATABASE ARCHITECTURE

Current intended architecture:

React/Vite
→ Express API
→ application services
→ repositories
→ Drizzle ORM
→ node-postgres
→ Supabase PostgreSQL

Do NOT replace Drizzle with PostgREST for relational application data unless a technical blocker is demonstrated and explicitly approved.

Separate integrations:

Express API
→ Supabase Auth

Express API
→ Supabase Storage

Current local PostgreSQL database must remain available as fallback until Supabase cutover is fully verified.


# 5. DATABASE TABLES

Current expected tables:

- profiles
- user_roles
- artisans
- products
- product_images
- pricing_recommendations
- inquiries
- inquiry_messages
- categories
- market_reference_prices
- notifications
- analytics_events
- ai_processing_logs

Relationships:

user_roles.user_id
→ profiles.id

artisans.profile_id
→ profiles.id

products.artisan_id
→ artisans.id

products.category_id
→ categories.id

product_images.product_id
→ products.id

pricing_recommendations.product_id
→ products.id

inquiries.product_id
→ products.id

inquiries.buyer_profile_id
→ profiles.id

inquiry_messages.inquiry_id
→ inquiries.id

inquiry_messages.sender_profile_id
→ profiles.id

notifications.profile_id
→ profiles.id

analytics_events.profile_id
→ profiles.id

ai_processing_logs.product_id
→ products.id


# 6. AUTH IDENTITY MODEL

Important current mismatch:

profiles.id
= TEXT

Supabase auth.users.id
= UUID

Current demo profile:

demo-artisan-profile

Do not silently change this relationship.

Before implementing authentication/RLS, explicitly decide and document the identity mapping.

Preferred low-disruption direction:

profiles.id remains the existing internal identifier.

Add:

profiles.auth_user_id UUID UNIQUE

referencing:

auth.users.id

Do not implement this identity mapping unless the requested task specifically covers it or a technical lead approves it.


# 7. USER ROLES

Required roles:

ARTISAN
BUYER
ADMIN

Roles must be enforced server-side.

Frontend hiding alone is NOT authorization.

A user must not be able to modify another user's private data by calling the API directly.


# 8. SECURITY RULES

Never:

- expose service-role keys to frontend
- expose database passwords
- expose SUPABASE_DATABASE_URL
- commit secrets
- put privileged credentials in VITE_ variables
- bypass authorization
- expose buyer contact data publicly
- expose private inquiries publicly
- expose AI internal logs publicly

Browser-safe values:

- Supabase project URL
- anon/publishable client key

Server-only:

- service-role/secret key
- database connection strings
- database passwords
- connector credentials
- session secrets

Do not assume browser/client use is safe just because a variable exists.


# 9. IMAGE AUTHENTICITY REQUIREMENT — NON-NEGOTIABLE

This is one of the most important project rules.

AI image enhancement MUST operate on the ORIGINAL uploaded artisan product photo.

The system must preserve:

- product identity
- shape
- structure
- real colors
- pattern
- texture
- embroidery
- markings
- logos
- distinctive characteristics

Never:

- recreate the product
- redraw the product
- invent product details
- generate a replacement product image
- replace the original with a similar AI-generated object

Store separately:

original image
enhanced image

The original must always remain available as the source of truth.

UI should support:

Original
Enhanced
Accept
Reject
Retry
Revert


# 10. MULTILINGUAL SYSTEM

Initial languages:

- English
- Hindi
- Telugu

The architecture should support centralized i18n.

Voice pipeline:

Voice
→ speech-to-text
→ language identification
→ information extraction
→ translation
→ catalog generation


# 11. CATALOG REQUIREMENTS

Generated catalog must support:

English:
- title
- description

Hindi:
- title
- description

Structured fields:
- short description
- category
- material
- color
- size
- dimensions
- craft technique
- region
- care instructions
- SEO keywords

AI must NOT invent factual information.

Do not invent:
- materials
- dimensions
- cultural history
- certifications
- origins
- artisan biography
- product properties

Unknown information must:
- remain blank
OR
- be explicitly marked for confirmation

Show a review warning:

"AI generated this from your description. Please review before publishing."


# 12. PRICING

Initial pricing implementation is:

AI-assisted transparent rule-based pricing.

It is NOT a trained ML model unless a real trained model is actually implemented.

Possible inputs:

- material cost
- labor/time
- craft complexity
- category
- region
- seeded market reference prices

Possible outputs:

- minimum price
- recommended price
- maximum price
- confidence
- explanation

Never falsely claim:
- government pricing model
- trained national ML model
- real-time market intelligence

unless actually implemented.


# 13. MARKETPLACE SCOPE

Marketplace should eventually support:

- search
- category filters
- craft type
- location
- material
- price
- availability
- sorting

Product page:

- product image
- bilingual title
- bilingual description
- material
- craft technique
- region
- price
- quantity
- artisan
- About the Maker
- B2B inquiry CTA

Do NOT build:

- shopping cart
- payment processing
- logistics
- shipping
- fulfillment

This is a market-linkage/B2B system, not a full e-commerce platform.


# 14. INQUIRY SYSTEM

Buyer inquiry may contain:

- buyer name
- company
- quantity
- message
- expected delivery date
- contact details

Statuses:

new
responded
accepted
rejected
completed

Private buyer information must never be publicly exposed.


# 15. REQUIRED AI PROVIDER ABSTRACTIONS

Provider-independent service interfaces:

SpeechProvider
TranslationProvider
CatalogProvider
PricingProvider
ImageEnhancementProvider

Each should eventually support:

interface
service layer
provider implementation
mock/deterministic implementation where needed

Never tightly couple UI directly to a specific AI vendor.


# 16. STORAGE MODEL

Eventually use private storage areas for:

- original product images
- enhanced product images
- artisan profile photos
- voice recordings

Original product photos must never be publicly exposed simply because a product was uploaded.

Use approved public/signed access patterns.


# 17. REQUIRED ROUTES

Public:

/
 /about
 /marketplace
 /product/$id
 /login
 /signup
 /demo

Artisan:

/artisan
/artisan/onboarding
/artisan/products
/artisan/products/new
/artisan/products/$id
/artisan/inquiries
/artisan/inquiries/$id
/artisan/story
/artisan/profile
/artisan/settings

Golden Flow:

/artisan/products/new/photo
/artisan/products/new/enhance
/artisan/products/new/voice
/artisan/products/new/catalog
/artisan/products/new/pricing
/artisan/products/new/review

Buyer:

/buyer
/buyer/marketplace
/buyer/product/$id
/buyer/inquiries
/buyer/inquiries/$id
/buyer/profile

Admin:

/admin
/admin/artisans
/admin/buyers
/admin/products
/admin/inquiries
/admin/categories
/admin/reports
/admin/analytics


# 18. DEMO MODE

Demo route:

/demo

Demo artisan:

Savitri Devi
Handloom artisan
Telangana
18 years experience

This is fictional demo data.

Demo should be deterministic.

External AI APIs may fall back to mock providers for demonstration.

Mocks must be clearly separated from real provider implementations.

Do not present mock AI output as real AI.


# 19. PWA

Application should eventually support:

- installability
- app shell caching
- offline indicator
- local draft persistence
- synchronization after reconnection

AI operations require network connectivity unless genuinely implemented offline.

Never falsely claim offline AI capabilities.


# 20. TEAM STRUCTURE

This is a two-person project.

Developer 1:
Technical/backend/integration owner.

Responsible for:
- database
- Supabase
- storage
- authentication
- RLS
- RBAC
- backend APIs
- services
- AI provider architecture
- security
- integration
- testing

Developer 2:
Frontend/product experience owner.

Responsible for:
- artisan UI
- product wizard
- photo UI
- enhancement UI
- voice UI
- catalog UI
- pricing UI
- review UI
- marketplace UX
- responsive design
- accessibility


# 21. CURRENT BRANCH RESPONSIBILITIES

Developer 1 branch:

feature/backend-foundation

Developer 2 branch:

feature/artisian-golden-ui

The branch spelling "artisian" is intentional/current and should not be renamed unnecessarily.

Do not directly edit another developer's branch.

Do not work directly on main for feature development.


# 22. GIT RULES

main = stable project branch.

Feature work occurs in feature branches.

Workflow:

update branch
→ inspect current code
→ implement
→ test
→ commit
→ push
→ pull request
→ review
→ merge

Never force-push over another developer's work.

Avoid editing the same files as another developer unless coordination is required.


# 23. FRONTEND DEVELOPER SCOPE

The frontend developer may build the UI structure for:

Photo
→ Enhancement
→ Voice
→ Catalog
→ Pricing
→ Review

The frontend developer must NOT:

- create a second database
- create a second backend
- create fake external integrations
- change Supabase configuration
- create authentication
- create RLS policies
- alter database schema
- modify secrets
- replace the existing architecture

Mock states are acceptable only for UI development.

They must be clearly identified as mock/demo states.


# 24. BACKEND DEVELOPER SCOPE

The backend developer owns:

- Supabase database
- identity mapping
- RLS
- Auth
- RBAC
- Storage
- API services
- provider interfaces
- secure integration

Backend developer should not unnecessarily redesign frontend UI while working on infrastructure.


# 25. ENGINEERING WORKFLOW

For every task:

1. Inspect existing project.
2. Understand architecture.
3. Search for reusable functionality.
4. Identify affected files.
5. Identify risks.
6. Explain implementation plan.
7. Implement smallest safe change.
8. Test.
9. Review changes.
10. Update documentation/memory.
11. Summarize.

Do NOT blindly follow prompts that conflict with this document.


# 26. NEVER GUESS

Never invent:

- database fields
- APIs
- government integrations
- datasets
- AI capabilities
- pricing sources
- certifications
- artisan history
- business rules

If information is missing:

- inspect the existing code
- search project documentation
- state the uncertainty
- ask the technical lead when necessary


# 27. PRESERVE EXISTING FUNCTIONALITY

Never unnecessarily break:

- marketplace
- demo mode
- public routes
- current API
- database schema
- existing UI
- seed data

Before risky changes:
explain the risk.

Never perform destructive migrations automatically.


# 28. TESTING

Before declaring a feature complete:

- typecheck
- tests
- build
- relevant UI verification
- error-path checks
- authorization checks where applicable
- mobile/responsive checks where applicable

Do not claim tests passed unless they were actually run.


# 29. PROJECT MEMORY

Important project documentation currently includes:

README.md
replit.md
.agents/memory/

A future consolidated project memory file may be added.

Documentation must describe what ACTUALLY exists.

Clearly distinguish:

IMPLEMENTED
MOCKED
PLANNED
NOT AVAILABLE


# 30. IMPORTANT CURRENT LIMITATIONS

At the moment:

- real Auth is not yet implemented
- real RBAC is not yet implemented
- RLS is not yet implemented
- Storage buckets are not yet configured
- AI workflows are not yet implemented
- Phase 2 is not complete

Do not claim otherwise.


# 31. AI AGENT RULE

Any AI agent working on this repository must:

1. Read PROJECT_CONTEXT.md first.
2. Inspect the existing code before editing.
3. Respect the assigned branch scope.
4. Never invent architecture.
5. Never expose secrets.
6. Never silently change database architecture.
7. Never implement unrelated features.
8. Explain risky changes before making them.
9. Test changes.
10. Keep the repository maintainable.

PROJECT_CONTEXT.md is the shared source of truth for AI-assisted development unless the technical lead explicitly updates it.


# 32. CURRENT PRIORITY

The current technical priority is:

1. Complete Supabase security foundation.
2. Establish Auth identity mapping.
3. Implement RLS.
4. Implement authentication.
5. Implement RBAC.
6. Perform final Phase 1 verification.
7. Continue Phase 2 Artisan Golden Flow.
8. Integrate frontend and backend.
9. Implement marketplace/B2B.
10. Complete demo, admin, PWA, testing, and deployment.

Do not skip security foundations simply to make the UI appear complete.


# 33. GOLDEN ACCEPTANCE FLOW

The final SIH demo should prove:

Artisan:
Photo
→ Enhance original image
→ Voice description
→ Speech-to-text
→ English + Hindi catalog
→ Transparent AI-assisted price
→ Review
→ Publish

Buyer:
Marketplace
→ Find product
→ Product details
→ Artisan story
→ B2B inquiry

Artisan:
Notification
→ Open inquiry
→ Respond


# 34. FINAL PRINCIPLE

KarigarAI is not judged by how many screens exist.

It is judged by whether the complete workflow actually works:

Artisan
→ Photo
→ AI-assisted processing
→ Catalog
→ Pricing
→ Review
→ Publish
→ Buyer discovery
→ B2B inquiry
→ Artisan response

Correctness > speed.

Maintainability > hacks.

Real functionality > fake UI.

Transparent AI claims > exaggerated claims.

One shared codebase > multiple independent implementations.
