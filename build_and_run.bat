@echo off
echo Building and running Gosnews on single port...

echo.
echo Step 1: Building Next.js frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo Error building frontend!
    pause
    exit /b 1
)

echo.
echo Step 2: Starting Django server...
cd ..
python manage.py collectstatic --noinput
python manage.py runserver

echo.
echo Server is running on http://localhost:8000
echo Frontend and API are both available on the same port!
pause




