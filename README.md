# BookNest — Adaptive Reading Platform

BookNest is a comprehensive language-learning platform that helps users improve their English skills through AI-powered book recommendations, adaptive quizzes, vocabulary building, and progress tracking. It assesses users' CEFR language levels (A1–C2) and serves tailored content accordingly.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BookNest System                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Browser :5173]                                                    │
│       │  React + Vite (Axios + JWT)                                 │
│       ▼                                                             │
│  [Express Backend :5000] ─────────────────────────────────────┐    │
│       │                                                        │    │
│       │── /api/auth ────────── Supabase Auth (signup/login)    │    │
│       │── /api/books ───────── Supabase DB + Storage           │    │
│       │── /api/profile ─────── Supabase DB (profiles)          │    │
│       │── /api/progress ────── Supabase DB (user_progress)     │    │
│       │── /api/notes ───────── Supabase DB (notes)             │    │
│       │── /api/vocabulary ──── Supabase DB (vocabulary)        │    │
│       │── /api/achievements ── Supabase DB (achievements)      │    │
│       │── /api/admin ───────── Supabase DB (admin ops)         │    │
│       │── /api/reader ──────── Google Gemini API (AI)          │    │
│       │                                                        │    │
│       │── /api/recommendations ── HTTP ─────► [Python :8000]   │    │
│       │                                        FastAPI +        │    │
│       │                                        SVD++ model      │    │
│       │                                        (model.pkl)      │    │
│       ▼                                                        │    │
│  [Supabase Cloud]                                               │    │
│   ├── PostgreSQL (auth_users, books, profiles, ...)             │    │
│   ├── Storage bucket: books/{covers/, content/}                 │    │
│   └── Auth API (JWT tokens, password reset)                     │    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

Four independent services communicating over HTTP:

| Service | Location | Port | Tech |
|---|---|---|---|
| Frontend | `frontend/` | 5173 | React + Vite + TailwindCSS |
| Backend API | `backend/` | 5000 | Express + TypeScript |
| Recommendation Engine | `python-service/` | 8000 | FastAPI + scikit-surprise (SVD++) |
| Database & Auth | Supabase (cloud) | — | PostgreSQL + Storage + Auth |

---

## Prerequisites

