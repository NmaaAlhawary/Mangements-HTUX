# Video Production Manager

A full-stack demo for tracking video shooting and editing projects. The backend is powered by Django REST Framework, and the frontend is a Vite + React.

# Overview

Video Production Manager is a streamlined dashboard that helps schools, departments, and media teams organize their video projects effortlessly.
It enables you to plan shoots, assign crew members, record production details, and maintain a complete database of all videos produced. Whether you’re managing academic recordings, promotional content, orientation videos, or student projects, this tool keeps everything in one place.

#  Key Features
1.  Project Management

- Create and organize video projects by category or school

- Add project names, pathways, course titles, and module details

- Set dates, video codes, blocks, and titles

## Prerequisite.

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

You can now sign in to `http://127.0.0.1:8000/admin/` and review/edit the projects from admin side. 

## Frontend (React)

```bash
cd frontend
cp .env.example .env      
npm install
npm run dev
```

Visit the dev server output (typically `http://127.0.0.1:5173`) to use the Video Production Manager UI. The app reads from `VITE_API_URL`, so update `.env` if the backend runs elsewhere.






