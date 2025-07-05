# Execution Plan

## Phase 1: Authentication (Email + Password)

### Backend (NestJS)
1. **Install dependencies:**
   - `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`, `@nestjs/config`
2. **Environment variables:**
   - Store JWT secret, DB credentials, and other sensitive info in `.env`.
   - Load with `@nestjs/config`.
3. **Create User entity/model:**
   - Fields: `id`, `email` (unique), `password` (hashed), `created_at`
   - Add index on `email`.
4. **Create Auth module, service, and controller:**
   - `nest g module auth`
   - `nest g service auth`
   - `nest g controller auth`
5. **Registration endpoint (`POST /api/auth/register`):**
   - Validate email/password (DTO + class-validator).
   - Hash password with bcrypt.
   - Check for duplicate email.
   - Save user to DB.
   - Return success or error.
6. **Login endpoint (`POST /api/auth/login`):**
   - Validate input.
   - Verify user exists and password matches (bcrypt compare).
   - Issue JWT on success.
7. **JWT strategy and guards:**
   - Use `@nestjs/passport` and `@nestjs/jwt`.
   - Protect all private endpoints with `@UseGuards(AuthGuard('jwt'))`.
8. **CORS configuration:**
   - Allow requests from frontend domain.
9. **Testing:**
   - Unit/integration tests for registration, login, and guards.
10. **Error handling:**
    - Return clear error messages for all auth flows.

### Frontend (Next.js)
1. **Create signup and login pages/forms.**
2. **POST to backend `/api/auth/register` and `/api/auth/login`.**
3. **On login, store JWT in memory or localStorage.**
4. **Attach JWT as Authorization header (`Bearer <token>`) for protected API requests.**
5. **Show/hide UI based on auth state (logged in/out).**
6. **Handle errors (invalid login, duplicate email, etc.).**
7. **Handle JWT expiry (auto-logout or prompt to re-login).**

---

## Phase 2: URL Shortener Service

### Backend (NestJS)
1. **Create URL entity/model:**
   - Fields: `id`, `originalUrl`, `slug` (unique), `userId` (nullable for public URLs), `visitCount`, `created_at`
   - Add indexes on `slug` and `userId`.
2. **Create URL module, service, and controller.**
3. **Endpoints:**
   - `POST /api/urls` (create short URL, requires auth)
   - `GET /api/urls` (list user's URLs, requires auth)
   - `GET /:slug` (redirect, public)
   - `PATCH /api/urls/:slug` (edit, requires auth)
   - `DELETE /api/urls/:slug` (delete, requires auth)
4. **Associate URLs with user (userId foreign key).**
5. **Slug generation and uniqueness checks.**
6. **URL validation (well-formed, valid URLs).**
7. **Visit tracking:**
   - Create `visits` table: `id`, `urlId`, `visited_at`, `ip_address` (optional, consider privacy)
   - Increment `visitCount` in `urls`.
8. **Authorization:**
   - Only the owner can edit/delete their URLs.
9. **Rate limiting:**
   - Apply to URL creation and login endpoints.
10. **404 handling:**
    - Return proper 404 for invalid slugs (API and frontend).
11. **Testing:**
    - Unit/integration tests for URL creation, redirection, analytics.
12. **Production readiness:**
    - Set `synchronize: false` in TypeORM for production and use migrations.
    - Secure JWT secret and other sensitive config.
13. **API documentation:**
    - Use Swagger or similar to document your API.

### Frontend (Next.js)
1. **Authenticated users can create, view, edit, and delete their URLs.**
2. **Show list of user's URLs (dashboard).**
3. **Show short URL and copy-to-clipboard feature.**
4. **Handle errors and loading states.**
5. **Display analytics/dashboard for user's URLs.**
6. **Show 404 page for invalid slugs.** 