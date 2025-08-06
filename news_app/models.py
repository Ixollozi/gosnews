from django.db import models
from core.translation_service import TranslationService
# Create your models here.

class News(models.Model):
    # Основной контент (на языке по умолчанию - узбекском)
    title = models.CharField(max_length=200)
    content = models.TextField()
    source_language = models.CharField(max_length=2, default='uz')

    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    featured_image = models.ImageField(upload_to='news/images/')
    additional_images = models.ManyToManyField('NewsImage', blank=True)
    video_url = models.URLField(blank=True)

    is_published = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views_count = models.PositiveIntegerField(default=0)

    # Кешированные переводы (опционально)
    cached_translations = models.JSONField(default=dict, blank=True)

    def get_title(self, language='uz'):
        """Получить заголовок на нужном языке"""
        if language == self.source_language:
            return self.title

        # Проверяем кеш
        cache_key = f"title_{language}"
        if cache_key in self.cached_translations:
            return self.cached_translations[cache_key]

        # Переводим и кешируем
        translated_title = TranslationService.translate(
            self.title,
            source_lang=self.source_language,
            target_lang=language
        )

        self.cached_translations[cache_key] = translated_title
        self.save(update_fields=['cached_translations'])

        return translated_title

    def get_content(self, language='uz'):
        """Получить контент на нужном языке"""
        if language == self.source_language:
            return self.content

        cache_key = f"content_{language}"
        if cache_key in self.cached_translations:
            return self.cached_translations[cache_key]

        # Для больших текстов можем разбить на части
        translated_content = TranslationService.translate_long_text(
            self.content,
            source_lang=self.source_language,
            target_lang=language
        )

        self.cached_translations[cache_key] = translated_content
        self.save(update_fields=['cached_translations'])

        return translated_content


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    source_language = models.CharField(max_length=2, default='uz')
    cached_translations = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)

    def get_name(self, language='uz'):
        if language == self.source_language:
            return self.name

        cache_key = f"name_{language}"
        if cache_key in self.cached_translations:
            return self.cached_translations[cache_key]

        translated_name = TranslationService.translate(
            self.name,
            source_lang=self.source_language,
            target_lang=language
        )

        self.cached_translations[cache_key] = translated_name
        self.save(update_fields=['cached_translations'])

        return translated_name


class Tutorial(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    source_language = models.CharField(max_length=2, default='uz')
    cached_translations = models.JSONField(default=dict, blank=True)

    video_url = models.URLField()
    thumbnail = models.ImageField(upload_to='tutorials/thumbnails/')
    duration = models.CharField(max_length=10)  # "10:30"
    difficulty_level = models.CharField(max_length=20)

    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def get_title(self, language='uz'):
        if language == self.source_language:
            return self.title

        cache_key = f"title_{language}"
        if cache_key in self.cached_translations:
            return self.cached_translations[cache_key]

        translated_title = TranslationService.translate(
            self.title,
            source_lang=self.source_language,
            target_lang=language
        )

        self.cached_translations[cache_key] = translated_title
        self.save(update_fields=['cached_translations'])

        return translated_title
