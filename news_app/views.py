from django.utils.translation import get_language
from django.shortcuts import render, get_object_or_404, redirect
from .models import NewsTranslation,CategoryTranslation,Leaders,Debt,GuideChoices

def index(request):
    lang = get_language()
    news = NewsTranslation.objects.select_related("news", "category").filter(lang=lang)[:3]
    categories = CategoryTranslation.objects.filter(lang=lang)
    leaders = Leaders.objects.all()
    debts = Debt.objects.all()

    context = {
        'news': news,
        'categories': categories,
        'leaders': leaders,
        'debts': debts,
    }

    return render(request, 'index.html', context)


def guide(request, guide_type):
    # Получаем текущий язык из запроса
    current_lang = request.LANGUAGE_CODE  # 'uz', 'ru', 'kaa'

    # Ищем в базе ссылку по типу и языку
    guide_choice = get_object_or_404(
        GuideChoices,
        guide_type=guide_type,
        language=current_lang
    )

    # Перенаправляем на найденную ссылку
    return redirect(guide_choice.guide.link)
