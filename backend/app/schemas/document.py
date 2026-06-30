from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class DocumentCreate(BaseModel):
    title: str = Field(default="Untitled Document", max_length=200)
    emoji: str = "📄"
    content: str = "# Untitled Document\n\nStart writing..."


class DocumentUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=200)
    emoji: str | None = None
    content: str | None = None


class DocumentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    workspace_id: int
    emoji: str
    title: str
    content: str
    author: str
    created_at: datetime
    updated_at: datetime
