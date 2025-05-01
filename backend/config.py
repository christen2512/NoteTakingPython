from typing import List


class Settings:
    FRONTEND_URL = "http://localhost:5173"
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "https://your-production-domain.com",
    ]

    class Config:
        env_file = ".env"

settings = Settings()
