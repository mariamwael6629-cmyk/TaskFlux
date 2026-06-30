# TaskFlux Backend (FastAPI)

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs (Swagger) and http://localhost:8000/redoc

## Structure

```
app/
  core/      settings, security (JWT, password hashing)
  db/        SQLAlchemy engine/session
  models/    ORM models (User, Workspace, Board, Column, Card, Document)
  schemas/   Pydantic request/response models
  routers/   API route handlers (auth, workspaces, boards, documents)
  deps.py    shared dependencies (get_current_user)
  main.py    app factory, CORS, error handlers
```

## Auth

JWT bearer tokens. Register/login at `/api/auth/register` and `/api/auth/login`, then send
`Authorization: Bearer <token>` on subsequent requests.
