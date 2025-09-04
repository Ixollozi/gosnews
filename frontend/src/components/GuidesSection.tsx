"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Youtube, 
  Video, 
  Captions, 
  MonitorPlay, 
  Fullscreen, 
  FileVideo2,
  SquarePlay
} from "lucide-react";
import { toast } from "sonner";

interface Guide {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  youtubeId: string;
  programType: "loans" | "subsidies" | "grants";
  tags: string[];
  transcript: TranscriptItem[];
  resources: Resource[];
}

interface TranscriptItem {
  timestamp: number;
  text: string;
}

interface Resource {
  id: string;
  title: string;
  type: "pdf" | "form" | "document";
  url: string;
  size: string;
}

// Mock data
const mockGuides: Guide[] = [
  {
    id: "1",
    title: "Как получить льготный кредит на жилье",
    description: "Подробное руководство по оформлению льготного кредита для покупки жилья",
    duration: "12:45",
    thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400",
    youtubeId: "dQw4w9WgXcQ",
    programType: "loans",
    tags: ["жилье", "кредит", "льготы"],
    transcript: [
      { timestamp: 0, text: "Добро пожаловать в руководство по льготным кредитам" },
      { timestamp: 30, text: "Сначала нужно собрать необходимые документы" },
      { timestamp: 90, text: "Процедура подачи заявления занимает несколько этапов" }
    ],
    resources: [
      { id: "1", title: "Заявление на кредит", type: "form", url: "/forms/credit-application.pdf", size: "2.1 MB" },
      { id: "2", title: "Список документов", type: "pdf", url: "/docs/documents-list.pdf", size: "856 KB" }
    ]
  },
  {
    id: "2",
    title: "Субсидии на развитие бизнеса",
    description: "Как оформить государственную субсидию для развития малого бизнеса",
    duration: "8:30",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    youtubeId: "dQw4w9WgXcQ",
    programType: "subsidies",
    tags: ["бизнес", "субсидии", "предпринимательство"],
    transcript: [
      { timestamp: 0, text: "Государственные субсидии для малого бизнеса" },
      { timestamp: 45, text: "Критерии отбора и требования к заявителям" }
    ],
    resources: [
      { id: "3", title: "Бизнес-план шаблон", type: "document", url: "/templates/business-plan.docx", size: "1.2 MB" }
    ]
  },
  {
    id: "3",
    title: "Гранты на образование",
    description: "Программы грантового финансирования образовательных проектов",
    duration: "15:20",
    thumbnail: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400",
    youtubeId: "dQw4w9WgXcQ",
    programType: "grants",
    tags: ["образование", "гранты", "проекты"],
    transcript: [
      { timestamp: 0, text: "Образовательные гранты: возможности и требования" },
      { timestamp: 60, text: "Подготовка проектной документации" }
    ],
    resources: [
      { id: "4", title: "Требования к проекту", type: "pdf", url: "/docs/project-requirements.pdf", size: "3.4 MB" }
    ]
  }
];

const programTypeLabels = {
  loans: "Кредиты",
  subsidies: "Субсидии",
  grants: "Гранты"
};

