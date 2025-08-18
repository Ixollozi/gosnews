from django.utils.translation import get_language
from django.shortcuts import render, get_object_or_404, redirect
from .models import NewsTranslation, CategoryTranslation, Leaders, Debt, GuideTranslation, Guide


def index(request):
    lang = get_language()
    news = NewsTranslation.objects.select_related("news", "category").filter(lang=lang)[:3]
    categories = CategoryTranslation.objects.filter(lang=lang)
    leaders = Leaders.objects.all()
    debts = Debt.objects.all()

    # Получаем все гайды с их переводами для текущего языка
    guides_with_choices = Guide.objects.prefetch_related(
        'translations'
    ).filter(
        translations__lang=lang
    ).distinct()

    # Получаем переводы гайдов для текущего языка
    guide_choices = GuideTranslation.objects.filter(lang=lang).select_related('guide')

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
        return render(request, 'second.html', context)
    except GuideTranslation.DoesNotExist:
        return redirect('home')
    except Exception as e:
        print("Error:", e)
        return redirect('home')

