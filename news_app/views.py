from django.utils.translation import get_language
from django.shortcuts import render, redirect
from .models import NewsTranslation, CategoryTranslation, Leaders, Debt, GuideTranslation, Guide, Partners

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

