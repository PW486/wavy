# 🌊 Wavy

A fluid, minimal social network where thoughts flow like waves.

> Built with Next.js, Prisma, SQLite and Gemini — fast, light, and playful.

<div align="center">
  <img width="700" src="https://github.com/user-attachments/assets/a1773ab9-e97c-44cb-acd2-cf2ec3137fa2" />
</div>

## Features

- **Instant Search** — search waves by content or author from the header
- **AI Community Pulse** — summarizes the latest 5 waves with Gemini 3 Flash Preview (cached in DB)
- **Interactive Waves** — like with instant feedback and smooth Framer Motion animations
- **Auth** — simple sign up / login

## Getting Started

**1. Install**

```bash
git clone <repository-url>
cd wavy
npm install
```

**2. Configure**

Create `.env`:

```env
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your_google_ai_studio_api_key"
```

**3. Setup DB**

```bash
npx prisma db push
npx prisma generate
```

**4. Run**

```bash
npm run dev
```

## Tech Stack

- **Framework:** Next.js 16 (Turbopack)
- **AI:** Google Generative AI (Gemini 3 Flash Preview)
- **Database:** Prisma ORM with SQLite
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Styling:** Tailwind CSS 4.0

## Project Structure

- `src/app/[username]` — dynamic profile routes
- `src/app/api/posts/summary` — AI summary + caching logic
- `src/components` — reusable UI (`PostCard` etc.)
- `prisma/schema.prisma` — `User`, `Post`, `SummaryCache`

## Deployment

Optimized for Google Cloud Compute Engine. Uses `deploy.sh`:

```bash
# ensure .env has production values
# DATABASE_URL="file:/app/db/dev.db"

./deploy.sh <YOUR_PROJECT_ID>
```

## Notes

- Summary is cached to minimize Gemini API calls
- Requires a valid `GEMINI_API_KEY` from Google AI Studio