export default function GuidesSection() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgramType, setSelectedProgramType] = useState<string>("all");
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load guides
  useEffect(() => {
    const loadGuides = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setGuides(mockGuides);
        setFilteredGuides(mockGuides);
        setLoading(false);
      }, 1000);
    };

    loadGuides();
  }, []);

  // Filter guides
  useEffect(() => {
    let filtered = guides;

    if (selectedProgramType !== "all") {
      filtered = filtered.filter(guide => guide.programType === selectedProgramType);
    }

    if (searchTerm) {
      filtered = filtered.filter(guide =>
        guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredGuides(filtered);
  }, [guides, searchTerm, selectedProgramType]);

  const handleGuideSelect = useCallback((guide: Guide) => {
    setSelectedGuide(guide);
    setPlayerReady(false);
    setShowTranscript(false);
  }, []);

  const handlePlayerReady = useCallback(() => {
    setPlayerReady(true);
  }, []);

  const jumpToTimestamp = useCallback((timestamp: number) => {
    if (iframeRef.current && playerReady) {
      // YouTube iframe API postMessage
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: "seekTo",
          args: [timestamp, true]
        }),
        "*"
      );
    }
  }, [playerReady]);

  const handleResourceDownload = useCallback((resource: Resource) => {
    // Track download analytics
    console.log("Resource downloaded:", resource.title);
    
    // Show success toast
    toast.success(`Загружается: ${resource.title}`, {
      description: `Размер файла: ${resource.size}`
    });

    // Trigger download
    const link = document.createElement("a");
    link.href = resource.url;
    link.download = resource.title;
    link.click();
  }, []);

  const copyTranscript = useCallback(() => {
    if (!selectedGuide) return;
    
    const transcriptText = selectedGuide.transcript
      .map(item => `[${Math.floor(item.timestamp / 60)}:${(item.timestamp % 60).toString().padStart(2, '0')}] ${item.text}`)
      .join('\n');
    
    navigator.clipboard.writeText(transcriptText).then(() => {
      toast.success("Расшифровка скопирована в буфер обмена");
    });
  }, [selectedGuide]);

  const GuideCard = ({ guide }: { guide: Guide }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    
    return (
      <Card className="group cursor-pointer hover:shadow-md transition-all duration-300 bg-card border border-border" 
            onClick={() => handleGuideSelect(guide)}>
        <CardHeader className="p-0">
          <div className="relative aspect-video rounded-t-lg overflow-hidden bg-muted">
            {!imageLoaded && (
              <Skeleton className="w-full h-full" />
            )}
            <img
              src={guide.thumbnail}
              alt={guide.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/60 rounded-full p-3 group-hover:bg-primary transition-colors">
                  <SquarePlay className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                {guide.duration}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {guide.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {guide.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                {programTypeLabels[guide.programType]}
              </Badge>
              {guide.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {guide.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{guide.tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const VideoPlayer = ({ guide }: { guide: Guide }) => (
    <div className="space-y-4">
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${guide.youtubeId}?enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
          title={guide.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handlePlayerReady}
        />
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold font-heading mb-2">{guide.title}</h3>
          <p className="text-muted-foreground">{guide.description}</p>
        </div>

        <Tabs defaultValue="resources" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <FileVideo2 className="h-4 w-4" />
              Материалы
            </TabsTrigger>
            <TabsTrigger value="transcript" className="flex items-center gap-2">
              <Captions className="h-4 w-4" />
              Расшифровка
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="space-y-3 mt-4">
            <div className="grid gap-3">
              {guide.resources.map((resource) => (
                <Card key={resource.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{resource.title}</h4>
                      <p className="text-xs text-muted-foreground">{resource.type.toUpperCase()} • {resource.size}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleResourceDownload(resource)}
                      className="ml-3"
                    >
                      Скачать
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="pt-4 border-t">
              <Button className="w-full" size="lg">
                Подать заявку на программу
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="transcript" className="mt-4">
            <Collapsible open={showTranscript} onOpenChange={setShowTranscript}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span>Показать полную расшифровку</span>
                      <Captions className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
                
                <CollapsibleContent className="space-y-3">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyTranscript}>
                      Копировать
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.print()}>
                      Печать
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 max-h-60 overflow-y-auto bg-muted/30">
                    {guide.transcript.map((item, index) => (
                      <div key={index} className="mb-3 last:mb-0">
                        <button
                          onClick={() => jumpToTimestamp(item.timestamp)}
                          className="text-sm text-primary hover:underline font-medium"
                        >
                          {Math.floor(item.timestamp / 60)}:{(item.timestamp % 60).toString().padStart(2, '0')}
                        </button>
                        <p className="text-sm mt-1">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">Руководства</h1>
              <p className="text-muted-foreground">Видео-инструкции по государственным программам поддержки</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Поиск по руководствам..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={selectedProgramType} onValueChange={setSelectedProgramType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Тип программы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все программы</SelectItem>
                  <SelectItem value="loans">Кредиты</SelectItem>
                  <SelectItem value="subsidies">Субсидии</SelectItem>
                  <SelectItem value="grants">Гранты</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Guides List */}
            <div className={`space-y-4 ${selectedGuide && !isMobile ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
              <div className="flex items-center gap-2 mb-4">
                <Video className="h-5 w-5" />
                <h2 className="text-xl font-semibold font-heading">
                  {loading ? "Загрузка..." : `${filteredGuides.length} руководств`}
                </h2>
              </div>

              {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="p-0">
                        <Skeleton className="aspect-video w-full rounded-t-lg" />
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex gap-2">
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-5 w-12" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className={`grid gap-6 ${selectedGuide && !isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'}`}>
                  {filteredGuides.map((guide) => (
                    <GuideCard key={guide.id} guide={guide} />
                  ))}
                </div>
              )}

              {!loading && filteredGuides.length === 0 && (
                <div className="text-center py-12">
                  <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Руководства не найдены</h3>
                  <p className="text-muted-foreground text-sm">
                    Попробуйте изменить параметры поиска
                  </p>
                </div>
              )}
            </div>

            {/* Player (Desktop) */}
            {selectedGuide && !isMobile && (
              <div className="lg:col-span-2">
                <div className="sticky top-4">
                  <VideoPlayer guide={selectedGuide} />
                </div>
              </div>
            )}
          </div>

          {/* Player Modal (Mobile) */}
          {selectedGuide && isMobile && (
            <Dialog open={!!selectedGuide} onOpenChange={() => setSelectedGuide(null)}>
              <DialogContent className="max-w-full h-full m-0 rounded-none p-4 overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="sr-only">{selectedGuide.title}</DialogTitle>
                </DialogHeader>
                <VideoPlayer guide={selectedGuide} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}