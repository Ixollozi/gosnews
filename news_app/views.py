from django.utils.translation import get_language
from django.shortcuts import render, redirect, get_object_or_404
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
# from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import News, NewsTranslation, Category, CategoryTranslation, Leaders, Debt, GuideTranslation, Guide, Partners
from .serializers import (
    NewsTranslationSerializer, LeadersSerializer, DebtSerializer,
    GuideTranslationSerializer, PartnersSerializer, CategorySerializer,
    CategoryTranslationSerializer
)

def get_news_data(lang):
    """Получение данных о новостях и категориях"""
    news = NewsTranslation.objects.select_related("news", "category").filter(lang=lang).order_by('-news__created_at')[:3]
    categories = CategoryTranslation.objects.filter(lang=lang)
    
    return {
        'news': news,
        'categories': categories
    }

def get_leaders_data(lang):
    """Получение данных о лидерах по регионам"""
    # Все лидеры с region_link и не пустым регионом
    valid_leaders = Leaders.objects.exclude(region='').filter(
        region_link__isnull=False
    ).distinct()

    # Создаём словарь для уникальности и сохранения порядка
    region_map = {}
    for leader in valid_leaders:
        if leader.region not in region_map:
            region_map[leader.region] = leader

    # Порядок из модели Leaders.REGION_CHOICES
    region_order = [region[0] for region in Leaders.REGION_CHOICES]

    # Сортируем регионы по порядку из REGION_CHOICES
    sorted_leaders = [
        region_map[region] for region in region_order if region in region_map
    ]

    leaders_list = sorted_leaders
    current_leader = leaders_list[0] if leaders_list else None
    
    return {
        'leaders_list': leaders_list,
        'current_leader': current_leader
    }

def get_debts_data():
    """Получение данных о долгах"""
    debts = Debt.objects.all()
    return {'debts': debts}

def get_guides_data(lang):
    """Получение данных о руководствах"""
    guides_with_choices = Guide.objects.prefetch_related('translations').filter(
        translations__lang=lang
    ).distinct()
    guide_choices = GuideTranslation.objects.filter(lang=lang).select_related('guide')
    
    return {
        'guides_list': guides_with_choices,
        'guide_choices': guide_choices
    }
    
def get_partners_data():
    """Получение данных о партнерах"""
    partners = Partners.objects.all()
    return {'partners': partners}

def index(request):
    """Главная страница - объединяет данные из всех функций"""
    lang = get_language()
    
    # Получаем данные из каждой функции
    news_data = get_news_data(lang)
    leaders_data = get_leaders_data(lang)
    debts_data = get_debts_data()
    guides_data = get_guides_data(lang)
    partners_data = get_partners_data()
    
    # Объединяем все данные в один контекст
    context = {
        **news_data,
        **leaders_data,
        **debts_data,
        **guides_data,
        **partners_data
    }

    return render(request, 'index.html', context)


# Альтернативный вариант - показать промежуточную страницу
def guide(request, guide_type):
    current_lang = request.LANGUAGE_CODE or get_language()
    try:
        guide_choice = GuideTranslation.objects.select_related('guide').get(
            guide__guide_type=guide_type,  # ← связь через guide
            lang=current_lang               # ← поле называется lang, не language
        )

        context = {
            'guide': guide_choice,
            'guide_type': guide_choice.guide.guide_type,
            'link': guide_choice.guide.link,
            'preview': guide_choice.guide.preview_url,
        }
        return render(request, 'guides.html', context)
    except GuideTranslation.DoesNotExist:
        return redirect('home')
    except Exception as e:
        print("Error:", e)
        return redirect('home')


def leaders(request):
    leaders = Leaders.objects.all()
    return render(request, 'leaders.html', {'leaders': leaders})


def news_detail(request, news_id: int):
    current_lang = request.LANGUAGE_CODE or get_language()
    base_news = get_object_or_404(News, id=news_id)
    news_tr = get_object_or_404(NewsTranslation.objects.select_related('category'), news=base_news, lang=current_lang)

    related_news = (
        NewsTranslation.objects.select_related('news', 'category')
        .filter(lang=current_lang)
        .exclude(news=base_news)
        .order_by('-news__created_at')
    )

    context = {
        'news': news_tr,
        'related_news': related_news,
    }
    return render(request, 'news_detail.html', context)


