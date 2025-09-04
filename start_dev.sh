#!/bin/bash

echo "Starting Gosnews Development Environment..."

echo ""
echo "Starting Django Backend..."
gnome-terminal -- bash -c "python manage.py runserver; exec bash" &

echo ""
echo "Starting Next.js Frontend..."
gnome-terminal -- bash -c "cd frontend && npm run dev; exec bash" &

echo ""
echo "Both servers are starting..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press any key to continue..."
read -n 1




