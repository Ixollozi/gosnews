from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls.i18n import i18n_patterns
from news_app.frontend_views import serve_frontend

urlpatterns = [
    path('i18n/', include('django.conf.urls.i18n')),
]

urlpatterns += i18n_patterns(
    path('admin/', admin.site.urls),
    path('', include('news_app.urls')),
) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# API URLs
urlpatterns += [
    path('api/', include('news_app.api')),
]

# Serve frontend for all other routes
urlpatterns += [
    re_path(r'^(?!api/|admin/|i18n/|static/|media/).*$', serve_frontend, name='frontend'),
]