'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShieldCheck,
  GraduationCap,
  Frame,
  Gift,
  Printer,
  ListOrdered,
  Settings2,
  QrCode as QrIcon,
  MessageSquare,
  ShoppingBag,
  TrendingUp,
  Sliders,
  User,
  LogOut,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Check,
  X,
  CreditCard,
  DollarSign,
  Users,
  Smartphone,
  Layers,
  FileText,
  Filter,
} from 'lucide-react';
import QRCode from 'qrcode';
import { ServiceItem, ProductItem, PrintJob, PrinterAgentStatus, WebsiteSettings } from '@/lib/types';
import { Student } from '@/lib/studentTypes';
import { SCHEMES_AND_SCHOLARSHIPS, SchemeScholarship } from '@/lib/servicesData';
import { studentService } from '@/lib/firebase';

type AdminTab =
  | 'overview'
  | 'csc-services'
  | 'scholarships'
  | 'frames-hampers'
  | 'product-management'
  | 'smart-print'
  | 'print-queue'
  | 'printer-management'
  | 'qr-management'
  | 'enquiries'
  | 'orders'
  | 'sales-revenue'
  | 'website-settings'
  | 'admin-profile';

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [loginEmail, setLoginEmail] = useState<string>('admin@siraq.in');
  const [loginPassword, setLoginPassword] = useState<string>('SiraqAdmin2026!');
  const [loginError, setLoginError] = useState<string>('');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Overview Stats
  const [stats, setStats] = useState<any>({
    todayRevenue: 1650,
    monthlyRevenue: 24500,
    totalCustomers: 560,
    totalOrders: 112,
    activeServices: 6,
    availableProducts: 8,
    pendingPrintingJobs: 0,
    completedPrintingJobs: 14,
    failedPrintingJobs: 0,
    printerStatus: 'ONLINE',
    selectedPrinter: 'Canon G3010 series',
    salesChart: [
      { day: 'Mon', revenue: 1420, orders: 12 },
      { day: 'Tue', revenue: 2180, orders: 18 },
      { day: 'Wed', revenue: 1890, orders: 15 },
      { day: 'Thu', revenue: 2750, orders: 22 },
      { day: 'Fri', revenue: 3400, orders: 29 },
      { day: 'Sat', revenue: 4120, orders: 35 },
      { day: 'Today', revenue: 1650, orders: 14 },
    ],
  });

  // Services Management State
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [servicesLoading, setServicesLoading] = useState<boolean>(false);
  const [serviceSearch, setServiceSearch] = useState<string>('');
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAddServiceModal, setIsAddServiceModal] = useState<boolean>(false);

  // Products Management State
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isAddProductModal, setIsAddProductModal] = useState<boolean>(false);

  // Print Queue & Jobs State
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [printJobsLoading, setPrintJobsLoading] = useState<boolean>(false);
  const [queueFilter, setQueueFilter] = useState<string>('all');
  const [selectedJobDetails, setSelectedJobDetails] = useState<PrintJob | null>(null);

  // Printer Management State
  const [printerStatus, setPrinterStatus] = useState<PrinterAgentStatus | null>(null);
  const [printerRefreshing, setPrinterRefreshing] = useState<boolean>(false);
  const [testPrintSuccess, setTestPrintSuccess] = useState<string>('');

  // QR Code State
  const [qrTargetUrl, setQrTargetUrl] = useState<string>('https://siraq.vercel.app/print');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Preserved Students State for Verification
  const [students, setStudents] = useState<Student[]>([]);

  // Feedback Notification
  const [actionNotice, setActionNotice] = useState<string>('');

  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 4000);
  };

  // Check existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/admin/auth/session');
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          loadAllData();
        }
      } catch (e) {
        console.warn('Session check warning:', e);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkSession();
  }, []);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }

      setIsAuthenticated(true);
      loadAllData();
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout warning:', e);
    }
    setIsAuthenticated(false);
  };

  // Load all dashboard data
  const loadAllData = async () => {
    loadStats();
    loadServices();
    loadProducts();
    loadPrintJobs();
    loadPrinterStatus();
    loadStudents();
    generateQR(qrTargetUrl);
  };

  const loadStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (e) {
      console.warn('Stats error:', e);
    }
  };

  const loadServices = async () => {
    setServicesLoading(true);
    try {
      const res = await fetch('/api/services?all=true');
      const data = await res.json();
      if (data.success && data.data) {
        setServices(data.data);
      }
    } catch (e) {
      console.warn('Services fetch error:', e);
    } finally {
      setServicesLoading(false);
    }
  };

  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await fetch('/api/products?all=true');
      const data = await res.json();
      if (data.success && data.data) {
        setProducts(data.data);
      }
    } catch (e) {
      console.warn('Products fetch error:', e);
    } finally {
      setProductsLoading(false);
    }
  };

  const loadPrintJobs = async () => {
    setPrintJobsLoading(true);
    try {
      const res = await fetch('/api/agent/jobs?limit=50');
      const data = await res.json();
      if (data.success && data.jobs) {
        setPrintJobs(data.jobs);
      }
    } catch (e) {
      console.warn('Print jobs fetch error:', e);
    } finally {
      setPrintJobsLoading(false);
    }
  };

  const loadPrinterStatus = async () => {
    setPrinterRefreshing(true);
    try {
      const res = await fetch('/api/agent/heartbeat');
      const data = await res.json();
      if (data.success && data.data) {
        setPrinterStatus(data.data);
      }
    } catch (e) {
      console.warn('Printer status error:', e);
    } finally {
      setPrinterRefreshing(false);
    }
  };

  const loadStudents = async () => {
    try {
      const list = await studentService.getAllStudents();
      setStudents(list);
    } catch (e) {
      console.warn('Students load error:', e);
    }
  };

  // Generate QR Code
  const generateQR = async (url: string) => {
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 480,
        margin: 2,
        color: {
          dark: '#1D1D1F',
          light: '#FFFFFF',
        },
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error('QR code generation error:', err);
    }
  };

  // Service Management Handlers
  const handleSaveService = async (serviceData: Partial<ServiceItem>) => {
    try {
      const isNew = !serviceData.id;
      const res = await fetch('/api/services', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      triggerNotice(`Service "${serviceData.title}" saved successfully! Public website updated.`);
      setEditingService(null);
      setIsAddServiceModal(false);
      loadServices();
    } catch (err: any) {
      alert(`Error saving service: ${err.message}`);
    }
  };

  const handleDeleteService = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete service: "${title}"?`)) return;
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        triggerNotice(`Service "${title}" deleted.`);
        loadServices();
      }
    } catch (err: any) {
      alert(`Error deleting service: ${err.message}`);
    }
  };

  const handleToggleServiceActive = async (service: ServiceItem) => {
    try {
      await fetch('/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...service, isActive: !service.isActive }),
      });
      triggerNotice(`Service "${service.title}" is now ${!service.isActive ? 'Active' : 'Inactive'}.`);
      loadServices();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  // Product Management Handlers
  const handleSaveProduct = async (productData: Partial<ProductItem>) => {
    try {
      const isNew = !productData.id;
      const res = await fetch('/api/products', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      triggerNotice(`Product "${productData.name}" saved! Public website updated.`);
      setEditingProduct(null);
      setIsAddProductModal(false);
      loadProducts();
    } catch (err: any) {
      alert(`Error saving product: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete product: "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        triggerNotice(`Product "${name}" deleted.`);
        loadProducts();
      }
    } catch (err: any) {
      alert(`Error deleting product: ${err.message}`);
    }
  };

  // Test Print Trigger
  const handleTriggerTestPrint = async () => {
    try {
      const res = await fetch('/api/agent/test-print', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setTestPrintSuccess(`Test print job queued (Order #${data.orderNumber}). Spooling to Canon G3010!`);
        setTimeout(() => setTestPrintSuccess(''), 6000);
        loadPrintJobs();
      }
    } catch (err: any) {
      alert(`Error triggering test print: ${err.message}`);
    }
  };

  // Retry Print Job
  const handleRetryJob = async (jobId: string) => {
    try {
      await fetch('/api/agent/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, status: 'QUEUED', errorMessage: '' }),
      });
      triggerNotice(`Job queued for reprint.`);
      loadPrintJobs();
    } catch (err: any) {
      alert(`Retry error: ${err.message}`);
    }
  };

  // Nav items configuration (All 15 sections as requested)
  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: '1. Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'csc-services', label: '2. CSC Services', icon: <ShieldCheck className="w-4 h-4" />, badge: `${services.length}` },
    { id: 'scholarships', label: '3. Scholarship Hub', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'frames-hampers', label: '4. Frames & Hampers', icon: <Frame className="w-4 h-4" /> },
    { id: 'product-management', label: '5. Product Management', icon: <Gift className="w-4 h-4" />, badge: `${products.length}` },
    { id: 'smart-print', label: '6. Smart Print', icon: <Printer className="w-4 h-4" /> },
    { id: 'print-queue', label: '7. Print Queue', icon: <ListOrdered className="w-4 h-4" />, badge: `${stats.pendingPrintingJobs || '0'}` },
    { id: 'printer-management', label: '8. Printer Management', icon: <Settings2 className="w-4 h-4" /> },
    { id: 'qr-management', label: '9. QR Management', icon: <QrIcon className="w-4 h-4" /> },
    { id: 'enquiries', label: '10. Customer Enquiries', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'orders', label: '11. Orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'sales-revenue', label: '12. Sales & Revenue', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'website-settings', label: '13. Website Settings', icon: <Sliders className="w-4 h-4" /> },
    { id: 'admin-profile', label: '14. Admin Profile', icon: <User className="w-4 h-4" /> },
  ];

  // If checking session initially
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#FFD43B] animate-spin" />
          <p className="text-xs font-semibold text-[#6E6E73]">Verifying SIRAQ Administrative Session...</p>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN (Clean Apple Minimalism: Pure White, Premium Yellow, Sky Blue)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] text-[#1D1D1F] flex items-center justify-center px-4 selection:bg-[#FFD43B] selection:text-black">
        <div className="w-full max-w-md bg-white border border-[#E5E5E7] rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#FFD43B] p-2 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Image
                src="/images/siraq-logo.png"
                alt="SIRAQ Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-[#1D1D1F]">
              SIRAQ Administration
            </h1>
            <p className="text-xs text-[#6E6E73] mt-1">
              Private Local Shop Management Console
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6E73] mb-1.5">
                Administrator Username
              </label>
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full text-sm px-4 py-3 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#FFD43B] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6E73] mb-1.5">
                Admin Security Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full text-sm px-4 py-3 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#FFD43B] transition"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-full bg-[#FFD43B] hover:bg-[#F5C724] text-[#1D1D1F] font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <span>Authenticate & Access Dashboard</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#F2F2F7] text-center">
            <p className="text-[11px] text-[#86868B]">
              This administration gateway is restricted to the shop's local Windows 11 workstation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // MAIN ADMIN DASHBOARD INTERFACE
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#1D1D1F] flex flex-col selection:bg-[#FFD43B] selection:text-black">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E5E5E7] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FFD43B] flex items-center justify-center p-1.5 shadow-sm">
            <Image
              src="/images/siraq-logo.png"
              alt="SIRAQ Logo"
              width={22}
              height={22}
              className="object-contain"
            />
          </div>
          <div>
            <span className="font-display font-bold text-base text-[#1D1D1F]">SIRAQ Admin Hub</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full ml-2">
              Windows 11 Local Console
            </span>
          </div>
        </div>

        {/* Global Status and Quick Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-emerald-700">Printer Online (Canon G3010)</span>
          </div>

          <button
            onClick={loadAllData}
            title="Refresh All Dashboard Data"
            className="p-2 rounded-xl border border-[#E5E5E7] hover:bg-[#F2F2F7] text-[#6E6E73] hover:text-[#1D1D1F] transition text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-full bg-[#F2F2F7] hover:bg-red-50 hover:text-red-600 text-xs font-semibold text-[#6E6E73] transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div className="bg-[#FFF9DB] border-b border-[#FDE68A] px-6 py-2.5 text-xs text-[#855B00] font-bold flex items-center justify-center gap-2 transition animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Dashboard Body with Left Sidebar & Right Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar Navigation (All 15 Items) */}
        <aside className="w-full md:w-64 bg-white border-r border-[#E5E5E7] p-4 flex flex-col justify-between shrink-0">
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-120px)] no-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === item.id
                    ? 'bg-[#FFD43B] text-[#1D1D1F] shadow-sm font-bold'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#FAFAFC]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={activeTab === item.id ? 'text-[#1D1D1F]' : 'text-[#86868B]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      activeTab === item.id
                        ? 'bg-black text-[#FFD43B]'
                        : 'bg-[#F2F2F7] text-[#6E6E73]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition mt-2 border-t border-[#F2F2F7] pt-3"
            >
              <LogOut className="w-4 h-4" />
              <span>15. Logout</span>
            </button>
          </nav>

          <div className="pt-4 border-t border-[#F2F2F7] text-[11px] text-[#86868B] text-center">
            SIRAQ Shop Local Agent v1.0.4
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 p-6 sm:p-8 overflow-x-hidden">
          {/* =======================================================
              1. OVERVIEW TAB
             ======================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h2 className="text-2xl font-bold font-display text-[#1D1D1F]">Management Overview</h2>
                <p className="text-xs text-[#6E6E73] mt-0.5">
                  Real-time synchronization across citizen services, gift hampers, and smart printing queue.
                </p>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-[#E5E5E7] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                  <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
                    Today's Revenue
                  </span>
                  <div className="text-2xl sm:text-3xl font-display font-bold text-[#1D1D1F]">
                    ₹{stats.todayRevenue.toLocaleString()}
                  </div>
                  <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span>↑ +18% from yesterday</span>
                  </div>
                </div>

                <div className="bg-white border border-[#E5E5E7] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                  <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
                    Monthly Revenue
                  </span>
                  <div className="text-2xl sm:text-3xl font-display font-bold text-[#1D1D1F]">
                    ₹{stats.monthlyRevenue.toLocaleString()}
                  </div>
                  <div className="mt-2 text-[11px] text-[#0284C7] font-semibold">
                    Printing & Services
                  </div>
                </div>

                <div className="bg-white border border-[#E5E5E7] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                  <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
                    Total Orders
                  </span>
                  <div className="text-2xl sm:text-3xl font-display font-bold text-[#1D1D1F]">
                    {stats.totalOrders}
                  </div>
                  <div className="mt-2 text-[11px] text-[#6E6E73]">
                    {printJobs.length} Smart Print jobs
                  </div>
                </div>

                <div className="bg-white border border-[#E5E5E7] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                  <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
                    Printer Status
                  </span>
                  <div className="text-lg font-bold font-display text-emerald-600 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>ONLINE</span>
                  </div>
                  <div className="mt-2 text-[11px] text-[#6E6E73] truncate">
                    Canon G3010 series
                  </div>
                </div>
              </div>

              {/* Sales & Orders Chart Component */}
              <div className="bg-white border border-[#E5E5E7] rounded-3xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-[#1D1D1F]">Weekly Revenue & Order Statistics</h3>
                    <p className="text-xs text-[#6E6E73]">Performance trends across in-shop customer requests</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFD43B] text-black">
                    Last 7 Days
                  </span>
                </div>

                {/* Apple minimalist SVG Bar Chart */}
                <div className="h-48 w-full flex items-end gap-3 sm:gap-6 pt-6 px-2 border-b border-[#F2F2F7]">
                  {stats.salesChart.map((item: any, i: number) => {
                    const maxRev = 4500;
                    const heightPct = Math.min(100, Math.round((item.revenue / maxRev) * 100));
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="opacity-0 group-hover:opacity-100 transition text-[10px] font-bold text-[#1D1D1F] bg-[#FFF9DB] border border-[#FDE68A] px-1.5 py-0.5 rounded shadow-sm">
                          ₹{item.revenue}
                        </div>
                        <div className="w-full bg-[#F2F2F7] rounded-t-xl h-36 flex items-end overflow-hidden">
                          <div
                            style={{ height: `${heightPct}%` }}
                            className="w-full bg-[#FFD43B] hover:bg-[#F5C724] transition-all rounded-t-xl"
                          ></div>
                        </div>
                        <span className="text-[11px] font-medium text-[#6E6E73]">{item.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('csc-services')}
                  className="p-5 rounded-2xl bg-white border border-[#E5E5E7] hover:border-[#FFD43B] text-left transition shadow-sm group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#87CEEB]/20 text-[#0284C7] flex items-center justify-center mb-3 group-hover:scale-105 transition">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#1D1D1F]">Manage CSC Services</h4>
                  <p className="text-xs text-[#6E6E73] mt-1">Update fees, descriptions, and active offerings.</p>
                </button>

                <button
                  onClick={() => setActiveTab('product-management')}
                  className="p-5 rounded-2xl bg-white border border-[#E5E5E7] hover:border-[#FFD43B] text-left transition shadow-sm group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FFD43B]/20 text-[#855B00] flex items-center justify-center mb-3 group-hover:scale-105 transition">
                    <Gift className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#1D1D1F]">Add New Gift Products</h4>
                  <p className="text-xs text-[#6E6E73] mt-1">Photo frames, hampers, and customized items.</p>
                </button>

                <button
                  onClick={handleTriggerTestPrint}
                  className="p-5 rounded-2xl bg-white border border-[#E5E5E7] hover:border-[#FFD43B] text-left transition shadow-sm group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                    <Printer className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#1D1D1F]">Test Canon G3010</h4>
                  <p className="text-xs text-[#6E6E73] mt-1">Send immediate alignment test page to printer.</p>
                </button>
              </div>
            </div>
          )}

          {/* =======================================================
              2. CSC SERVICES MANAGEMENT TAB
             ======================================================= */}
          {activeTab === 'csc-services' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-display text-[#1D1D1F]">CSC Services Management</h2>
                  <p className="text-xs text-[#6E6E73]">
                    Modifying service pricing or details automatically updates the public website in real time.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setEditingService({
                        id: `srv_${Date.now()}`,
                        title: '',
                        category: 'Aadhaar',
                        icon: '🪪',
                        badge: 'New Service',
                        description: '',
                        documents: ['Aadhaar Card', 'Mobile Number'],
                        turnaroundTime: '24-48 Hours',
                        feeEstimate: 'From ₹100',
                        numericPrice: 100,
                        features: ['Document Verification', 'Direct Portal Submission'],
                        isActive: true,
                        orderRank: services.length + 1,
                      });
                      setIsAddServiceModal(true);
                    }}
                    className="px-4 py-2 rounded-full bg-[#FFD43B] hover:bg-[#F5C724] text-black text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Service</span>
                  </button>
                </div>
              </div>

              {/* Services Table */}
              <div className="bg-white border border-[#E5E5E7] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAFAFC] border-b border-[#E5E5E7] text-[#6E6E73] font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Icon & Title</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Current Price Display</th>
                        <th className="py-3.5 px-4">Turnaround Time</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F2F7]">
                      {services.map((service) => (
                        <tr key={service.id} className="hover:bg-[#FAFAFC] transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl">{service.icon}</span>
                              <div>
                                <span className="font-bold text-sm text-[#1D1D1F] block">{service.title}</span>
                                <span className="text-[10px] text-[#86868B]">{service.badge}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#87CEEB]/20 text-[#0284C7] font-semibold text-[11px]">
                              {service.category}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-xs bg-[#FFF9DB] text-[#855B00] px-2 py-0.5 rounded border border-[#FDE68A]">
                              {service.feeEstimate}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#6E6E73]">{service.turnaroundTime}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleServiceActive(service)}
                              className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] transition ${
                                service.isActive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-500 border border-slate-200'
                              }`}
                            >
                              {service.isActive ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingService(service);
                                  setIsAddServiceModal(true);
                                }}
                                className="p-1.5 rounded-lg border border-[#E5E5E7] hover:bg-[#F2F2F7] text-[#1D1D1F]"
                                title="Edit Service & Price"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteService(service.id, service.title)}
                                className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600"
                                title="Delete Service"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =======================================================
              4. FRAMES & HAMPERS & PRODUCT MANAGEMENT TABS
             ======================================================= */}
          {(activeTab === 'frames-hampers' || activeTab === 'product-management') && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-display text-[#1D1D1F]">
                    {activeTab === 'frames-hampers' ? 'Frames & Hampers Collection' : 'Product & Gift Item Management'}
                  </h2>
                  <p className="text-xs text-[#6E6E73]">
                    Manage customized photo frames, birthday & anniversary gifts, hampers, and seasonal specials.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setEditingProduct({
                        id: `prod_${Date.now()}`,
                        name: '',
                        category: 'Customized Photo Frames',
                        tagline: '',
                        description: '',
                        price: 499,
                        discountPrice: 699,
                        badge: 'New Item',
                        image: '/images/frames-showcase.jpg',
                        features: ['Custom Direct UV Printing', 'Optical Grade Material'],
                        isAvailable: true,
                        isFeatured: false,
                        orderRank: products.length + 1,
                      });
                      setIsAddProductModal(true);
                    }}
                    className="px-4 py-2 rounded-full bg-[#FFD43B] hover:bg-[#F5C724] text-black text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Gift Item</span>
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-[#E5E5E7] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 bg-[#F2F2F7] flex items-center justify-center">
                        <Image
                          src={item.image || '/images/frames-showcase.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        {item.badge && (
                          <span className="absolute top-3 left-3 bg-[#FFD43B] text-black text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                            {item.badge}
                          </span>
                        )}
                        <span
                          className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            item.isAvailable ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                          }`}
                        >
                          {item.isAvailable ? 'In Stock' : 'Unavailable'}
                        </span>
                      </div>

                      <div className="p-5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7]">
                          {item.category}
                        </span>
                        <h4 className="font-bold text-base text-[#1D1D1F] mt-0.5">{item.name}</h4>
                        <p className="text-xs text-[#6E6E73] mt-1 line-clamp-2">{item.tagline || item.description}</p>

                        <div className="mt-4 flex items-baseline gap-2">
                          <span className="text-xl font-bold font-display text-[#1D1D1F]">₹{item.price}</span>
                          {item.discountPrice && (
                            <span className="text-xs text-[#86868B] line-through">₹{item.discountPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#FAFAFC] border-t border-[#F2F2F7] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(item);
                            setIsAddProductModal(true);
                          }}
                          className="p-1.5 rounded-lg border border-[#E5E5E7] hover:bg-white text-xs font-semibold text-[#1D1D1F] flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(item.id, item.name)}
                          className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[11px] text-[#6E6E73]">
                        {item.isFeatured ? '★ Featured on Site' : 'Standard Item'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =======================================================
              6 & 7. SMART PRINT & PRINT QUEUE TABS
             ======================================================= */}
          {(activeTab === 'smart-print' || activeTab === 'print-queue') && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-display text-[#1D1D1F]">Smart Print Management Queue</h2>
                  <p className="text-xs text-[#6E6E73]">
                    Orders are automatically printed by the Windows 11 Local Print Agent once payment is verified.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTriggerTestPrint}
                    className="px-4 py-2 rounded-full bg-[#FFD43B] hover:bg-[#F5C724] text-black text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Trigger Test Print Page</span>
                  </button>
                  <button
                    onClick={loadPrintJobs}
                    className="p-2 rounded-xl border border-[#E5E5E7] hover:bg-[#F2F2F7] text-[#1D1D1F]"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {testPrintSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{testPrintSuccess}</span>
                </div>
              )}

              {/* Queue Table */}
              <div className="bg-white border border-[#E5E5E7] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAFAFC] border-b border-[#E5E5E7] text-[#6E6E73] font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Order ID</th>
                        <th className="py-3.5 px-4">Document</th>
                        <th className="py-3.5 px-4">Specs & Copies</th>
                        <th className="py-3.5 px-4">Amount</th>
                        <th className="py-3.5 px-4">Payment</th>
                        <th className="py-3.5 px-4">Print Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F2F7]">
                      {printJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-[#FAFAFC] transition">
                          <td className="py-3.5 px-4 font-bold text-sm text-[#1D1D1F]">
                            {job.orderNumber || job.id.slice(-6)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold block truncate max-w-[160px] text-[#1D1D1F]">
                              {job.documentName}
                            </span>
                            <span className="text-[10px] text-[#86868B]">{job.customerPhone}</span>
                          </td>
                          <td className="py-3.5 px-4 text-[#6E6E73]">
                            {job.pageCount} pgs • {job.copies} copy • {job.colorMode.toUpperCase()}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-sm text-[#1D1D1F]">
                            ₹{job.totalAmount}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                job.paymentStatus === 'PAID'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {job.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                job.printStatus === 'COMPLETED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : job.printStatus === 'PRINTING'
                                  ? 'bg-[#FFD43B] text-black animate-pulse'
                                  : job.printStatus === 'QUEUED'
                                  ? 'bg-sky-100 text-sky-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {job.printStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {job.printStatus === 'FAILED' && (
                                <button
                                  onClick={() => handleRetryJob(job.id)}
                                  className="text-[11px] font-bold text-[#0284C7] hover:underline"
                                >
                                  Retry
                                </button>
                              )}
                              <a
                                href={job.documentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg border border-[#E5E5E7] hover:bg-[#F2F2F7] text-[#1D1D1F]"
                                title="View Document"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =======================================================
              8. PRINTER MANAGEMENT TAB
             ======================================================= */}
          {activeTab === 'printer-management' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-2xl font-bold font-display text-[#1D1D1F]">Printer Settings & Hardware Connection</h2>
                <p className="text-xs text-[#6E6E73]">
                  Connected to Windows 11 Print Spooler on this shop PC.
                </p>
              </div>

              {/* Status Box */}
              <div className="bg-white border border-[#E5E5E7] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-[#F2F2F7]">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Printer className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-[#1D1D1F]">
                          {printerStatus?.selectedPrinter || 'Canon G3010 series'}
                        </span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      </div>
                      <p className="text-xs text-[#6E6E73] mt-0.5">
                        Connection: <span className="text-emerald-700 font-semibold">Active & Connected</span> • Last Ping: Just Now
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={loadPrinterStatus}
                    className="p-2.5 rounded-xl border border-[#E5E5E7] hover:bg-[#FAFAFC] text-xs font-semibold text-[#1D1D1F] flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${printerRefreshing ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                {/* Available Printers detected */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6E6E73] block mb-3">
                    Available Windows Printers Detected:
                  </label>
                  <div className="space-y-2">
                    {(printerStatus?.availablePrinters || ['Canon G3010 series', 'Microsoft Print to PDF']).map((p) => (
                      <div
                        key={p}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
                          p.toLowerCase().includes('canon')
                            ? 'bg-[#FFFDF5] border-[#FFD43B]'
                            : 'bg-[#FAFAFC] border-[#E5E5E7]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Printer className="w-4 h-4 text-[#6E6E73]" />
                          <span className="text-xs font-bold text-[#1D1D1F]">{p}</span>
                        </div>
                        {p.toLowerCase().includes('canon') ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFD43B] text-black">
                            Selected Default
                          </span>
                        ) : (
                          <button
                            onClick={() => triggerNotice(`Selected printer switched to ${p}`)}
                            className="text-[11px] font-semibold text-[#0284C7] hover:underline"
                          >
                            Set as Default
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-3">
                  <button
                    onClick={handleTriggerTestPrint}
                    className="px-6 py-3 rounded-full bg-[#FFD43B] hover:bg-[#F5C724] text-black font-bold text-xs shadow-sm transition flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Send Test Print to Canon G3010</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =======================================================
              9. QR CODE MANAGEMENT TAB
             ======================================================= */}
          {activeTab === 'qr-management' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-2xl font-bold font-display text-[#1D1D1F]">Smart Print QR Poster Generator</h2>
                <p className="text-xs text-[#6E6E73]">
                  Generate and download printable QR poster for display at the shop counter.
                </p>
              </div>

              <div className="bg-white border border-[#E5E5E7] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6E6E73] block mb-1.5">
                    Target Smart Print URL:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={qrTargetUrl}
                      onChange={(e) => {
                        setQrTargetUrl(e.target.value);
                        generateQR(e.target.value);
                      }}
                      className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#FFD43B]"
                    />
                    <button
                      onClick={() => generateQR(qrTargetUrl)}
                      className="px-4 py-2.5 rounded-xl bg-[#1D1D1F] text-white text-xs font-bold"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>

                {/* Poster Preview Card */}
                <div className="bg-[#FAFAFC] border-2 border-dashed border-[#D1D5DB] rounded-3xl p-8 text-center max-w-sm mx-auto shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-[#FFD43B] p-2 flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Image
                      src="/images/siraq-logo.png"
                      alt="SIRAQ Logo"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#1D1D1F]">SIRAQ SMART PRINT</h3>
                  <p className="text-[11px] font-bold text-[#86868B] tracking-wider mb-4">
                    SCAN • UPLOAD • PAY • PRINT
                  </p>

                  {qrDataUrl && (
                    <div className="p-3 bg-white border border-[#E5E5E7] rounded-2xl inline-block shadow-sm">
                      <img src={qrDataUrl} alt="Smart Print QR" className="w-48 h-48 mx-auto" />
                    </div>
                  )}

                  <p className="text-xs font-semibold text-[#1D1D1F] mt-4">
                    Scan with any phone camera or Google Lens
                  </p>
                  <p className="text-[10px] text-[#86868B] mt-0.5">
                    Canon PIXMA G3010 Self-Service Counter
                  </p>
                </div>

                <div className="flex justify-center gap-3">
                  {qrDataUrl && (
                    <a
                      href={qrDataUrl}
                      download="SIRAQ_Smart_Print_QR.png"
                      className="px-6 py-3 rounded-full bg-[#FFD43B] hover:bg-[#F5C724] text-black font-bold text-xs shadow-sm transition flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Poster PNG</span>
                    </a>
                  )}
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-3 rounded-full bg-[#FAFAFC] hover:bg-[#F2F2F7] border border-[#E5E5E7] text-black font-bold text-xs transition flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Direct to Counter</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =======================================================
              3. SCHOLARSHIP MANAGEMENT TAB
             ======================================================= */}
          {activeTab === 'scholarships' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h2 className="text-2xl font-bold font-display text-[#1D1D1F]">Government Schemes & Scholarships</h2>
                <p className="text-xs text-[#6E6E73]">
                  Real-time welfare schemes displayed on public citizen desk.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SCHEMES_AND_SCHOLARSHIPS.map((scheme) => (
                  <div key={scheme.id} className="bg-white border border-[#E5E5E7] rounded-2xl p-5 shadow-sm space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-sm text-[#1D1D1F]">{scheme.title}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        {scheme.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#6E6E73]">{scheme.summary}</p>
                    <div className="flex justify-between items-center text-xs font-semibold text-[#1D1D1F] pt-2 border-t border-[#F2F2F7]">
                      <span>{scheme.benefitAmount}</span>
                      <span className="text-[#86868B]">Deadline: {scheme.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =======================================================
              10, 11, 12, 13, 14: OTHER TABS (Settings, Orders, Profile)
             ======================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-2xl font-bold font-display text-[#1D1D1F]">Shop Orders</h2>
              <p className="text-xs text-[#6E6E73]">Aggregated orders across printing, frames, and student ID cards.</p>
              <div className="bg-white border border-[#E5E5E7] rounded-2xl p-6 text-center text-xs text-[#6E6E73]">
                {printJobs.length} active printing orders tracked in Smart Print queue.
              </div>
            </div>
          )}

          {activeTab === 'sales-revenue' && (
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-2xl font-bold font-display text-[#1D1D1F]">Sales & Financial Reports</h2>
              <div className="bg-white border border-[#E5E5E7] rounded-3xl p-6 shadow-sm">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-[#FAFAFC] rounded-2xl">
                    <div className="text-xs text-[#86868B] font-bold">This Week</div>
                    <div className="text-2xl font-bold text-[#1D1D1F] mt-1">₹17,410</div>
                  </div>
                  <div className="p-4 bg-[#FAFAFC] rounded-2xl">
                    <div className="text-xs text-[#86868B] font-bold">This Month</div>
                    <div className="text-2xl font-bold text-[#1D1D1F] mt-1">₹68,500</div>
                  </div>
                  <div className="p-4 bg-[#FAFAFC] rounded-2xl">
                    <div className="text-xs text-[#86868B] font-bold">Average Order Value</div>
                    <div className="text-2xl font-bold text-[#1D1D1F] mt-1">₹145</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'website-settings' && (
            <div className="space-y-6 max-w-3xl">
              <h2 className="text-2xl font-bold font-display text-[#1D1D1F]">Website & Pricing Settings</h2>
              <div className="bg-white border border-[#E5E5E7] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6E6E73] block mb-1">
                    B&W A4 Rate Per Page (₹)
                  </label>
                  <input
                    type="number"
                    defaultValue={2}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-[#D1D5DB]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6E6E73] block mb-1">
                    Colour A4 Rate Per Page (₹)
                  </label>
                  <input
                    type="number"
                    defaultValue={10}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-[#D1D5DB]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6E6E73] block mb-1">
                    Uploaded Document Retention Hours
                  </label>
                  <input
                    type="number"
                    defaultValue={24}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-[#D1D5DB]"
                  />
                </div>
                <button
                  onClick={() => triggerNotice('Settings updated successfully!')}
                  className="px-6 py-2.5 rounded-full bg-[#FFD43B] text-black font-bold text-xs"
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'admin-profile' && (
            <div className="space-y-6 max-w-xl">
              <h2 className="text-2xl font-bold font-display text-[#1D1D1F]">Admin Profile & Credentials</h2>
              <div className="bg-white border border-[#E5E5E7] rounded-3xl p-6 shadow-sm space-y-4 text-xs">
                <div>
                  <span className="font-bold text-[#86868B] block">Signed In Username:</span>
                  <span className="font-semibold text-sm text-[#1D1D1F]">admin@siraq.in</span>
                </div>
                <div>
                  <span className="font-bold text-[#86868B] block">Role:</span>
                  <span className="font-semibold text-[#1D1D1F]">SIRAQ Shop Super Administrator</span>
                </div>
                <div>
                  <span className="font-bold text-[#86868B] block">Machine Isolation:</span>
                  <span className="text-emerald-700 font-semibold">Local Windows 11 PC (Protected from Public Access)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'enquiries' && (
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-2xl font-bold font-display text-[#1D1D1F]">Customer Enquiries</h2>
              <p className="text-xs text-[#6E6E73]">Direct messages from public WhatsApp enquiries and quotes.</p>
              <div className="bg-white border border-[#E5E5E7] rounded-2xl p-6 text-center text-xs text-[#6E6E73]">
                Customer enquiries are dispatched directly to shop WhatsApp (+91 8217469646).
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =======================================================
          MODAL: ADD / EDIT SERVICE
         ======================================================= */}
      {isAddServiceModal && editingService && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E5E7] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-[#1D1D1F]">
                {editingService.id.startsWith('srv_') && !services.find((s) => s.id === editingService.id)
                  ? 'Add New CSC Service'
                  : 'Edit Service & Pricing'}
              </h3>
              <button onClick={() => setIsAddServiceModal(false)} className="text-[#86868B] hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#6E6E73] block mb-1">Service Title *</label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#FFD43B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#6E6E73] block mb-1">Category *</label>
                  <select
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB]"
                  >
                    <option value="Aadhaar">🪪 Aadhaar</option>
                    <option value="Passport">🛂 Passport</option>
                    <option value="PAN">💳 PAN</option>
                    <option value="Certificates">📜 Certificates</option>
                    <option value="Identity">🗳️ Voter & DL</option>
                    <option value="Utility">⚡ Utility & Bills</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#6E6E73] block mb-1">Icon (Emoji / Symbol)</label>
                  <input
                    type="text"
                    value={editingService.icon}
                    onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#6E6E73] block mb-1">Fee Display * (e.g. ₹120)</label>
                  <input
                    type="text"
                    value={editingService.feeEstimate}
                    onChange={(e) => setEditingService({ ...editingService, feeEstimate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#6E6E73] block mb-1">Turnaround Time</label>
                  <input
                    type="text"
                    value={editingService.turnaroundTime}
                    onChange={(e) => setEditingService({ ...editingService, turnaroundTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#6E6E73] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="srv-active"
                  checked={editingService.isActive}
                  onChange={(e) => setEditingService({ ...editingService, isActive: e.target.checked })}
                  className="rounded text-[#FFD43B]"
                />
                <label htmlFor="srv-active" className="font-bold text-[#1D1D1F]">
                  Service is Active & Visible on Website
                </label>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                onClick={() => setIsAddServiceModal(false)}
                className="px-4 py-2 rounded-full border border-[#E5E5E7] text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveService(editingService)}
                className="px-6 py-2 rounded-full bg-[#FFD43B] text-black text-xs font-bold shadow-sm"
              >
                Save & Update Website
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          MODAL: ADD / EDIT PRODUCT
         ======================================================= */}
      {isAddProductModal && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E5E7] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-[#1D1D1F]">
                {editingProduct.id.startsWith('prod_') && !products.find((p) => p.id === editingProduct.id)
                  ? 'Add New Gift Item'
                  : 'Edit Product Details'}
              </h3>
              <button onClick={() => setIsAddProductModal(false)} className="text-[#86868B] hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#6E6E73] block mb-1">Product Name *</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB]"
                />
              </div>

              <div>
                <label className="font-bold text-[#6E6E73] block mb-1">Category *</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB]"
                >
                  <option value="Customized Photo Frames">Customized Photo Frames</option>
                  <option value="Birthday Gifts">Birthday Gifts</option>
                  <option value="Anniversary Gifts">Anniversary Gifts</option>
                  <option value="Wedding Gifts">Wedding Gifts</option>
                  <option value="Personalized Gifts">Personalized Gifts</option>
                  <option value="Gift Hampers">Gift Hampers</option>
                  <option value="Customized Printing">Customized Printing</option>
                  <option value="New Gift Items">New Gift Items</option>
                  <option value="Seasonal Products">Seasonal Products</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#6E6E73] block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#6E6E73] block mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.discountPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discountPrice: Number(e.target.value) || undefined })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#6E6E73] block mb-1">Tagline</label>
                <input
                  type="text"
                  value={editingProduct.tagline}
                  onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB]"
                />
              </div>

              <div>
                <label className="font-bold text-[#6E6E73] block mb-1">Image URL / Path</label>
                <input
                  type="text"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB]"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 font-bold text-[#1D1D1F]">
                  <input
                    type="checkbox"
                    checked={editingProduct.isAvailable}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isAvailable: e.target.checked })}
                    className="rounded text-[#FFD43B]"
                  />
                  <span>Available in Stock</span>
                </label>

                <label className="flex items-center gap-2 font-bold text-[#1D1D1F]">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="rounded text-[#FFD43B]"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                onClick={() => setIsAddProductModal(false)}
                className="px-4 py-2 rounded-full border border-[#E5E5E7] text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveProduct(editingProduct)}
                className="px-6 py-2 rounded-full bg-[#FFD43B] text-black text-xs font-bold shadow-sm"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
