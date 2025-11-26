# KSS IT Committee Website

The official website for the IT Committee of Koishikawa Secondary School (都立小石川中等教育学校).

## Overview

A full-stack web application that serves as the committee's official platform, providing:
- Committee information and member profiles
- User authentication with admin verification
- Team member management

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript 5
- **UI:** React 19, CSS Modules
- **Database:** Vercel Postgres (Neon)
- **Auth:** Session-based with bcryptjs password hashing
- **Deployment:** Docker, Nginx (load balancer), Vercel
- **CI/CD:** GitHub Actions

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- PostgreSQL (or use Vercel Postgres)

### Development

```bash
npm install
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```
POSTGRES_URL=your_postgres_connection_string
```

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── api/auth/         # Authentication API routes
│   ├── committee-info/   # Protected member area
│   ├── login/            # Login page
│   ├── signup/           # Registration page
│   └── tutorial/         # Protected tutorials
├── components/           # Reusable React components
├── lib/                  # Auth and database utilities
├── styles/               # CSS Modules
└── types/                # TypeScript definitions
```

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
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## License

This project is maintained by the KSS IT Committee, and is under MIT License.
