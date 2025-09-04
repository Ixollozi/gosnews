import { useState, useEffect, useCallback } from 'react';
import { apiClient, HomeData, NewsItem, NewsDetail, Leader, Debt, Guide, Partner, Category } from '@/lib/api';

// Generic hook for API calls
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Specific hooks for different data types
export function useHomeData(lang: string = 'uz') {
  return useApi(() => apiClient.getHomeData(lang), [lang]);
}

export function useNews(lang: string = 'uz', page: number = 1, category?: string, search?: string) {
  return useApi(
    () => apiClient.getNews(lang, page, category, search),
    [lang, page, category, search]
  );
}

export function useNewsDetail(newsId: number, lang: string = 'uz') {
  return useApi(
    () => apiClient.getNewsDetail(newsId, lang),
    [newsId, lang]
  );
}

export function useLeaders(region?: string) {
  return useApi(() => apiClient.getLeaders(region), [region]);
}

export function useDebts(search?: string, status?: string, debtType?: string) {
  return useApi(
    () => apiClient.getDebts(search, status, debtType),
    [search, status, debtType]
  );
}

export function useGuides(lang: string = 'uz', guideType?: string) {
  return useApi(
    () => apiClient.getGuides(lang, guideType),
    [lang, guideType]
  );
}

export function usePartners() {
  return useApi(() => apiClient.getPartners());
}

export function useCategories() {
  return useApi(() => apiClient.getCategories());
}

// Hook for language management
export function useLanguage() {
  const [language, setLanguage] = useState<string>('uz');

  const changeLanguage = useCallback((lang: string) => {
    setLanguage(lang);
    // You can also save to localStorage or cookies here
    localStorage.setItem('preferred-language', lang);
  }, []);

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  return { language, changeLanguage };
}




