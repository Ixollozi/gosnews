from django.contrib import admin
from .models import (
    News, NewsTranslation,
    Category, CategoryTranslation,
    Leaders, LeadersRegion,
    Debt,
    Guide, GuideChoices
)


# ================== News ==================
class NewsTranslationInline(admin.StackedInline):  # меняем на StackedInline
    model = NewsTranslation
    extra = 1


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ("id", "created_at")
    inlines = [NewsTranslationInline]
    ordering = ["-created_at"]
    search_fields = ("title",)


# ================== Category ==================
class CategoryTranslationInline(admin.StackedInline):  # тоже меняем
    model = CategoryTranslation
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [CategoryTranslationInline]
    search_fields = ("name",)


# ================== Leaders ==================
class LeadersRegionInline(admin.StackedInline):  # и здесь
    model = LeadersRegion
    extra = 1


@admin.register(Leaders)
class LeadersAdmin(admin.ModelAdmin):
    list_display = ("leader_name", "leader_position", "leader_phone", "region")
    inlines = [LeadersRegionInline]
    search_fields = ("leader_name", "leader_position")


# ================== Debt ==================
@admin.register(Debt)
class DebtAdmin(admin.ModelAdmin):
    list_display = ("inn", "full_name", "debt_amount", "status")
    list_filter = ("status", "debt_type")
    search_fields = ("inn", "full_name")

#=================== Guide ==================
class GuideChoicesInline(admin.TabularInline):
    model = GuideChoices
    extra = 1


@admin.register(Guide)
class GuideAdmin(admin.ModelAdmin):
    list_display = ("title", "link")
    search_fields = ("title",)
    inlines = [GuideChoicesInline]


@admin.register(GuideChoices)
class GuideChoicesAdmin(admin.ModelAdmin):
    list_display = ("guide", "guide_type")
    list_filter = ("guide_type",)
    search_fields = ("guide__title",)