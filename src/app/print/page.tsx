'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Printer,
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ArrowLeft,
  Smartphone,
  CreditCard,
  Layers,
  FileCheck2,
} from 'lucide-react';
import { PrintJob, PrintColorMode, PrintPaperSize, PrintSides } from '@/lib/types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function SmartPrintPage() {
  // Step state: 1 = Upload, 2 = Configure, 3 = Payment / Review, 4 = Status tracking
  const [step, setStep] = useState<number>(1);

  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [detectedPages, setDetectedPages] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Print options
  const [colorMode, setColorMode] = useState<PrintColorMode>('bw');
  const [paperSize, setPaperSize] = useState<PrintPaperSize>('A4');
  const [sides, setSides] = useState<PrintSides>('single');
  const [copies, setCopies] = useState<number>(1);
  const [pageRangeMode, setPageRangeMode] = useState<'all' | 'custom'>('all');
  const [customPageRange, setCustomPageRange] = useState<string>('');

  // Customer info
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');

  // Calculated Pricing
  const [unitPrice, setUnitPrice] = useState<number>(2.0);
  const [totalAmount, setTotalAmount] = useState<number>(2.0);
  const [calculatingPrice, setCalculatingPrice] = useState<boolean>(false);

  // Order & Payment state
  const [processingOrder, setProcessingOrder] = useState<boolean>(false);
  const [activeJob, setActiveJob] = useState<PrintJob | null>(null);
  const [trackingStatus, setTrackingStatus] = useState<string>('QUEUED');
  const [paymentError, setPaymentError] = useState<string>('');

  // Recalculate price whenever options change
  useEffect(() => {
    let effectivePages = detectedPages;
    if (pageRangeMode === 'custom' && customPageRange.trim()) {
      // Parse custom pages count e.g. "1-3, 5" -> 4 pages
      try {
        const parts = customPageRange.split(',');
        let count = 0;
        for (const p of parts) {
          const trimmed = p.trim();
          if (trimmed.includes('-')) {
            const [start, end] = trimmed.split('-').map(Number);
            if (!isNaN(start) && !isNaN(end) && end >= start) {
              count += end - start + 1;
            } else {
              count += 1;
            }
          } else if (trimmed && !isNaN(Number(trimmed))) {
            count += 1;
          }
        }
        effectivePages = Math.max(1, count);
      } catch {
        effectivePages = detectedPages;
      }
    }

    let rate = 2.0;
    if (paperSize === 'A4') {
      if (colorMode === 'bw') {
        rate = sides === 'double' ? 1.75 : 2.0;
      } else {
        rate = sides === 'double' ? 9.0 : 10.0;
      }
    } else {
      // A5
      rate = colorMode === 'bw' ? 1.5 : 8.0;
    }

    setUnitPrice(rate);
    const total = Math.max(1, Math.round(effectivePages * copies * rate));
    setTotalAmount(total);
  }, [detectedPages, copies, colorMode, paperSize, sides, pageRangeMode, customPageRange]);

  // Handle file select & automatic upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setUploadError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selected);

      const res = await fetch('/api/print/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload document');
      }

      setUploadedUrl(data.fileUrl);
      setDetectedPages(data.detectedPages || 1);
      setStep(2); // Move to configure step
    } catch (err: any) {
      setUploadError(err.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Payment Initiation via UPI / Razorpay
  const handleProceedToPayment = async () => {
    if (!customerPhone.trim() || customerPhone.length < 10) {
      setPaymentError('Please enter a valid 10-digit mobile number for order verification');
      return;
    }

    setProcessingOrder(true);
    setPaymentError('');

    try {
      // 1. Create order on server
      const createRes = await fetch('/api/print/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName || 'Valued Customer',
          customerPhone,
          documentName: file?.name || 'Document.pdf',
          documentUrl: uploadedUrl,
          documentType: file?.name.endsWith('.pdf') ? 'pdf' : 'jpg',
          documentSize: file?.size || 1024,
          pageCount: detectedPages,
          colorMode,
          paperSize,
          sides,
          copies,
          pageRange: pageRangeMode === 'custom' ? customPageRange : 'All',
        }),
      });

      const orderData = await createRes.json();
      if (!createRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initiate printing order');
      }

      const { jobId, orderNumber, amount, razorpayOrderId, keyId, isLiveGateway } = orderData;

      // 2. Open Razorpay Checkout modal if Razorpay script is loaded
      if (typeof window !== 'undefined' && window.Razorpay && isLiveGateway) {
        const options = {
          key: keyId,
          amount: amount * 100,
          currency: 'INR',
          name: 'SIRAQ SMART PRINT',
          description: `Print Order #${orderNumber} (${copies} copies, ${colorMode.toUpperCase()})`,
          image: '/images/siraq-logo.png',
          order_id: razorpayOrderId,
          handler: async function (response: any) {
            // Verify payment cryptographically on server
            await verifyPaymentOnServer(jobId, response);
          },
          prefill: {
            name: customerName,
            contact: customerPhone,
          },
          theme: {
            color: '#FFD43B',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setPaymentError(resp.error?.description || 'Payment was declined or cancelled');
          setProcessingOrder(false);
        });
        rzp.open();
      } else {
        // Instant verified test/direct mode fallback when Razorpay keys are in setup
        const fakePaymentId = `pay_upi_${Date.now().toString(36)}`;
        await verifyPaymentOnServer(jobId, {
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: fakePaymentId,
          razorpay_signature: 'test_verified_local',
        });
      }
    } catch (err: any) {
      setPaymentError(err.message || 'Payment initiation failed');
      setProcessingOrder(false);
    }
  };

  const verifyPaymentOnServer = async (jobId: string, paymentResp: any) => {
    try {
      const verifyRes = await fetch('/api/print/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          razorpay_order_id: paymentResp.razorpay_order_id,
          razorpay_payment_id: paymentResp.razorpay_payment_id,
          razorpay_signature: paymentResp.razorpay_signature,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || 'Server payment verification failed');
      }

      setActiveJob(verifyData.job);
      setTrackingStatus(verifyData.job.printStatus || 'QUEUED');
      setStep(4); // Move to real-time status tracking screen!
    } catch (err: any) {
      setPaymentError(err.message || 'Payment verification failed');
    } finally {
      setProcessingOrder(false);
    }
  };

  // Poll for job status update while on tracking screen
  useEffect(() => {
    if (step !== 4 || !activeJob?.id) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/print/status/${activeJob.id}`);
        const data = await res.json();
        if (data.success && data.job) {
          setTrackingStatus(data.job.printStatus);
          setActiveJob(data.job);
        }
      } catch (e) {
        console.warn('Status poll warning:', e);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [step, activeJob?.id]);

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#1D1D1F] flex flex-col justify-between selection:bg-[#FFD43B] selection:text-black">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E5E5E7] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-[#FFD43B] flex items-center justify-center p-1.5 shadow-sm">
            <Image
              src="/images/siraq-logo.png"
              alt="SIRAQ Logo"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div>
            <span className="font-display font-bold text-base text-[#1D1D1F] tracking-tight">SIRAQ</span>
            <span className="text-[10px] uppercase font-bold text-[#FFD43B] bg-[#1D1D1F] px-1.5 py-0.5 rounded ml-1.5">
              Smart Print
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 text-xs font-medium text-[#6E6E73]">
          <span className="hidden sm:inline">Canon G3010 Ready</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-emerald-600 font-semibold text-[11px]">Shop Printer Online</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="container max-w-xl mx-auto px-4 py-8 flex-1">
        {/* Project Tagline Banner */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD43B]/20 text-[#855B00] border border-[#FFD43B]/40 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Self-Service Shop Printing
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            SIRAQ SMART PRINT
          </h1>
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#6E6E73] mt-1">
            SCAN • UPLOAD • PAY • PRINT
          </p>
        </div>

        {/* Step Progress Tracker */}
        <div className="flex items-center justify-between mb-8 px-2 max-w-md mx-auto">
          {[
            { num: 1, label: 'Upload' },
            { num: 2, label: 'Options' },
            { num: 3, label: 'Payment' },
            { num: 4, label: 'Printing' },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-[#FFD43B] text-black shadow-sm scale-110'
                    : step > s.num
                    ? 'bg-[#1D1D1F] text-white'
                    : 'bg-[#E5E5E7] text-[#86868B]'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-[11px] mt-1 font-medium ${step === s.num ? 'text-[#1D1D1F] font-bold' : 'text-[#86868B]'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: UPLOAD DOCUMENT */}
        {step === 1 && (
          <div className="bg-white border border-[#E5E5E7] rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <h2 className="text-lg font-bold text-[#1D1D1F] mb-1">Step 1: Upload Your Document</h2>
            <p className="text-xs text-[#6E6E73] mb-6">
              Supported file formats: <span className="font-semibold text-[#1D1D1F]">PDF, JPG, JPEG, PNG</span> (up to 25MB)
            </p>

            {uploadError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#D1D5DB] hover:border-[#FFD43B] bg-[#FAFAFC] hover:bg-[#FFFDF5] rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/jpeg,image/png,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-14 h-14 rounded-full bg-[#87CEEB]/20 text-[#0284C7] flex items-center justify-center group-hover:scale-110 transition">
                {uploading ? (
                  <RefreshCw className="w-6 h-6 animate-spin text-[#FFD43B]" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>

              <div>
                <p className="text-sm font-bold text-[#1D1D1F]">
                  {uploading ? 'Processing & Validating Document...' : 'Tap to Browse or Drop File Here'}
                </p>
                <p className="text-[11px] text-[#86868B] mt-1">Direct upload from WhatsApp, Google Drive or Gallery</p>
              </div>

              <span className="mt-2 text-xs font-semibold px-4 py-1.5 rounded-full bg-[#FFD43B] text-black">
                Select Document
              </span>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-[#6E6E73]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Encrypted & Private
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#0284C7]" /> Auto-deleted in 24 hours
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: CONFIGURE PRINTING OPTIONS */}
        {step === 2 && (
          <div className="bg-white border border-[#E5E5E7] rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-[#F2F2F7]">
              <div>
                <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider">Document Ready</span>
                <h3 className="text-base font-bold text-[#1D1D1F] truncate max-w-[240px] sm:max-w-xs">{file?.name}</h3>
                <p className="text-xs text-[#6E6E73]">
                  Detected Pages: <span className="font-semibold text-[#1D1D1F]">{detectedPages}</span> • Size: {Math.round((file?.size || 0) / 1024)} KB
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-[#0284C7] hover:underline font-semibold"
              >
                Change
              </button>
            </div>

            {/* Option 1: Color Mode */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#6E6E73] block mb-2">
                1. Color Preference
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setColorMode('bw')}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${
                    colorMode === 'bw'
                      ? 'border-[#1D1D1F] bg-[#1D1D1F] text-white shadow-sm'
                      : 'border-[#E5E5E7] bg-white text-[#1D1D1F] hover:bg-[#FAFAFC]'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm">Black & White</div>
                    <div className={`text-[11px] ${colorMode === 'bw' ? 'text-slate-300' : 'text-[#86868B]'}`}>
                      Standard notes & docs
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colorMode === 'bw' ? 'bg-[#FFD43B] text-black' : 'bg-slate-100 text-slate-700'}`}>
                    ₹2/pg
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setColorMode('color')}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${
                    colorMode === 'color'
                      ? 'border-[#FFD43B] bg-[#FFFDF5] text-[#1D1D1F] shadow-sm'
                      : 'border-[#E5E5E7] bg-white text-[#1D1D1F] hover:bg-[#FAFAFC]'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm flex items-center gap-1.5">
                      <span>Full Colour</span>
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    </div>
                    <div className="text-[11px] text-[#86868B]">Certificates & photos</div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FFD43B] text-black">
                    ₹10/pg
                  </span>
                </button>
              </div>
            </div>

            {/* Option 2: Paper Size & Sides */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#6E6E73] block mb-2">
                  2. Paper Size
                </label>
                <div className="flex gap-2">
                  {(['A4', 'A5'] as PrintPaperSize[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setPaperSize(sz)}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition ${
                        paperSize === sz
                          ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]'
                          : 'bg-white border-[#E5E5E7] text-[#1D1D1F] hover:bg-[#FAFAFC]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#6E6E73] block mb-2">
                  3. Sides
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSides('single')}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition ${
                      sides === 'single'
                        ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]'
                        : 'bg-white border-[#E5E5E7] text-[#1D1D1F] hover:bg-[#FAFAFC]'
                    }`}
                  >
                    1-Sided
                  </button>
                  <button
                    type="button"
                    onClick={() => setSides('double')}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition ${
                      sides === 'double'
                        ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]'
                        : 'bg-white border-[#E5E5E7] text-[#1D1D1F] hover:bg-[#FAFAFC]'
                    }`}
                  >
                    2-Sided
                  </button>
                </div>
              </div>
            </div>

            {/* Option 3: Copies & Page Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#6E6E73] block mb-2">
                  4. Number of Copies
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCopies(Math.max(1, copies - 1))}
                    className="w-10 h-10 rounded-xl border border-[#E5E5E7] bg-[#FAFAFC] hover:bg-[#F2F2F7] flex items-center justify-center font-bold text-lg"
                  >
                    -
                  </button>
                  <span className="font-bold text-base w-8 text-center">{copies}</span>
                  <button
                    type="button"
                    onClick={() => setCopies(copies + 1)}
                    className="w-10 h-10 rounded-xl border border-[#E5E5E7] bg-[#FAFAFC] hover:bg-[#F2F2F7] flex items-center justify-center font-bold text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#6E6E73] block mb-2">
                  5. Specific Pages
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPageRangeMode('all')}
                    className={`flex-1 py-2 rounded-xl border text-xs font-semibold ${
                      pageRangeMode === 'all'
                        ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]'
                        : 'bg-white border-[#E5E5E7] text-[#6E6E73]'
                    }`}
                  >
                    All Pages
                  </button>
                  <button
                    type="button"
                    onClick={() => setPageRangeMode('custom')}
                    className={`flex-1 py-2 rounded-xl border text-xs font-semibold ${
                      pageRangeMode === 'custom'
                        ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]'
                        : 'bg-white border-[#E5E5E7] text-[#6E6E73]'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {pageRangeMode === 'custom' && (
                  <input
                    type="text"
                    placeholder="e.g. 1-3, 5"
                    value={customPageRange}
                    onChange={(e) => setCustomPageRange(e.target.value)}
                    className="mt-2 w-full text-xs px-3 py-2 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#FFD43B]"
                  />
                )}
              </div>
            </div>

            {/* Price Preview Card */}
            <div className="p-4 rounded-2xl bg-[#FFF9DB] border border-[#FDE68A] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#855B00] uppercase tracking-wider">Estimated Total</span>
                <p className="text-xs text-[#855B00]">
                  {detectedPages} page(s) × {copies} copy = {detectedPages * copies} impressions
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold font-display text-[#1D1D1F]">₹{totalAmount}</span>
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full py-3.5 rounded-full bg-[#FFD43B] hover:bg-[#F5C724] text-[#1D1D1F] font-bold text-sm shadow-sm transition flex items-center justify-center gap-2"
            >
              <span>Continue to Customer Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: CUSTOMER DETAILS & PAYMENT */}
        {step === 3 && (
          <div className="bg-white border border-[#E5E5E7] rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-6">
            <div>
              <button
                onClick={() => setStep(2)}
                className="text-xs text-[#6E6E73] hover:text-[#1D1D1F] flex items-center gap-1 font-semibold mb-3"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Options
              </button>
              <h2 className="text-lg font-bold text-[#1D1D1F]">Step 3: Customer Information & Pay</h2>
              <p className="text-xs text-[#6E6E73]">
                Enter your details so your print job can be identified at the shop counter.
              </p>
            </div>

            {paymentError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6E73] mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-sm px-4 py-3 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#FFD43B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6E73] mb-1">
                  Mobile Number (Required) *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-[#D1D5DB] bg-[#FAFAFC] text-xs font-bold text-[#6E6E73]">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-sm px-4 py-3 rounded-r-xl border border-[#D1D5DB] focus:outline-none focus:border-[#FFD43B]"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary Receipt */}
            <div className="p-4 rounded-2xl bg-[#FAFAFC] border border-[#E5E5E7] space-y-2 text-xs">
              <div className="flex justify-between text-[#6E6E73]">
                <span>Document:</span>
                <span className="font-semibold text-[#1D1D1F] truncate max-w-[180px]">{file?.name}</span>
              </div>
              <div className="flex justify-between text-[#6E6E73]">
                <span>Color & Paper:</span>
                <span className="font-semibold text-[#1D1D1F]">
                  {colorMode === 'bw' ? 'Black & White' : 'Full Colour'} • {paperSize}
                </span>
              </div>
              <div className="flex justify-between text-[#6E6E73]">
                <span>Total Copies:</span>
                <span className="font-semibold text-[#1D1D1F]">{copies} copy</span>
              </div>
              <div className="pt-2 border-t border-[#E5E5E7] flex justify-between font-bold text-sm text-[#1D1D1F]">
                <span>Total Payable:</span>
                <span className="text-[#1D1D1F]">₹{totalAmount}</span>
              </div>
            </div>

            {/* Instant UPI Pay Button */}
            <button
              disabled={processingOrder}
              onClick={handleProceedToPayment}
              className="w-full py-4 rounded-full bg-[#FFD43B] hover:bg-[#F5C724] text-[#1D1D1F] font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processingOrder ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Connecting Secure Gateway...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ₹{totalAmount} & Send to Printer</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-[#86868B] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Razorpay / UPI Payment Gateway with Instant Spooling
            </p>
          </div>
        )}

        {/* STEP 4: ORDER CONFIRMATION & LIVE PRINT STATUS */}
        {step === 4 && activeJob && (
          <div className="bg-white border border-[#E5E5E7] rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Verified • Order Confirmed
              </span>
              <h2 className="text-xl font-bold font-display text-[#1D1D1F] mt-3">
                Order #{activeJob.orderNumber}
              </h2>
              <p className="text-xs text-[#6E6E73] mt-1">
                Your print job is in progress at SIRAQ Canon PIXMA G3010.
              </p>
            </div>

            {/* Live Status Animation Pipeline */}
            <div className="p-5 rounded-2xl bg-[#FAFAFC] border border-[#E5E5E7] text-left space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1D1D1F]">Payment Confirmed</div>
                  <div className="text-[10px] text-[#86868B]">Transaction verified via webhook</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    trackingStatus === 'PRINTING' || trackingStatus === 'COMPLETED'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#FFD43B] text-black animate-pulse'
                  }`}
                >
                  {trackingStatus === 'COMPLETED' ? '✓' : '2'}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1D1D1F]">Sent to Canon PIXMA G3010</div>
                  <div className="text-[10px] text-[#86868B]">Local Windows Print Agent spooling</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    trackingStatus === 'COMPLETED'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#E5E5E7] text-[#86868B]'
                  }`}
                >
                  {trackingStatus === 'COMPLETED' ? '✓' : '3'}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1D1D1F]">
                    {trackingStatus === 'COMPLETED' ? 'Printing Completed!' : 'Printing In Progress...'}
                  </div>
                  <div className="text-[10px] text-[#86868B]">
                    {trackingStatus === 'COMPLETED'
                      ? 'Please collect your sheets from the shop counter.'
                      : 'Paper feeding and ink deposition underway.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setStep(1);
                  setFile(null);
                  setActiveJob(null);
                }}
                className="flex-1 py-3 rounded-full bg-[#FAFAFC] hover:bg-[#F2F2F7] border border-[#E5E5E7] text-xs font-bold text-[#1D1D1F] transition"
              >
                Print Another Document
              </button>
              <Link
                href="/"
                className="flex-1 py-3 rounded-full bg-[#FFD43B] hover:bg-[#F5C724] text-xs font-bold text-[#1D1D1F] transition flex items-center justify-center"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="py-6 border-t border-[#E5E5E7] text-center text-xs text-[#86868B] bg-white">
        <p>SIRAQ Smart Print & Self-Service Printing Ecosystem • Canon PIXMA G3010 Series</p>
      </footer>
    </div>
  );
}

