@echo off
echo Starting Gosnews Development Environment...

echo.
echo Starting Django Backend...
start "Django Backend" cmd /k "python manage.py runserver"

echo.
echo Starting Next.js Frontend...
start "Next.js Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
pause




