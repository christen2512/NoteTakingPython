import os
from typing import List


class Settings:
    FRONTEND_URL = "http://localhost:5173"
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "https://your-production-domain.com",
    ]
    DATABASE_URL: str = os.getenv("DATABASE_URL")  # type: ignore
    APP_SECRET_KEY: str = os.getenv("APP_SECRET_KEY")  # type: ignore
    
    class Config:
        env_file = ".env"

settings = Settings()
