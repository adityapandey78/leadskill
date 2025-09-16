
# LeadSkill - Buyer Lead Management App

A modern Next.js application for capturing, managing, and tracking buyer leads with a clean dark UI.

## Features

- Modern UI (dark mode, minimal, responsive)
- CRUD operations for buyer leads (create, read, update, delete)
- Search and filtering by city, property type, purpose, timeline
- CSV import/export functionality with validation
- Form validation with proper error handling
- Pagination and sorting
- Authentication with NextAuth.js
- Database integration with Drizzle ORM + Supabase

## Tech Stack

- **Frontend**: Next.js 15.5.3, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, NextAuth.js authentication
- **Database**: PostgreSQL with Drizzle ORM (Supabase hosted)
- **Validation**: Zod schemas, React Hook Form
- **Styling**: Tailwind CSS with custom dark theme
- **Deployment**: Vercel

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Supabase account)

### Local Development

```bash
npm install
```

**Environment Setup:**
- Copy `.env.example` to `.env.local` and fill in your Postgres and NextAuth secrets.
- **Database Setup:**
- See `.env.example` for connection string format.
- Example (psql):
  ```sql
  CREATE DATABASE leadskill;
  CREATE USER "user" WITH PASSWORD 'password';
  GRANT ALL PRIVILEGES ON DATABASE leadskill TO "user";
  ```

**Run Database Migrations:**
```bash
npx drizzle-kit push
```

**Start Development Server:**
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### 1. Connect to Vercel
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### 2. Set Environment Variables in Vercel Dashboard
Go to your Vercel project settings and add:
- `DATABASE_URL`: Your Supabase/PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random secret for NextAuth.js
- `NEXTAUTH_URL`: Your production URL (e.g., `https://your-app.vercel.app`)

### 3. Deploy
```bash
# Deploy to production
vercel --prod
```

### Database Setup for Production
If using Supabase:
1. Create a new Supabase project
2. Copy the connection string from Settings > Database
3. Run migrations: `npx drizzle-kit push` (with production DATABASE_URL)

## Design Notes

- Minimal, modern, dark UI with clean font and color choices
- Form validation with immediate feedback
- Responsive design that works on mobile and desktop
- Clean separation of client and server components
- Optimistic updates with proper error handling

## What's Done vs Skipped

- [x] All core features implemented (see above)
- [x] Production-ready with proper error handling
- [x] Clean, maintainable code structure
- [x] Comprehensive validation and type safety

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Build for production  
- `npm start` — Start production server
- `vercel` — Deploy to Vercel
