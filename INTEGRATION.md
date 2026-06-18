# BookNest Integration Document

The system integrates **four independent services** that communicate over HTTP:

### 1. Frontend → Backend
The React app (Vite on `:5173`) proxies all `/api` requests to Express (`:5000`). Every API call carries a JWT in the `Authorization` header, managed by an Axios interceptor that auto-refreshes expired tokens.

### 2. Backend → Supabase
Express uses two Supabase clients:
- **`supabase`** (anon key) — for auth operations (`signInWithPassword`, `signUp`)
- **`supabaseAdmin`** (service role key) — for all CRUD on 11 tables (books, profiles, progress, etc.)

The admin client bypasses Row-Level Security and is used for every database operation in controllers.

### 3. Backend → Gemini AI
The AI service (`aiService.ts`) calls Google Gemini directly via `fetch()` — no intermediate service. It requests structured JSON responses using Gemini's `responseSchema`. The backend exposes these as REST endpoints under `/api/reader`.

### 4. Backend → Python Recommendation Service
The recommendation service is a **standalone FastAPI microservice** (`:8000`) that:
- Loads a pickled Surprise **SVD++** model on startup
- Queries Supabase directly (using its own Supabase client with the service role key)
- Maps user/book UUIDs to integer IDs via the `int_id` column in the database
- Calls `model.predict(user_int_id, book_int_id)` for each candidate
- Returns ranked results to Express via HTTP POST

Express proxies requests through `recommendationService.ts` — same pattern as the Gemini service.

### Data Flow for a Recommendation Request

```
User visits Dashboard
  → React calls recommendationService.getForUser(6)
  → Axios GET /api/recommendations?limit=6 (with JWT)
  → Express authenticates JWT, calls recommendationService.getRecommendations()
  → Node.js fetch() POST to Python service at :8000
  → Python looks up auth_users.int_id by UUID
  → Python queries Supabase for unread books with their int_id
  → Python scores each (user_int, book_int) via SVD++ model
  → Python sorts, returns top N with full book metadata
  → Express wraps in { success: true, data: [...] }
  → Axios unwraps to React state
  → Dashboard renders "🎯 Recommended for You" grid of BookCards
```

### Cold Start Handling

If the Python service is offline, the user is unknown to the model, or a book wasn't in the training set, the system gracefully falls back to **trending books** (sorted by `views DESC, rating DESC`) — ensuring the UI never shows empty.

---

## Architecture Diagram

```
[User Browser :5173]
       │ React (Vite) with Axios + JWT
       ▼
[Express Backend :5000] ─────────────────────────────────────┐
       │                                                     │
       │── /api/auth ......... Supabase Auth (signup/login)  │
       │── /api/profile ...... Supabase DB (profiles)        │
       │── /api/books ........ Supabase DB + Storage         │
       │── /api/progress ..... Supabase DB (user_progress)   │
       │── /api/notes ........ Supabase DB (notes)           │
       │── /api/vocabulary ... Supabase DB (vocabulary)      │
       │── /api/reader ....... Google Gemini API (direct)    │
       │── /api/achievements . Supabase DB (achievements)    │
       │── /api/admin ........ Supabase DB (admin ops)       │
       │                                                     │
       │── /api/recommendations ───── HTTP ───► [Python :8000]
       │                                                    ▼
       │                                             SVD++ Model
       │                                             (model.pkl)
[Supabase Platform]
   ├── PostgreSQL (auth_users, books, profiles, ...)
   ├── Storage (bucket: books/, covers/ & content/)
   └── Auth API (JWT tokens, password reset)
```

---

## 1. Frontend

### Framework & Build

| Aspect | Detail |
|---|---|
| Framework | React 19 + Vite 5 |
| Routing | React Router v6 |
| Styling | Tailwind CSS 3 |
| HTTP client | Axios (with JWT interceptor) |
| Entry | `frontend/src/main.jsx` |
| Router | `frontend/src/App.jsx` |

