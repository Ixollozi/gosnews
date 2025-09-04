"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, MapPin, Tag, Filter, X, ArrowRight, Clock, User, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { useNews, useCategories, useLanguage } from '@/hooks/useApi';
import { NewsItem } from '@/lib/api';

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
  excerpt: string;
  featuredImage?: {
    src: string;
    alt: string;
    caption?: string;
  };
  readTime?: number;
  views?: number;
  featured?: boolean;
}

const mockNews: NewsArticle[] = [
  {
    id: "1",
    headline: "Yangi kichik biznes qo'llab-quvvatlash dasturi ishga tushirildi",
    subtitle: "Hukumat tadbirkorlik rivojlanishi uchun qo'shimcha mablag' ajratdi",
    author: "Anna Ivanova",
    agency: "Iqtisodiyot vazirligi",
    publishDate: "2024-01-15",
    region: "Milliy",
    program: "Biznes qo'llab-quvvatlash",
    tags: ["biznes", "qo'llab-quvvatlash", "iqtisodiyot", "viloyatlar"],
    excerpt: "Bugun mamlakat barcha viloyatlarini qamrab olgan yangi davlat kichik va o'rta biznes qo'llab-quvvatlash dasturining ishga tushirilishi e'lon qilindi.",
    featuredImage: {
      src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop',
      alt: 'Biznes qo\'llab-quvvatlash dasturini muhokama qilish yig\'ilishi',
      caption: 'Vazirlik vakillari yangi dastur tafsilotlarini muhokama qilyapti'
    },
    readTime: 5,
    views: 1254,
    featured: true
  },
  {
    id: "2",
    headline: "Qishloq xo'jaligi sektoriga yangi subsididya dasturi",
    author: "Sardor Karimov",
    agency: "Qishloq xo'jaligi vazirligi",
    publishDate: "2024-01-14",
    region: "Farg'ona",
    program: "Qishloq xo'jaligi",
    tags: ["qishloq xo'jaligi", "subsidiya", "fermerlar", "o'simlik yetishtirish"],
    excerpt: "Farg'ona viloyatida fermerlar uchun yangi subsidiya dasturi e'lon qilindi. Dastur orqali paxtachilik va mevachilik rivojlantiriladi.",
    featuredImage: {
      src: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=250&fit=crop',
      alt: 'Farg\'ona viloyatidagi fermer xo\'jaligi',
    },
    readTime: 3,
    views: 892,
    featured: false
  },
  {
    id: "3",
    headline: "IT sohasida startaplar uchun grant dasturi kengaytirildi",
    author: "Dilnoza Toshmatova",
    agency: "Raqamli texnologiyalar vazirligi",
    publishDate: "2024-01-13",
    region: "Toshkent",
    program: "IT rivojlantirish",
    tags: ["IT", "startap", "grant", "texnologiya", "yoshlar"],
    excerpt: "Yoshlar orasida IT sohasidagi tadbirkorlikni rivojlantirish maqsadida grant dasturi hajmi ikki baravarga oshirildi.",
    featuredImage: {
      src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop',
      alt: 'IT startap ofisi',
    },
    readTime: 4,
    views: 2143,
    featured: true
  },
  {
    id: "4",
    headline: "Uy-joy ta'minoti dasturi yangi bosqichga o'tdi",
    author: "Farrux Abdullayev",
    agency: "Qurilish vazirligi",
    publishDate: "2024-01-12",
    region: "Samarqand",
    program: "Ijtimoiy",
    tags: ["uy-joy", "qurilish", "ijtimoiy", "kredit"],
    excerpt: "Samarqand viloyatida arzon uy-joy dasturi yangi loyihalar bilan kengaytirilmoqda. Yoshlar uchun imtiyozli kredit shartlari taqdim etiladi.",
    featuredImage: {
      src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
      alt: 'Yangi turar joy majmuasi',
    },
    readTime: 6,
    views: 756,
    featured: false
  },
  {
    id: "5",
    headline: "Eksport qiluvchilar uchun yangi imkoniyatlar",
    author: "Nodir Saidov",
    agency: "Tashqi savdo vazirligi",
    publishDate: "2024-01-11",
    region: "Andijon",
    program: "Eksport qo'llab-quvvatlash",
    tags: ["eksport", "savdo", "xalqaro", "mahsulot"],
    excerpt: "Andijon viloyati korxonalari uchun xalqaro bozorlarga chiqish dasturi ishga tushirildi. Yangi eksport yo'nalishlari ochilmoqda.",
    featuredImage: {
      src: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=250&fit=crop',
      alt: 'Eksport mahsulotlari',
    },
    readTime: 4,
    views: 1089,
    featured: false
  },
  {
    id: "6",
    headline: "Turizm sektorini rivojlantirish dasturi",
    author: "Malika Yusupova",
    agency: "Turizm vazirligi",
    publishDate: "2024-01-10",
    region: "Buxoro",
    program: "Turizm rivojlantirish",
    tags: ["turizm", "madaniy meros", "xizmat", "mehmonxona"],
    excerpt: "Buxoro viloyatida turizm infratuzilmasini rivojlantirish uchun yangi dastur boshlandi. Tarixiy joylar ta'mirlash ishlari kuchaytiriladi.",
    featuredImage: {
      src: 'https://images.unsplash.com/photo-1582555172866-f73bb012f33d?w=400&h=250&fit=crop',
      alt: 'Buxoro tarixi binolari',
    },
    readTime: 5,
    views: 1876,
    featured: true
  },
  // ... more articles
];

