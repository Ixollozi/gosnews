"use client";

import { useState } from "react";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import HomePage from "@/components/HomePage";
import { NewsSection } from "@/components/NewsSection";
import NewsDetail from "@/components/NewsDetail";
import GuidesSection from "@/components/GuidesSection";
import RegionsSection from "@/components/RegionsSection";
import DebtCheckSection from "@/components/DebtCheckSection";
import UserDashboard from "@/components/UserDashboard";
import { LeadersSection } from "@/components/LeadersSection";
import Footer from "@/components/Footer";

type ActiveRoute = 'home' | 'news' | 'news-detail' | 'guides' | 'regions' | 'debt-check' | 'dashboard' | 'leaders';

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
}

export default function Page() {
  const [activeRoute, setActiveRoute] = useState<ActiveRoute>('home');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // Mock article data for news detail
  const mockArticleData: NewsArticle = {
    id: "1",
    headline: "Новая программа поддержки малого бизнеса запущена в регионах",
    subtitle: "Правительство выделило дополнительные средства на развитие предпринимательства",
    author: "Анна Иванова",
    agency: "Министерство экономики",
    publishDate: "2024-01-15",
    region: "Национальный",
    program: "Поддержка бизнеса",
    tags: ["бизнес", "поддержка", "экономика", "регионы"],
    content: [
      {
        type: 'text',
        content: 'Сегодня было объявлено о запуске новой программы государственной поддержки малого и среднего бизнеса, которая охватит все регионы страны. Программа предусматривает выделение льготных кредитов, субсидий и грантов для начинающих предпринимателей.'
      },
      {
        type: 'quote',
        content: 'Эта программа станет важным шагом в развитии экономики наших регионов и создании новых рабочих мест',
        caption: 'Министр экономики'
      },
      {
        type: 'list',
        content: [
          'Льготные кредиты под 5% годовых',
          'Гранты до 50 миллионов сум',
          'Упрощенная процедура регистрации',
          'Бесплатные консультации экспертов'
        ]
      }
    ],
    featuredImage: {
      src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop',
      alt: 'Деловая встреча по обсуждению программы поддержки бизнеса',
      caption: 'Представители министерства обсуждают детали новой программы'
    }
  };

  const relatedArticles = [
    {
      id: "2",
      headline: "Результаты первого квартала программы",
      publishDate: "2024-01-20",
      region: "Ташкент",
      featuredImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=120&fit=crop"
    },
    {
      id: "3", 
      headline: "Новые возможности для экспортеров",
      publishDate: "2024-01-18",
      region: "Самарканд",
      featuredImage: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=200&h=120&fit=crop"
    }
  ];

  const handleNavigation = (route: ActiveRoute, article?: NewsArticle) => {
    setActiveRoute(route);
    if (article) {
      setSelectedArticle(article);
    }
  };

  const renderActiveRoute = () => {
    switch (activeRoute) {
      case 'home':
        return <HomePage />;
      case 'news':
        return <NewsSection />;
      case 'news-detail':
        return (
          <NewsDetail 
            article={selectedArticle || mockArticleData} 
            relatedArticles={relatedArticles}
          />
        );
      case 'guides':
        return <GuidesSection />;
      case 'regions':
        return <RegionsSection />;
      case 'debt-check':
        return <DebtCheckSection />;
      case 'dashboard':
        return <UserDashboard />;
      case 'leaders':
        return <LeadersSection />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {renderActiveRoute()}
        </div>
      </main>
      
      <Footer />
      
      {/* Navigation for demo purposes */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
          <div className="text-sm font-medium mb-2">Demo Navigation:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button 
              onClick={() => handleNavigation('home')}
              className={`px-2 py-1 rounded ${activeRoute === 'home' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigation('news')}
              className={`px-2 py-1 rounded ${activeRoute === 'news' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
            >
              News
            </button>
            <button 
              onClick={() => handleNavigation('news-detail')}
              className={`px-2 py-1 rounded ${activeRoute === 'news-detail' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
            >
              Article
            </button>
            <button 
              onClick={() => handleNavigation('guides')}
              className={`px-2 py-1 rounded ${activeRoute === 'guides' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
            >
              Guides
            </button>
            <button 
              onClick={() => handleNavigation('leaders')}
              className={`px-2 py-1 rounded ${activeRoute === 'leaders' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
            >
              Leaders
            </button>
            <button 
              onClick={() => handleNavigation('regions')}
              className={`px-2 py-1 rounded ${activeRoute === 'regions' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
            >
              Regions
            </button>
            <button 
              onClick={() => handleNavigation('debt-check')}
              className={`px-2 py-1 rounded ${activeRoute === 'debt-check' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
            >
              Debt Check
            </button>
            <button 
              onClick={() => handleNavigation('dashboard')}
              className={`px-2 py-1 rounded ${activeRoute === 'dashboard' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}