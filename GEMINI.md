# Project Instructions: Wavy

This file provides context and guidelines for AI agents working on the Wavy project.

## 🧠 AI Features & Gemini Integration
- **Model:** Currently using `gemini-3-flash-preview` for summaries.
- **Caching:** AI summaries are stored in the `SummaryCache` table. 
  - **Logic:** We generate a unique key based on the sorted IDs of the summarized posts.
  - **Rule:** Always check the cache before calling the Gemini API to reduce latency and costs.
- **API Key:** Managed via `GEMINI_API_KEY` in `.env`.

## 🎨 Design & Animation Principles
- **Library:** Use `framer-motion` for all non-trivial transitions.
- **Style:** 
  - Use the **Cyan-to-Blue** gradient theme for primary actions and brand elements.
  - Usernames should use the `bg-clip-text text-transparent` gradient pattern.
  - Use `AnimatePresence` for entrance/exit animations of lists.
- **Icons:** Use `lucide-react`.

## 🏗 Coding Standards
- **Framework:** Next.js 16+ (App Router).
- **Components:** Functional components with TypeScript. Prefer Server Components for data fetching where possible.
- **Shared UI:** Global components belong in `src/components`. Page-specific components can stay in their route folder.
- **Database:** All DB interactions via `src/lib/prisma.ts`.

## 🛠 Database Maintenance
- After changing `prisma/schema.prisma`:
  1. Run `npx prisma db push` to sync.
  2. Run `npx prisma generate` to update the client.
  3. **Note:** Local dev server may need a restart to recognize new Prisma models.

## 🚀 Deployment Workflow
- The `deploy.sh` script automates GCP deployment.
- Ensure any new environment variables are added to the deployment configuration.