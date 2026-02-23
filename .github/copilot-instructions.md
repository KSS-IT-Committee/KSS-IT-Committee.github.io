# Copilot Instructions

## Project Overview

This is the **KSS IT Committee** website — a Next.js 16 (App Router) application with React 19, TypeScript, and Vercel Postgres (Neon). It features authentication, event management with RSVP, tutorials, and member demo pages. Deployed via Docker with Nginx reverse proxy and zero-downtime rolling deploys.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript (strict mode)
- **Database**: Vercel Postgres (`@vercel/postgres`) with Neon
- **Auth**: Session-based with HTTP-only cookies, bcrypt password hashing
- **Styling**: CSS Modules (no Tailwind, no CSS-in-JS)
- **Deployment**: Docker Compose + Nginx, rolling deploy script
- **Analytics**: Vercel Analytics + Speed Insights

## Project Structure

```
src/
├── app/              # Next.js App Router pages and API routes
│   ├── api/          # Route handlers (auth, events)
│   ├── tutorial/     # Tutorial pages (git, WSL, etc.)
│   ├── events/       # Event CRUD pages
│   ├── demo/         # Member demo pages
│   └── globals.css   # Global styles + CSS variables
├── components/       # Reusable React components
│   └── events/       # Event-specific components
├── hooks/            # Custom React hooks (useAsyncData)
├── lib/              # Server utilities (auth, db, constants, api-utils)
├── styles/           # CSS Modules for components
└── types/            # TypeScript type definitions
```

## Code Style (from docs/CODE-STYLE-ja.md)

### Naming Conventions

| Element                 | Convention      | Example                          |
| :---------------------- | :-------------- | :------------------------------- |
| React components        | PascalCase      | `EventCard.tsx`, `BackButton.tsx` |
| Component files         | PascalCase      | `<ComponentName>.tsx`            |
| Page components         | `page.tsx`      | `export default function <PageName>Page()` |
| Library/utility files   | kebab-case      | `api-utils.ts`, `auth.ts`       |
| Directories             | kebab-case      | `committee-info/`, `git-commands/` |
| CSS Modules (component) | PascalCase      | `EventCard.module.css` → `src/styles/` |
| CSS Modules (page)      | kebab-case      | `not-found.module.css` → near page |
| Custom hooks            | camelCase       | `useAsyncData`                   |
| Functions               | camelCase       | `validateSession`, `requireAuth` |
| Variables               | camelCase       | `isAuthenticated`, `hasPermission` |
| Constants               | CONSTANT_CASE   | `RSVP_STATUS`, `ERROR_MESSAGES`  |
| Types/Interfaces        | PascalCase      | `EventResponse`, `LoginRequest`  |
| Images                  | kebab-case      | placed in `public/`              |

### Formatting Rules

- **Indentation**: 2 spaces
- **Quotes**: Double quotes (`"`)
- **Semicolons**: Always
- **Trailing commas**: Always (multi-line arrays, objects, params)
- **Equality**: Strict `===` / `!==`
- **String interpolation**: Template literals `` `name: ${name}` ``
- **Files**: End with a newline

### Import Order

1. External libraries (`next`, `react`, third-party)
2. Internal modules (`@/lib/`, `@/components/`, `@/hooks/`)
3. Styles (`@/styles/`)

Use double quotes. Prefer alphabetical order within groups.

### Export Rules

- **Named exports** for components, functions, and types (prevents typos)
- **`export default`** only for page components (`page.tsx`)

### Function Style

- Arrow functions `() => {}` for functions inside `.tsx` files
- `function` declarations for React component definitions

### Boolean Naming

Prefix with `is`, `has`, or `can` (e.g., `isAuthenticated`, `hasPermission`, `canEdit`).

## Component Patterns

### Server Components (default)

Most components are server components. Only add `"use client"` when the component requires browser APIs, state, effects, or event handlers.

**Server component examples**: `AuthGuard`, `ErrorMessage`, `IconCard`, `LoadingSpinner`, `maintainerCard`, `NoScript`, `Plaintext`, `DynamicLink`, `Linklist`

### Client Components (`"use client"`)

Add the directive only when needed for interactivity.

**Client component examples**: `BackButton`, `codeBlock`, `EventForm`, `Konami-Easter`, `LogoutButton`, `PageNavBar`, `TutorialLayout`

### Component Structure

