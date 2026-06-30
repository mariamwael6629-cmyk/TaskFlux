from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.deps import get_current_user
from app.models.board import Board, Card, Column
from app.models.user import User
from app.routers.workspaces import get_owned_workspace
from app.schemas.board import (
    BoardCreate,
    BoardDetailOut,
    BoardOut,
    CardCreate,
    CardOut,
    CardUpdate,
    ColumnCreate,
    ColumnOut,
)

router = APIRouter(prefix="/api", tags=["boards"])


def _card_to_out(card: Card) -> CardOut:
    data = {
        "id": card.id,
        "column_id": card.column_id,
        "title": card.title,
        "description": card.description,
        "priority": card.priority,
        "due_date": card.due_date,
        "tags": [t for t in card.tags.split(",") if t] if card.tags else [],
        "assignee": card.assignee,
        "order": card.order,
    }
    return CardOut(**data)


def _column_to_out(column: Column) -> ColumnOut:
    return ColumnOut(
        id=column.id,
        board_id=column.board_id,
        title=column.title,
        color=column.color,
        order=column.order,
        cards=[_card_to_out(c) for c in column.cards],
    )


def get_owned_board(board_id: int, db: Session, current_user: User) -> Board:
    board = db.get(Board, board_id)
    if not board:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")
    get_owned_workspace(board.workspace_id, db, current_user)
    return board


def get_owned_column(column_id: int, db: Session, current_user: User) -> Column:
    column = db.get(Column, column_id)
    if not column:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Column not found")
    get_owned_board(column.board_id, db, current_user)
    return column


def get_owned_card(card_id: int, db: Session, current_user: User) -> Card:
    card = db.get(Card, card_id)
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
    get_owned_column(card.column_id, db, current_user)
    return card


@router.get("/workspaces/{workspace_id}/boards", response_model=list[BoardOut])
def list_boards(
    workspace_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    get_owned_workspace(workspace_id, db, current_user)
    return db.query(Board).filter(Board.workspace_id == workspace_id).order_by(Board.id).all()


@router.post(
    "/workspaces/{workspace_id}/boards", response_model=BoardDetailOut, status_code=status.HTTP_201_CREATED
)
def create_board(
    workspace_id: int,
    payload: BoardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_owned_workspace(workspace_id, db, current_user)
    board = Board(workspace_id=workspace_id, name=payload.name)
    db.add(board)
    db.flush()
    for i, col in enumerate([{"title": "To Do", "color": "#64748b"}]):
        db.add(Column(board_id=board.id, title=col["title"], color=col["color"], order=i))
    db.commit()
    db.refresh(board)
    return BoardDetailOut(id=board.id, workspace_id=board.workspace_id, name=board.name, columns=[_column_to_out(c) for c in board.columns])


@router.get("/boards/{board_id}", response_model=BoardDetailOut)
def get_board(board_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    board = get_owned_board(board_id, db, current_user)
    return BoardDetailOut(
        id=board.id, workspace_id=board.workspace_id, name=board.name,
        columns=[_column_to_out(c) for c in board.columns],
    )


@router.post("/boards/{board_id}/columns", response_model=ColumnOut, status_code=status.HTTP_201_CREATED)
def create_column(
    board_id: int,
    payload: ColumnCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    board = get_owned_board(board_id, db, current_user)
    max_order = max([c.order for c in board.columns], default=-1)
    column = Column(board_id=board_id, title=payload.title, color=payload.color, order=max_order + 1)
    db.add(column)
    db.commit()
    db.refresh(column)
    return _column_to_out(column)


@router.post("/columns/{column_id}/cards", response_model=CardOut, status_code=status.HTTP_201_CREATED)
def create_card(
    column_id: int,
    payload: CardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    column = get_owned_column(column_id, db, current_user)
    max_order = max([c.order for c in column.cards], default=-1)
    card = Card(
        column_id=column_id,
        title=payload.title,
        description=payload.description,
        priority=payload.priority,
        due_date=payload.due_date,
        tags=",".join(payload.tags),
        assignee=payload.assignee,
        order=max_order + 1,
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return _card_to_out(card)


@router.patch("/cards/{card_id}", response_model=CardOut)
def update_card(
    card_id: int,
    payload: CardUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    card = get_owned_card(card_id, db, current_user)

    if payload.column_id is not None and payload.column_id != card.column_id:
        get_owned_column(payload.column_id, db, current_user)
        card.column_id = payload.column_id

    update_data = payload.model_dump(exclude_unset=True, exclude={"column_id", "tags"})
    for field, value in update_data.items():
        setattr(card, field, value)
    if payload.tags is not None:
        card.tags = ",".join(payload.tags)

    db.commit()
    db.refresh(card)
    return _card_to_out(card)


@router.delete("/cards/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(card_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    card = get_owned_card(card_id, db, current_user)
    db.delete(card)
    db.commit()
