# ApplyTrack - Internship & Job Application Tracker

ApplyTrack is a professional full-stack web application designed for students, graduates, and job seekers to organize and track their internship and job applications, interviews, and overall progress.

## 🚀 Features

- **Application Tracking**: Add, edit, and manage your job applications with detailed information.
- **Interview Management**: Schedule and track interviews associated with your applications.
- **Dashboard Analytics**: Visualize your progress with status distributions and success rates.
- **Smart Notifications**: Stay updated with internal application alerts and reminders.
- **Advanced Filtering**: Search and filter applications by status, type, location, and more.
- **Secure Authentication**: JWT-based authentication with secure password hashing.

## 🛠️ Technology Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS.
- **Backend**: Node.js, Express.js, TypeScript.
- **Database**: PostgreSQL (Neon).
- **ORM**: Prisma.
- **Authentication**: JWT, bcryptjs.
- **Deployment**: Vercel.

## 🏗️ Architecture

\`\`\`text
User <-> Next.js Frontend <-> Express.js REST API <-> Prisma ORM <-> Neon PostgreSQL
\`\`\`

## ⚙️ Installation & Setup

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd applytrack
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Neon PostgreSQL credentials
npx prisma migrate dev --name init
cd ..
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your NEXT_PUBLIC_API_URL
cd ..
\`\`\`

### 4. Running the Application
To start both the frontend and backend simultaneously from the root directory:
\`\`\`bash
npm run dev
\`\`\`

## 🌐 Environment Variables

### Backend (`.env`)
- `DATABASE_URL`: Connection string for your Neon PostgreSQL database.
- `JWT_SECRET`: Secret key for signing JWTs.
- `PORT`: Port for the Express server (default: 5000).
- `FRONTEND_URL`: URL of the deployed frontend for CORS.

### Frontend (`.env.local`)
- `NEXT_PUBLIC_API_URL`: Base URL of the deployed Express backend.

## 🧪 Testing
Run backend tests using:
\`\`\`bash
cd backend
npm test
\`\`\`

## 🚢 Deployment

### Database
1. Create a free PostgreSQL database on [Neon.tech](https://neon.tech).
2. Copy the connection string to your production environment variables.

### Backend
1. Deploy the `backend` folder to Vercel.
2. Configure environment variables in the Vercel dashboard.

### Frontend
1. Deploy the `frontend` folder to Vercel.
2. Configure `NEXT_PUBLIC_API_URL` to point to your deployed backend.

## 📝 License
MIT
