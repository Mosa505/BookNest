# React Book Q&A MCQ Platform

A React.js version of the Vue quiz generator project.

## Features

- Generate MCQ quiz from PDF/summary or topic.
- Classify CEFR level from PDF/summary first.
- Keep PDF quiz generation aligned with classified CEFR level.
- Choose quiz difficulty (easy, medium, hard).
- Quiz flow with Back, Submit Question, Next, Submit All Answers, Exit.

## Tech

- Frontend: React + Vite
- Backend: Express + Gemini API

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file from template:

```bash
copy .env.example .env
```

3. Fill in your API key in `.env`:

```env
GEMINI_API_KEY=your_real_key
GEMINI_MODEL=gemini-2.5-flash
PORT=8787
```

## Run

Run frontend + backend together:

```bash
npm run dev:full
```

Or run separately:

```bash
npm run dev
npm run dev:api
```

## Build

```bash
npm run build
```
