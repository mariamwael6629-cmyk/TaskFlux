# ⚡ TaskFlux

A sleek, collaborative project management platform featuring real-time Kanban boards, shared document workspaces, and seamless team collaboration. Built with a modern **React + Vite** frontend and a high-performance **FastAPI** backend.

---

## 🚀 Features

*   **Workspace Management:** Create separate team environments with unique boards and docs.
*   **Interactive Kanban Boards:** Dynamic drag-and-drop workflow powered by `@hello-pangea/dnd`.
*   **Collaborative Documents:** Shared workspaces for real-time rich-text or markdown documentation.
*   **Granular Authentication:** Secure JWT-based user authentication and route protection.
*   **Clean Architecture:** Highly scalable and decoupled frontend/backend structure.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework:** React 18 (Vite)
*   **Routing:** React Router v6
*   **State & HTTP:** Axios, React Context API
*   **Drag & Drop:** `@hello-pangea/dnd`

### Backend & Database
*   **Framework:** FastAPI
*   **ORM:** SQLAlchemy 2.0
*   **Validation:** Pydantic v2
*   **Security:** `python-jose` (JWT), `passlib` (Bcrypt)
*   **Database:** SQLite (Default, easily swappable via `DATABASE_URL`)

---

## 📂 Project Structure

```text
TaskFlux/
  ├── backend/                 # FastAPI Application
  │   ├── app/
  │   │   ├── core/            # Settings & JWT security
  │   │   ├── db/              # SQLAlchemy session setup
  │   │   ├── models/          # ORM Models (User, Workspace, Board, Column, Card, Document)
  │   │   ├── schemas/         # Pydantic validation models
  │   │   ├── routers/         # REST API endpoints
  │   │   ├── deps.py          # Shared dependencies (Auth injection)
  │   │   └── main.py          # App entrypoint & CORS configuration
  │   ├── requirements.txt
  │   └── .env.example
  │
  └── frontend/                # React Application
      ├── src/
      │   ├── api/             # Axios API wrapper clients
      │   ├── components/      # Reusable UI (Sidebar, Kanban, Modals)
      │   ├── context/         # AuthContext & AppState Contexts
      │   ├── pages/           # App Views (Dashboard, Workspace, Editor, Auth)
      │   ├── icons/           # Custom inline SVG asset set
      │   ├── styles/          # base (tokens/reset), components/, layout/, features/
      │   └── index.css        # Imports every stylesheet under styles/ in cascade order
      └── .env.example

```

---

## 🏁 Quick Start

### Prerequisites

* **Python** 3.11+
* **Node.js** 18+

### 1. Backend Setup (`http://localhost:8000`)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000

```

### 2. Frontend Setup (`http://localhost:5173`)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev

```

> **Note:** Once both servers are running, visit `http://localhost:5173` to sign up. A default workspace and initial Kanban board will be generated automatically for your account.

---

## ⚙️ Configuration & Environment Variables

### Backend Configuration (`backend/.env`)

| Variable | Default Value | Description |
| --- | --- | --- |
| `DATABASE_URL` | `sqlite:///./taskflux.db` | SQLAlchemy database connection string |
| `SECRET_KEY` | — | Cryptographic key for signing JWT tokens |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `10080` (7 days) | Session duration before token expiration |
| `CORS_ORIGINS` | `http://localhost:5173` | Allowed client-side domains separated by commas |

### Frontend Configuration (`frontend/.env`)

| Variable | Default Value | Description |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:8000/api` | Base target URL for backend API requests |

---

## 🔑 Authentication Flow

* **Secure Hashing:** Passwords are fully hashed with **Bcrypt** using `passlib` before DB storage.
* **Bearer Tokens:** Authorization relies on JWT tokens issued upon successful registration or login.
* **Interceptors:** Axios request interceptors automatically append the token from `localStorage` to all authenticated headers.
* **Session Guard:** An explicit 401 response interceptor catches expired sessions, immediately invalidating the local state and rerouting to `/login`.

---

## 📑 API Reference

Once the backend is live, you can interact with the dynamic documentation at:

* **Swagger UI:** `http://localhost:8000/docs`
* **ReDoc:** `http://localhost:8000/redoc`

> **Note:** Every protected endpoint requires the `Authorization: Bearer <token>` header.

### Endpoints Breakdown

| Method | Endpoint Path | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register new user & issue token |
| `POST` | `/api/auth/login` | Authenticate user & issue token |
| `GET` | `/api/auth/me` | Fetch active user profile data |
| `GET` | `/api/workspaces` | List user workspaces |
| `POST` | `/api/workspaces` | Create workspace + auto-generate board |
| `GET` | `/api/workspaces/{id}` | Retrieve specific workspace metadata |
| `POST` | `/api/workspaces/{id}/members` | Invite member to workspace |
| `GET` | `/api/workspaces/{id}/boards` | List workspace boards |
| `POST` | `/api/workspaces/{id}/boards` | Create board inside workspace |
| `GET` | `/api/boards/{id}` | Fetch board with nested columns & cards |
| `POST` | `/api/boards/{id}/columns` | Append new status column |
| `POST` | `/api/columns/{id}/cards` | Create a task card |
| `PATCH` | `/api/cards/{id}` | Modify card or execute drag-and-drop move |
| `DELETE` | `/api/cards/{id}` | Remove specific task card |
| `GET` | `/api/workspaces/{id}/documents` | Retrieve workspace wiki documents |
| `POST` | `/api/workspaces/{id}/documents` | Instatiate text document |
| `PATCH` | `/api/documents/{id}` | Update document contents |
| `DELETE` | `/api/documents/{id}` | Delete document |
| `GET` | `/api/health` | API gateway health check |

---

## 📦 Production Deployment

### Building the Frontend

```bash
cd frontend
npm run build      # Generates optimized distribution build inside frontend/dist
npm run preview    # Locally verify production build behavior

```

### Server Execution

1. Host the static assets from `frontend/dist` using Nginx, Vercel, or Netlify.
2. Spin up the FastAPI instance using a production ASGI server like `uvicorn` or `gunicorn` behind a reverse proxy.
3. Update production environment variables (`CORS_ORIGINS`, `SECRET_KEY`) accordingly.

```

```