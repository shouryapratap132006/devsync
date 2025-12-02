# DevSync – AI Career Growth Partner

1. Project Title

DevSync – AI Career Growth Partner

2. Problem Statement

Developers often lack structured and personalized guidance to achieve their career goals. Learning resources are scattered, and tracking progress becomes tedious. DevSync solves this by acting as an AI-powered career mentor that helps developers assess their skills, generate personalized learning roadmaps, and track their growth in real time — all within a single integrated platform.

3. System Architecture

Architecture Flow: Frontend (Next.js) → Backend (Node.js + Express API) → Database (MongoDB)

Frontend
- Next.js (app router)
- Tailwind CSS for styling
- Framer Motion for UI animations
- Axios for HTTP requests

Backend
- Node.js + Express.js
- JWT authentication, bcrypt for password hashing
- REST API endpoints for goals, tasks, roadmaps, community, and profile

Database
- MongoDB Atlas (NoSQL)

Hosting
- Frontend: Vercel
- Backend: Render or Railway
- Database: MongoDB Atlas

4. Key Features

- Authentication & Authorization: Secure JWT login/signup, bcrypt encryption, role-based access controls
- CRUD Operations: Full create/read/update/delete for goals, tasks, roadmaps, posts, and profiles
- Personalized Roadmaps: AI-powered roadmap generation using an LLM (server-side API)
- Progress Tracking: Track goal progress, task completion, and historical milestones
- Community: Discussion posts with search, filtering, pagination and moderation
- Searching / Sorting / Filtering: Keyword search, sort by date/popularity, filter by category/status
- Pagination: Client-side pagination for goals/tasks; server-side pagination endpoints for large lists

5. Tech Stack

- Frontend: Next.js, Tailwind CSS, Framer Motion, Axios
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Authentication: JWT, bcrypt
- AI: LLM API (configurable -  Google Gemini)
- Charts: Recharts or Chart.js for progress visuals
- Hosting: Vercel (frontend), Render / Railway (backend)

6. API Overview

Below are the API routes implemented in this repository (mounted under `/api`). Endpoints marked `Auth` require a valid JWT unless otherwise noted.

| Category | Endpoint | Method | Description | Access |
|---|---|---:|---|---|
| Authentication | `/api/auth/signup` | POST | Register new user | Public |
| Authentication | `/api/auth/login` | POST | Authenticate user and return JWT | Public |
| Goals | `/api/goals` | GET | Get all goals for authenticated user | Authenticated |
| Goals | `/api/goals` | POST | Create a new goal | Authenticated |
| Goals | `/api/goals/:id` | PUT | Update a goal by id | Authenticated |
| Goals | `/api/goals/:id` | DELETE | Delete a goal by id | Authenticated |
| Tasks | `/api/tasks` | GET | Get all tasks for authenticated user | Authenticated |
| Tasks | `/api/tasks` | POST | Create a new task | Authenticated |
| Tasks | `/api/tasks/:id` | PUT | Update a task by id | Authenticated |
| Tasks | `/api/tasks/:id` | DELETE | Delete a task by id | Authenticated |
| Roadmaps | `/api/roadmaps` | GET | Get all saved roadmaps | Authenticated |
| Roadmaps | `/api/roadmaps/:id` | GET | Get a roadmap by id | Authenticated |
| Roadmaps | `/api/roadmaps` | POST | Create/save a roadmap | Authenticated |
| Roadmaps | `/api/roadmaps/:id` | DELETE | Delete a roadmap by id | Authenticated |
| Community | `/api/community/posts` | GET | Get community posts (supports filters/pagination) | Authenticated |
| Community | `/api/community/posts` | POST | Create a new post | Authenticated |
| Community | `/api/community/posts/:id/like` | POST | Like/unlike a post | Authenticated |
| Community | `/api/community/posts/:id/comment` | POST | Add a comment to a post | Authenticated |
| Community | `/api/community/leaderboard` | GET | Get community leaderboard / top contributors | Authenticated |
| Dashboard | `/api/dashboard/stats` | GET | Fetch dashboard statistics for the user | Authenticated |
| Profile | `/api/profile` | GET | Get current user's profile | Authenticated |
| Profile | `/api/profile` | PUT | Update current user's profile | Authenticated |

Notes:
- The README lists the routes that exist under `server/routes/` and how they are mounted in `server/server.js` (e.g. `app.use('/api/goals', goalRoutes)`).
- If you'd like, I can also add example request/response bodies for each endpoint (useful for API docs), and include information about required fields and validation errors.

7. How to run locally

Prerequisites: Node.js, npm, MongoDB connection (MongoDB Atlas recommended)

1. Install dependencies

```bash
# server
cd server
npm install

# client
cd ../client
npm install
```

2. Create a `.env` in `server/` with:

```
PORT=5000
DATABASE_URL=<your-mongo-connection-string>
JWT_SECRET=<your_jwt_secret>
GEMINI_API_KEY=...
OPENAI_API_KEY=... (optional)
```

3. Run the backend and frontend

```bash
# from repo root
cd server
npm run dev

# in another terminal
cd client
npm run dev
```

8. Contribution & Notes

- The repo uses the Next.js app router for client pages and a Node/Express backend in `server/`.
- Keep secrets out of source control; use environment variables for API keys and DB connection strings.
- AI integrations are configurable — switch between providers in `server/services/`.

If you'd like, I can also:
- Add this README to the `client/` README or merge contents.
- Generate a condensed `README.md` for the server folder with server-specific endpoints and run instructions.
