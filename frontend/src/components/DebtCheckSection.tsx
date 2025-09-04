"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, SearchCheck, Receipt, CircleDollarSign, CreditCard, Check, FileCheck, WalletCards } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// Validation schemas
const innSchema = z.string()
  .min(9, "ИНН должен содержать минимум 9 цифр")
  .max(14, "ИНН должен содержать максимум 14 цифр")
  .regex(/^\d+$/, "ИНН должен содержать только цифры");

const fioSchema = z.object({
  firstName: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  lastName: z.string().min(2, "Фамилия должна содержать минимум 2 символа"),
  middleName: z.string().optional(),
});

const paymentSchema = z.object({
  gateway: z.string().min(1, "Выберите платежную систему"),
  phone: z.string().min(9, "Введите корректный номер телефона"),
  email: z.string().email("Введите корректный email").optional(),
  consent: z.boolean().refine(val => val, "Необходимо согласие на обработку данных"),
});

// Types
interface DebtItem {
  id: string;
  authority: string;
  description: string;
  amount: number;
  dueDate: string;
  penalty: number;
  status: "active" | "overdue" | "paid";
}

interface DebtSummary {
  taxpayerInfo: {
    name: string;
    inn: string;
    type: "individual" | "entity";
  };
  totalDebt: number;
  totalPenalty: number;
  items: DebtItem[];
  lastUpdated: string;
}

interface PaymentStatus {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  gateway: string;
  amount: number;
  createdAt: string;
  receiptUrl?: string;
}

const paymentGateways = [
  { id: "payme", name: "Payme", icon: "💳" },
  { id: "click", name: "Click", icon: "📱" },
  { id: "uzumbank", name: "Uzum Bank", icon: "🏦" },
  { id: "sqb", name: "SQB", icon: "💰" },
];