- **Node.js** >= 20.0.0
- **npm**
- **Python** >= 3.10
- A **Supabase** project (free tier works) — [supabase.com](https://supabase.com)
- A **Google Gemini API key** — [aistudio.google.com](https://aistudio.google.com)

---

## Environment Configuration

All environment variables are loaded from a single `.env` file at the **project root**. Copy the template and fill in your values:

```bash
cp .env.example .env
```

| Variable | Default | Required | Description |
|---|---|---|---|
| `PORT` | `5000` | No | Express listen port |
| `FRONTEND_URL` | `http://localhost:5173` | No | CORS origin + password-reset redirect |
| `NODE_ENV` | `development` | No | Environment mode |
| `VITE_API_URL` | `http://localhost:5000` | No | Axios base URL for the frontend |
| `SUPABASE_URL` | — | **Yes** | Supabase project URL |
| `SUPABASE_ANON_KEY` | — | **Yes** | Public anon key (safe for client) |
| `SUPABASE_SERVICE_ROLE_KEY` | — | **Yes** | Service-role key (bypasses RLS) |
| `JWT_SECRET` | — | No | JWT secret from Supabase Settings → API → JWT Secret; enables local (offline) verification |
| `GEMINI_API_KEY` | — | **Yes** | Google Gemini API key |
| `GEMINI_MODEL` | `gemini-3-flash-preview` | No | Gemini model identifier |
| `RECOMMENDATION_SERVICE_URL` | `http://localhost:8000` | No | Python microservice URL |
| `REC_MODEL_PATH` | `./models/model.pkl` | No | Path to the pickle model file |
| `REC_SERVICE_HOST` | `0.0.0.0` | No | Python service bind host |
| `REC_SERVICE_PORT` | `8000` | No | Python service listen port |

> **Important:** The `.env` file at the project root is referenced by both the backend (via `dotenv`) and the Python service (via `config.py`). You do **not** need separate `.env` files inside `backend/` or `python-service/`.

---

## Database Setup

1. Go to your **Supabase Dashboard** → **SQL Editor**.
2. Open `backend/db/schema.sql` and run its entire contents. This creates all tables, indexes, RLS policies, and storage-bucket policies.
3. Run each migration file in `backend/db/migrations/` **in numeric order** (001, 002, …, 008). The migrations add incremental schema changes and new features.
4. (Optional) Run `backend/db/seed.sql` to insert sample books and data for testing.

---

## Storage Setup

1. In your **Supabase Dashboard** → **Storage**, create a new **public** bucket named `books`.
2. Ensure the RLS policies in `backend/db/schema.sql` are applied — they grant public read, authenticated write, and admin delete on the `books` bucket.
3. No further configuration is needed. The bucket will contain two auto-created sub-paths: `books/covers/` (cover images) and `books/content/` (PDF/EPUB files).

---

## Running the Backend (Express + TypeScript)

```bash
cd backend
npm install
npm run dev
```

- Runs on **http://localhost:5000**
- Hot-reload via `nodemon` + `ts-node`
- **Swagger UI:** http://localhost:5000/api-docs
- **Health check:** http://localhost:5000/health

Other commands:

```bash
npm run build    # Compile TypeScript → JavaScript (output: backend/build/)
npm start        # Run compiled production build
npm test         # Run Jest test suite
```

---

## Running the Python Recommendation Service

```bash
cd python-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install "numpy<2"        # scikit-surprise requires numpy < 2
uvicorn main:app --reload --port 8000
```

- Runs on **http://localhost:8000**
- Auto-reload via `--reload`
- **Health check:** http://localhost:8000/health
- The pre-trained model is at `python-service/models/model.pkl` (SVD++ collaborative filtering, trained on ~53k users × ~10k books)

---

## Running the Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

- Runs on **http://localhost:5173**
- Hot-reload via Vite
- API requests to `/api/*` are proxied to `http://localhost:5000` (configured in `vite.config.js`)

Other commands:

```bash
npm run build    # Production build → frontend/dist/
npm run preview  # Preview the production build
npm run lint     # ESLint
```

---

## Running Everything Together

The root `package.json` uses npm workspaces and the `concurrently` package to orchestrate the frontend and backend.

### One command (two of three services):

```bash
# From project root — runs both frontend (:5173) and backend (:5000)
npm run dev

# Individual scripts:
npm run dev:frontend    # Frontend only
npm run dev:backend     # Backend only
npm run build           # Build both
npm start               # Start production backend
```

### Full stack (three terminals):

| Terminal | Command |
|---|---|
| 1 — Python Service | `cd python-service && source .venv/bin/activate && uvicorn main:app --reload --port 8000` |
| 2 — Backend | `npm run dev:backend` (or `cd backend && npm run dev`) |
| 3 — Frontend | `npm run dev:frontend` (or `cd frontend && npm run dev`) |

---

## AI Services

### 1. Google Gemini Integration

**Source:** `backend/src/services/aiService.ts`

The backend calls the Gemini REST API directly (no SDK) to provide AI-powered language features. All endpoints are under `/api/reader/*` and require JWT authentication.

| Endpoint | Method | Description |
|---|---|---|
| `/api/reader/define` | POST | Dictionary-style word definition with examples |
| `/api/reader/quiz/:bookId` | GET | Retrieve a quiz for a specific book |
| `/api/reader/quiz/submit` | POST | Submit quiz answers and get a score |
| `/api/reader/generate-quiz` | POST | Generate a multiple-choice quiz from text or PDF |
| `/api/reader/classify-level` | POST | Classify text/PDF content to a CEFR level (A1–C2) |
| `/api/reader/simplify` | POST | Simplify a sentence to a target CEFR level |

**Configuration:**

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3-flash-preview    # or gemini-2.0-flash, etc.
```

The service uses Gemini's structured JSON output (`responseSchema`) for reliable, parseable responses.

### 2. Recommendation System (Python Microservice)

**Source:** `python-service/`

A FastAPI microservice that provides personalized book recommendations using collaborative filtering.

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | Health check |
| `/api/recommendations` | POST | Get personalized recommendations for a user |
| `/api/similar-books` | POST | Find books similar to a given book |

**How it works:**

- Uses a pre-trained **SVD++** model from the `scikit-surprise` library (`python-service/models/model.pkl`)
- Trained on implicit user-book interaction data
- **Cold-start fallback:** When the model cannot produce recommendations (new user, new book), the service returns trending books sorted by `views DESC, rating DESC` via a Supabase query
- The Express backend proxies recommendation requests to this service through `backend/src/services/recommendationService.ts`

---

## API Endpoints Summary

| Route Group | Prefix | Auth | Description |
|---|---|---|---|
| Auth | `/api/auth` | Public | Register, login, logout, refresh token |
| Books | `/api/books` | Public | Browse, search, filter, paginate books |
| Reader | `/api/reader` | JWT | AI-powered features (define, quiz, classify, simplify) |
| Profile | `/api/profile` | JWT | View/update profile, avatar upload |
| Progress | `/api/progress` | JWT | Track reading progress per user/book |
| Notes | `/api/notes` | JWT | CRUD annotations linked to books |
| Vocabulary | `/api/vocabulary` | JWT | Saved words with mastery levels |
| Achievements | `/api/achievements` | JWT | Badge system and reading streaks |
| Recommendations | `/api/recommendations` | JWT | Personalized book suggestions |
| Admin | `/api/admin` | JWT + Admin | Book CRUD, file uploads, user management, stats |

Full interactive documentation is available at **http://localhost:5000/api-docs** (Swagger UI).

---

## Project Structure

```
BookNest/
├── .env                          # Environment variables (root, shared)
├── .env.example                  # Template
├── package.json                  # Root workspace (orchestrates frontend + backend)
│
├── backend/                      # Express API (TypeScript)
│   ├── src/
│   │   ├── server.ts             # Entry point
│   │   ├── config/
│   │   │   ├── database.ts       # Query/insert/update/remove helpers
│   │   │   ├── supabase.ts       # Supabase clients (anon + admin)
│   │   │   └── swagger.ts        # OpenAPI/Swagger config
│   │   ├── controllers/          # Route handlers (10 controllers)
│   │   ├── routes/               # Express routers (10 route files)
│   │   ├── middleware/
│   │   │   ├── auth.ts           # JWT verification + admin check
│   │   │   └── validation.ts     # Input sanitization
│   │   ├── services/
│   │   │   ├── aiService.ts      # Google Gemini integration
│   │   │   └── recommendationService.ts  # Python microservice proxy
│   │   └── utils/
│   │       ├── auth.ts           # JWT token helpers
│   │       └── readingStreak.ts  # Streak tracking + achievements
│   ├── db/
│   │   ├── schema.sql            # Full PostgreSQL schema + RLS policies
│   │   ├── seed.sql              # Sample book data
│   │   ├── migrations/           # Incremental schema changes (001–008)
│   │   └── setup.sql
│   └── docs/                     # Backend-specific docs
│
├── frontend/                     # React app (Vite)
│   ├── src/
│   │   ├── main.jsx              # Entry point
│   │   ├── App.jsx               # Router configuration
│   │   ├── pages/                # Page components (auth, books, reader, admin, etc.)
│   │   ├── components/           # Reusable UI components
│   │   ├── services/             # API service modules (11 files)
│   │   ├── hooks/                # Custom React hooks
│   │   ├── context/              # AuthContext, ToastContext
│   │   └── utils/                # Constants, formatters, validators
│   ├── public/
│   └── index.html
│
├── python-service/               # Recommendation microservice (FastAPI)
│   ├── main.py                   # FastAPI app
│   ├── config.py                 # Environment loading
│   ├── models/
│   │   ├── recommender.py        # Recommendation engine class
│   │   └── model.pkl             # Pre-trained SVD++ model
│   ├── schemas/
│   │   └── recommendation.py     # Pydantic request/response models
│   └── requirements.txt
│
└── docs/                         # Project-level documentation
    ├── PRD.md
    └── DATABASE_CONTRACT.md
```

---

## Troubleshooting

| Problem | Solution |
|---|---|
| **Books not showing covers** | Ensure `cover_image_url` is set on the book record. Upload a cover via the admin panel. |
| **Upload fails** | Verify the `books` storage bucket exists and is public in Supabase Dashboard. Check file type (jpg/png/webp/gif for covers, pdf/epub for content) and size (< 10 MB). |
| **Admin panel not visible** | Your user needs `is_admin = true` in the `profiles` table. Run: `UPDATE profiles SET is_admin = true WHERE email = 'your@email.com';` |
| **API proxy / CORS errors** | Ensure the backend is running on port 5000. The frontend's Vite dev server proxies `/api` to `http://localhost:5000`. |
| **Recommendations not working** | Make sure the Python service is running on port 8000. Check `RECOMMENDATION_SERVICE_URL` in your `.env`. The service falls back to trending books if the model is unavailable. |
| **scikit-surprise install fails** | scikit-surprise requires `numpy < 2`. Run `pip install "numpy<2"` before installing the requirements. |
| **Page not found / blank screen** | Check the browser console for API errors. Verify all three services are running. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router 6, Vite 5, TailwindCSS 3, Axios |
| **Backend** | Node.js 20+, Express 4, TypeScript 5 |
| **Database** | PostgreSQL (via Supabase) |
| **Auth** | Supabase Auth (JWT) + local JWT verification |
| **Storage** | Supabase Storage (S3-compatible) |
| **AI** | Google Gemini API (CEFR classification, quiz generation, definitions, simplification) |
| **Recommendations** | Python, FastAPI, scikit-surprise (SVD++ collaborative filtering) |
| **API Docs** | Swagger (OpenAPI 3) via swagger-jsdoc + swagger-ui-express |
| **Dev Tools** | nodemon, concurrently, ESLint |

---

## Quick Start (TL;DR)

```bash
# 1. Clone and install
git clone https://github.com/iamAmer/BookNest.git
cd BookNest
cp .env.example .env
# Edit .env with your Supabase credentials and Gemini API key
resource at http://localhost:5000/api/auth/login. (Reason: CORS header ‘Access-Control-Allow-Origin’ missing). Status code: 204.
# 2. Database: Run backend/db/schema.sql in Supabase SQL Editor

# 3. Storage: Create public "books" bucket in Supabase Dashboard

# 4. Python service (Terminal 1)
cd python-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt && pip install "numpy<2"
uvicorn main:app --reload --port 8000

# 5. Backend (Terminal 2)
npm run dev:backend

# 6. Frontend (Terminal 3)
npm run dev:frontend

# Open http://localhost:5173
```

---

## Links

- **Repository:** https://github.com/iamAmer/BookNest
- **Swagger API Docs:** http://localhost:5000/api-docs *(when backend is running)*
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Google AI Studio (Gemini):** https://aistudio.google.com