def all_news(request):
    """Страница со всеми новостями"""
    current_lang = request.LANGUAGE_CODE or get_language()
    
    # Получаем все новости
    news_list = NewsTranslation.objects.select_related('news', 'category').filter(
        lang=current_lang
    ).order_by('-news__created_at')
    
    # Получаем все категории для фильтрации
    categories = CategoryTranslation.objects.filter(lang=current_lang)
    
    # Фильтрация по категории
    category_filter = request.GET.get('category')
    if category_filter:
        news_list = news_list.filter(category__slug=category_filter)
    
    # Поиск по заголовку
    search_query = request.GET.get('search')
    if search_query:
        news_list = news_list.filter(title__icontains=search_query)
    
    # Пагинация
    paginator = Paginator(news_list, 12)  # 12 новостей на страницу
    page = request.GET.get('page')
    
    try:
        news_list = paginator.page(page)
    except PageNotAnInteger:
        news_list = paginator.page(1)
    except EmptyPage:
        news_list = paginator.page(paginator.num_pages)
    
    context = {
        'news_list': news_list,
        'categories': categories,
        'current_category': category_filter,
        'search_query': search_query,
        'paginator': paginator,
    }
    return render(request, 'all_news.html', context)


# ================== API VIEWS ==================

class NewsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = NewsTranslation.objects.all()
    serializer_class = NewsTranslationSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['news__created_at']
    ordering = ['-news__created_at']
    
    def get_queryset(self):
        lang = self.request.query_params.get('lang', 'uz')
        queryset = NewsTranslation.objects.select_related('news', 'category').filter(lang=lang)
        
        # Manual filtering for category
        category_slug = self.request.query_params.get('category__slug')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
            
        return queryset


class LeadersViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Leaders.objects.all()
    serializer_class = LeadersSerializer
    
    def get_queryset(self):
        queryset = Leaders.objects.all()
        region = self.request.query_params.get('region')
        if region:
            queryset = queryset.filter(region=region)
        return queryset


class DebtViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Debt.objects.all()
    serializer_class = DebtSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['inn', 'full_name']
    
    def get_queryset(self):
        queryset = Debt.objects.all()
        status = self.request.query_params.get('status')
        debt_type = self.request.query_params.get('debt_type')
        if status:
            queryset = queryset.filter(status=status)
        if debt_type:
            queryset = queryset.filter(debt_type=debt_type)
        return queryset


class GuideViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GuideTranslation.objects.all()
    serializer_class = GuideTranslationSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['guide__created_at']
    ordering = ['-guide__created_at']
    
    def get_queryset(self):
        lang = self.request.query_params.get('lang', 'uz')
        queryset = GuideTranslation.objects.select_related('guide').filter(lang=lang)
        guide_type = self.request.query_params.get('guide__guide_type')
        if guide_type:
            queryset = queryset.filter(guide__guide_type=guide_type)
        return queryset


class PartnersViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Partners.objects.all()
    serializer_class = PartnersSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_queryset(self):
        queryset = Category.objects.all()
        slug = self.request.query_params.get('slug')
        if slug:
            queryset = queryset.filter(slug=slug)
        return queryset


# API endpoints for specific data
@api_view(['GET'])
def home_data(request):
    """Get all data for homepage"""
    lang = request.query_params.get('lang', 'uz')
    
    # Get news data
    news_data = get_news_data(lang)
    news_serializer = NewsTranslationSerializer(news_data['news'], many=True)
    categories_serializer = CategoryTranslationSerializer(news_data['categories'], many=True)
    
    # Get leaders data
    leaders_data = get_leaders_data(lang)
    leaders_serializer = LeadersSerializer(leaders_data['leaders_list'], many=True)
    
    # Get debts data
    debts_data = get_debts_data()
    debts_serializer = DebtSerializer(debts_data['debts'], many=True)
    
    # Get guides data
    guides_data = get_guides_data(lang)
    guides_serializer = GuideTranslationSerializer(guides_data['guide_choices'], many=True)
    
    # Get partners data
    partners_data = get_partners_data()
    partners_serializer = PartnersSerializer(partners_data['partners'], many=True)
    
    return Response({
        'news': news_serializer.data,
        'categories': categories_serializer.data,
        'leaders': leaders_serializer.data,
        'debts': debts_serializer.data,
        'guides': guides_serializer.data,
        'partners': partners_serializer.data,
    })


@api_view(['GET'])
def news_detail_api(request, news_id):
    """Get news detail by ID"""
    lang = request.query_params.get('lang', 'uz')
    
    try:
        base_news = News.objects.get(id=news_id)
        news_translation = NewsTranslation.objects.select_related('category').get(
            news=base_news, lang=lang
        )
        
        # Get related news
        related_news = NewsTranslation.objects.select_related('news', 'category').filter(
            lang=lang
        ).exclude(news=base_news).order_by('-news__created_at')[:3]
        
        news_serializer = NewsTranslationSerializer(news_translation)
        related_serializer = NewsTranslationSerializer(related_news, many=True)
        
        return Response({
            'news': news_serializer.data,
            'related_news': related_serializer.data,
        })
        
    except (News.DoesNotExist, NewsTranslation.DoesNotExist):
        return Response(
            {'error': 'News not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