export default function DebtCheckSection() {
  const [searchType, setSearchType] = useState<"inn" | "fio">("inn");
  const [searchValue, setSearchValue] = useState("");
  const [fioData, setFioData] = useState({ firstName: "", lastName: "", middleName: "" });
  const [isSearching, setIsSearching] = useState(false);
  const [debtData, setDebtData] = useState<DebtSummary | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [paymentModal, setPaymentModal] = useState(false);
  const [selectedDebtItem, setSelectedDebtItem] = useState<DebtItem | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);

  const innForm = useForm({
    resolver: zodResolver(z.object({ inn: innSchema })),
    defaultValues: { inn: "" },
  });

  const fioForm = useForm({
    resolver: zodResolver(fioSchema),
    defaultValues: { firstName: "", lastName: "", middleName: "" },
  });

  const paymentForm = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      gateway: "",
      phone: "",
      email: "",
      consent: false,
    },
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value: string, type: string) => {
      if (value.length > 2) {
        performSearch(value, type);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (searchType === "inn" && searchValue) {
      debouncedSearch(searchValue, searchType);
    }
  }, [searchValue, searchType, debouncedSearch]);

  const performSearch = async (value: string, type: string) => {
    setIsSearching(true);
    setSearchError(null);
    setDebtData(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response
      const mockDebtData: DebtSummary = {
        taxpayerInfo: {
          name: type === "inn" ? "ООО Тест Компания" : `${fioData.lastName} ${fioData.firstName} ${fioData.middleName}`,
          inn: type === "inn" ? value : "123456789",
          type: type === "inn" ? "entity" : "individual",
        },
        totalDebt: 2500000,
        totalPenalty: 150000,
        items: [
          {
            id: "1",
            authority: "Налоговый комитет",
            description: "Подоходный налог за 2023 год",
            amount: 1500000,
            dueDate: "2024-03-15",
            penalty: 75000,
            status: "overdue",
          },
          {
            id: "2",
            authority: "Социальный фонд",
            description: "Соц. взносы за 4 квартал 2023",
            amount: 1000000,
            dueDate: "2024-01-20",
            penalty: 75000,
            status: "active",
          },
        ],
        lastUpdated: new Date().toISOString(),
      };

      if (value === "000000000") {
        setSearchError("Данные не найдены");
      } else {
        setDebtData(mockDebtData);
      }
    } catch (error) {
      setSearchError("Ошибка при поиске данных. Попробуйте еще раз.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = async (data: any) => {
    if (searchType === "inn") {
      await performSearch(data.inn, "inn");
    } else {
      setFioData(data);
      await performSearch(`${data.lastName} ${data.firstName} ${data.middleName || ""}`, "fio");
    }
  };

  const handlePaymentSubmit = async (data: any) => {
    if (!selectedDebtItem) return;

    try {
      setPaymentStatus({
        id: Math.random().toString(36),
        status: "processing",
        gateway: data.gateway,
        amount: selectedDebtItem.amount + selectedDebtItem.penalty,
        createdAt: new Date().toISOString(),
      });

      toast.success("Платеж инициирован", {
        description: `Обработка платежа через ${paymentGateways.find(g => g.id === data.gateway)?.name}`,
      });

      // Simulate payment processing
      setTimeout(() => {
        const success = Math.random() > 0.3; // 70% success rate
        setPaymentStatus(prev => prev ? {
          ...prev,
          status: success ? "completed" : "failed",
          receiptUrl: success ? "/api/receipts/example.pdf" : undefined,
        } : null);

        if (success) {
          toast.success("Платеж выполнен успешно!", {
            description: "Квитанция доступна для скачивания",
          });
        } else {
          toast.error("Ошибка платежа", {
            description: "Попробуйте еще раз или выберите другую платежную систему",
          });
        }
      }, 3000);

      setPaymentModal(false);
      paymentForm.reset();
    } catch (error) {
      toast.error("Ошибка обработки платежа");
    }
  };

  const openPaymentModal = (debtItem: DebtItem) => {
    setSelectedDebtItem(debtItem);
    setPaymentModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "overdue": return "destructive";
      case "active": return "secondary";
      case "paid": return "default";
      default: return "outline";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "overdue": return "Просрочено";
      case "active": return "Активно";
      case "paid": return "Оплачено";
      default: return status;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold font-heading">Проверка долгов</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Проверьте задолженности по налогам и другим обязательным платежам. 
          Оплачивайте онлайн через удобные платежные системы.
        </p>
      </div>

      {/* Search Panel */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SearchCheck className="h-5 w-5 text-primary" />
            Поиск задолженностей
          </CardTitle>
          <CardDescription>
            Выберите способ поиска и введите данные для проверки
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={searchType} onValueChange={(value) => setSearchType(value as "inn" | "fio")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="inn">По ИНН</TabsTrigger>
              <TabsTrigger value="fio">По ФИО</TabsTrigger>
            </TabsList>

            <TabsContent value="inn" className="space-y-4">
              <Form {...innForm}>
                <form onSubmit={innForm.handleSubmit(handleSearchSubmit)} className="space-y-4">
                  <FormField
                    control={innForm.control}
                    name="inn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ИНН налогоплательщика</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Например: 123456789"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setSearchValue(e.target.value);
                            }}
                            className="bg-background"
                          />
                        </FormControl>
                        <FormDescription>
                          Введите 9-14 цифр ИНН физического или юридического лица
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isSearching} className="w-full">
                    {isSearching ? "Поиск..." : "Найти задолженности"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="fio" className="space-y-4">
              <Form {...fioForm}>
                <form onSubmit={fioForm.handleSubmit(handleSearchSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                      control={fioForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Фамилия</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Иванов"
                              {...field}
                              className="bg-background"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={fioForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Имя</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Иван"
                              {...field}
                              className="bg-background"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={fioForm.control}
                      name="middleName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Отчество (необязательно)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Иванович"
                              {...field}
                              className="bg-background"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" disabled={isSearching} className="w-full">
                    {isSearching ? "Поиск..." : "Найти задолженности"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>

          {/* Quick search buttons */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Быстрая проверка:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchType("inn");
                  setSearchValue("123456789");
                  innForm.setValue("inn", "123456789");
                }}
              >
                Тестовый ИНН
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchType("inn");
                  setSearchValue("000000000");
                  innForm.setValue("inn", "000000000");
                }}
              >
                Без долгов
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isSearching && (
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-32 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {searchError && (
        <Card className="bg-card border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>{searchError}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {debtData && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                Сводка по задолженностям
              </CardTitle>
              <CardDescription>
                Данные на {new Date(debtData.lastUpdated).toLocaleDateString("ru-RU")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Налогоплательщик</p>
                  <p className="font-medium">{debtData.taxpayerInfo.name}</p>
                  <p className="text-sm text-muted-foreground">ИНН: {debtData.taxpayerInfo.inn}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Общая задолженность</p>
                  <p className="text-2xl font-bold text-destructive">
                    {formatCurrency(debtData.totalDebt)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Пени и штрафы</p>
                  <p className="text-xl font-semibold text-orange-600">
                    {formatCurrency(debtData.totalPenalty)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Debt Items */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold font-heading">Детализация задолженностей</h3>
            {debtData.items.map((item) => (
              <Card key={item.id} className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{item.description}</h4>
                        <Badge variant={getStatusBadgeVariant(item.status)}>
                          {getStatusText(item.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.authority}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Сумма: </span>
                          <span className="font-medium">{formatCurrency(item.amount)}</span>
                        </div>
                        {item.penalty > 0 && (
                          <div>
                            <span className="text-muted-foreground">Пени: </span>
                            <span className="font-medium text-orange-600">
                              {formatCurrency(item.penalty)}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground">Срок: </span>
                          <span className="font-medium">
                            {new Date(item.dueDate).toLocaleDateString("ru-RU")}
                          </span>
                        </div>
                      </div>
                    </div>
                    {item.status !== "paid" && (
                      <Button
                        onClick={() => openPaymentModal(item)}
                        className="w-full lg:w-auto"
                      >
                        <CircleDollarSign className="h-4 w-4 mr-2" />
                        Оплатить {formatCurrency(item.amount + item.penalty)}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Payment Status */}
      {paymentStatus && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WalletCards className="h-5 w-5 text-primary" />
              Статус платежа
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">
                  {paymentGateways.find(g => g.id === paymentStatus.gateway)?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(paymentStatus.amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(paymentStatus.createdAt).toLocaleString("ru-RU")}
                </p>
              </div>
              <div className="text-right space-y-2">
                <Badge
                  variant={
                    paymentStatus.status === "completed"
                      ? "default"
                      : paymentStatus.status === "failed"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {paymentStatus.status === "completed"
                    ? "Оплачено"
                    : paymentStatus.status === "failed"
                    ? "Ошибка"
                    : paymentStatus.status === "processing"
                    ? "Обработка"
                    : "Ожидание"
                  }
                </Badge>
                {paymentStatus.receiptUrl && (
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(paymentStatus.receiptUrl, "_blank")}
                    >
                      <FileCheck className="h-4 w-4 mr-2" />
                      Квитанция
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Modal */}
      <Dialog open={paymentModal} onOpenChange={setPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Оплата задолженности</DialogTitle>
            <DialogDescription>
              {selectedDebtItem && (
                <>
                  {selectedDebtItem.description}
                  <br />
                  Сумма к оплате: {formatCurrency(selectedDebtItem.amount + selectedDebtItem.penalty)}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <Form {...paymentForm}>
            <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-4">
              <FormField
                control={paymentForm.control}
                name="gateway"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Платежная система</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите способ оплаты" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paymentGateways.map((gateway) => (
                          <SelectItem key={gateway.id} value={gateway.id}>
                            <div className="flex items-center gap-2">
                              <span>{gateway.icon}</span>
                              {gateway.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={paymentForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Номер телефона</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+998 90 123 45 67"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Для подтверждения платежа
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={paymentForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (необязательно)</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@mail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Для отправки квитанции
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={paymentForm.control}
                name="consent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Согласие на обработку персональных данных
                      </FormLabel>
                      <FormDescription>
                        Я соглашаюсь с{" "}
                        <a href="/privacy" className="text-primary hover:underline">
                          политикой конфиденциальности
                        </a>
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPaymentModal(false)}
                  className="flex-1"
                >
                  Отмена
                </Button>
                <Button type="submit" className="flex-1">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Оплатить
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}