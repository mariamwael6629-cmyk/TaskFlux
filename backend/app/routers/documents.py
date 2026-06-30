from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.deps import get_current_user
from app.models.document import Document
from app.models.user import User
from app.routers.workspaces import get_owned_workspace
from app.schemas.document import DocumentCreate, DocumentOut, DocumentUpdate

router = APIRouter(prefix="/api", tags=["documents"])


def get_owned_document(document_id: int, db: Session, current_user: User) -> Document:
    document = db.get(Document, document_id)
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    get_owned_workspace(document.workspace_id, db, current_user)
    return document


@router.get("/workspaces/{workspace_id}/documents", response_model=list[DocumentOut])
def list_documents(
    workspace_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    get_owned_workspace(workspace_id, db, current_user)
    return (
        db.query(Document)
        .filter(Document.workspace_id == workspace_id)
        .order_by(Document.updated_at.desc())
        .all()
    )


@router.post(
    "/workspaces/{workspace_id}/documents", response_model=DocumentOut, status_code=status.HTTP_201_CREATED
)
def create_document(
    workspace_id: int,
    payload: DocumentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_owned_workspace(workspace_id, db, current_user)
    document = Document(
        workspace_id=workspace_id,
        title=payload.title,
        emoji=payload.emoji,
        content=payload.content,
        author=current_user.name,
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document


@router.get("/documents/{document_id}", response_model=DocumentOut)
def get_document(
    document_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return get_owned_document(document_id, db, current_user)


@router.patch("/documents/{document_id}", response_model=DocumentOut)
def update_document(
    document_id: int,
    payload: DocumentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document = get_owned_document(document_id, db, current_user)
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(document, field, value)
    document.author = current_user.name
    db.commit()
    db.refresh(document)
    return document


@router.delete("/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    document_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    document = get_owned_document(document_id, db, current_user)
    db.delete(document)
    db.commit()
