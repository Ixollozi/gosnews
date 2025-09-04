"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  WalletMinimal, 
  PanelRight, 
  LogIn 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface Debt {
  id: string;
  creditor: string;
  amount: number;
  status: 'active' | 'overdue' | 'settled' | 'disputed';
  dueDate: string;
  originalAmount: number;
  category: string;
}

interface Payment {
  id: string;
  debtId: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  method: string;
  receiptUrl?: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  language: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

interface UserDashboardProps {
  className?: string;
}

export default function UserDashboard({ className }: UserDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  // Data states
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [paymentForm, setPaymentForm] = useState({ amount: '', method: 'card' });

  // Simulate authentication check
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, randomly authenticate user
      const authenticated = Math.random() > 0.5;
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        await loadUserData();
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const loadUserData = useCallback(async () => {
    try {
      // Simulate loading user data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProfile({
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        language: 'en',
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      });

      setDebts([
        {
          id: '1',
          creditor: 'Credit Card Company A',
          amount: 2500.00,
          status: 'overdue',
          dueDate: '2024-01-15',
          originalAmount: 3000.00,
          category: 'Credit Card'
        },
        {
          id: '2',
          creditor: 'Medical Center',
          amount: 850.00,
          status: 'active',
          dueDate: '2024-02-28',
          originalAmount: 850.00,
          category: 'Medical'
        },
        {
          id: '3',
          creditor: 'Auto Loan Finance',
          amount: 0.00,
          status: 'settled',
          dueDate: '2023-12-01',
          originalAmount: 15000.00,
          category: 'Auto Loan'
        }
      ]);

      setPayments([
        {
          id: '1',
          debtId: '3',
          amount: 500.00,
          status: 'completed',
          date: '2024-01-10',
          method: 'Bank Transfer',
          receiptUrl: '#'
        },
        {
          id: '2',
          debtId: '1',
          amount: 100.00,
          status: 'pending',
          date: '2024-01-08',
          method: 'Credit Card'
        },
        {
          id: '3',
          debtId: '2',
          amount: 200.00,
          status: 'failed',
          date: '2024-01-05',
          method: 'Bank Transfer'
        }
      ]);
    } catch (error) {
      toast.error('Failed to load user data');
    }
  }, []);

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simulate login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsAuthenticated(true);
      setShowLoginModal(false);
      await loadUserData();
      
      toast.success('Successfully logged in');
      
      // Execute pending action if any
      if (pendingAction) {
        setActiveTab(pendingAction);
        setPendingAction(null);
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  }, [loadUserData, pendingAction]);

  const handlePayment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDebt) return;

    try {
      // Optimistic update
      const newPayment: Payment = {
        id: Date.now().toString(),
        debtId: selectedDebt.id,
        amount: parseFloat(paymentForm.amount),
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        method: paymentForm.method === 'card' ? 'Credit Card' : 'Bank Transfer'
      };

      setPayments(prev => [newPayment, ...prev]);
      setShowPaymentModal(false);
      setSelectedDebt(null);
      setPaymentForm({ amount: '', method: 'card' });

      toast.success('Payment submitted successfully');

      // Simulate payment processing
      setTimeout(() => {
        setPayments(prev => 
          prev.map(p => 
            p.id === newPayment.id 
              ? { ...p, status: 'completed' as const, receiptUrl: '#' }
              : p
          )
        );
        
        // Update debt amount
        setDebts(prev => 
          prev.map(d => 
            d.id === selectedDebt.id
              ? { ...d, amount: Math.max(0, d.amount - parseFloat(paymentForm.amount)) }
              : d
          )
        );
        
        toast.success('Payment processed successfully');
      }, 3000);
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    }
  }, [selectedDebt, paymentForm]);

  const handleDebtAction = useCallback((action: string, debt: Debt) => {
    if (!isAuthenticated) {
      setPendingAction('debts');
      setShowLoginModal(true);
      return;
    }

    switch (action) {
      case 'pay':
        setSelectedDebt(debt);
        setPaymentForm(prev => ({ ...prev, amount: debt.amount.toString() }));
        setShowPaymentModal(true);
        break;
      case 'dispute':
        toast.info('Dispute process initiated');
        break;
      case 'download':
        toast.info('Document download started');
        break;
    }
  }, [isAuthenticated]);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setProfile(null);
    setDebts([]);
    setPayments([]);
    toast.success('Logged out successfully');
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      overdue: 'destructive',
      settled: 'secondary',
      disputed: 'outline',
      completed: 'secondary',
      pending: 'outline',
      failed: 'destructive'
    };
    
    const variant = variants[status as keyof typeof variants] || 'default';
    return <Badge variant={variant as "default" | "destructive" | "outline" | "secondary"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>;
  };

  const filteredPayments = payments.filter(payment => {
    if (paymentFilter !== 'all' && payment.status !== paymentFilter) return false;
    if (dateFilter && !payment.date.includes(dateFilter)) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className || ''}`}>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
              <div className="md:col-span-3 space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`space-y-6 ${className || ''}`}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <LogIn className="h-6 w-6" />
              Access Your Dashboard
            </CardTitle>
            <CardDescription>
              Please log in to view your account information and manage your debts
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => setShowLoginModal(true)}>
              Log In to Dashboard
            </Button>
          </CardContent>
        </Card>

        <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Login to Your Account</DialogTitle>
              <DialogDescription>
                Enter your credentials to access your dashboard
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Log In
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" />
            User Dashboard
          </CardTitle>
          <CardDescription>
            Manage your profile, debts, payments, and account settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <TabsList className="grid grid-cols-1 h-fit">
              <TabsTrigger value="profile" className="justify-start">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="debts" className="justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                My Debts
              </TabsTrigger>
              <TabsTrigger value="payments" className="justify-start">
                <WalletMinimal className="h-4 w-4 mr-2" />
                Payments
              </TabsTrigger>
              <TabsTrigger value="settings" className="justify-start">
                <PanelRight className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <div className="md:col-span-3">
              <TabsContent value="profile" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Your personal account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Full Name</Label>
                          <p className="font-medium">{profile.name}</p>
                        </div>
                        <div>
                          <Label>Email</Label>
                          <p className="font-medium">{profile.email}</p>
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <p className="font-medium">{profile.phone}</p>
                        </div>
                        <div>
                          <Label>Language</Label>
                          <p className="font-medium">{profile.language === 'en' ? 'English' : profile.language}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="debts" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>My Debts</CardTitle>
                    <CardDescription>Overview of your current debts and payment status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {debts.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">No debts found</p>
                        <Button variant="outline">Check for New Debts</Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {debts.map((debt) => (
                          <Card key={debt.id}>
                            <CardContent className="pt-6">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h4 className="font-medium">{debt.creditor}</h4>
                                  <p className="text-sm text-muted-foreground">{debt.category}</p>
                                </div>
                                {getStatusBadge(debt.status)}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <Label className="text-xs">Current Amount</Label>
                                  <p className="font-bold text-lg">${debt.amount.toFixed(2)}</p>
                                </div>
                                <div>
                                  <Label className="text-xs">Original Amount</Label>
                                  <p className="font-medium">${debt.originalAmount.toFixed(2)}</p>
                                </div>
                                <div>
                                  <Label className="text-xs">Due Date</Label>
                                  <p className="font-medium">{new Date(debt.dueDate).toLocaleDateString()}</p>
                                </div>
                              </div>
                              {debt.status !== 'settled' && (
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleDebtAction('pay', debt)}
                                    disabled={debt.amount === 0}
                                  >
                                    Pay Now
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleDebtAction('dispute', debt)}
                                  >
                                    Dispute
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleDebtAction('download', debt)}
                                  >
                                    Download
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>View and manage your payment records</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 mb-6">
                      <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Payments</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="month"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-40"
                      />
                    </div>

                    {filteredPayments.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No payments found</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPayments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                              <TableCell>${payment.amount.toFixed(2)}</TableCell>
                              <TableCell>{payment.method}</TableCell>
                              <TableCell>{getStatusBadge(payment.status)}</TableCell>
                              <TableCell>
                                {payment.receiptUrl && (
                                  <Button size="sm" variant="outline">
                                    Download Receipt
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Manage how you receive updates</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {profile && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="email" 
                              checked={profile.notifications.email}
                              onCheckedChange={(checked) => {
                                setProfile(prev => prev ? {
                                  ...prev,
                                  notifications: { ...prev.notifications, email: !!checked }
                                } : null);
                              }}
                            />
                            <Label htmlFor="email">Email notifications</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="sms" 
                              checked={profile.notifications.sms}
                              onCheckedChange={(checked) => {
                                setProfile(prev => prev ? {
                                  ...prev,
                                  notifications: { ...prev.notifications, sms: !!checked }
                                } : null);
                              }}
                            />
                            <Label htmlFor="sms">SMS notifications</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="push" 
                              checked={profile.notifications.push}
                              onCheckedChange={(checked) => {
                                setProfile(prev => prev ? {
                                  ...prev,
                                  notifications: { ...prev.notifications, push: !!checked }
                                } : null);
                              }}
                            />
                            <Label htmlFor="push">Push notifications</Label>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Manage your account preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Select value={profile?.language} onValueChange={(value) => {
                          setProfile(prev => prev ? { ...prev, language: value } : null);
                        }}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="pt-4">
                        <Button variant="destructive" onClick={handleLogout}>
                          Logout
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogDescription>
              {selectedDebt && `Pay ${selectedDebt.creditor} - $${selectedDebt.amount.toFixed(2)}`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="Enter amount"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Payment Method</Label>
              <Select value={paymentForm.method} onValueChange={(value) => 
                setPaymentForm(prev => ({ ...prev, method: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit Card</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Submit Payment
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}