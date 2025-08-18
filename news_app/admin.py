from django.contrib import admin
from .models import (
    News, NewsTranslation,
    Category, CategoryTranslation,
    Leaders,
    Debt,
    Guide, GuideTranslation
)


# ================== News ==================
class NewsTranslationInline(admin.StackedInline):
    model = NewsTranslation
    extra = 1


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ("id", "created_at")
    inlines = [NewsTranslationInline]
    ordering = ["-created_at"]


# ================== Category ==================
class CategoryTranslationInline(admin.StackedInline):
    model = CategoryTranslation
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [CategoryTranslationInline]
    search_fields = ("name",)


# ================== Leaders ==================
@admin.register(Leaders)
class LeadersAdmin(admin.ModelAdmin):
    list_display = ("leader_name", "leader_position", "leader_phone", "region")
    search_fields = ("leader_name", "leader_position")
    list_filter = ("region",)


# ================== Debt ==================
@admin.register(Debt)
class DebtAdmin(admin.ModelAdmin):
    list_display = ("inn", "full_name", "debt_amount", "status")
    list_filter = ("status", "debt_type")
    search_fields = ("inn", "full_name")


#=================== Guide ==================
class GuideTranslationInline(admin.StackedInline):
    model = GuideTranslation
    extra = 1
    verbose_name = "Перевод"
    verbose_name_plural = "Переводы"


@admin.register(Guide)
class GuideAdmin(admin.ModelAdmin):
    list_display = ("id", "guide_type", "created_at", "link")
    list_filter = ("guide_type",)
    inlines = [GuideTranslationInline]
    ordering = ["-created_at"]
    readonly_fields = ("created_at",)