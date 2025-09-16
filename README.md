
# LeadSkill Buyer Lead Intake App

A modern, minimal, dark-mode Next.js app for capturing, listing, and managing buyer leads with validation, search/filter, CSV import/export, and more.

## Features
- Modern UI (dark mode, minimal, responsive)
- Next.js App Router, TypeScript, Tailwind CSS
- Drizzle ORM + Postgres (with migrations)
- Zod validation (forms and CSV)
- Authentication (magic link or demo login)
- Full CRUD for buyers
- SSR buyers list with filters, search, pagination, CSV export
- CSV import with validation and error table
- Edit/view with concurrency and change history
- Rate limiting, error boundary, empty state, a11y basics
- Unit test for CSV/budget validation

## Getting Started

1. **Install dependencies**
	```
	npm install
	```
2. **Set up environment variables**
	- Copy `.env.example` to `.env.local` and fill in your Postgres and NextAuth secrets.
3. **Start Postgres and create the database/user**
	- See `.env.example` for connection string format.
	- Example (psql):
	  ```sql
	  CREATE DATABASE leadskill;
	  CREATE USER "user" WITH PASSWORD 'password';
	  GRANT ALL PRIVILEGES ON DATABASE leadskill TO "user";
	  ```
4. **Run Drizzle migrations**
	```
	npx drizzle-kit push
	```
5. **Start the app**
	```
	npm run dev
	```
	Visit [http://localhost:3000](http://localhost:3000)

## Design Notes
- Minimal, modern, dark UI with clean font and color choices
- All forms use Zod + React Hook Form for robust validation
- CSV import/export is robust and user-friendly
- Error boundaries and rate limiting for production safety
- Code is modular and easy to extend

## What’s Done vs Skipped
- [x] All core features implemented (see above)
- [x] Unit test for CSV/budget validation
- [ ] Advanced a11y, full test coverage, production-grade error handling (can be extended)
- [ ] Email sending for magic link (demo login is default)

## Scripts
- `npm run dev` — Start dev server
- `npx drizzle-kit push` — Run DB migrations
- `npx vitest run` — Run unit tests

---

PRs and feedback welcome!
