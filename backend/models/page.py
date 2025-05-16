from sqlmodel import Field, SQLModel, Column
from sqlalchemy.dialects.postgresql import JSONB
from typing import Any  # Use Any for flexibility


class Page(SQLModel, table=True):
    """
    Database model for a Page.
    Content is stored as a JSONB blob.
    """

    id: int | None = Field(default=None, primary_key=True)
    # Removed type: str = Field(default="doc") as it's part of content

    # Store the entire Tiptap document structure as JSONB
    content: Any = Field(
        default={},  # Default to an empty dict for the content field
        sa_column=Column(JSONB),
    )

    # Consider adding other metadata like title, timestamps etc.
    # title: str | None = Field(index=True, default=None)
    # created_at: datetime = Field(default_factory=datetime.utcnow)
    # updated_at: datetime = Field(default_factory=datetime.utcnow)
