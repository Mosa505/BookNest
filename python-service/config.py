import os
from dotenv import load_dotenv
import pathlib

# Try loading .env from project root or python-service dir
root_env = pathlib.Path(__file__).resolve().parent.parent / ".env"
local_env = pathlib.Path(__file__).resolve().parent / ".env"

if root_env.exists():
    load_dotenv(root_env)
elif local_env.exists():
    load_dotenv(local_env)

MODEL_PATH = os.getenv("REC_MODEL_PATH", "models/model.pkl")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
REC_SERVICE_HOST = os.getenv("REC_SERVICE_HOST", "0.0.0.0")
REC_SERVICE_PORT = int(os.getenv("REC_SERVICE_PORT", "8000"))
