from pydantic import BaseModel, Field
from typing import Any


class PageBase(BaseModel):
    """
    Base schema for Page.
    """

    docId: str | None = Field(default=None)

    content: dict[str, Any] | list[Any] = Field(default_factory=dict)
    pass  # No common fields needed in base for now if type is removed


class PageCreate(PageBase):
    """
    Schema for creating a new Page.
    Content is expected to be a valid JSON structure (dict or list).
    """

    # content: Any  # Or Dict[str, Any] | List[Any] for slightly stricter typing
    pass


class PageRead(PageBase):
    """
    Schema for reading/returning a Page.
    Includes the database ID and the content JSON.
    """

    id: int
    # content: Any  # The content retrieved from the JSONB column

    class Config:
        from_attributes = True


class PageUpdate(PageBase):
    """
    Schema for updating an existing Page.
    Content is optional and replaces the existing content if provided.
    """

    # content: Any | None = None  # Allow sending null or omitting to not update content
    pass
