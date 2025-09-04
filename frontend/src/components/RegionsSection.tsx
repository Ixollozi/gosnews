"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Map, MapPin, Phone, Mail, Building, Copy, Flag, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface RegionLeader {
  id: string;
  name: string;
  position: string;
  photo?: string;
  phone: string;
  email: string;
  inn?: string;
}

interface Region {
  id: string;
  name: string;
  nameEn: string;
  population: number;
  area: number;
  capital: string;
  description: string;
  leader: RegionLeader;
  programs: string[];
  recentNews: Array<{
    id: string;
    title: string;
    date: string;
    summary: string;
  }>;
  coordinates: [number, number];
  officeAddress: string;
}

const uzbekistanRegions: Region[] = [
  {
    id: 'tashkent-city',
    name: 'Ташкент',
    nameEn: 'Tashkent City',
    population: 2571668,
    area: 334.8,
    capital: 'Ташкент',
    description: 'Столица и крупнейший город Узбекистана, политический, экономический и культурный центр страны.',
    leader: {
      id: '1',
      name: 'Жахонгир Артыкходжаев',
      position: 'Хоким города Ташкента',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      phone: '+998 71 233 45 67',
      email: 'hokim@tashkent.uz',
      inn: '123456789012'
    },
    programs: ['Цифровая инфраструктура', 'Умный город', 'Экологические инициативы'],
    recentNews: [
      {
        id: '1',
        title: 'Запуск новой системы электронного документооборота',
        date: '2024-01-15',
        summary: 'Внедрена современная система для упрощения административных процедур'
      }
    ],
    coordinates: [41.2995, 69.2401],
    officeAddress: 'ул. Истиклол, 5, Ташкент, 100047'
  },
  {
    id: 'andijan',
    name: 'Андижанская область',
    nameEn: 'Andijan Region',
    population: 3223081,
    area: 4303,
    capital: 'Андижан',
    description: 'Восточная область Узбекистана, известная своим сельским хозяйством и промышленностью.',
    leader: {
      id: '2',
      name: 'Шухрат Ганиев',
      position: 'Хоким Андижанской области',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      phone: '+998 74 223 45 67',
      email: 'hokim@andijan.uz',
      inn: '234567890123'
    },
    programs: ['Развитие агропромышленности', 'Поддержка МСБ', 'Туристическое развитие'],
    recentNews: [
      {
        id: '2',
        title: 'Открытие нового технопарка',
        date: '2024-01-12',
        summary: 'Создано 500 новых рабочих мест в сфере IT и производства'
      }
    ],
    coordinates: [40.7821, 72.3442],
    officeAddress: 'ул. Бобура, 12, Андижан, 170100'
  },
  {
    id: 'bukhara',
    name: 'Бухарская область',
    nameEn: 'Bukhara Region',
    population: 1917275,
    area: 40323,
    capital: 'Бухара',
    description: 'Историческая область с богатым культурным наследием и развитым туризмом.',
    leader: {
      id: '3',
      name: 'Уктам Барноев',
      position: 'Хоким Бухарской области',
      photo: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
      phone: '+998 65 224 56 78',
      email: 'hokim@bukhara.uz',
      inn: '345678901234'
    },
    programs: ['Сохранение культурного наследия', 'Развитие туризма', 'Реставрация памятников'],
    recentNews: [
      {
        id: '3',
        title: 'Завершена реставрация медресе Мир-и-Араб',
        date: '2024-01-10',
        summary: 'Исторический памятник полностью восстановлен для посетителей'
      }
    ],
    coordinates: [39.7747, 64.4286],
    officeAddress: 'ул. Мустакиллик, 8, Бухара, 200100'
  }
];

