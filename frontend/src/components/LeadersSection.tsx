"use client";

import React, { useState, useMemo } from 'react';
import { Search, Mail, Phone, MapPin, Users, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Leader {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  region: string;
  email: string;
  phone: string;
  photo: string;
  bio?: string;
}

const mockLeaders: Leader[] = [
  {
    id: "1",
    firstName: "Shavkat",
    lastName: "Mirziyoyev",
    position: "Prezident",
    region: "Toshkent",
    email: "president@gov.uz",
    phone: "+998 71 239 15 15",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "O'zbekiston Respublikasining Prezidenti. Mamlakatning ichki va tashqi siyosatini belgilaydi."
  },
  {
    id: "2",
    firstName: "Abdulla",
    lastName: "Aripov",
    position: "Bosh vazir",
    region: "Toshkent",
    email: "pm@gov.uz",
    phone: "+998 71 239 87 00",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "O'zbekiston Respublikasi Vazirlar Mahkamasining Raisi. Hukumat faoliyatini muvofiqlashtiradi."
  },
  {
    id: "3",
    firstName: "Erkin",
    lastName: "Turdimov",
    position: "Hokim",
    region: "Andijon",
    email: "hokim@andijon.uz",
    phone: "+998 74 223 45 67",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    bio: "Andijon viloyati hokimi. Viloyat ijtimoiy-iqtisodiy rivojlanishini ta'minlaydi."
  },
  {
    id: "4",
    firstName: "Komil",
    lastName: "Allamjonov",
    position: "Hokim",
    region: "Buxoro",
    email: "hokim@bukhara.uz",
    phone: "+998 65 224 78 90",
    photo: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
    bio: "Buxoro viloyati hokimi. Tarixiy merosi va iqtisodiy rivojlanishni muvozanatlaydi."
  },
  {
    id: "5",
    firstName: "Sherzod",
    lastName: "Hidoyatov",
    position: "Hokim",
    region: "Farg'ona",
    email: "hokim@fergana.uz",
    phone: "+998 73 244 32 11",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    bio: "Farg'ona viloyati hokimi. Qishloq xo'jaligi va sanoat rivojlanishini nazorat qiladi."
  },
  {
    id: "6",
    firstName: "Dilmurod",
    lastName: "Ruzmetov",
    position: "Hokim",
    region: "Jizzax",
    email: "hokim@jizzakh.uz",
    phone: "+998 72 226 44 55",
    photo: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    bio: "Jizzax viloyati hokimi. Transport va logistika markazini rivojlantirishda faol."
  },
  {
    id: "7",
    firstName: "Jahongir",
    lastName: "Artikxojayev",
    position: "Hokim",
    region: "Toshkent shahar",
    email: "hokim@tashkent.uz",
    phone: "+998 71 202 46 46",
    photo: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150&h=150&fit=crop&crop=face",
    bio: "Toshkent shahar hokimi. Poytaxtni zamonaviy shahar sifatida rivojlantirishni boshqaradi."
  },
  {
    id: "8",
    firstName: "Botir",
    lastName: "Zakirov",
    position: "Hokim",
    region: "Xorazm",
    email: "hokim@khorezm.uz",
    phone: "+998 62 225 33 44",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "Xorazm viloyati hokimi. Qadimiy madaniyat va zamonaviy rivojlanishni uyg'unlashtirishda etakchi."
  },
  {
    id: "9",
    firstName: "Laziz",
    lastName: "Kudratov",
    position: "Hokim",
    region: "Namangan",
    email: "hokim@namangan.uz",
    phone: "+998 69 234 56 78",
    photo: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face",
    bio: "Namangan viloyati hokimi. Yosh tadbirkorlarni qo'llab-quvvatlash dasturlarini amalga oshiradi."
  },
  {
    id: "10",
    firstName: "Rustam",
    lastName: "Qosimov",
    position: "Hokim",
    region: "Navoiy",
    email: "hokim@navoiy.uz",
    phone: "+998 79 223 67 89",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    bio: "Navoiy viloyati hokimi. Tog'-kon sanoati va ekologik barqarorlikni ta'minlaydi."
  },
  {
    id: "11",
    firstName: "Ulugbek",
    lastName: "Qosimov",
    position: "Hokim",
    region: "Qashqadaryo",
    email: "hokim@qashqadaryo.uz",
    phone: "+998 75 223 78 90",
    photo: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    bio: "Qashqadaryo viloyati hokimi. Neft-gaz sanoati va qishloq xo'jaligi rivojlanishini muvofiqlashtiradi."
  },
  {
    id: "12",
    firstName: "Aziz",
    lastName: "Abdukhakimov",
    position: "Hokim",
    region: "Qoraqalpog'iston",
    email: "hokim@karakalpakstan.uz",
    phone: "+998 61 223 45 67",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    bio: "Qoraqalpog'iston Respublikasi vaziri hokimi. Orol dengizi hududidagi ekologik muammolarni hal qilishda faol."
  },
  {
    id: "13",
    firstName: "Shukhrat",
    lastName: "Ganiyev",
    position: "Hokim",
    region: "Samarqand",
    email: "hokim@samarkand.uz",
    phone: "+998 66 233 44 55",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "Samarqand viloyati hokimi. Turizm va madaniy merosni rivojlantirishda yetakchi."
  },
  {
    id: "14",
    firstName: "Muzaffar",
    lastName: "Meliqulov",
    position: "Hokim",
    region: "Sirdaryo",
    email: "hokim@sirdaryo.uz",
    phone: "+998 67 224 56 78",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    bio: "Sirdaryo viloyati hokimi. Suv resurslari va qishloq xo'jaligi samaradorligini oshirishda faol."
  },
  {
    id: "15",
    firstName: "Odiljon",
    lastName: "Toshmatov",
    position: "Hokim",
    region: "Surxondaryo",
    email: "hokim@surkhandaryo.uz",
    phone: "+998 76 223 67 89",
    photo: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
    bio: "Surxondaryo viloyati hokimi. Chegaradosh hududlar bilan hamkorlikni rivojlantirishda etakchi."
  },
  {
    id: "16",
    firstName: "Davron",
    lastName: "Khidiraliyet",
    position: "Hokim",
    region: "Toshkent viloyat",
    email: "hokim@toshkent-viloyat.uz",
    phone: "+998 70 233 45 67",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "Toshkent viloyati hokimi. Poytaxt atrofidagi hududlarning rivojlanishini ta'minlaydi."
  }
];

const regions = ["Barcha viloyatlar", "Toshkent", "Toshkent shahar", "Toshkent viloyat", "Andijon", "Buxoro", "Farg'ona", "Jizzax", "Xorazm", "Namangan", "Navoiy", "Qashqadaryo", "Qoraqalpog'iston", "Samarqand", "Sirdaryo", "Surxondaryo"];

const positions = ["Barcha lavozimlar", "Prezident", "Bosh vazir", "Hokim"];

const getRegionColor = (region: string): string => {
  const colors = {
    "Toshkent": "bg-blue-100 text-blue-800 border-blue-200",
    "Toshkent shahar": "bg-purple-100 text-purple-800 border-purple-200",
    "Toshkent viloyat": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "Andijon": "bg-green-100 text-green-800 border-green-200",
    "Buxoro": "bg-amber-100 text-amber-800 border-amber-200",
    "Farg'ona": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "Jizzax": "bg-cyan-100 text-cyan-800 border-cyan-200",
    "Xorazm": "bg-orange-100 text-orange-800 border-orange-200",
    "Namangan": "bg-lime-100 text-lime-800 border-lime-200",
    "Navoiy": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Qashqadaryo": "bg-rose-100 text-rose-800 border-rose-200",
    "Qoraqalpog'iston": "bg-violet-100 text-violet-800 border-violet-200",
    "Samarqand": "bg-sky-100 text-sky-800 border-sky-200",
    "Sirdaryo": "bg-teal-100 text-teal-800 border-teal-200",
    "Surxondaryo": "bg-pink-100 text-pink-800 border-pink-200"
  };
  return colors[region as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
};

export const LeadersSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("Barcha viloyatlar");
  const [selectedPosition, setSelectedPosition] = useState("Barcha lavozimlar");
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredLeaders = useMemo(() => {
    return mockLeaders.filter(leader => {
      const matchesSearch = searchTerm === "" || 
        `${leader.firstName} ${leader.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leader.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leader.region.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRegion = selectedRegion === "Barcha viloyatlar" || leader.region === selectedRegion;
      const matchesPosition = selectedPosition === "Barcha lavozimlar" || leader.position === selectedPosition;
      
      return matchesSearch && matchesRegion && matchesPosition;
    });
  }, [searchTerm, selectedRegion, selectedPosition]);

  const handleEmailContact = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const handlePhoneContact = (phone: string) => {
    window.open(`tel:${phone}`, '_blank');
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRegion("Barcha viloyatlar");
    setSelectedPosition("Barcha lavozimlar");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
          <Users className="h-6 w-6 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Rahbariyat</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-heading text-foreground">
          Hududiy Rahbarlar
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          O'zbekiston Respublikasi viloyatlari va shaharlarining rahbarlari bilan to'g'ridan-to'g'ri bog'lanish imkoniyati
        </p>
      </div>

      {/* Filters Section */}
      <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Qidirish va filtrlash</h2>
            </div>
            {(searchTerm || selectedRegion !== "Barcha viloyatlar" || selectedPosition !== "Barcha lavozimlar") && (
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
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ism, familya yoki lavozim bo'yicha qidiring..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 border-white/30"
              />
            </div>
            
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

            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger className="bg-white/50 border-white/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {positions.map(position => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{filteredLeaders.length} ta rahbar topildi</span>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Barcha viloyatlar</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaders Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="animate-pulse backdrop-blur-sm bg-white/80 border-white/20">
              <CardContent className="p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredLeaders.length === 0 ? (
        <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-lg">
          <CardContent className="p-12 text-center space-y-4">
            <Users className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold text-foreground">Rahbarlar topilmadi</h3>
            <p className="text-muted-foreground">
              Qidiruv mezonlaringizni o'zgartirib ko'ring yoki barcha filtrlarni tozalang.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Barcha filtrlarni tozalash
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLeaders.map((leader) => (
            <Dialog key={leader.id}>
              <DialogTrigger asChild>
                <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm bg-white/80 border-white/20 shadow-lg">
                  <CardContent className="p-6 space-y-4 text-center">
                    <Avatar className="w-20 h-20 mx-auto ring-4 ring-white/50 group-hover:ring-primary/30 transition-all duration-300">
                      <AvatarImage src={leader.photo} alt={`${leader.firstName} ${leader.lastName}`} />
                      <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                        {leader.firstName[0]}{leader.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {leader.firstName} {leader.lastName}
                      </h3>
                      <p className="text-sm font-medium text-muted-foreground">
                        {leader.position}
                      </p>
                    </div>

                    <Badge 
                      variant="secondary" 
                      className={`${getRegionColor(leader.region)} font-medium`}
                    >
                      {leader.region}
                    </Badge>

                    <div className="flex justify-center gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 bg-white/50 hover:bg-white/80 border-white/30"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEmailContact(leader.email);
                        }}
                      >
                        <Mail className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 bg-white/50 hover:bg-white/80 border-white/30"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePhoneContact(leader.phone);
                        }}
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl font-bold">
                    Rahbar ma'lumotlari
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <Avatar className="w-24 h-24 mx-auto ring-4 ring-primary/20">
                      <AvatarImage src={leader.photo} alt={`${leader.firstName} ${leader.lastName}`} />
                      <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                        {leader.firstName[0]}{leader.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">
                        {leader.firstName} {leader.lastName}
                      </h3>
                      <p className="text-lg font-medium text-muted-foreground">
                        {leader.position}
                      </p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`${getRegionColor(leader.region)} font-medium text-sm px-3 py-1`}
                    >
                      {leader.region}
                    </Badge>
                  </div>

                  {leader.bio && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-foreground leading-relaxed">
                        {leader.bio}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Bog'lanish ma'lumotlari</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground">{leader.email}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground">{leader.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground">{leader.region}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 flex items-center gap-2"
                      onClick={() => handleEmailContact(leader.email)}
                    >
                      <Mail className="h-4 w-4" />
                      Email yuborish
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 flex items-center gap-2"
                      onClick={() => handlePhoneContact(leader.phone)}
                    >
                      <Phone className="h-4 w-4" />
                      Qo'ng'iroq qilish
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
};