### Vite Proxy

**File:** `frontend/vite.config.js`

All `/api` requests are proxied to the Express backend during development:

```js
server: {
  proxy: { '/api': { target: 'http://localhost:5000', changeOrigin: true } },
}
```

### Axios Instance (`api.js`)

**File:** `frontend/src/services/api.js`

| Behavior | Details |
|---|---|
| Base URL | `VITE_API_URL` env (default `http://localhost:5000`) |
| Request interceptor | Attaches `Authorization: Bearer <accessToken>` from localStorage |
| Response interceptor | On 401, calls `POST /api/auth/refresh-token`, queues failed requests, retries on success |
| Token storage | `localStorage` — keys: `accessToken`, `refreshToken` |

### Service Layer

All services follow the same pattern — export an object with async methods using the shared `api` instance.

| Service File | Endpoint Prefix | Key Methods |
|---|---|---|
| `services/auth.service.js` | `/api/auth` | `login`, `register`, `logout`, `checkAuth`, `forgotPassword`, `resetPassword` |
| `services/books.service.js` | `/api/books` | `getAll`, `getById`, `getCategories`, `getTrending`, `uploadCover`, `uploadContent`, `deleteFile`, `getKidsBooks` |
| `services/profile.service.js` | `/api/profile` | `get`, `update`, `updateLevel`, `updateGoal` |
| `services/progress.service.js` | `/api/progress` | `update`, `getByBook` |
| `services/notes.service.js` | `/api/notes` | `getByBook`, `create`, `update`, `remove` |
| `services/vocabulary.service.js` | `/api/vocabulary` | `save`, `getAll`, `getStats`, `review` |
| `services/reader.service.js` | `/api/reader` | `defineWord`, `getQuiz`, `submitQuiz`, `classifyLevel`, `generateQuiz` |
| `services/achievements.service.js` | `/api/achievements` | `getUserAchievements`, `getAvailableAchievements`, `getKidsAchievements` |
| `services/admin.service.js` | `/api/admin` | `getStats`, `createBook`, `updateBook`, `deleteBook`, `getUsers`, `grantAdmin`, `revokeAdmin` |
| `services/recommendation.service.js` | `/api/recommendations` | `getForUser`, `getSimilarBooks` |

### State Management

No global state library (Redux/Zustand). State is managed via:

- **React Context**: `AuthContext` (user session), `ToastContext` (notifications)
- **Custom hooks**: `useAuth`, `useBooks`, `useReader`, `useDebounce`, `useSessionTracker`

### Auth Flow (Frontend)

```
1. User submits login form
2. authService.login(email, password) → POST /api/auth/login
3. Response has { accessToken, refreshToken }
4. Stored in localStorage
5. AuthContext.setUser() with decoded user info
6. Axios interceptor attaches Bearer token on subsequent requests
7. On 401: auto-refresh via /api/auth/refresh-token
8. On page reload: localStorage → GET /api/auth/status → restore session
```

---

## 2. Backend (Express + TypeScript)

### Server Setup

**File:** `backend/src/server.ts`

| Aspect | Value |
|---|---|
| Port | `PORT` env (default `5000`) |
| Env loading | `../../.env` (project root) then `../.env` (backend local) |
| CORS | `FRONTEND_URL` env + localhost variants |
| Body parser | `express.json()` |
| Security | `validateQueryLength(1000)` + `sanitizeSQLPatterns` |
| Swagger UI | `GET /api-docs` |
| Health | `GET /health` |

### Route Map

