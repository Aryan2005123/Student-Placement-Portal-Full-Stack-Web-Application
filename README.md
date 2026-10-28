# CampusConnect — Full-stack Student Placement Portal

A college minor project with a polished responsive frontend and a REST API backend.

## Stack
- Frontend: HTML, CSS, Bootstrap 5, Bootstrap Icons, vanilla JavaScript
- Backend: Node.js, Express
- Database: MongoDB + Mongoose
- Authentication: JWT and bcrypt password hashing
- Validation: express-validator + Mongoose schema validation

## Features
- Responsive student dashboard and job listings
- Search and filtering by keyword, type, location, and CGPA
- Job details and application submission
- Student registration/login endpoints with hashed passwords and JWT
- Student profile read/update endpoints
- Job CRUD endpoints (admin-only writes)
- Applications: apply, view own applications, admin list, status update
- Duplicate-application protection and consistent HTTP error responses
- Seed script with eight sample job listings and a demo admin
- Frontend retains local demo mode if the API is unavailable; backend APIs are available once server/database are running

## Requirements
- Node.js 18 or newer
- MongoDB Community Server running locally, or a MongoDB Atlas connection string
- Internet connection for Bootstrap CDN assets

## Setup
1. Extract the ZIP and open the project folder in a terminal.
2. Install packages:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env`.
4. Edit `.env` and set a long random `JWT_SECRET`. Set `MONGODB_URI` to your local MongoDB or Atlas connection string.
5. Start MongoDB.
6. Add sample data and a demo admin:
   ```bash
   npm run seed
   ```
7. Start the app:
   ```bash
   npm start
   ```
8. Open `http://localhost:5000`. Check API health at `http://localhost:5000/api/health`.

Demo admin credentials after seeding:
- Email: `admin@campusconnect.local`
- Password: `ChangeMe123!`

Change the demo admin password before any deployment. Do not expose the demo credentials publicly.

## API endpoints
All request/response bodies use JSON.

### Authentication
- `POST /api/auth/register` — `{ "name":"A Student", "email":"student@example.com", "password":"atleast8chars" }`
- `POST /api/auth/login` — `{ "email":"student@example.com", "password":"..." }`
- `GET /api/auth/me` — requires `Authorization: Bearer <token>`

### Jobs
- `GET /api/jobs?q=react&type=Internship&location=Remote&minCgpa=7`
- `GET /api/jobs/:id`
- `POST /api/jobs` — admin token required
- `PATCH /api/jobs/:id` — admin token required
- `DELETE /api/jobs/:id` — admin token required (archives listing)

### Student profile
- `GET /api/students/me` — requires token
- `PUT /api/students/me` — requires token

### Applications
- `POST /api/applications` — student token, body `{ "jobId":"<MongoDB job id>", "coverNote":"...", "cgpa":8.1 }`
- `GET /api/applications/mine` — requires token
- `GET /api/applications` — admin token
- `PATCH /api/applications/:id/status` — admin token, body `{ "status":"Shortlisted" }`

Allowed statuses: `Applied`, `Pending`, `Shortlisted`, `Rejected`.

## Notes about the UI integration
The supplied dashboard is designed to work immediately as a frontend demo. The API bridge attempts to load job listings from the backend when served by Express; if the API is not reachable, the sample local data is used so the UI can still be explored. Authentication and profile/application endpoints are exposed and can be tested through Postman. For a production-ready UI, connect the login/register forms to the auth endpoints and use the returned JWT for protected actions.

## Security and academic-use limitations
- This is an educational starter project, not production-hardened software.
- Change `JWT_SECRET` and demo admin credentials before deployment.
- Add rate limiting, HTTPS, stricter CORS policy, audit logging, and secure account recovery before public deployment.
- Frontend's existing admin demo view is not fully wired to protected API calls; API-level admin writes are protected by JWT role checks.
- Never commit `.env` or real passwords to source control.
