from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class WorkspaceCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    emoji: str = "🚀"
    color: str = "#6366f1"


class WorkspaceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    emoji: str
    color: str
    owner_id: int
    created_at: datetime


class MemberCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    role: str = "Member"
    initials: str = "U"
    color: str = "#6366f1"
    status: str = "online"


class MemberOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    workspace_id: int
    name: str
    role: str
    initials: str
    color: str
    status: str
