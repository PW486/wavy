# Project Instructions: Wavy

This file provides context and guidelines for AI agents working on the Wavy project.

## Tech Stack
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Database:** Prisma ORM
- **Styling:** Tailwind CSS
- **Authentication:** Custom API routes (`/api/auth`)

## Coding Standards
- Use **functional components** and **Server Components** by default.
- Use **TypeScript interfaces** for data structures.
- Follow the existing project structure in `src/app` for routing.
- Keep components small and modular.

## Database Guidelines
- All database interactions should go through `src/lib/prisma.ts`.
- Run `npx prisma generate` after modifying `schema.prisma`.

## Development Workflow
- Follow the established pattern for API routes in `src/app/api`.
- Ensure new features are reflected in the `Dockerfile` if system-level dependencies are added.
