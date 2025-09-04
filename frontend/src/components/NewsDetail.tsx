"use client";

import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, User, Share2, Bookmark, Eye, Clock, Tag, ChevronRight, Facebook, Twitter, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import Image from 'next/image';

interface NewsArticle {
  id: string;
  headline: string;
  subtitle?: string;
  author: string;
  agency?: string;
  publishDate: string;
  region: string;
  program: string;
  tags: string[];
  content: {
    type: 'text' | 'image' | 'video' | 'quote' | 'list' | 'document';
    content: any;
    caption?: string;
    alt?: string;
    url?: string;
    title?: string;
  }[];
  featuredImage?: {
    src: string;
    alt: string;
    caption?: string;
  };
  readTime?: number;
  views?: number;
}

interface RelatedArticle {
  id: string;
  headline: string;
  publishDate: string;
  region: string;
  featuredImage?: string;
  readTime?: number;
}

interface NewsDetailProps {
  article: NewsArticle;
  relatedArticles: RelatedArticle[];
}

const getCategoryColor = (category: string): string => {
  const colors = {
    "Поддержка бизнеса": "bg-blue-100 text-blue-800 border-blue-200",
    "Qishloq xo'jaligi": "bg-green-100 text-green-800 border-green-200",
    "IT rivojlantirish": "bg-purple-100 text-purple-800 border-purple-200",
    "Ijtimoiy": "bg-orange-100 text-orange-800 border-orange-200",
    "Eksport qo'llab-quvvatlash": "bg-cyan-100 text-cyan-800 border-cyan-200",
    "Turizm rivojlantirish": "bg-pink-100 text-pink-800 border-pink-200"
  };
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
};

const NewsDetail: React.FC<NewsDetailProps> = ({ article, relatedArticles }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentViews] = useState(article.views || 1245);

  const handleShare = (platform: string) => {
    const url = `${typeof window !== 'undefined' ? window.location.href : ''}`;
    const text = `${article.headline} - ${article.subtitle || ''}`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
        break;
      case 'copy':
        if (typeof window !== 'undefined') {
          navigator.clipboard.writeText(url);
          toast.success('Havola nusxalandi!');
        }
        break;
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Xatcho\'pdan o\'chirildi' : 'Xatcho\'pga qo\'shildi');
  };

  const renderContent = (contentItem: any, index: number) => {
    switch (contentItem.type) {
      case 'text':
        return (
          <div key={index} className="prose prose-lg max-w-none">
            <p className="text-foreground leading-relaxed text-lg mb-6">
              {contentItem.content}
            </p>
          </div>
        );
        
      case 'quote':
        return (
          <div key={index} className="my-8">
            <Card className="border-l-4 border-l-primary bg-primary/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <blockquote className="text-xl font-medium text-foreground mb-4 italic">
                  "{contentItem.content}"
                </blockquote>
                {contentItem.caption && (
                  <cite className="text-muted-foreground font-semibold">
                    — {contentItem.caption}
                  </cite>
                )}
              </CardContent>
            </Card>
          </div>
        );
        
      case 'list':
        return (
          <div key={index} className="my-6">
            <Card className="backdrop-blur-sm bg-white/80 border-white/20">
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {contentItem.content.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-foreground text-lg leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'image':
        return (
          <div key={index} className="my-8">
            <Card className="overflow-hidden backdrop-blur-sm bg-white/80 border-white/20">
              <div className="relative">
                <Image
                  src={contentItem.url || ''}
                  alt={contentItem.alt || ''}
                  width={800}
                  height={450}
                  className="w-full h-auto object-cover"
                />
                {contentItem.caption && (
                  <div className="p-4 bg-muted/50 backdrop-blur-sm">
                    <p className="text-sm text-muted-foreground italic">
                      {contentItem.caption}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (         
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="flex items-center gap-2 backdrop-blur-sm bg-white/80 border-white/20">
          <ArrowLeft className="h-4 w-4" />
          Orqaga
        </Button>
        <div className="flex items-center text-sm text-muted-foreground">
          <span>Yangiliklar</span>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="line-clamp-1">{article.headline}</span>
        </div>
      </div>

      {/* Article Header */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className={`${getCategoryColor(article.program)} font-medium`}>
            {article.program}
          </Badge>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={article.publishDate}>
                {new Date(article.publishDate).toLocaleDateString('uz-UZ', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{article.region}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{currentViews.toLocaleString()}</span>
            </div>
            {article.readTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{article.readTime} min o'qish</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-foreground leading-tight">
            {article.headline}
          </h1>
          {article.subtitle && (
            <p className="text-xl text-muted-foreground font-medium leading-relaxed">
              {article.subtitle}
            </p>
          )}
        </div>

        {/* Author and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-white/50">
              <AvatarImage src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face`} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {article.author.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-foreground">{article.author}</span>
              </div>
              {article.agency && (
                <p className="text-sm text-muted-foreground">{article.agency}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBookmark}
              className={`flex items-center gap-2 ${isBookmarked ? 'bg-primary/10 text-primary border-primary/20' : 'backdrop-blur-sm bg-white/80 border-white/20'}`}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? 'Saqlangan' : 'Saqlash'}
            </Button>
            
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('facebook')}
                className="backdrop-blur-sm bg-white/80 border-white/20"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('twitter')}
                className="backdrop-blur-sm bg-white/80 border-white/20"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('telegram')}
                className="backdrop-blur-sm bg-white/80 border-white/20"
              >
                <Send className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('copy')}
                className="backdrop-blur-sm bg-white/80 border-white/20"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {article.featuredImage && (
        <Card className="overflow-hidden backdrop-blur-sm bg-white/80 border-white/20 shadow-lg">
          <div className="relative">
            <Image
              src={article.featuredImage.src}
              alt={article.featuredImage.alt}
              width={800}
              height={450}
              className="w-full h-96 object-cover"
            />
            {article.featuredImage.caption && (
              <div className="p-4 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0">
                <p className="text-sm text-white">
                  {article.featuredImage.caption}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Article Content */}
      <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-lg">
        <CardContent className="p-8">
          <div className="space-y-6">
            {article.content.map((contentItem, index) => renderContent(contentItem, index))}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card className="backdrop-blur-sm bg-white/80 border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Teglar</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Related Articles */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
          <div className="w-1 h-6 bg-primary rounded-full"></div>
          O'xshash yangiliklar
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relatedArticles.map((relatedArticle) => (
            <Card key={relatedArticle.id} className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 backdrop-blur-sm bg-white/80 border-white/20">
              <div className="flex gap-4 p-4">
                {relatedArticle.featuredImage && (
                  <div className="relative overflow-hidden rounded-lg flex-shrink-0">
                    <Image
                      src={relatedArticle.featuredImage}
                      alt={relatedArticle.headline}
                      width={120}
                      height={80}
                      className="w-30 h-20 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {relatedArticle.headline}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <time dateTime={relatedArticle.publishDate}>
                        {new Date(relatedArticle.publishDate).toLocaleDateString('uz-UZ')}
                      </time>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{relatedArticle.region}</span>
                    </div>
                    {relatedArticle.readTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{relatedArticle.readTime} min</span>
                      </div>
                    )}
                  </div>
                  
                  <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 p-0 h-auto font-medium">
                    Batafsil o'qish →
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="outline" className="backdrop-blur-sm bg-white/80 border-white/20">
            Barcha yangiliklar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;