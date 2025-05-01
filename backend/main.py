import os
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.routers.auth_router import auth_router
from dotenv import load_dotenv
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "Accept",
        "Origin",
        "X-Requested-With",
    ],
    expose_headers=["Content-Type"],
)
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("APP_SECRET_KEY"),  # type: ignore
    same_site="lax",
    https_only=False,
    max_age=3600,
)

load_dotenv()

app.include_router(auth_router)

@app.get("/")
async def home():
    return RedirectResponse("/login")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
