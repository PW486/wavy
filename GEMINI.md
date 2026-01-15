# Project Instructions: Wavy

This file provides context and guidelines for AI agents working on the Wavy project.

## 🧠 AI Features & Gemini Integration
- **Model:** Currently using `gemini-3-flash-preview` for summaries.
- **Caching:** AI summaries are stored in the `SummaryCache` table. 
  - **Logic:** We use a fixed key (`latest_summary`) to store the most recent summary.
  - **Rule:** The summary is updated every 1 hour. If a valid cache exists and is less than 1 hour old, it is returned instead of calling the Gemini API.
- **API Key:** Managed via `GEMINI_API_KEY` in `.env`.

## 🎨 Design & Animation Principles
- **Library:** Use `framer-motion` for all non-trivial transitions.
- **Style:** 
  - Use the **Cyan-to-Blue** gradient theme for primary actions and brand elements.
  - Usernames should use the `bg-clip-text text-transparent` gradient pattern.
  - Use `AnimatePresence` for entrance/exit animations of lists.
  - **Search Bar:** Uses `cyan-500` for focus ring and `focus-within` transitions.
- **Icons:** Use `lucide-react`.

## 🏗 Coding Standards
- **Search Logic:** Implemented via URL query parameter `?q=`. Components using `useSearchParams` MUST be wrapped in `<Suspense />` for Next.js build compatibility.
- **Authentication:**
  - Registration automatically logs in the user and redirects to the home feed.
  - Logout triggers a `window.location.reload()` to ensure full state reset (e.g., showing the landing banner).
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