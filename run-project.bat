@echo off

start cmd /k "cd backend && venv\Scripts\activate && py manage.py runserver"

start cmd /k "npm run dev"