export default function RegionsSection() {
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [showMapModal, setShowMapModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedRegionForAction, setSelectedRegionForAction] = useState<Region | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [reportForm, setReportForm] = useState({
    type: '',
    description: '',
    anonymous: false
  });

  const handleRegionSelect = useCallback((regionId: string) => {
    setSelectedRegion(regionId);
  }, []);

  const handleMapClick = useCallback((region: Region) => {
    setSelectedRegionForAction(region);
    setShowMapModal(true);
  }, []);

  const handleContactClick = useCallback((region: Region) => {
    setSelectedRegionForAction(region);
    setShowContactModal(true);
  }, []);

  const handleReportClick = useCallback((region: Region) => {
    setSelectedRegionForAction(region);
    setShowReportModal(true);
  }, []);

  const handleCopyToClipboard = useCallback((text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} скопирован в буфер обмена`);
    }).catch(() => {
      toast.error('Ошибка при копировании');
    });
  }, []);

  const handleContactSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Пожалуйста, заполните обязательные поля');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast.success('Сообщение отправлено успешно');
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setShowContactModal(false);
    }, 1000);
  }, [contactForm]);

  const handleReportSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportForm.type || !reportForm.description) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast.success('Обращение отправлено успешно');
      setReportForm({ type: '', description: '', anonymous: false });
      setShowReportModal(false);
    }, 1000);
  }, [reportForm]);

  const selectedRegionData = selectedRegion 
    ? uzbekistanRegions.find(r => r.id === selectedRegion)
    : null;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-card rounded-lg border p-6">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-heading font-bold mb-4">Регионы Узбекистана</h1>
          <p className="text-muted-foreground mb-6">
            Познакомьтесь с руководством регионов, ключевыми программами развития и последними новостями. 
            Выберите область для получения подробной информации и контактов.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Label htmlFor="region-select" className="text-sm font-medium">
              Выберите регион:
            </Label>
            <Select value={selectedRegion} onValueChange={handleRegionSelect}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Все регионы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все регионы</SelectItem>
                {uzbekistanRegions.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Карта регионов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                <svg 
                  viewBox="0 0 800 600" 
                  className="w-full h-full"
                  role="img"
                  aria-label="Интерактивная карта регионов Узбекистана"
                >
                  {/* Simplified SVG map regions */}
                  <rect 
                    x="100" y="100" width="120" height="80" 
                    fill={selectedRegion === 'tashkent-city' ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
                    stroke="hsl(var(--border))" 
                    strokeWidth="2" 
                    className="cursor-pointer transition-colors hover:fill-primary/20"
                    onClick={() => handleMapClick(uzbekistanRegions[0])}
                  />
                  <text x="160" y="145" textAnchor="middle" className="text-xs fill-foreground">
                    Ташкент
                  </text>
                  
                  <rect 
                    x="300" y="150" width="100" height="70" 
                    fill={selectedRegion === 'andijan' ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
                    stroke="hsl(var(--border))" 
                    strokeWidth="2" 
                    className="cursor-pointer transition-colors hover:fill-primary/20"
                    onClick={() => handleMapClick(uzbekistanRegions[1])}
                  />
                  <text x="350" y="190" textAnchor="middle" className="text-xs fill-foreground">
                    Андижан
                  </text>
                  
                  <rect 
                    x="200" y="300" width="140" height="90" 
                    fill={selectedRegion === 'bukhara' ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
                    stroke="hsl(var(--border))" 
                    strokeWidth="2" 
                    className="cursor-pointer transition-colors hover:fill-primary/20"
                    onClick={() => handleMapClick(uzbekistanRegions[2])}
                  />
                  <text x="270" y="350" textAnchor="middle" className="text-xs fill-foreground">
                    Бухара
                  </text>
                </svg>
                
                <div className="absolute bottom-4 right-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowMapModal(true)}
                    className="bg-background/80 backdrop-blur-sm"
                  >
                    <Map className="h-4 w-4 mr-2" />
                    Полная карта
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Region Details */}
        <div className="space-y-6">
          {selectedRegionData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5" />
                  {selectedRegionData.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Центр: {selectedRegionData.capital}</p>
                  <p className="text-sm text-muted-foreground">
                    Население: {selectedRegionData.population.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Площадь: {selectedRegionData.area.toLocaleString()} км²
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Руководитель</h4>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedRegionData.leader.photo} alt={selectedRegionData.leader.name} />
                      <AvatarFallback>
                        {selectedRegionData.leader.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{selectedRegionData.leader.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedRegionData.leader.position}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleContactClick(selectedRegionData)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Связаться
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleReportClick(selectedRegionData)}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Сообщить о проблеме
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-48 text-muted-foreground">
                <div className="text-center">
                  <Map className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Выберите регион для просмотра информации</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Regions Grid */}
      <div>
        <h2 className="text-2xl font-heading font-bold mb-6">Все регионы</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uzbekistanRegions.map((region) => (
            <Card 
              key={region.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedRegion === region.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleRegionSelect(region.id)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{region.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{region.capital}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {region.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Население:</span>
                    <span>{region.population.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={region.leader.photo} alt={region.leader.name} />
                    <AvatarFallback className="text-xs">
                      {region.leader.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{region.leader.name}</p>
                    <p className="text-xs text-muted-foreground">{region.leader.position}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {region.programs.slice(0, 2).map((program, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {program}
                    </Badge>
                  ))}
                  {region.programs.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{region.programs.length - 2}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Map Modal */}
      <Dialog open={showMapModal} onOpenChange={setShowMapModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Интерактивная карта Узбекистана</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
            <iframe
              src="https://yandex.ru/map-widget/v1/?um=constructor%3A123456789&amp;source=constructor"
              width="100%"
              height="100%"
              className="border-0 rounded-lg"
              title="Карта регионов Узбекистана"
              loading="lazy"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Связаться с регионом</DialogTitle>
          </DialogHeader>
          
          {selectedRegionForAction && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedRegionForAction.leader.photo} alt={selectedRegionForAction.leader.name} />
                    <AvatarFallback>
                      {selectedRegionForAction.leader.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedRegionForAction.leader.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedRegionForAction.leader.position}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{selectedRegionForAction.leader.phone}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyToClipboard(selectedRegionForAction.leader.phone, 'Телефон')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{selectedRegionForAction.leader.email}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyToClipboard(selectedRegionForAction.leader.email, 'Email')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4" />
                    <span>{selectedRegionForAction.officeAddress}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact-name">Имя *</Label>
                    <Input
                      id="contact-name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-phone">Телефон</Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contact-email">Email *</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contact-subject">Тема</Label>
                  <Input
                    id="contact-subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="contact-message">Сообщение *</Label>
                  <Textarea
                    id="contact-message"
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Отправить сообщение
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowContactModal(false)}>
                    Отмена
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Report Issue Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Сообщить о проблеме</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleReportSubmit} className="space-y-4">
            <div>
              <Label htmlFor="report-type">Тип обращения *</Label>
              <Select value={reportForm.type} onValueChange={(value) => setReportForm(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="complaint">Жалоба</SelectItem>
                  <SelectItem value="suggestion">Предложение</SelectItem>
                  <SelectItem value="corruption">Коррупция</SelectItem>
                  <SelectItem value="service">Качество услуг</SelectItem>
                  <SelectItem value="other">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="report-description">Описание проблемы *</Label>
              <Textarea
                id="report-description"
                rows={5}
                value={reportForm.description}
                onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Подробно опишите ситуацию..."
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={reportForm.anonymous}
                onChange={(e) => setReportForm(prev => ({ ...prev, anonymous: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="anonymous" className="text-sm">
                Анонимное обращение
              </Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Отправить обращение
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowReportModal(false)}>
                Отмена
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}