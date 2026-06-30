from pydantic import BaseModel, ConfigDict, Field


class CardBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str = ""
    priority: str = Field(default="medium", pattern="^(low|medium|high)$")
    due_date: str | None = None
    tags: list[str] = []
    assignee: str = ""


class CardCreate(CardBase):
    pass


class CardUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    priority: str | None = Field(default=None, pattern="^(low|medium|high)$")
    due_date: str | None = None
    tags: list[str] | None = None
    assignee: str | None = None
    column_id: int | None = None
    order: float | None = None


class CardOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    column_id: int
    title: str
    description: str
    priority: str
    due_date: str | None
    tags: list[str]
    assignee: str
    order: float


class ColumnCreate(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    color: str = "#64748b"


class ColumnOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    board_id: int
    title: str
    color: str
    order: float
    cards: list[CardOut] = []


class BoardCreate(BaseModel):
    name: str = Field(min_length=1, max_length=160)


class BoardOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    workspace_id: int
    name: str


class BoardDetailOut(BoardOut):
    columns: list[ColumnOut] = []
