from django.shortcuts import render
from django.conf import settings
from django.utils import translation

def index(request):
    print("Available languages:", settings.LANGUAGES)
    print("Current language:", request.LANGUAGE_CODE)
    print("Session language:", request.session.get('django_language'))
    print("Active language:", translation.get_language())
    return render(request, 'index.html')