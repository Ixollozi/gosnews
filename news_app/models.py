from django.db import models
from urllib.parse import urlparse, parse_qs
from django.core.exceptions import ValidationError
from django.utils.text import slugify


# ================== Category ==================
class Category(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name="Название")
    slug = models.SlugField(max_length=50, unique=True, verbose_name="Ссылка для категории по URL")

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class CategoryTranslation(models.Model):
    LANG_CHOICES = [
        ('uz', "O'zbek"),
        ('ru', "Русский"),
        ('kaa', "Karakalpak"),
    ]

    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="translations")
    lang = models.CharField(max_length=5, choices=LANG_CHOICES, verbose_name="Язык")
    name = models.CharField(max_length=50, verbose_name="Название")

    class Meta:
        unique_together = ('category', 'lang')
        verbose_name = "Перевод категории"
        verbose_name_plural = "Переводы категорий"

    def __str__(self):
        return f"{self.lang} — {self.name}"


# ================== News ==================
class News(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Новость"
        verbose_name_plural = "Новости"

    def __str__(self):
        return f"News {self.id}"


class NewsTranslation(models.Model):
    LANG_CHOICES = [
        ('uz', "O'zbek"),
        ('ru', "Русский"),
        ('kaa', "Karakalpak"),
    ]

    news = models.ForeignKey(News, on_delete=models.CASCADE, related_name="translations")
    lang = models.CharField(max_length=5, choices=LANG_CHOICES, verbose_name="Язык")
    image = models.ImageField(upload_to='news/', verbose_name="Изображение")
    title = models.CharField(max_length=255, verbose_name="Заголовок")
    short_title = models.CharField(max_length=100, verbose_name="Короткий заголовок")
    description = models.TextField(verbose_name="Описание")
    short_description = models.TextField(verbose_name="Короткое описание")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, verbose_name="Категория")

    class Meta:
        unique_together = ('news', 'lang')
        verbose_name = "Перевод новости"
        verbose_name_plural = "Переводы новостей"

    def clean_image(self):
        image = self.cleaned_data.get('image')
        # Если нет картинки — запрещаем сохранение
        if not image:
            raise ValidationError("⚠ Пожалуйста, загрузите изображение.")
        return image

    def __str__(self):
        return f"{self.lang} — {self.title}"


# ================== Leaders ==================
class Leaders(models.Model):
    REGION_CHOICES = [
        ('Toshkent', "Toshkent"),
        ("Toshkent-viloyati", "Toshkent-viloyati"),
        ('Andijon', "Andijon"),
        ('Buxoro', "Buxoro"),
        ('Farg`ona', "Farg`ona"),
        ('Jizzax', "Jizzax"),
        ('Namangan', "Namangan"),
        ('Navoiy', "Navoiy"),
        ('Qashqadaryo', "Qashqadaryo"),
        ('Samarqand', "Samarqand"),
        ('Surxondaryo', "Surxondaryo"),
        ('Sirdaryo', "Sirdaryo"),
        ('Xorazm', "Xorazm"),
        ('Qoraqalpog`iston', "Qoraqalpog`iston"),
    ]

    leader_name = models.CharField(max_length=50, verbose_name="ФИО")
    leader_position = models.CharField(max_length=50, verbose_name="Должность")
    leader_image = models.ImageField(upload_to='leaders/', verbose_name="Фото")
    leader_mail = models.EmailField(blank=True, verbose_name="Email")
    leader_phone = models.CharField(max_length=50, blank=True, verbose_name="Телефон")
    region = models.CharField(max_length=50, choices=REGION_CHOICES, blank=True, verbose_name="Регион")
    region_link = models.URLField(blank=True, verbose_name="Ссылка яндкес карты на местоположение")

    class Meta:
        verbose_name = "Лидер"
        verbose_name_plural = "Лидеры"

    def clean_image(self):
        image = self.cleaned_data.get('leader_image')
        # Если нет картинки — запрещаем сохранение
        if not image:
            raise ValidationError("⚠ Пожалуйста, загрузите изображение.")
        return image

    def _to_yandex_embed(self):
        """
        Преобразует короткую ссылку вида https://yandex.uz/maps/-/CHxAQEyc
        в embed-URL вида https://yandex.uz/map-widget/v1/-/CHxAQEyc
        Если не распознал — вернёт None.
        """
        if not self.region_link:
            return None
        try:
            u = urlparse(self.region_link)
            host = u.netloc or 'yandex.uz'
            path = (u.path or '').strip('/')

            # Уже embed (без изменений)
            if 'map-widget' in self.region_link:
                return self.region_link

            # Формат /-/CODE или maps/-/CODE
            if '/-/' in u.path:
                code = u.path.split('/-/')[-1].strip('/')
                if code:
                    return f"https://{host}/map-widget/v1/-/{code}"

            # Если ссылка содержит /org/ (организация) — можно преобразовать в виджет org
            # Пример: /org/123701252573/...
            parts = [p for p in path.split('/') if p]
            if 'org' in parts:
                # найдём id после 'org'
                try:
                    idx = parts.index('org')
                    org_id = parts[idx + 1]
                    return f"https://{host}/map-widget/v1/org/{org_id}"
                except Exception:
                    pass

            # Если в query есть ll и z — вернуть как widget с query
            if u.query:
                return f"https://{host}/map-widget/v1/?{u.query}"

        except Exception:
            return None
        return None

    @property
    def region_embed(self):
        embed = self._to_yandex_embed()
        return embed or (self.region_link or None)

    def __str__(self):
        return f"{self.leader_name} - {self.leader_phone} - {self.leader_position}"


