# Micro-SNS

A simple, text-based social networking service built with Next.js, Prisma, and SQLite.

## Features
- **User Authentication**: Register and Login functionality.
- **Timeline**: View posts from all users in chronological order.
- **Posting**: Authenticated users can create text-based posts.
- **Responsive Design**: Clean interface built with Tailwind CSS.

## Getting Started

Follow these steps to set up and run the project in a new environment.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd micro-sns
```

### 2. Install Dependencies

Install the required Node.js packages:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory of the project:

```bash
touch .env
```

Add the following content to `.env` to configure the SQLite database:

```env
DATABASE_URL="file:./dev.db"
```

### 4. Initialize the Database

Push the Prisma schema to the database to create the necessary tables:

```bash
npx prisma db push
```

### 5. Run the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app`: Application source code (Pages, API routes).
- `src/lib/prisma.ts`: Prisma client instance.
- `prisma/schema.prisma`: Database schema definition.

## Tech Stack

- **Framework**: Next.js 16
- **Database**: SQLite (via Prisma ORM)
- **Styling**: Tailwind CSS