| Mount Prefix | Routes File | Auth | Endpoints |
|---|---|---|---|
| `/api/auth` | `authRoutes.ts` | Mixed | `POST register`, `POST login`, `POST refresh-token`, `POST password-reset`, `POST reset-password`, `GET status`, `POST logout` |
| `/api/profile` | `profileRoutes.ts` | JWT | `GET /`, `PATCH /`, `PATCH /level`, `PATCH /goal` |
| `/api/books` | `bookRoutes.ts` | JWT | `GET /`, `GET /trending`, `GET /categories`, `GET /:id`, `POST upload-cover`, `POST upload-content`, `DELETE delete-file` |
| `/api/progress` | `progressRoutes.ts` | JWT | `POST /update`, `GET /:bookId` |
| `/api/notes` | `notesRoutes.ts` | JWT | `GET /:bookId`, `POST /`, `PUT /:id`, `DELETE /:id` |
| `/api/vocabulary` | `vocabularyRoutes.ts` | JWT | `POST /save`, `GET /`, `GET /stats`, `PUT /:id/review` |
| `/api/reader` | `aiRoutes.ts` | JWT | `POST /define`, `POST /simplify`, `GET /quiz/:bookId`, `POST /quiz/submit`, `POST /classify-level`, `POST /generate-quiz` |
| `/api/achievements` | `achievementsRoutes.ts` | Mixed | `GET /`, `GET /user`, `POST /check/:bookId` |
| `/api/admin` | `adminRoutes.ts` | JWT+Admin | `GET /stats`, `POST /books`, `PUT /books/:id`, `DELETE /books/:id`, `GET /users`, `POST /users/:userId/admin`, `DELETE /users/:userId/admin` |
| `/api/recommendations` | `recommendationRoutes.ts` | JWT | `GET /`, `GET /similar/:bookId` |

### Pattern: Route → Controller → Service

Every request follows this chain:

```
Route (validation) → Controller (business logic) → Service (external API / DB)
```

Example for AI:

```
POST /api/reader/define
  → aiRoutes.ts (authenticateJWT middleware)
  → aiController.defineWord() (parses body, handles errors)
  → aiService.defineWord() (calls Gemini API via fetch)
```

Example for Recommendations:

```
GET /api/recommendations
  → recommendationRoutes.ts (authenticateJWT middleware)
  → recommendationController.getRecommendations() (parses query)
  → recommendationService.getRecommendations() (calls Python service via fetch)
```

### JWT Auth Middleware

**File:** `backend/src/middleware/auth.ts`

- Verifies token via `supabaseAdmin.auth.getUser(token)` with 2 retries
- Returns 401 on invalid/expired token
- Enriches `req.user` with `{ id, email, isAdmin }`
- `requireAdmin` middleware checks `req.user.isAdmin`, returns 403 if false

---

## 3. Supabase Integration

### Clients

**File:** `backend/src/config/supabase.ts`

| Client | Credential | Purpose |
|---|---|---|
| `supabase` (default) | `SUPABASE_ANON_KEY` | Public reads, auth operations (signup, signin) |
| `supabaseAdmin` | `SUPABASE_SERVICE_ROLE_KEY` | All CRUD operations (bypasses RLS) |

### Query Patterns

Most controllers use the Supabase client directly:

```ts
// Direct query (most common)
const { data, error } = await supabaseAdmin
  .from('books')
  .select('id, title, author')
  .eq('category', 'Kids')
  .order('views', { ascending: false })

// Single row
const { data: profile } = await supabaseAdmin
  .from('profiles')
  .select('full_name, is_admin')
  .eq('id', data.user.id)
  .single()
```

### Database Tables

**File:** `backend/db/schema.sql`

| Table | Purpose | Key Columns |
|---|---|---|
| `auth_users` | Custom user accounts | `id (UUID)`, `email`, `password_hash`, `full_name`, `is_admin` |
| `profiles` | Extended user profile | `id (FK)`, `email`, `cefr_level` (A1-C2), `avatar_url` |
| `books` | Book catalog | `id (UUID)`, `title`, `author`, `category`, `difficulty` (A1-C2), `age_group`, `rating`, `views`, `int_id` |
| `user_progress` | Reading activity | `user_id`, `book_id`, `current_page`, `is_completed`, `time_spent_seconds` |
| `quiz_results` | Quiz attempts | `user_id`, `book_id`, `score`, `answers (JSONB)` |
| `vocabulary` | Saved words | `user_id`, `word`, `definition`, `mastery_level` |
| `notes` | Book highlights/notes | `user_id`, `book_id`, `page_number`, `content` |
| `achievements` | Achievement definitions | `name`, `description`, `criteria_json (JSONB)` |
| `user_achievements` | Earned achievements | `user_id`, `achievement_id`, `earned_at` |
| `categories` | Book categories | `name`, `description`, `icon_url` |
| `refresh_tokens` | Session management | `user_id`, `token_hash`, `expires_at` |