# ================== Debt ==================
class Debt(models.Model):
    STATUS_CHOICES = [
        ('active', "Активный"),
        ('closed', "Закрыт"),
        ('pending', "В ожидании"),
    ]

    inn = models.CharField(max_length=50, verbose_name="ИНН")
    full_name = models.CharField(max_length=50, verbose_name="ФИО")
    debt_amount = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Сумма долга")
    debt_type = models.CharField(max_length=50, verbose_name="Тип долга")
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, verbose_name="Статус")
    description = models.TextField(verbose_name="Описание")

    class Meta:
        verbose_name = "Долг"
        verbose_name_plural = "Долги"

    def __str__(self):
        return f"{self.inn} - {self.full_name}"


# =================== Guide ==================
class Guide(models.Model):
    GUIDE_TYPE_CHOICES = [
        ('loan', "Ссуда"),
        ('grant', "Грант"),
        ('subsidy', "Субсидия"),
    ]

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    guide_type = models.CharField(max_length=20, choices=GUIDE_TYPE_CHOICES, verbose_name="Тип гайда")
    link = models.URLField(null=False, verbose_name="Ссылка на видео")

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Гайд"
        verbose_name_plural = "Гайды"

    @property
    def preview_url(self) -> str | None:
        if not self.link:
            return None

        u = urlparse(self.link)
        host = (u.netloc or "").lower()

        # youtu.be/VIDEO_ID
        if "youtu.be" in host and u.path:
            vid = u.path.lstrip("/")
            return f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg"

        # youtube.com/watch?v=VIDEO_ID
        if "youtube.com" in host:
            if u.path == "/watch":
                qs = parse_qs(u.query or "")
                vid = qs.get("v", [None])[0]
                if vid:
                    return f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg"
            # youtube.com/embed/VIDEO_ID
            if u.path.startswith("/embed/"):
                vid = u.path.split("/embed/")[1]
                if vid:
                    return f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg"

        return None

    def __str__(self):
        return f"{self.get_guide_type_display()} - Guide {self.id}"


class GuideTranslation(models.Model):
    LANG_CHOICES = [
        ('uz', "O'zbek"),
        ('ru', "Русский"),
        ('kaa', "Karakalpak"),
    ]

    guide = models.ForeignKey(Guide, on_delete=models.CASCADE, related_name="translations")
    lang = models.CharField(max_length=5, choices=LANG_CHOICES, verbose_name="Язык")
    title = models.CharField(max_length=255, verbose_name="Заголовок")
    short_title = models.CharField(max_length=100, verbose_name="Короткий заголовок", blank=True)
    description = models.TextField(verbose_name="Описание")
    short_description = models.TextField(verbose_name="Короткое описание", blank=True)

    class Meta:
        unique_together = ('guide', 'lang')
        verbose_name = "Перевод гайда"
        verbose_name_plural = "Переводы гайдов"

    def __str__(self):
        return f"{self.lang} — {self.title}"
    
    
# ================== Partners ==================
class Partners(models.Model):
    name = models.CharField(max_length=50, verbose_name="Название")
    image = models.ImageField(upload_to='partners/', verbose_name="Изображение")
    link = models.URLField(verbose_name="Ссылка")

    class Meta:
        verbose_name = "Партнер"
        verbose_name_plural = "Партнеры"

    def __str__(self):
        return self.name