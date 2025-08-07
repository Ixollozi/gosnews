from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views

app_name = 'news_app'

urlpatterns = [
    path('', views.main, name='main')
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)