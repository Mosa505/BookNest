from pydantic import BaseModel
from typing import List, Optional


class RecommendRequest(BaseModel):
    user_id: str
    limit: int = 10


class SimilarRequest(BaseModel):
    book_id: str
    limit: int = 6


class BookItem(BaseModel):
    id: str
    title: Optional[str] = None
    author: Optional[str] = None
    cover_image_url: Optional[str] = None
    rating: Optional[float] = None
    difficulty: Optional[str] = None
    category: Optional[str] = None
    predicted_score: Optional[float] = None


class RecommendResponse(BaseModel):
    recommendations: List[BookItem]


class SimilarResponse(BaseModel):
    similar: List[BookItem]


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