### Migrations

**Directory:** `backend/db/migrations/`

| File | Purpose |
|---|---|
| `001_add_admin_to_profiles.sql` | Add `is_admin` column |
| `002_add_reading_goal.sql` | Add reading goal feature |
| `003_add_total_site_time.sql` | Site-wide reading time tracking |
| `004_add_kids_features.sql` | Kids section: achievements, age_group column, triggers |
| `005_add_integer_ids_for_model.sql` | Add `int_id SERIAL` to `auth_users` and `books` for recommendation model |

### Storage

Supabase Storage bucket `books/` with subfolders:

| Subfolder | Content | Access |
|---|---|---|
| `books/covers/` | Book cover images | Public read, authenticated write |
| `books/content/` | Book PDF/epub files | Public read, authenticated write |

---

## 4. AI Service (Google Gemini)

### Architecture

The AI service calls Google Gemini directly from Node.js — no Python microservice involved.

**File:** `backend/src/services/aiService.ts`

| Detail | Value |
|---|---|
| API endpoint | `https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={KEY}` |
| Auth | `GEMINI_API_KEY` env var |
| Model | `GEMINI_MODEL` env var (default `gemini-2.0-flash`) |
| Response format | Always requests structured JSON via `responseSchema` |
| Temperature | 0.2 (classification/definition), 0.5 (quiz generation) |

### Available Functions

| Function | Input | Output | Use Case |
|---|---|---|---|
| `classifyLevel({ summary?, pdfBuffer? })` | Text or PDF | `{ cefrLevel: string }` | CEFR level classification |
| `defineWord(word)` | Word string | `{ word, definition, example }` | Dictionary lookup |
| `generateQuiz({ sourceType, summary?, topic?, pdfBuffer?, questionCount, difficulty, cefrLevel? })` | Content + config | `{ cefrLevel, questions: [...] }` | Quiz generation |

### Exposed Endpoints

All under `/api/reader` and require JWT:

| POST /api/reader/define | `{ word }` → word definition |
|---|---|
| POST /api/reader/quiz/submit | `{ bookId, answers, score, total_questions }` → results + achievements |
| GET /api/reader/quiz/:bookId | Query: `cefr_level`, `numQuestions` → quiz questions |
| POST /api/reader/classify-level | Multipart: `pdf` file + `summary` text → CEFR level |
| POST /api/reader/generate-quiz | Multipart: `pdf` file + fields → quiz questions |

### Error Handling

All AI controllers wrap calls in try/catch and return:

- `{ success: true, data: ... }` on success
- `{ error: "message" }` with status 500 on failure

---

## 5. Recommendation System (Python Microservice)

### Architecture

A standalone FastAPI microservice that loads a pickled Surprise SVD++ collaborative filtering model.

```
Express Backend (recommendationService.ts)
    │  HTTP POST (fetch)
    ▼
Python FastAPI :8000
    │
    ├── Loads model.pkl (SVD++) on startup
    ├── Queries Supabase for user/book data
    ├── Calls model.predict(user_int_id, book_int_id)
    └── Returns ranked results
```

### File Structure

| File | Purpose |
|---|---|
| `python-service/main.py` | FastAPI app entry, lifespan, route handlers |
| `python-service/config.py` | Environment variable loading |
| `python-service/models/recommender.py` | `Recommender` class — loads pickle, batch predict |
| `python-service/schemas/recommendation.py` | Pydantic request/response models |

