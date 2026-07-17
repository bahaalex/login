# NOIR — The Detective's Guild

A premium detective-mystery web application with a cinematic **black & gold**
theme. Solve investigations, examine evidence, name the culprit, climb the
ranks, and manage everything from a professional admin dashboard.

## Features

- **Cinematic landing page** — animated hero, featured cases, "how it works", live stats.
- **Authentication** — sign up, log in, forgot/reset password (JWT httpOnly cookie sessions).
- **Personal dashboard** — points, global rank, cases solved, achievements, active cases.
- **Case pages** — full briefing plus an evidence board of photos (lightbox), video, audio, documents, and downloadable files.
- **Investigation submissions** — name the suspect and defend your reasoning; auto-graded with points, admin-reviewable.
- **Global leaderboard** — top-100 detectives with a podium and ranking table.
- **Profile page** — editable dossier, statistics, rank progress, and unlockable badges.
- **Admin dashboard** — create/edit/delete cases, manage evidence, review submissions, and manage users.
- **Fully responsive** — desktop and mobile, with smooth Framer Motion animations.

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS (custom noir/gold design system)
- Framer Motion (animations)
- Prisma ORM + SQLite (zero-config local database)
- JWT auth (`jsonwebtoken`) with bcrypt password hashing
- Zod validation

## Getting Started

```bash
# 1. Install dependencies (also runs `prisma generate`)
npm install

# 2. Configure environment
cp .env.example .env   # then set a JWT_SECRET

# 3. Create the database schema
npm run db:migrate     # or: npx prisma migrate deploy

# 4. Seed demo cases, users, and achievements
npm run db:seed

# 5. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seeded Accounts

| Role  | Email             | Password       |
| ----- | ----------------- | -------------- |
| Admin | `admin@noir.io`   | `detective123` |
| User  | `sam@noir.io`     | `detective123` |

> The **first account ever created** (via sign up) automatically becomes an
> admin, so a fresh database is usable without the seed.

## Scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the dev server                 |
| `npm run build`   | Production build                     |
| `npm run start`   | Start the production server          |
| `npm run lint`    | Run ESLint                           |
| `npm run db:migrate` | Apply Prisma migrations           |
| `npm run db:seed` | Seed demo data                       |
| `npm run db:reset` | Reset the database and re-seed      |

## Environment Variables

| Variable       | Description                              |
| -------------- | ---------------------------------------- |
| `DATABASE_URL` | Prisma connection string (SQLite file).  |
| `JWT_SECRET`   | Secret used to sign session tokens.      |

## Notes

- Password reset has no email provider wired up; in development the reset link
  is returned directly by the API so the flow is fully testable.
- Evidence images use placeholder services and sample media URLs; the admin
  dashboard lets you replace them with real assets.
