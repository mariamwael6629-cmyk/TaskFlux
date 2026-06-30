from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.deps import get_current_user
from app.models.board import Board, Column
from app.models.user import User
from app.models.workspace import Workspace, WorkspaceMember
from app.schemas.workspace import MemberCreate, MemberOut, WorkspaceCreate, WorkspaceOut

router = APIRouter(prefix="/api/workspaces", tags=["workspaces"])

DEFAULT_COLUMNS = [
    {"title": "To Do", "color": "#64748b"},
    {"title": "In Progress", "color": "#6366f1"},
    {"title": "Under Review", "color": "#f59e0b"},
    {"title": "Done", "color": "#10b981"},
]


def get_owned_workspace(workspace_id: int, db: Session, current_user: User) -> Workspace:
    workspace = db.get(Workspace, workspace_id)
    if not workspace:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")
    if workspace.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized for this workspace")
    return workspace


@router.get("", response_model=list[WorkspaceOut])
def list_workspaces(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Workspace).filter(Workspace.owner_id == current_user.id).order_by(Workspace.id).all()


@router.post("", response_model=WorkspaceOut, status_code=status.HTTP_201_CREATED)
def create_workspace(
    payload: WorkspaceCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    workspace = Workspace(name=payload.name, emoji=payload.emoji, color=payload.color, owner_id=current_user.id)
    db.add(workspace)
    db.flush()

    db.add(
        WorkspaceMember(
            workspace_id=workspace.id,
            name=current_user.name,
            role="Owner",
            initials=current_user.initials,
            color=payload.color,
            status="online",
        )
    )

    board = Board(workspace_id=workspace.id, name=f"{payload.name} Board")
    db.add(board)
    db.flush()
    for i, col in enumerate(DEFAULT_COLUMNS):
        db.add(Column(board_id=board.id, title=col["title"], color=col["color"], order=i))

    db.commit()
    db.refresh(workspace)
    return workspace


@router.get("/{workspace_id}", response_model=WorkspaceOut)
def get_workspace(
    workspace_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return get_owned_workspace(workspace_id, db, current_user)


@router.get("/{workspace_id}/members", response_model=list[MemberOut])
def list_members(
    workspace_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    get_owned_workspace(workspace_id, db, current_user)
    return (
        db.query(WorkspaceMember)
        .filter(WorkspaceMember.workspace_id == workspace_id)
        .order_by(WorkspaceMember.id)
        .all()
    )


@router.post("/{workspace_id}/members", response_model=MemberOut, status_code=status.HTTP_201_CREATED)
def add_member(
    workspace_id: int,
    payload: MemberCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_owned_workspace(workspace_id, db, current_user)
    member = WorkspaceMember(workspace_id=workspace_id, **payload.model_dump())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member
