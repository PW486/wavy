# Wavy

A modern, fluid social networking service where thoughts flow like waves. Built with Next.js, Prisma, SQLite, and powered by Google Gemini AI.

## 🌊 Core Features
- **Instant Search**: Search for waves by content or author directly from the header.
- **AI Community Pulse**: Automatically summarizes the latest 5 waves using **Gemini 3 Flash Preview**.
- **Interactive Waves**: Like your favorite waves with instant feedback.
- **Smart Caching**: AI summaries are cached in the database to minimize API calls and ensure instant loading.
  - Smooth staggered animations using **Framer Motion**.
  - Fancy gradient usernames with hover shimmer effects.
  - Modern, clean aesthetic with Tailwind CSS 4.0.
- **User Authentication**: Secure registration and login functionality.
- **Real-time Feel**: Instant post updates and layout transitions.

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone <repository-url>
cd wavy
npm install
```

### 2. Configure Environment
Create a `.env` file:
```env
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your_google_ai_studio_api_key"
```

### 3. Database Setup
```bash
npx prisma db push
npx prisma generate
```

### 4. Run
```bash
npm run dev
```

## 🛠 Tech Stack
- **Framework**: Next.js 16 (Turbopack)
- **AI**: Google Generative AI (Gemini 3 Flash Preview)
- **Database**: Prisma ORM with SQLite
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Styling**: Tailwind CSS 4.0

## ☁️ Deployment
The project is optimized for **Google Cloud Compute Engine**. Use the provided `deploy.sh` script to automate your deployment pipeline.

```bash
./deploy.sh <YOUR_PROJECT_ID>
```

## 📂 Project Structure
- `src/app/[username]`: Dynamic profile routes.
- `src/app/api/posts/summary`: AI summary logic with Prisma caching.
- `src/components`: Reusable UI components like `PostCard`.
- `prisma/schema.prisma`: Schema including `User`, `Post`, and `SummaryCache`.