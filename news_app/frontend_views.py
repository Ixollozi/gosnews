from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
import os

def serve_frontend(request, path=''):
    """
    Serve Next.js frontend from Django
    """
    # Handle API routes - let Django handle them
    if path.startswith('api/'):
        return None
    
    # Build the file path
    frontend_path = os.path.join(settings.BASE_DIR, 'frontend', 'out')
    
    # If no path specified, serve index.html
    if not path or path == '/':
        file_path = os.path.join(frontend_path, 'index.html')
    else:
        # Remove leading slash and add .html if no extension
        clean_path = path.lstrip('/')
        if not os.path.splitext(clean_path)[1]:
            clean_path += '.html'
        
        file_path = os.path.join(frontend_path, clean_path)
    
    # Check if file exists
    if os.path.exists(file_path):
        with open(file_path, 'rb') as f:
            content = f.read()
        
        # Set appropriate content type
        if file_path.endswith('.html'):
            content_type = 'text/html'
        elif file_path.endswith('.js'):
            content_type = 'application/javascript'
        elif file_path.endswith('.css'):
            content_type = 'text/css'
        elif file_path.endswith('.json'):
            content_type = 'application/json'
        else:
            content_type = 'application/octet-stream'
        
        return HttpResponse(content, content_type=content_type)
    
    # If file not found, serve index.html for SPA routing
    index_path = os.path.join(frontend_path, 'index.html')
    if os.path.exists(index_path):
        with open(index_path, 'rb') as f:
            content = f.read()
        return HttpResponse(content, content_type='text/html')
    
    # Return 404 if nothing found
    return HttpResponse('Not Found', status=404)




