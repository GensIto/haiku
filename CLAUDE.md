# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack React application built with Vite and Hono, designed to run on Cloudflare Workers. It uses Cloudflare D1 (SQLite) for database operations, Drizzle ORM for database access, and better-auth for authentication.

### Tech Stack

**Frontend:**
- React 19 with TypeScript
- TanStack Router (file-based routing)
- TanStack Query (data fetching)
- shadcn/ui components
- Tailwind CSS 4
- next-themes (dark mode)

**Backend:**
- Hono (API framework)
- better-auth (authentication)
- Drizzle ORM
- Cloudflare D1 (SQLite)
- Cloudflare AI binding

## Architecture

### Project Structure

- `src/react-app/` - React frontend application
  - `src/react-app/routes/` - TanStack Router file-based routes
  - `src/react-app/components/ui/` - shadcn/ui components
  - `src/react-app/lib/` - Frontend utilities (router, auth client, API client)
- `src/worker/` - Cloudflare Worker backend (Hono API)
  - `src/worker/index.ts` - Main Hono app entry point
  - `src/worker/db/` - Database schema and initialization
  - `src/worker/lib/` - Authentication configuration
- `drizzle/` - Database migration files
- `dist/client/` - Built frontend assets (served by Worker)

### Deployment Architecture

The application runs as a single Cloudflare Worker that:
1. Serves the React SPA from static assets
2. Handles API routes via Hono under `/api/*`
3. Uses single-page-application routing (all routes serve index.html for client-side routing)

### Database Architecture

- **ORM**: Drizzle ORM with D1 adapter
- **Database**: Cloudflare D1 (SQLite) bound as `DB`
- **Migrations**: Stored in `drizzle/` directory
- **Schema**: Defined in `src/worker/db/schema.ts`
- **Connection**: Uses `env.DB` from `cloudflare:workers` module (not traditional connection strings)

### Authentication

- **Library**: better-auth with Drizzle adapter
- **Strategy**: Email/password authentication
- **Backend**: `src/worker/lib/auth.ts` - betterAuth instance with SQLite provider
- **Frontend**: `src/react-app/lib/betterAuth.ts` - createAuthClient instance
- **Routes**: All auth routes handled at `/api/auth/*`

## Development Commands

### Setup
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Starts Vite dev server at http://localhost:5173 with HMR

### Type Checking and Building
```bash
npm run build          # TypeScript compile + Vite build
npm run check          # Full check: tsc + build + dry-run deploy
```

### Linting
```bash
npm run lint           # Run ESLint
```

### Database Operations

```bash
# Generate migrations from schema changes
npm run db:gen

# Apply migrations locally
npm run db:migrate

# Apply migrations to production
npm run db:migrate:remote

# Open Drizzle Studio (local database)
npm run db:studio

# Open Drizzle Studio (production database)
npm run db:studio:prod
```

### Deployment

```bash
npm run preview        # Preview production build locally
npm run deploy         # Deploy to Cloudflare Workers
npx wrangler tail      # Monitor deployed worker logs
```

### Cloudflare Type Generation
```bash
npm run cf-typegen     # Generate TypeScript types for Cloudflare bindings
```

## Key Configuration Files

- `wrangler.json` - Cloudflare Worker configuration including D1 binding and AI binding
- `drizzle.config.ts` - Production Drizzle config (uses D1 HTTP driver with API tokens)
- `drizzle.config.local.ts` - Local Drizzle Studio config (reads from `.wrangler/state/`)
- `vite.config.ts` - Vite configuration with Cloudflare plugin
- `.env` - Environment variables for Drizzle production access (CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, CLOUDFLARE_D1_TOKEN)

## Important Implementation Details

### Type-Safe API Communication
The frontend and backend share types via Hono's RPC client:
```typescript
// Backend exports AppType
export type AppType = typeof route;

// Frontend uses typed client
import { hc } from "hono/client";
const client = hc<AppType>("/");
```

### Database Access Pattern
The database is accessed via Cloudflare Workers bindings, not traditional connection strings. In worker code:
```typescript
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
export const db = drizzle(env.DB, { schema });
```

### Worker Bindings
Configured in `wrangler.json`:
- `DB` - D1 database (haiku)
- `AI` - Cloudflare AI binding
- Assets served from `dist/client/` with SPA routing

### TypeScript Configuration
- `tsconfig.app.json` - Frontend config (includes `src/react-app/`)
- `tsconfig.node.json` - Node/build tooling config
- Strict mode enabled with additional linting rules

### Local vs Production Database
- **Local**: Wrangler creates SQLite file in `.wrangler/state/v3/d1/miniflare-D1DatabaseObject/`
- **Production**: Accessed via D1 HTTP API using credentials from `.env`
- Drizzle Studio uses different configs for local vs production

## Cloudflare Workers Specifics

- **Compatibility date**: 2025-10-08
- **Compatibility flags**: `nodejs_compat` enabled
- **Observability**: Enabled for monitoring
- **Upload source maps**: Enabled for debugging

## Frontend Architecture Details

### Routing

- Uses TanStack Router with file-based routing
- Route files in `src/react-app/routes/`
- Route tree auto-generated in `src/react-app/routeTree.ts`
- Root layout in `src/react-app/routes/__root.tsx`

### Styling

- Tailwind CSS 4 with `@tailwindcss/vite` plugin
- shadcn/ui components in `src/react-app/components/ui/`
- Dark mode support via next-themes
- CSS utilities: clsx, tailwind-merge, class-variance-authority

## Authentication Flow

better-auth is configured with:
- Drizzle adapter using SQLite provider
- Email/password authentication
- Database tables managed via better-auth's schema requirements

Ensure authentication tables are properly migrated when modifying auth configuration.
