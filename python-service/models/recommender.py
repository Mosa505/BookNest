import pickle
import os
import logging
from typing import List, Optional

from surprise import PredictionImpossible

logger = logging.getLogger(__name__)


class Recommender:
    def __init__(self, model_path: str):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found: {model_path}")

        logger.info(f"Loading model from {model_path}")
        with open(model_path, "rb") as f:
            data = pickle.load(f)

        self.model = data["algo"]
        logger.info(f"Model loaded: {type(self.model).__name__}")
        logger.info(
            f"Trainset: {self.model.trainset.n_users} users, "
            f"{self.model.trainset.n_items} items"
        )

        # Store known raw IDs for quick membership checks
        self._known_user_ids = set(self.model.trainset._raw2inner_id_users.keys())
        self._known_item_ids = set(self.model.trainset._raw2inner_id_items.keys())

    def is_known_user(self, raw_user_id: int) -> bool:
        return raw_user_id in self._known_user_ids

    def is_known_item(self, raw_item_id: int) -> bool:
        return raw_item_id in self._known_item_ids

    def predict_batch(
        self, user_id: int, item_ids: List[int]
    ) -> List[dict]:
        results = []
        for item_id in item_ids:
            try:
                pred = self.model.predict(user_id, item_id)
                results.append({
                    "book_id": item_id,
                    "score": pred.est,
                })
            except (PredictionImpossible, ValueError, KeyError, IndexError) as e:
                logger.debug(
                    f"Prediction failed for user={user_id}, item={item_id}: {e}"
                )
                continue
        return results

    def recommend(
        self, user_id: int, candidate_item_ids: List[int], limit: int = 10
    ) -> List[dict]:
        if not candidate_item_ids:
            return []

        scored = self.predict_batch(user_id, candidate_item_ids)
        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:limit]
