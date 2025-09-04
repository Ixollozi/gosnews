#!/bin/bash

echo "Building and running Gosnews on single port..."

echo ""
echo "Step 1: Building Next.js frontend..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo "Error building frontend!"
    exit 1
fi

echo ""
echo "Step 2: Starting Django server..."
cd ..
python manage.py collectstatic --noinput
python manage.py runserver

echo ""
echo "Server is running on http://localhost:8000"
echo "Frontend and API are both available on the same port!"




