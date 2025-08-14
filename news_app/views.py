from django.utils.translation import get_language
from django.shortcuts import render, get_object_or_404, redirect
from .models import NewsTranslation, CategoryTranslation, Leaders, Debt, GuideChoices, Guide


def index(request):
    lang = get_language()
    news = NewsTranslation.objects.select_related("news", "category").filter(lang=lang)[:3]
    categories = CategoryTranslation.objects.filter(lang=lang)
    leaders = Leaders.objects.all()
    debts = Debt.objects.all()

    # Получаем все гайды с их переводами для текущего языка
    guides_with_choices = Guide.objects.prefetch_related(
        'choices'
    ).filter(
        choices__language=lang
    ).distinct()

    # Также получаем отдельно guide_choices для удобства работы с типами
    guide_choices = GuideChoices.objects.filter(language=lang).select_related('guide')


    # Получаем первого лидера для отображения по умолчанию
    current_leader = leaders.first() if leaders.exists() else None

    context = {
        'news': news,
        'categories': categories,
        'leaders_list': leaders,
        'leaders': leaders,  # Для совместимости со старым кодом
        'debts': debts,
        'guides_list': guides_with_choices,
        'guide_choices': guide_choices,
        'current_leader': current_leader,
    }

    return render(request, 'index.html', context)


# Альтернативный вариант - показать промежуточную страницу
def guide(request, guide_type):
    current_lang = request.LANGUAGE_CODE or get_language()
    try:
        guide_choice = GuideChoices.objects.get(
            guide_type=guide_type,
            language=current_lang
        )

        # Вместо прямого перенаправления, покажем промежуточную страницу

        context = {
            'guide': guide_choice.guide,
            'guide_choice': guide_choice,
            'link': guide_choice.guide.link,
            'preview': guide_choice.guide.link.split('?')[0].split('/')[-1],
        }

        return render(request, 'second.html', context)
    except Exception as e:
        print(e)
        return redirect(f'/{current_lang}/')

