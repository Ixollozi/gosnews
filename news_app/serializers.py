from rest_framework import serializers
from .models import (
    News, NewsTranslation, Category, CategoryTranslation,
    Leaders, Debt, Guide, GuideTranslation, Partners
)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class CategoryTranslationSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(source='category.slug', read_only=True)
    
    class Meta:
        model = CategoryTranslation
        fields = ['id', 'lang', 'name', 'slug']


class NewsTranslationSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    news_id = serializers.IntegerField(source='news.id', read_only=True)
    created_at = serializers.DateTimeField(source='news.created_at', read_only=True)
    
    class Meta:
        model = NewsTranslation
        fields = [
            'id', 'news_id', 'lang', 'image', 'title', 'short_title',
            'description', 'short_description', 'category', 'created_at'
        ]


class LeadersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leaders
        fields = [
            'id', 'leader_name', 'leader_position', 'leader_image',
            'leader_mail', 'leader_phone', 'region', 'region_link', 'region_embed'
        ]


class DebtSerializer(serializers.ModelSerializer):
    class Meta:
        model = Debt
        fields = [
            'id', 'inn', 'full_name', 'debt_amount', 'debt_type',
            'status', 'description'
        ]


class GuideTranslationSerializer(serializers.ModelSerializer):
    guide_id = serializers.IntegerField(source='guide.id', read_only=True)
    guide_type = serializers.CharField(source='guide.guide_type', read_only=True)
    link = serializers.URLField(source='guide.link', read_only=True)
    preview_url = serializers.URLField(source='guide.preview_url', read_only=True)
    created_at = serializers.DateTimeField(source='guide.created_at', read_only=True)
    
    class Meta:
        model = GuideTranslation
        fields = [
            'id', 'guide_id', 'lang', 'title', 'short_title',
            'description', 'short_description', 'guide_type',
            'link', 'preview_url', 'created_at'
        ]


class PartnersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partners
        fields = ['id', 'name', 'image', 'link']