// Categories will be loaded from API
const regions = ["Barcha viloyatlar", "Milliy", "Toshkent", "Andijon", "Buxoro", "Farg'ona", "Jizzax", "Xorazm", "Namangan", "Navoiy", "Qashqadaryo", "Qoraqalpog'iston", "Samarqand", "Sirdaryo", "Surxondaryo"];

const getCategoryColor = (category: string): string => {
  const colors = {
    "Biznes qo'llab-quvvatlash": "bg-blue-100 text-blue-800 border-blue-200",
    "Qishloq xo'jaligi": "bg-green-100 text-green-800 border-green-200",
    "IT rivojlantirish": "bg-purple-100 text-purple-800 border-purple-200",
    "Ijtimoiy": "bg-orange-100 text-orange-800 border-orange-200",
    "Eksport qo'llab-quvvatlash": "bg-cyan-100 text-cyan-800 border-cyan-200",
    "Turizm rivojlantirish": "bg-pink-100 text-pink-800 border-pink-200"
  };
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
};

export const NewsSection = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Barchasi");
  const [selectedRegion, setSelectedRegion] = useState("Barcha viloyatlar");
  const [sortBy, setSortBy] = useState("date");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // API hooks
  const { data: newsData, loading: isLoading, error } = useNews(
    language, 
    currentPage, 
    selectedCategory !== "Barchasi" ? selectedCategory : undefined,
    searchTerm || undefined
  );
  const { data: categories } = useCategories();

  // Convert API data to component format
  const newsArticles = useMemo(() => {
    if (!newsData?.results) return [];
    
    return newsData.results.map((news: NewsItem) => ({
      id: news.id.toString(),
      headline: news.title,
      subtitle: news.short_title,
      author: "Admin", // You can add author field to your API
      agency: news.category?.name || "Davlat xizmati",
      publishDate: news.created_at,
      region: "Milliy", // You can add region field to your API
      program: news.category?.name || "Umumiy",
      tags: [news.category?.name || "yangilik"],
      excerpt: news.short_description,
      featuredImage: {
        src: news.image,
        alt: news.title,
      },
      readTime: 5, // You can calculate this based on content length
      views: Math.floor(Math.random() * 2000), // Mock data for now
      featured: false, // You can add featured field to your API
    }));
  }, [newsData]);

  const totalPages = Math.ceil((newsData?.count || 0) / itemsPerPage);
  const featuredNews = newsArticles.filter(article => article.featured);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Barchasi");
    setSelectedRegion("Barcha viloyatlar");
    setCurrentPage(1);
  };

  const NewsCard = ({ article, featured = false }: { article: NewsArticle; featured?: boolean }) => (
    <Card className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm bg-white/80 border-white/20 shadow-lg ${featured ? 'ring-2 ring-primary/20' : ''}`}>
      {article.featuredImage && (
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={article.featuredImage.src}
            alt={article.featuredImage.alt}
            width={featured ? 800 : 400}
            height={featured ? 450 : 250}
            className={`w-full ${featured ? 'h-64' : 'h-48'} object-cover transition-transform duration-300 group-hover:scale-105`}
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={`${getCategoryColor(article.program)} font-medium`}>
              {article.program}
            </Badge>
            {featured && (
              <Badge className="bg-primary text-primary-foreground">
                Muhim yangilik
              </Badge>
            )}
          </div>
          {article.views && (
            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Eye className="h-3 w-3 text-white" />
              <span className="text-xs text-white">{article.views}</span>
            </div>
          )}
        </div>
      )}
      
      <CardContent className={`${featured ? 'p-6' : 'p-4'} space-y-3`}>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <time dateTime={article.publishDate}>
              {new Date(article.publishDate).toLocaleDateString('uz-UZ')}
            </time>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{article.region}</span>
          </div>
          {article.readTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{article.readTime} min</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className={`font-heading font-semibold group-hover:text-primary transition-colors line-clamp-2 ${featured ? 'text-xl' : 'text-lg'}`}>
            {article.headline}
          </h3>
          {article.subtitle && featured && (
            <p className="text-base text-muted-foreground font-medium line-clamp-1">
              {article.subtitle}
            </p>
          )}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {article.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{article.author}</span>
          </div>
          <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 p-1">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-1 pt-2">
          {article.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-muted/50">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const NewsListItem = ({ article }: { article: NewsArticle }) => (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg backdrop-blur-sm bg-white/80 border-white/20">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {article.featuredImage && (
            <div className="relative overflow-hidden rounded-lg flex-shrink-0">
              <Image
                src={article.featuredImage.src}
                alt={article.featuredImage.alt}
                width={120}
                height={80}
                className="w-30 h-20 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={`${getCategoryColor(article.program)} text-xs`}>
                {article.program}
              </Badge>
              <span className="text-xs text-muted-foreground">{article.region}</span>
            </div>
            
            <h3 className="font-heading font-semibold group-hover:text-primary transition-colors line-clamp-2">
              {article.headline}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {article.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <time dateTime={article.publishDate}>
                    {new Date(article.publishDate).toLocaleDateString('uz-UZ')}
                  </time>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{article.author}</span>
                </div>
                {article.readTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{article.readTime} min</span>
                  </div>
                )}
              </div>
              <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 p-1">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
          <Tag className="h-6 w-6 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Yangiliklar</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-heading text-foreground">
          Barcha Yangiliklar
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          O'zbekiston bo'ylab davlat dasturlari va qo'llab-quvvatlash choralari haqidagi eng so'nggi yangiliklar
        </p>
      </div>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            Muhim yangiliklar
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredNews.slice(0, 2).map(article => (
              <NewsCard key={article.id} article={article} featured={true} />
            ))}
          </div>
        </section>
      )}

      {/* Filters */}
      <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Qidirish va saralash</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                To'r
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                Ro'yxat
              </Button>
              {(searchTerm || selectedCategory !== "Barchasi" || selectedRegion !== "Barcha viloyatlar") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Tozalash
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Yangiliklar qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 border-white/30"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-white/50 border-white/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Barchasi">Barchasi</SelectItem>
                {categories?.map(category => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="bg-white/50 border-white/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-white/50 border-white/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sana bo'yicha</SelectItem>
                <SelectItem value="views">Ko'rishlar bo'yicha</SelectItem>
                <SelectItem value="readTime">O'qish vaqti bo'yicha</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{newsData?.count || 0} ta yangilik topildi</span>
            <span>Sahifa {currentPage} / {totalPages}</span>
          </div>
        </CardContent>
      </Card>

      {/* News Grid/List */}
      {isLoading ? (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {[...Array(12)].map((_, index) => (
            <Card key={index} className="animate-pulse backdrop-blur-sm bg-white/80 border-white/20">
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-lg">
          <CardContent className="p-12 text-center space-y-4">
            <Tag className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold text-foreground">Xatolik yuz berdi</h3>
            <p className="text-muted-foreground">
              Yangiliklar yuklanmadi. Iltimos, qaytadan urinib ko'ring.
            </p>
          </CardContent>
        </Card>
      ) : newsArticles.length === 0 ? (
        <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-lg">
          <CardContent className="p-12 text-center space-y-4">
            <Tag className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold text-foreground">Yangiliklar topilmadi</h3>
            <p className="text-muted-foreground">
              Qidiruv mezonlaringizni o'zgartirib ko'ring yoki barcha filtrlarni tozalang.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Barcha filtrlarni tozalash
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {newsArticles.map(article => (
              viewMode === 'grid' ? 
                <NewsCard key={article.id} article={article} /> :
                <NewsListItem key={article.id} article={article} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Oldingi
              </Button>
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = Math.max(1, currentPage - 2) + i;
                if (pageNum > totalPages) return null;
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Keyingi
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};