# Students App — NestJS + PostgreSQL Backend

Designed & Built by Bilal · bilaljaved1002@gmail.com

---

## Project Structure

```
students-backend/          ← NestJS backend (this folder)
  src/
    main.ts                ← entry point, CORS, validation pipe
    app.module.ts          ← root module, TypeORM config
    students/
      student.entity.ts   ← PostgreSQL table definition
      students.controller.ts  ← REST routes
      students.service.ts     ← database logic
      dto/
        create-student.dto.ts  ← POST body validation
        update-student.dto.ts  ← PATCH body validation

students-frontend/         ← your existing Vite + React app
  src/
    helpers.js             ← replace with the new version (calls real API)
    App.jsx                ← replace with the new version (async handlers)
    components.jsx         ← unchanged
```

---

## Prerequisites

- Node.js 18+ (you likely already have this)
- PostgreSQL installed and running locally

---

## Step 1 — Set up PostgreSQL

Open psql or pgAdmin and run:

```sql
CREATE DATABASE students_db;
```

That's it — NestJS will create the `students` table automatically on first run.

---

## Step 2 — Set up the backend

```bash
cd students-backend
npm install
```

Copy the example env file and fill in your database password:

```bash
cp .env.example .env
```

Open `.env` and update:

```
DB_PASSWORD=your_actual_postgres_password
```

Start the backend:

```bash
npm run start:dev
```

You should see:
```
🚀 Server running on http://localhost:3000/api
📋 Students endpoint: http://localhost:3000/api/students
```

---

## Step 3 — Connect the frontend

In your React project, create a `.env` file (in the frontend root):

```
VITE_API_URL=http://localhost:3000/api
```

Replace your frontend's `src/helpers.js` and `src/App.jsx` with the new
versions included in this zip.

Start the frontend:

```bash
npm run dev
```

Open http://localhost:5173 — it's now talking to real PostgreSQL.

---

## API Endpoints

| Method | URL                        | Description           |
|--------|----------------------------|-----------------------|
| GET    | /api/students              | Get all students      |
| GET    | /api/students?search=priya | Search students       |
| GET    | /api/students/:id          | Get one student       |
| POST   | /api/students              | Create student        |
| PATCH  | /api/students/:id          | Update student        |
| DELETE | /api/students/:id          | Delete student        |

### POST / PATCH body shape:
```json
{
  "name": "Aarav Sharma",
  "email": "aarav.sharma@uni.edu",
  "age": 21
}
```

---

## Deploying

**Backend** → Railway, Render, or any VPS. Set the env variables in the dashboard.

**Frontend** → Vercel or Netlify. Set `VITE_API_URL` to your deployed backend URL.
