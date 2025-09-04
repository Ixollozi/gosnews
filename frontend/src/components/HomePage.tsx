"use client";

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Map, Newspaper, Component, Earth, LayoutDashboard, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { useHomeData, useLanguage } from '@/hooks/useApi';
import { NewsItem, Guide } from '@/lib/api';

interface SupportProgram {
  id: string;
  name: string;
  category: 'business' | 'agriculture' | 'social';
  eligibilityTags: string[];
  description: string;
}

interface Region {
  id: string;
  name: string;
  priority: boolean;
}

const HomePage: React.FC = () => {
  const { language } = useLanguage();
  const { data: homeData, loading: isLoading, error } = useHomeData(language);
  
  const [selectedProgramCategory, setSelectedProgramCategory] = useState<'all' | 'business' | 'agriculture' | 'social'>('all');
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [subscriptionEmail, setSubscriptionEmail] = useState('');
  const [subscriptionPhone, setSubscriptionPhone] = useState('');

  // Convert guides to support programs format for compatibility
  const supportPrograms: SupportProgram[] = homeData?.guides?.map((guide: Guide) => ({
    id: guide.id.toString(),
    name: guide.title,
    category: guide.guide_type as 'business' | 'agriculture' | 'social',
    eligibilityTags: [guide.short_title || guide.title],
    description: guide.short_description || guide.description
  })) || [];

  // Mock regions data (you can replace this with real data from API later)
  const regions: Region[] = [
    { id: '1', name: 'Central Region', priority: true },
    { id: '2', name: 'Northern Territory', priority: true },
    { id: '3', name: 'Southern Coast', priority: true },
    { id: '4', name: 'Eastern Province', priority: true },
    { id: '5', name: 'Western Districts', priority: true }
  ];

  const filteredPrograms = selectedProgramCategory === 'all' 
    ? supportPrograms 
    : supportPrograms.filter(program => program.category === selectedProgramCategory);

  const handleMapOpen = useCallback(() => {
    setMapModalOpen(true);
    setMapLoading(true);
    
    // Simulate loading interactive map
    setTimeout(() => {
      setMapLoading(false);
    }, 2000);
  }, []);

  const handleSubscription = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subscriptionEmail && !subscriptionPhone) {
      toast.error('Please provide either email or phone number');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Successfully subscribed to alerts!');
      setSubscriptionEmail('');
      setSubscriptionPhone('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    }
  }, [subscriptionEmail, subscriptionPhone]);

  const NewsCard: React.FC<{ news: NewsItem }> = ({ news }) => (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="relative overflow-hidden rounded-t-lg">
        <Image
          src={news.image}
          alt={news.title}
          width={400}
          height={250}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {news.category && (
          <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground">
            {news.category.name}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Newspaper className="h-4 w-4" />
          <time dateTime={news.created_at}>{new Date(news.created_at).toLocaleDateString()}</time>
        </div>
        <h3 className="font-heading font-semibold mb-2 group-hover:text-primary transition-colors">
          {news.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{news.short_description}</p>
      </CardContent>
    </Card>
  );

  const ProgramCard: React.FC<{ program: SupportProgram }> = ({ program }) => (
    <Card className="transition-all duration-300 hover:shadow-md bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{program.name}</CardTitle>
        <CardDescription className="text-sm">{program.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1 mb-3">
          {program.eligibilityTags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <Button size="sm" className="w-full">
          View Details
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24">
        <div className="container">
          <Card className="max-w-4xl bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
            <CardContent className="p-8 lg:p-12">
              <div className="max-w-2xl">
                <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-6 text-foreground">
                  Supporting Your Success
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Access government support programs, check your eligibility, and get the help you need to thrive.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="text-lg px-8">
                    <Navigation className="mr-2 h-5 w-5" />
                    Find Support Programs
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    <LayoutDashboard className="mr-2 h-5 w-5" />
                    Check Debts
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured News */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center gap-3 mb-8">
            <Newspaper className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-heading font-bold">Latest Updates</h2>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="bg-card/50 backdrop-blur-sm">
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Failed to load news. Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {homeData?.news?.map(news => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Support Programs */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex items-center gap-3 mb-8">
            <Component className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-heading font-bold">Support Programs</h2>
          </div>

          <Tabs value={selectedProgramCategory} onValueChange={(value) => setSelectedProgramCategory(value as any)} className="mb-8">
            <TabsList className="grid w-full grid-cols-4 max-w-md">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="agriculture">Agriculture</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-3">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map(program => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Regions Preview */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center gap-3 mb-8">
            <Map className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-heading font-bold">Regional Services</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map Preview */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                  <div className="relative z-10 text-center">
                    <Map className="h-12 w-12 text-primary mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">Interactive Regional Map</p>
                    <Dialog open={mapModalOpen} onOpenChange={setMapModalOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={handleMapOpen}>
                          <Earth className="mr-2 h-4 w-4" />
                          Open Map
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl h-[600px]">
                        <DialogHeader>
                          <DialogTitle>Regional Services Map</DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 bg-muted/50 rounded-lg flex items-center justify-center">
                          {mapLoading ? (
                            <div className="text-center">
                              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                              <p className="text-sm text-muted-foreground">Loading interactive map...</p>
                            </div>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <Map className="h-16 w-16 text-primary mx-auto mb-4" />
                                <p className="text-lg font-semibold mb-2">Interactive Regional Map</p>
                                <p className="text-sm text-muted-foreground">Map functionality would be integrated here</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Priority Regions List */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Priority Regions</CardTitle>
                <CardDescription>Quick access to regional service centers</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {regions.filter(region => region.priority).map(region => (
                      <div key={region.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                        <span className="font-medium">{region.name}</span>
                        <Button size="sm" variant="ghost">
                          View Services
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-heading font-bold text-center mb-8">Our Partners</h2>
          
          {isLoading ? (
            <div className="flex justify-center gap-8">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-32" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
              {homeData?.partners?.map(partner => (
                <div key={partner.id} className="bg-card/80 backdrop-blur-sm rounded-lg p-4 hover:shadow-md transition-shadow">
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    width={120}
                    height={80}
                    className="h-16 w-24 object-cover rounded"
                  />
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center">
            <Button variant="outline">View All Partners</Button>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12">
        <div className="container">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-heading font-bold mb-4">Stay Updated</h3>
              <p className="text-muted-foreground mb-6">
                Subscribe to receive alerts about new support programs and important updates.
              </p>
              
              <form onSubmit={handleSubscription} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={subscriptionEmail}
                    onChange={(e) => setSubscriptionEmail(e.target.value)}
                    className="bg-background/50"
                  />
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    value={subscriptionPhone}
                    onChange={(e) => setSubscriptionPhone(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto">
                  Subscribe to Alerts
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default HomePage;