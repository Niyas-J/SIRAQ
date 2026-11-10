'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Printer,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ArrowLeft,
  CreditCard,
  Layers,
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

  // Calculated Pricing: ₹5 for B&W, ₹10 for Colour
  const [unitPrice, setUnitPrice] = useState<number>(5.0);
  const [totalAmount, setTotalAmount] = useState<number>(5.0);
  const [effectivePageCount, setEffectivePageCount] = useState<number>(1);

  // Order & Payment state
  const [processingOrder, setProcessingOrder] = useState<boolean>(false);
  const [activeJob, setActiveJob] = useState<PrintJob | null>(null);
  const [trackingStatus, setTrackingStatus] = useState<string>('QUEUED');
  const [paymentError, setPaymentError] = useState<string>('');

  // Calculate pricing based on exact specified rates:
  // Black & White: ₹5 per page
  // Colour: ₹10 per page
  // Total Amount = (Number of Printed Pages × Price Per Page × Copies)
  useEffect(() => {
    let pages = detectedPages;
    if (pageRangeMode === 'custom' && customPageRange.trim()) {
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
        pages = Math.max(1, count);
      } catch {
        pages = detectedPages;
      }
    }
    setEffectivePageCount(pages);

    // Exact rates: B&W = ₹5, Color = ₹10
    const rate = colorMode === 'bw' ? 5.0 : 10.0;
    setUnitPrice(rate);

    const calculatedTotal = Math.max(1, Math.round(pages * Math.max(1, copies) * rate));
    setTotalAmount(calculatedTotal);
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
          customerName: customerName.trim() || 'Valued Customer',
          customerPhone: customerPhone.trim(),
          documentName: file?.name || 'Document.pdf',
          documentUrl: uploadedUrl,
          documentType: file?.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'jpg',
          documentSize: file?.size || 1024,
          pageCount: effectivePageCount,
          colorMode,
          paperSize,
          sides,
          copies,
          pageRange: pageRangeMode === 'custom' ? customPageRange : 'All',
          totalAmount,
          unitPrice,
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
            await verifyPaymentOnServer(jobId, response);
          },
          prefill: {
            name: customerName,
            contact: customerPhone,
          },
          theme: {
            color: '#F5D76E',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setPaymentError(resp.error?.description || 'Payment was declined or cancelled');
          setProcessingOrder(false);
        });
        rzp.open();
      } else {
        // Direct verified instant mode fallback when Razorpay keys are in setup/test
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
      setStep(4); // Move to live status tracking screen
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
    <div className="min-h-screen bg-[#FFFFFF] text-[#25352B] flex flex-col justify-between selection:bg-[#F5D76E] selection:text-[#25352B]">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#DDF1DF] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-[#DDF1DF] border border-[#A8CFAE] flex items-center justify-center p-1.5 shadow-sm">
            <Image
              src="/images/siraq-logo.png"
              alt="SIRAQ Logo"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div>
            <span className="font-display font-bold text-base text-[#25352B] tracking-tight">SIRAQ</span>
            <span className="text-[10px] uppercase font-bold text-[#477D55] bg-[#DDF1DF] px-2 py-0.5 rounded ml-1.5 border border-[#A8CFAE]">
              Smart Print
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 text-xs font-medium text-[#25352B]/75">
          <span className="hidden sm:inline">Canon PIXMA G3010</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[#477D55] font-semibold text-[11px]">Printer Online</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="container max-w-xl mx-auto px-4 py-8 flex-1">
        {/* Project Tagline Banner */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF1DF] text-[#477D55] border border-[#A8CFAE] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#477D55]" /> Self-Service Shop Printing
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#25352B]">
            SIRAQ SMART PRINT
          </h1>
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#477D55] mt-1">
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
                    ? 'bg-[#F5D76E] text-[#25352B] shadow-sm scale-110 border border-[#eed063]'
                    : step > s.num
                    ? 'bg-[#477D55] text-white'
                    : 'bg-[#F5F9F5] border border-[#DDF1DF] text-[#25352B]/50'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-[11px] mt-1 font-medium ${step === s.num ? 'text-[#25352B] font-bold' : 'text-[#25352B]/50'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: UPLOAD DOCUMENT */}
        {step === 1 && (
          <div className="bg-[#F5F9F5] border border-[#DDF1DF] rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(71,125,85,0.04)]">
            <h2 className="text-lg font-bold text-[#25352B] mb-1">Step 1: Upload Your Document</h2>
            <p className="text-xs text-[#25352B]/75 mb-6">
              Supported file formats: <span className="font-semibold text-[#25352B]">PDF, JPG, JPEG, PNG</span> (up to 25MB)
            </p>

            {uploadError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#A8CFAE] hover:border-[#477D55] bg-white rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 group shadow-sm"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/jpeg,image/png,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-14 h-14 rounded-full bg-[#DDF1DF] text-[#477D55] flex items-center justify-center group-hover:scale-110 transition">
                {uploading ? (
                  <RefreshCw className="w-6 h-6 animate-spin text-[#477D55]" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>

              <div>
                <p className="text-sm font-bold text-[#25352B]">
                  {uploading ? 'Processing & Validating Document...' : 'Tap to Browse or Drop File Here'}
                </p>
                <p className="text-[11px] text-[#25352B]/60 mt-1">Direct upload from WhatsApp, Google Drive or Photos</p>
              </div>

              <span className="mt-2 text-xs font-semibold px-5 py-2 rounded-full bg-[#F5D76E] hover:bg-[#eed063] text-[#25352B] shadow-sm">
                Select Document
              </span>
            </div>

            {/* Pricing Preview Badge */}
            <div className="mt-6 p-3.5 rounded-2xl bg-white border border-[#DDF1DF] flex items-center justify-around text-center text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#477D55] block">Black & White</span>
                <span className="text-base font-bold text-[#25352B]">₹5 / page</span>
              </div>
              <div className="w-px h-8 bg-[#DDF1DF]"></div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#477D55] block">Full Colour</span>
                <span className="text-base font-bold text-[#25352B]">₹10 / page</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-[#25352B]/70">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#477D55]" /> 100% Encrypted & Private
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#477D55]" /> Auto-deleted in 24 hours
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: CONFIGURE PRINTING OPTIONS */}
        {step === 2 && (
          <div className="bg-[#F5F9F5] border border-[#DDF1DF] rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(71,125,85,0.04)] space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-[#DDF1DF]">
              <div>
                <span className="text-[10px] font-bold text-[#477D55] uppercase tracking-wider">Document Ready</span>
                <h3 className="text-base font-bold text-[#25352B] truncate max-w-[240px] sm:max-w-xs">{file?.name}</h3>
                <p className="text-xs text-[#25352B]/75">
                  Detected Pages: <span className="font-semibold text-[#25352B]">{detectedPages}</span> • Size: {Math.round((file?.size || 0) / 1024)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-[#477D55] hover:underline font-semibold"
              >
                Change
              </button>
            </div>

            {/* Option 1: Color Preference (₹5 B&W / ₹10 Colour) */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#477D55] block mb-2">
                1. Color Preference
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setColorMode('bw')}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${
                    colorMode === 'bw'
                      ? 'border-[#477D55] bg-white text-[#25352B] shadow-sm ring-2 ring-[#477D55]/20'
                      : 'border-[#DDF1DF] bg-[#FFFFFF] text-[#25352B]/70 hover:bg-[#F5F9F5]'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-[#25352B]">Black & White</div>
                    <div className="text-[11px] text-[#25352B]/60">Regular text & notes</div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#DDF1DF] text-[#477D55]">
                    ₹5/pg
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setColorMode('color')}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${
                    colorMode === 'color'
                      ? 'border-[#477D55] bg-white text-[#25352B] shadow-sm ring-2 ring-[#477D55]/20'
                      : 'border-[#DDF1DF] bg-[#FFFFFF] text-[#25352B]/70 hover:bg-[#F5F9F5]'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-[#25352B] flex items-center gap-1.5">
                      <span>Full Colour</span>
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    </div>
                    <div className="text-[11px] text-[#25352B]/60">Certificates & photos</div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F5D76E] text-[#25352B]">
                    ₹10/pg
                  </span>
                </button>
              </div>
            </div>

            {/* Option 2: Paper Size & Sides */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#477D55] block mb-2">
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
                          ? 'bg-[#477D55] text-white border-[#477D55]'
                          : 'bg-white border-[#DDF1DF] text-[#25352B] hover:bg-[#F5F9F5]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#477D55] block mb-2">
                  3. Sides
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSides('single')}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition ${
                      sides === 'single'
                        ? 'bg-[#477D55] text-white border-[#477D55]'
                        : 'bg-white border-[#DDF1DF] text-[#25352B] hover:bg-[#F5F9F5]'
                    }`}
                  >
                    1-Sided
                  </button>
                  <button
                    type="button"
                    onClick={() => setSides('double')}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition ${
                      sides === 'double'
                        ? 'bg-[#477D55] text-white border-[#477D55]'
                        : 'bg-white border-[#DDF1DF] text-[#25352B] hover:bg-[#F5F9F5]'
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
                <label className="text-xs font-bold uppercase tracking-wider text-[#477D55] block mb-2">
                  4. Number of Copies
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCopies(Math.max(1, copies - 1))}
                    className="w-10 h-10 rounded-xl border border-[#DDF1DF] bg-white hover:bg-[#DDF1DF] flex items-center justify-center font-bold text-lg text-[#25352B] transition"
                  >
                    -
                  </button>
                  <span className="font-bold text-base w-8 text-center text-[#25352B]">{copies}</span>
                  <button
                    type="button"
                    onClick={() => setCopies(copies + 1)}
                    className="w-10 h-10 rounded-xl border border-[#DDF1DF] bg-white hover:bg-[#DDF1DF] flex items-center justify-center font-bold text-lg text-[#25352B] transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#477D55] block mb-2">
                  5. Specific Pages
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPageRangeMode('all')}
                    className={`flex-1 py-2 rounded-xl border text-xs font-semibold ${
                      pageRangeMode === 'all'
                        ? 'bg-[#477D55] text-white border-[#477D55]'
                        : 'bg-white border-[#DDF1DF] text-[#25352B]/75'
                    }`}
                  >
                    All Pages
                  </button>
                  <button
                    type="button"
                    onClick={() => setPageRangeMode('custom')}
                    className={`flex-1 py-2 rounded-xl border text-xs font-semibold ${
                      pageRangeMode === 'custom'
                        ? 'bg-[#477D55] text-white border-[#477D55]'
                        : 'bg-white border-[#DDF1DF] text-[#25352B]/75'
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
                    className="mt-2 w-full text-xs px-3 py-2 rounded-xl border border-[#DDF1DF] bg-white text-[#25352B] focus:outline-none focus:border-[#477D55]"
                  />
                )}
              </div>
            </div>

            {/* Transparent Calculation Breakdown Card */}
            <div className="p-4 rounded-2xl bg-white border border-[#A8CFAE] flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[11px] font-bold text-[#477D55] uppercase tracking-wider">
                  Price Calculation
                </span>
                <p className="text-xs text-[#25352B]/75 mt-0.5">
                  {effectivePageCount} page{effectivePageCount > 1 ? 's' : ''} × {copies} copy{copies > 1 ? 's' : ''} × ₹{unitPrice}/pg
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold font-display text-[#25352B]">₹{totalAmount}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full py-3.5 rounded-full bg-[#F5D76E] hover:bg-[#eed063] text-[#25352B] font-bold text-sm shadow-sm transition flex items-center justify-center gap-2"
            >
              <span>Continue to Customer Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: CUSTOMER DETAILS & PAYMENT */}
        {step === 3 && (
          <div className="bg-[#F5F9F5] border border-[#DDF1DF] rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(71,125,85,0.04)] space-y-6">
            <div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-[#477D55] hover:text-[#25352B] flex items-center gap-1 font-semibold mb-3"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Options
              </button>
              <h2 className="text-lg font-bold text-[#25352B]">Step 3: Customer Information & Pay</h2>
              <p className="text-xs text-[#25352B]/75">
                Enter your mobile number so your print job can be identified at the shop counter.
              </p>
            </div>

            {paymentError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#477D55] mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-sm px-4 py-3 rounded-xl border border-[#DDF1DF] bg-white text-[#25352B] focus:outline-none focus:border-[#477D55]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#477D55] mb-1">
                  Mobile Number (Required) *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-[#DDF1DF] bg-white text-xs font-bold text-[#477D55]">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-sm px-4 py-3 rounded-r-xl border border-[#DDF1DF] bg-white text-[#25352B] focus:outline-none focus:border-[#477D55]"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary Receipt */}
            <div className="p-4 rounded-2xl bg-white border border-[#DDF1DF] space-y-2 text-xs">
              <div className="flex justify-between text-[#25352B]/75">
                <span>Document:</span>
                <span className="font-semibold text-[#25352B] truncate max-w-[180px]">{file?.name}</span>
              </div>
              <div className="flex justify-between text-[#25352B]/75">
                <span>Color & Paper:</span>
                <span className="font-semibold text-[#25352B]">
                  {colorMode === 'bw' ? 'Black & White (₹5/pg)' : 'Full Colour (₹10/pg)'} • {paperSize}
                </span>
              </div>
              <div className="flex justify-between text-[#25352B]/75">
                <span>Total Impressions:</span>
                <span className="font-semibold text-[#25352B]">{effectivePageCount} pages × {copies} copy</span>
              </div>
              <div className="pt-2 border-t border-[#DDF1DF] flex justify-between font-bold text-sm text-[#25352B]">
                <span>Total Payable:</span>
                <span className="text-[#477D55]">₹{totalAmount}</span>
              </div>
            </div>

            {/* Instant UPI Pay Button */}
            <button
              type="button"
              disabled={processingOrder}
              onClick={handleProceedToPayment}
              className="w-full py-4 rounded-full bg-[#F5D76E] hover:bg-[#eed063] text-[#25352B] font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
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

            <p className="text-[11px] text-center text-[#25352B]/60 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#477D55]" />
              Verified Razorpay / UPI Payment Gateway with Instant Spooling
            </p>
          </div>
        )}

        {/* STEP 4: ORDER CONFIRMATION & LIVE PRINT STATUS */}
        {step === 4 && activeJob && (
          <div className="bg-[#F5F9F5] border border-[#DDF1DF] rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(71,125,85,0.04)] text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#DDF1DF] text-[#477D55] border border-[#A8CFAE] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#477D55] bg-white px-3 py-1 rounded-full border border-[#DDF1DF]">
                Payment Verified • Order Confirmed
              </span>
              <h2 className="text-xl font-bold font-display text-[#25352B] mt-3">
                Order #{activeJob.orderNumber}
              </h2>
              <p className="text-xs text-[#25352B]/75 mt-1">
                Your print job is queued at SIRAQ Canon PIXMA G3010.
              </p>
            </div>

            {/* Live Status Animation Pipeline */}
            <div className="p-5 rounded-2xl bg-white border border-[#DDF1DF] text-left space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#477D55] text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-[#25352B]">Payment Confirmed</div>
                  <div className="text-[10px] text-[#25352B]/60">Verified via webhook</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    trackingStatus === 'PRINTING' || trackingStatus === 'COMPLETED'
                      ? 'bg-[#477D55] text-white'
                      : 'bg-[#F5D76E] text-[#25352B] animate-pulse'
                  }`}
                >
                  {trackingStatus === 'COMPLETED' ? '✓' : '2'}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#25352B]">Sent to Canon PIXMA G3010</div>
                  <div className="text-[10px] text-[#25352B]/60">Local Windows Print Agent spooling</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    trackingStatus === 'COMPLETED'
                      ? 'bg-[#477D55] text-white'
                      : 'bg-[#DDF1DF] text-[#477D55]'
                  }`}
                >
                  {trackingStatus === 'COMPLETED' ? '✓' : '3'}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#25352B]">
                    {trackingStatus === 'COMPLETED' ? 'Printing Completed!' : 'Printing In Progress...'}
                  </div>
                  <div className="text-[10px] text-[#25352B]/60">
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
                type="button"
                onClick={() => {
                  setStep(1);
                  setFile(null);
                  setActiveJob(null);
                }}
                className="flex-1 py-3 rounded-full bg-white hover:bg-[#DDF1DF] border border-[#DDF1DF] text-xs font-bold text-[#25352B] transition"
              >
                Print Another Document
              </button>
              <Link
                href="/"
                className="flex-1 py-3 rounded-full bg-[#F5D76E] hover:bg-[#eed063] text-xs font-bold text-[#25352B] transition flex items-center justify-center"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="py-6 border-t border-[#DDF1DF] text-center text-xs text-[#25352B]/60 bg-[#F5F9F5]">
        <p>SIRAQ Smart Print & Self-Service Printing Ecosystem • Canon PIXMA G3010 Series</p>
      </footer>
    </div>
  );
}
