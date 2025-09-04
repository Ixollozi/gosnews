from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'news', views.NewsViewSet)
router.register(r'leaders', views.LeadersViewSet)
router.register(r'debts', views.DebtViewSet)
router.register(r'guides', views.GuideViewSet)
router.register(r'partners', views.PartnersViewSet)
router.register(r'categories', views.CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('home/', views.home_data, name='home-data'),
    path('news/<int:news_id>/detail/', views.news_detail_api, name='news-detail-api'),
]