```tsx
// 1. "use client" directive (only if needed)
"use client";

// 2. External imports
import { useState } from "react";
import Image from "next/image";

// 3. Internal imports
import { ERROR_MESSAGES } from "@/lib/constants";

// 4. Style imports
import styles from "@/styles/ComponentName.module.css";

// 5. Props interface
interface ComponentNameProps {
  title: string;
  isVisible?: boolean;
}

// 6. JSDoc documentation
/**
 * Brief description of what the component does.
 */
export function ComponentName({ title, isVisible = true }: ComponentNameProps) {
  return (
    <div className={styles.container}>
      {title}
    </div>
  );
}
```

### Key Conventions

- Props interface: `{ComponentName}Props` suffix
- CSS Modules imported from `@/styles/` for components
- JSDoc documentation on exported components
- Use `React.memo()` for expensive renders (e.g., `codeBlock`, `maintainerCard`)
- Use Next.js `<Image>` for optimized images, `<Link>` for navigation

## API Route Patterns

### Route Handler Structure

```tsx
import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createSuccessResponse, createErrorResponse } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  try {
    // Business logic
    return createSuccessResponse(data);
  } catch {
    return createErrorResponse("エラーメッセージ", 500);
  }
}
```

### API Conventions

- Authentication via `requireAuth()` helper (returns session or error Response)
- Consistent responses via `createSuccessResponse()` / `createErrorResponse()`
- Cache control via `createOptimizedResponse()` with options: `"no-cache"`, `"public"`, `"private"`
- Error messages are in **Japanese**
- Input validation before database operations
- HTTP status codes: 200/201 success, 400 validation, 401 auth, 403 permission, 404 not found, 500 server error

## Authentication

- Session-based auth with HTTP-only, Secure, SameSite=strict cookies
- `validateSession()` for server components (redirects to `/login`)
- `requireAuth()` for API routes (returns error response)
- Sessions expire after 7 days with sliding expiration
- New users require admin approval (`verified` flag)
- Passwords hashed with bcrypt (10 rounds)

## Database

- All queries are in `src/lib/db.ts` organized by namespace: `userQueries`, `sessionQueries`, `eventQueries`, `rsvpQueries`
- Tables: `users`, `sessions`, `events`, `rsvps`
- Uses parameterized queries (SQL injection prevention)
- Auto-cleanup: expired sessions, past events (>5 days old)

## Middleware

- `src/middleware.ts` protects routes: `/tutorial/*`, `/committee-info/*`, `/events/*`
- Sets security headers: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`
- Runs at the Edge

## Styling

- **CSS Modules only** — no Tailwind, no styled-components
- Component styles go in `src/styles/<ComponentName>.module.css`
- Page styles go near the page file as `<page-name>.module.css`
- CSS variables defined in `globals.css` for theming (`--background`, `--foreground`)
- Dark mode via `prefers-color-scheme` media query
- camelCase for CSS class names inside modules

## Git Conventions

### Branch Naming

Format: `<branch-type>/<topic-name>` (topic in kebab-case)

| Type       | Purpose                                    |
| :--------- | :----------------------------------------- |
| `feature`  | New functionality (demo pages: `feature/demo/<username>`) |
| `fix`      | Bug fixes                                  |
| `bugfix`   | Bug fixes (alternative)                    |
| `hotfix`   | Urgent production fixes                    |
| `chore`    | Maintenance tasks                          |
| `refactor` | Code improvements                          |
| `test`     | Experimental branches                      |
| `docs`     | Documentation updates                      |

## Anti-Patterns to Avoid

- Meaningless abbreviations (`usr`, `cfg`, `mgr`) — use full words
- Similar confusing names in the same context (`UserCard` vs `UserItem`)
- Common abbreviations are OK: `URL`, `API`, `ID`
- `export default` on non-page components
- CSS-in-JS or inline styles
- Using `==` instead of `===`

## Build & Deploy

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
./deploy-rolling.sh  # Zero-downtime Docker deployment
```

## Path Aliases

- `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- Always use `@/` imports for internal modules

## Important Notes

- Error messages throughout the app are in **Japanese**
- The project uses `server-only` package to prevent server code from leaking to client bundles
- Image optimization is configured for GitHub avatars, Qiita, AtCoder, and other external sources
- `react-syntax-highlighter` is in `optimizePackageImports` for tree-shaking
- Framework/library conventions override project conventions when they conflict
