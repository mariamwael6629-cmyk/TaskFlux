from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Board(Base):
    __tablename__ = "boards"

    id: Mapped[int] = mapped_column(primary_key=True)
    workspace_id: Mapped[int] = mapped_column(ForeignKey("workspaces.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    workspace: Mapped["Workspace"] = relationship(back_populates="boards")
    columns: Mapped[list["Column"]] = relationship(
        back_populates="board", cascade="all, delete-orphan", order_by="Column.order"
    )


class Column(Base):
    __tablename__ = "columns"

    id: Mapped[int] = mapped_column(primary_key=True)
    board_id: Mapped[int] = mapped_column(ForeignKey("boards.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    color: Mapped[str] = mapped_column(String(16), default="#64748b")
    order: Mapped[float] = mapped_column(Float, default=0)

    board: Mapped["Board"] = relationship(back_populates="columns")
    cards: Mapped[list["Card"]] = relationship(
        back_populates="column", cascade="all, delete-orphan", order_by="Card.order"
    )


class Card(Base):
    __tablename__ = "cards"

    id: Mapped[int] = mapped_column(primary_key=True)
    column_id: Mapped[int] = mapped_column(ForeignKey("columns.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    priority: Mapped[str] = mapped_column(String(16), default="medium")
    due_date: Mapped[str | None] = mapped_column(String(20), nullable=True)
    tags: Mapped[str] = mapped_column(String(255), default="")
    assignee: Mapped[str] = mapped_column(String(8), default="")
    order: Mapped[float] = mapped_column(Float, default=0)

    column: Mapped["Column"] = relationship(back_populates="cards")
