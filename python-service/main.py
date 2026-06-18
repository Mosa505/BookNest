import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client

from config import (
    MODEL_PATH,
    SUPABASE_URL,
    SUPABASE_SERVICE_KEY,
    REC_SERVICE_HOST,
    REC_SERVICE_PORT,
)
from models.recommender import Recommender
from schemas.recommendation import (
    RecommendRequest,
    RecommendResponse,
    SimilarRequest,
    SimilarResponse,
    BookItem,
    HealthResponse,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

recommender: Recommender = None
supabase: Client = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global recommender, supabase
    logger.info("Starting recommendation service...")

    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        logger.warning("Supabase credentials not configured — using empty DB fallback")

    try:
        recommender = Recommender(MODEL_PATH)
        logger.info("Model loaded successfully")
    except FileNotFoundError as e:
        logger.error(f"Failed to load model: {e}")
        recommender = None

    supabase = (
        create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        if SUPABASE_URL and SUPABASE_SERVICE_KEY
        else None
    )

    yield

    logger.info("Shutting down recommendation service...")


app = FastAPI(
    title="BookNest Recommendations",
    description="SVD++ collaborative filtering recommendation service",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_trending_fallback(limit: int, exclude_ids: set = None) -> list:
    if supabase is None:
        return []

    try:
        query = (
            supabase.table("books")
            .select("id,title,author,cover_image_url,rating,difficulty,category")
            .order("views", desc=True)
            .order("rating", desc=True)
            .limit(limit * 2)
        )
        result = query.execute()
        books = result.data or []
        if exclude_ids:
            return [b for b in books if b["id"] not in exclude_ids][:limit]
        return books[:limit]
    except Exception as e:
        logger.error(f"Failed to fetch trending: {e}")
        return []


def to_book_item(book: dict, score: float = None) -> BookItem:
    return BookItem(
        id=book["id"],
        title=book.get("title"),
        author=book.get("author"),
        cover_image_url=book.get("cover_image_url"),
        rating=book.get("rating"),
        difficulty=book.get("difficulty"),
        category=book.get("category"),
        predicted_score=score,
    )


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="ok",
        model_loaded=recommender is not None,
    )


@app.post("/api/recommendations", response_model=RecommendResponse)
async def get_recommendations(body: RecommendRequest):
    if recommender is None:
        logger.warning("Model not loaded — returning trending fallback")
        fallback = get_trending_fallback(body.limit)
        return RecommendResponse(
            recommendations=[to_book_item(b) for b in fallback]
        )

    # 1. Resolve user UUID → integer ID
    user_int_id = None
    if supabase:
        try:
            result = (
                supabase.table("auth_users")
                .select("int_id")
                .eq("id", body.user_id)
                .maybe_single()
                .execute()
            )
            user_int_id = result.data.get("int_id") if result.data else None
        except Exception as e:
            logger.warning(f"Failed to fetch user int_id: {e}")

    if user_int_id is None or not recommender.is_known_user(user_int_id):
        logger.info(
            f"User {body.user_id} not in model (int_id={user_int_id}) "
            f"— returning trending fallback"
        )
        fallback = get_trending_fallback(body.limit)
        return RecommendResponse(
            recommendations=[to_book_item(b) for b in fallback]
        )

    # 2. Get user's read books
    read_uuids: set = set()
    if supabase:
        try:
            progress = (
                supabase.table("user_progress")
                .select("book_id")
                .eq("user_id", body.user_id)
                .execute()
            )
            read_uuids = {row["book_id"] for row in (progress.data or [])}
        except Exception as e:
            logger.warning(f"Failed to fetch user progress: {e}")

    # 3. Get all books with both UUID and int_id
    all_books = []
    if supabase:
        try:
            result = (
                supabase.table("books")
                .select("id,int_id,title,author,cover_image_url,rating,difficulty,category")
                .execute()
            )
            all_books = result.data or []
        except Exception as e:
            logger.warning(f"Failed to fetch books: {e}")

    if not all_books:
        return RecommendResponse(recommendations=[])

    # 4. Filter to unread books that exist in the model
    candidates = [
        b
        for b in all_books
        if b["id"] not in read_uuids
        and b.get("int_id") is not None
        and recommender.is_known_item(b["int_id"])
    ]

    if not candidates:
        fallback = get_trending_fallback(body.limit, exclude_ids=read_uuids)
        return RecommendResponse(
            recommendations=[to_book_item(b) for b in fallback]
        )

    # 5. Score with model using integer IDs
    candidate_int_ids = [b["int_id"] for b in candidates]
    scored = recommender.recommend(user_int_id, candidate_int_ids, body.limit)

    scored_map = {s["book_id"]: s["score"] for s in scored}

    # 6. Build response — map back to UUIDs
    recommendations = []
    for book in candidates:
        if book["int_id"] in scored_map:
            recommendations.append(
                to_book_item(book, scored_map[book["int_id"]])
            )

    recommendations.sort(key=lambda x: x.predicted_score or 0, reverse=True)

    # 7. Pad with trending if needed
    if len(recommendations) < body.limit:
        existing_uuids = {r.id for r in recommendations}
        fallback = get_trending_fallback(
            body.limit, exclude_ids=existing_uuids | read_uuids
        )
        for book in fallback:
            if len(recommendations) >= body.limit:
                break
            recommendations.append(to_book_item(book))

    return RecommendResponse(recommendations=recommendations[:body.limit])


@app.post("/api/similar-books", response_model=SimilarResponse)
async def get_similar_books(body: SimilarRequest):
    if recommender is None:
        return SimilarResponse(similar=[])

    if not body.book_id:
        raise HTTPException(status_code=400, detail="book_id is required")

    # 1. Get the source book's int_id
    source_int_id = None
    if supabase:
        try:
            result = (
                supabase.table("books")
                .select("int_id")
                .eq("id", body.book_id)
                .maybe_single()
                .execute()
            )
            source_int_id = result.data.get("int_id") if result.data else None
        except Exception as e:
            logger.warning(f"Failed to fetch book int_id: {e}")

    if source_int_id is None:
        return SimilarResponse(similar=[])

    # 2. Get all other books
    all_books = []
    if supabase:
        try:
            result = (
                supabase.table("books")
                .select("id,int_id,title,author,cover_image_url,rating,difficulty,category")
                .neq("id", body.book_id)
                .execute()
            )
            all_books = result.data or []
        except Exception as e:
            logger.warning(f"Failed to fetch books: {e}")

    if not all_books:
        return SimilarResponse(similar=[])

    # 3. Filter to items known by the model
    known_books = [
        b
        for b in all_books
        if b.get("int_id") is not None
        and recommender.is_known_item(b["int_id"])
    ]

    if not known_books:
        return SimilarResponse(similar=[])

    # 4. Use a dummy user ID to get item affinity.
    # Pick the first known user from the model as anchor.
    anchor_user = next(iter(recommender._known_user_ids))

    candidate_int_ids = [b["int_id"] for b in known_books]
    scored = recommender.recommend(anchor_user, candidate_int_ids, body.limit)

    scored_map = {s["book_id"]: s["score"] for s in scored}

    similar = []
    for book in known_books:
        if book["int_id"] in scored_map:
            similar.append(to_book_item(book, scored_map[book["int_id"]]))

    similar.sort(key=lambda x: x.predicted_score or 0, reverse=True)
    return SimilarResponse(similar=similar[:body.limit])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=REC_SERVICE_HOST, port=REC_SERVICE_PORT)
