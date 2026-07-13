# KSS IT Committee Website

The official website for the IT Committee of Koishikawa Secondary School (都立小石川中等教育学校).

[日本語版](/docs/README-ja.md)

## Overview

A full-stack web application that serves as the committee's official platform, providing:

- Committee information and member profiles
- User authentication with admin verification
- Team member management

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript 5
- **UI:** React 19, CSS Modules
- **Database:** PostgreSQL via Drizzle ORM (`postgres-js` driver)
- **Auth:** Session-based with bcryptjs password hashing
- **Deployment:** Standalone Docker image, deployed to the shared VPS by [`2026-server-ansible`](https://github.com/KSS-IT-Committee/2026-server-ansible) (nginx + Let's Encrypt, blue/green via a 60 s poll loop, served on `kss-it.com` and `committee.kss-it.com`)
- **CI/CD:** GitHub Actions (`preview-image.yml` builds & pushes the multi-arch GHCR `preview` image the VPS pulls)

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- A PostgreSQL database

### Development

```bash
npm install
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```txt
DATABASE_URL=postgres://user:password@host:5432/committee
```

`DATABASE_URL` is the single required runtime variable (read lazily by
`src/lib/db.ts`). On the VPS it is injected automatically by the deploy infra
(`postgres://committee:…@postgres:5432/committee`); the tables self-initialize on
first boot. For a Google Analytics tag, set `GA_MEASUREMENT_ID` in
`src/app/layout.tsx`.

## Project Structure

```txt
content/
└── posts/                # News posts (markdown + frontmatter)
src/
├── app/                  # Next.js App Router pages
│   ├── api/auth/         # Authentication API routes
│   ├── committee-info/   # Protected information page
│   ├── demo/             # Demo
│   ├── events/           # Protected events info
│   ├── login/            # Login page
│   ├── news/             # Public news list and detail pages
│   ├── signup/           # Registration page
│   └── tutorial/         # Protected tutorials
├── components/           # Reusable React components
├── lib/                  # Auth and database utilities
├── styles/               # CSS Modules
└── types/                # TypeScript definitions
```

### News Posts

News posts live in `content/posts/*.md` (frontmatter: `id`, `date`, `title`,
`tag`). At build time `scripts/build-posts.mjs` (run automatically by the
`predev`/`prebuild` hooks) renders them into `src/lib/posts.generated.json`,
which the `/news/list` and `/news/[id]` pages statically import — the markdown
is never read at runtime. To add a news post, drop a new `.md` file into
`content/posts/`.

## Features

### Authentication

- User registration with password hashing
- Session-based auth with 7-day sliding expiration
- Admin verification required for new accounts
- Secure HttpOnly cookies

### Protected Content

- Middleware-based route protection
- Tutorial content for committee members
- Committee information access control

## Branch Naming Convention

- `feature/` — new functionality
- `fix/` or `bugfix/` — fixing bugs
- `hotfix/` — urgent production fix
- `chore/` — maintenance or cleanup
- `refactor/` — internal code changes
- `test/` — testing or experiment branches
- `docs/` — documentation updates

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production (standalone output)
npm run posts        # Render content/posts/*.md into src/lib/posts.generated.json
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint and auto-fix
npm run format:check # Run Prettier (check)
npm run format       # Run Prettier and auto-format
npm run generate     # drizzle-kit generate (create a migration from db/schema.ts)
npm run migrate      # drizzle-kit migrate (apply migrations to DATABASE_URL)
npm run push         # drizzle-kit push (push schema directly)
npm run studio       # drizzle-kit studio (schema explorer)
```

## License

This project is maintained by the KSS IT Committee, and is under MIT License.
