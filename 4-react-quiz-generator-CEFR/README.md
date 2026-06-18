# Book Q&A MCQ Platform (React + Node + Gemini)

This project is a full quiz generation platform that:

1. Accepts a book PDF or a text summary.
2. Classifies the source language level to CEFR and returns only one level (`A1`, `A2`, `B1`, `B2`, `C1`, or `C2`).
3. Generates MCQ questions and runs an interactive quiz UI.

## Architecture

- Frontend: React + Vite
- Backend: Express API server
- AI: Gemini API (`generateContent`) using document + text input

## API Endpoint

- `POST /api/generate-quiz`
	- `multipart/form-data`
	- fields:
		- `pdf` (optional, PDF file)
		- `summary` (optional, plain text)
		- `questionCount` (optional, default `5`, range `3-15`)
	- response:
		- `cefrLevel`: one of `A1|A2|B1|B2|C1|C2`
		- `questions`: list of MCQs

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
cp .env.example .env
```

3. Open `.env` and set your key:

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

## Build Frontend

```bash
npm run build
```

## Project Path

The active React app lives in `4-react-quiz-generator/`.

## Notes

- Gemini API key is used only on the backend.
- Do not commit `.env`.
- If both PDF and summary are provided, both are used to improve question quality.
