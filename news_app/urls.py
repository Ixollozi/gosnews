from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('guides/', views.guides, name='guides'),
    path('guide/<str:guide_type>', views.guide, name='guide'),
    path('leaders/', views.leaders, name='leaders'),
    path('news/<int:news_id>/', views.news_detail, name='news_detail'),
    path('news/', views.all_news, name='all_news'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('debt-check/', views.debt_check, name='debt_check'),
]