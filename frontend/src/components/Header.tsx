"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Earth, Search, LogIn, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface SearchSuggestion {
  id: string;
  title: string;
  type: "news" | "guide";
  url: string;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
}

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("Рус");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({ email: "", password: "" });
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const languages = ["Uz", "Рус", "Qaraqalpaq"];
  
  const navItems = [
    { label: "Главная", href: "/" },
    { label: "Новости", href: "/news" },
    { label: "Руководства", href: "/guides" },
    { label: "Регионы", href: "/regions" },
    { label: "Проверка задолженностей", href: "/debt-check" },
    { label: "Личный кабинет", href: "/dashboard" },
  ];

  // Debounced search suggestions
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/search-suggestions?q=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const suggestions = await response.json();
          setSuggestions(suggestions);
        }
      } catch (error) {
        console.error("Search suggestions error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem("preferred-language", language);
    toast.success(`Язык изменен на ${language}`);
  };

  const validateLoginForm = () => {
    const errors = { email: "", password: "" };
    
    if (!loginForm.email.trim()) {
      errors.email = "Email обязателен";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
      errors.email = "Неверный формат email";
    }
    
    if (!loginForm.password.trim()) {
      errors.password = "Пароль обязателен";
    } else if (loginForm.password.length < 6) {
      errors.password = "Пароль должен содержать минимум 6 символов";
    }
    
    setLoginErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) {
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      if (response.ok) {
        const userData = await response.json();
        setIsAuthenticated(true);
        setUser(userData.user);
        setIsLoginOpen(false);
        setLoginForm({ email: "", password: "" });
        toast.success("Вы успешно вошли в систему");
      } else {
        const error = await response.json();
        toast.error(error.message || "Ошибка входа");
      }
    } catch (error) {
      toast.error("Ошибка подключения");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      setUser(null);
      setIsAccountMenuOpen(false);
      toast.success("Вы вышли из системы");
    } catch (error) {
      toast.error("Ошибка выхода");
    }
  };

  const handleSearchSubmit = (suggestion?: SearchSuggestion) => {
    if (suggestion) {
      window.location.href = suggestion.url;
    } else if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="w-[280px] h-12 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold text-lg">
                GovPortal
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Основная навигация">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="text-sm font-medium text-foreground hover:text-primary hover:bg-accent"
                asChild
              >
                <a href={item.href}>{item.label}</a>
              </Button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Language Switcher */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex items-center space-x-1 text-muted-foreground hover:text-foreground"
                  aria-label="Выбрать язык"
                >
                  <Earth className="h-4 w-4" />
                  <span className="text-sm">{currentLanguage}</span>
                  <ChevronUp className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-32 p-1" align="end">
                {languages.map((lang) => (
                  <Button
                    key={lang}
                    variant={lang === currentLanguage ? "secondary" : "ghost"}
                    className="w-full justify-start text-sm"
                    onClick={() => handleLanguageChange(lang)}
                  >
                    {lang}
                  </Button>
                ))}
              </PopoverContent>
            </Popover>

            {/* Desktop Search */}
            <div className="hidden md:block">
              <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Поиск"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0" align="end">
                  <Command shouldFilter={false}>
                    <div className="flex items-center border-b px-3">
                      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                      <Input
                        ref={searchInputRef}
                        placeholder="Поиск новостей и руководств..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !isSearching) {
                            handleSearchSubmit();
                          }
                        }}
                        className="border-0 focus:ring-0 focus:ring-offset-0"
                      />
                    </div>
                    <CommandList>
                      {isSearching && (
                        <div className="p-4 text-sm text-muted-foreground text-center">
                          Поиск...
                        </div>
                      )}
                      {!isSearching && searchQuery && searchSuggestions.length === 0 && (
                        <CommandEmpty>Ничего не найдено</CommandEmpty>
                      )}
                      {!isSearching && searchSuggestions.length > 0 && (
                        <CommandGroup>
                          {searchSuggestions.map((suggestion) => (
                            <CommandItem
                              key={suggestion.id}
                              onSelect={() => handleSearchSubmit(suggestion)}
                              className="cursor-pointer"
                            >
                              <div>
                                <div className="font-medium">{suggestion.title}</div>
                                <div className="text-xs text-muted-foreground capitalize">
                                  {suggestion.type === "news" ? "Новость" : "Руководство"}
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Mobile Search */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden text-muted-foreground hover:text-foreground"
                  aria-label="Поиск"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Поиск</DialogTitle>
                </DialogHeader>
                <Command shouldFilter={false}>
                  <div className="flex items-center border rounded-md px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                      placeholder="Поиск новостей и руководств..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isSearching) {
                          handleSearchSubmit();
                        }
                      }}
                      className="border-0 focus:ring-0 focus:ring-offset-0"
                    />
                  </div>
                  <CommandList className="mt-4">
                    {isSearching && (
                      <div className="p-4 text-sm text-muted-foreground text-center">
                        Поиск...
                      </div>
                    )}
                    {!isSearching && searchQuery && searchSuggestions.length === 0 && (
                      <CommandEmpty>Ничего не найдено</CommandEmpty>
                    )}
                    {!isSearching && searchSuggestions.length > 0 && (
                      <CommandGroup>
                        {searchSuggestions.map((suggestion) => (
                          <CommandItem
                            key={suggestion.id}
                            onSelect={() => handleSearchSubmit(suggestion)}
                            className="cursor-pointer"
                          >
                            <div>
                              <div className="font-medium">{suggestion.title}</div>
                              <div className="text-xs text-muted-foreground capitalize">
                                {suggestion.type === "news" ? "Новость" : "Руководство"}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </DialogContent>
            </Dialog>

            {/* Account Section */}
            {isAuthenticated && user ? (
              <Popover open={isAccountMenuOpen} onOpenChange={setIsAccountMenuOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                    aria-label="Меню аккаунта"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="end">
                  <div className="flex items-center space-x-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                    </div>
                  </div>
                  <div className="border-t pt-1 mt-1">
                    <Button variant="ghost" className="w-full justify-start text-sm" asChild>
                      <a href="/profile">Профиль</a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm" asChild>
                      <a href="/payments">Платежи</a>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm text-destructive hover:text-destructive"
                      onClick={handleLogout}
                    >
                      Выйти
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Войти
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Вход в систему</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        className={loginErrors.email ? "border-destructive" : ""}
                      />
                      {loginErrors.email && (
                        <p className="text-sm text-destructive">{loginErrors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium">
                        Пароль
                      </label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className={loginErrors.password ? "border-destructive" : ""}
                      />
                      {loginErrors.password && (
                        <p className="text-sm text-destructive">{loginErrors.password}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full">
                      Войти
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden text-muted-foreground hover:text-foreground"
                  aria-label="Открыть меню"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4" aria-label="Мобильная навигация">
                  {navItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                  
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Язык</h3>
                    <div className="flex space-x-2">
                      {languages.map((lang) => (
                        <Button
                          key={lang}
                          variant={lang === currentLanguage ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => handleLanguageChange(lang)}
                        >
                          {lang}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Быстрые ссылки</h3>
                    <div className="space-y-2">
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <a href="/payments">Платежи</a>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <a href="/faq">FAQ</a>
                      </Button>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}