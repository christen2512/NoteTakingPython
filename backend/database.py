from sqlmodel import create_engine, SQLModel, Session
import os
from backend.config import settings

# --- Synchronous Setup (Simpler to start with) ---
# The engine is the entry point to your database.
# echo=True is useful for debugging as it logs all SQL statements.
# Disable echo=True in production for performance and to avoid logging sensitive data.
engine = create_engine(settings.DATABASE_URL)

# CHECK DOCUMEMENTATION FOR HOW THEY DEFINE THE DATABASE URL


def create_db_and_tables():
    """
    Creates all database tables defined by SQLModel models.
    Call this once at application startup (e.g., in main.py).
    """
    # SQLModel.metadata.drop_all(engine_sync) # Uncomment to drop all tables first (BE CAREFUL!)
    SQLModel.metadata.create_all(engine)
    print("Database tables created (if they didn't exist).")


def get_db():
    """
    Dependency to get a synchronous database session.
    """
    with Session(engine) as session:
        yield session


# --- Asynchronous Setup (Consider for better performance in FastAPI) ---
# To use async, you'll also need to install 'asyncpg': pip install asyncpg
# from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
# from sqlalchemy.orm import sessionmaker

# DATABASE_URL_ASYNC = "postgresql+asyncpg://postgres:your_postgres_password@localhost:5432/postgres"
# Or: "postgresql+asyncpg://my_app_user:my_app_password@localhost:5432/my_notion_clone_db"

# engine_async = create_async_engine(DATABASE_URL_ASYNC, echo=True)

# async def create_db_and_tables_async():
#     async with engine_async.begin() as conn:
#         # await conn.run_sync(SQLModel.metadata.drop_all) # BE CAREFUL!
#         await conn.run_sync(SQLModel.metadata.create_all)
#     print("Async database tables created (if they didn't exist).")

# async def get_session_async() -> AsyncSession:
#     async_session_maker = sessionmaker(
#         engine_async, class_=AsyncSession, expire_on_commit=False
#     )
#     async with async_session_maker() as session:
#         yield session