### Endpoints

| Method | Path | Input | Output |
|---|---|---|---|
| GET | `/health` | — | `{ status, model_loaded }` |
| POST | `/api/recommendations` | `{ user_id, limit }` | `{ recommendations: [BookItem] }` |
| POST | `/api/similar-books` | `{ book_id, limit }` | `{ similar: [BookItem] }` |

### Prediction Flow

```
1. POST /api/recommendations { user_id: "uuid", limit: 10 }
2. Look up auth_users.int_id from Supabase using the UUID
3. Query unread books with their int_id values
4. For each candidate: model.predict(user_int_id, book_int_id)
5. Sort by predicted rating descending
6. Return top N with full book details
7. Unknown users/items → fallback to trending (sorted by views, rating)
```

### Data Model

The pickle file (`model.pkl`) contains:

```
{
  'predictions': None,
  'algo': SVDpp object with trainset (53424 users, 10000 items)
}
```

### Cold Start & Fallback

| Scenario | Behavior |
|---|---|
| New user (no reading history) | Score all books; fallback to trending if user unknown to model |
| User not in training set | `PredictionImpossible` caught → return trending |
| Book not in training set | Skipped during scoring → appears in trending padding |
| Python service offline | Express returns `[]` (empty recommendations) |
| Not enough scored results | Pad remaining slots with trending (no duplicates) |

### Proxy from Express

**File:** `backend/src/services/recommendationService.ts`

```ts
const PYTHON_SERVICE_URL = process.env.RECOMMENDATION_SERVICE_URL || 'http://localhost:8000'

const response = await fetch(`${PYTHON_SERVICE_URL}/api/recommendations`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ user_id: userId, limit }),
})
```

---

## 6. Environment Variables

**File:** `.env.example`

| Variable | Default | Used By | Purpose |
|---|---|---|---|
| `PORT` | `5000` | `server.ts` | Express listen port |
| `FRONTEND_URL` | `http://localhost:5173` | `server.ts` | CORS origin + password reset redirect |
| `NODE_ENV` | `development` | `server.ts` | Environment mode |
| `VITE_API_URL` | `http://localhost:5000` | Frontend `api.js` | Axios base URL |
| `SUPABASE_URL` | required | `supabase.ts`, `config.py` | Supabase project URL |
| `SUPABASE_ANON_KEY` | required | `supabase.ts` | Public Supabase API key |
| `SUPABASE_SERVICE_ROLE_KEY` | required | `supabase.ts`, `config.py` | Admin Supabase key (bypasses RLS) |
| `GEMINI_API_KEY` | required | `aiService.ts` | Google Gemini API key |
| `GEMINI_MODEL` | `gemini-2.0-flash` | `aiService.ts` | Gemini model name |
| `RECOMMENDATION_SERVICE_URL` | `http://localhost:8000` | `recommendationService.ts` | Python microservice URL |
| `REC_MODEL_PATH` | `./models/model.pkl` | `config.py` | Path to pickle model file |
| `REC_SERVICE_HOST` | `0.0.0.0` | `main.py` | Python service bind host |
| `REC_SERVICE_PORT` | `8000` | `main.py` | Python service listen port |

---

## 7. Running the Full Stack

```bash
# Terminal 1 — Python recommendation service
cd python-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install "numpy<2"       # scikit-surprise C extensions require NumPy 1.x
uvicorn main:app --reload --port 8000

# Terminal 2 — Express backend
cd backend
npm run dev

# Terminal 3 — React frontend
cd frontend
npm run dev

# Open http://localhost:5173
```

### Health Checks

| Service | Endpoint |
|---|---|
| Express | `GET http://localhost:5000/health` |
| Express docs | `GET http://localhost:5000/api-docs` |
| Python service | `GET http://localhost:8000/health` |

### Database Migration

Run migrations via Supabase Dashboard SQL Editor:

```bash
# Copy contents from:
backend/db/migrations/005_add_integer_ids_for_model.sql
```
