# ApplyTrack - Internship & Job Application Tracker

## Project Purpose
ApplyTrack is a professional full-stack web application designed for students, graduates, and job seekers to organize and track their internship and job applications, interviews, and overall progress.

## Technology Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS, React
- **Backend**: Express.js, Node.js, TypeScript
- **Database**: PostgreSQL (hosted on Neon)
- **ORM**: Prisma
- **Authentication**: Secure email/password with JWT and bcryptjs
- **Deployment**: Vercel (Frontend and Backend)
- **API**: REST API

## Architecture
The application follows a decoupled architecture:
`User` <-> `Next.js Frontend` <-> `Express.js REST API` <-> `Prisma ORM` <-> `Neon PostgreSQL`

## Coding Conventions
- **TypeScript**: Used throughout for type safety.
- **Naming**: camelCase for variables/functions, PascalCase for components/classes, kebab-case for files/folders.
- **Styling**: Utility-first approach using Tailwind CSS.
- **API**: RESTful endpoints returning consistent JSON responses.
- **Security**: No plaintext passwords, user-isolated data, input validation.

## Folder Structure
```text
applytrack/
│
├── frontend/               # Next.js Application
│   ├── app/                # App Router (Pages & Layouts)
│   ├── components/         # Reusable UI Components
│   ├── lib/                # Utility functions and API clients
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript interfaces/types
│   └── public/             # Static assets
│
├── backend/                # Express.js Application
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Auth, Validation, Error handlers
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   ├── validators/     # Zod schemas for validation
│   │   └── types/          # Backend-specific types
│   │   └── server.ts       # Entry point
│   ├── prisma/             # Prisma schema and migrations
│   │   └── schema.prisma
│   └── package.json
│
└── AGENTS.md                # AI Guidance (this file)
```

## Database Rules
- All applications, interviews, and notifications must be linked to a `User` via `userId`.
- Use Prisma for all database interactions.
- Cascade deletes appropriately (e.g., deleting an application deletes its interviews).

## API Rules
- Base URL: `/api`
- Responses must follow the format: `{ "success": boolean, "message": string, "data": any }`
- Use appropriate HTTP status codes (200, 201, 400, 401, 403, 404, 500).
- Use query parameters for filtering, searching, and pagination.

## Authentication Rules
- Passwords must be hashed using `bcryptjs` before storage.
- Use JWTs for session management.
- Protected routes must use authentication middleware to verify the JWT.
- User identity must be derived from the token, not the request body.

## Security Rules
- Input validation using Zod on the backend.
- CORS configured to allow only the frontend domain.
- Use `helmet` for basic security headers.
- No secrets committed to version control; use `.env` files.
- Strict ownership checks: users can only access their own data.

## Scope Boundaries
- **IN SCOPE**: App tracking, interview management, basic analytics, notifications, user profiles.
- **OUT OF SCOPE**: CV/Resume builders, job board scraping, external calendar integration, employer accounts.

## How to Run
### Backend
1. `cd backend`
2. `npm install`
3. Configure `.env` (DATABASE_URL, JWT_SECRET)
4. `npx prisma migrate dev`
5. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. Configure `.env.local` (NEXT_PUBLIC_API_URL)
4. `npm run dev`

## How to Test
- Backend: Implement tests using Jest/Supertest.
- Frontend: Implement tests using React Testing Library/Cypress.

## Deployment
- Database: Neon PostgreSQL.
- Backend: Vercel (via Express adapter).
- Frontend: Vercel.
