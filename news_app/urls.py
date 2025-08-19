from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('guide/<str:guide_type>', views.guide, name='guide'),
    path('leaders', views.leaders, name='leaders'),
]