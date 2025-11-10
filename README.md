<<<<<<< HEAD
# Video Production Manager

A full-stack demo for tracking video shooting and editing projects. The backend is powered by Django REST Framework and the frontend is a Vite + React single page app.

## Prerequisites

- Python 3.9+
- Node.js 18+ and npm

## Backend (Django)

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt  # or pip install django djangorestframework django-cors-headers
cd backend
python manage.py migrate
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/api/projects/`.

### Sample admin data

```bash
cd backend
python manage.py loaddata sample_projects  # loads backend/projects/fixtures/sample_projects.json
python manage.py createsuperuser           # follow prompts for admin login
```

You can now sign in to `http://127.0.0.1:8000/admin/` and review/edit the seeded projects.

## Frontend (React)

```bash
cd frontend
cp .env.example .env        # optional, defaults to localhost API
npm install
npm run dev
```

Visit the dev server output (typically `http://127.0.0.1:5173`) to use the Video Production Manager UI. The app reads from `VITE_API_URL`, so update `.env` if the backend runs elsewhere.
=======
# Mangements-HTUX
>>>>>>> a8a553fce8ff924cc6c5ec5e9726cc97f94d4762
