# EduApp — CBC Grades 1-3 Learning Platform

## Structure
```
eduapp/
├── backend/      Express API + WebSocket
├── frontend/     React (Vite) SPA
├── db/           SQL migrations + seed data
└── docs/         Engineering brief, ADRs, API spec
```

## Quick Start
```bash
# Backend
cd backend && npm install && cp .env.example .env && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

## Environment
Copy `backend/.env.example` → `backend/.env` and fill in secrets before starting.
