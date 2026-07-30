'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ShieldCheck,
  Building2,
  BookOpen,
  GraduationCap,
  Calendar,
  PhoneCall,
  User,
  Heart,
  QrCode as QrIcon,
  AlertTriangle,
  Clock,
  Eye,
  Award,
  Sparkles,
  SearchX,
  Sun,
  Moon,
  Share2,
} from 'lucide-react';
import { Student } from '@/lib/studentTypes';
import { studentService } from '@/lib/firebase';
import { generateQRCodeDataUrl } from '@/lib/qrGenerator';

export default function StudentVerificationPage() {
  const params = useParams();
  const rawStudentId = params?.studentId as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [photoZoom, setPhotoZoom] = useState<boolean>(false);

  useEffect(() => {
    if (!rawStudentId) return;

    async function loadVerificationData() {
      setLoading(true);
      try {
        const foundStudent = await studentService.getStudentById(rawStudentId);
        if (!foundStudent) {
          setNotFound(true);
        } else {
          setStudent(foundStudent);
          // Increment scan count and record timestamp asynchronously
          studentService.recordScan(foundStudent.studentId);
          // Generate QR code for display badge
          const qrUrl = await generateQRCodeDataUrl(foundStudent.studentId);
          setQrCodeDataUrl(qrUrl);
        }
      } catch (err) {
        console.error('Error fetching verification profile:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    loadVerificationData();
  }, [rawStudentId]);

  // Check expiration
  const isExpired = React.useMemo(() => {
    if (!student?.expiryDate) return false;
    const expiry = new Date(student.expiryDate);
    const now = new Date();
    return expiry < now;
  }, [student?.expiryDate]);

  return (
    <>
      <Head>
        <title>
          {student ? `${student.name} — Verified Student Profile` : 'Student Verification — SIRAQ'}
        </title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDarkMode ? 'bg-[#06070C] text-white' : 'bg-slate-50 text-slate-900'
        }`}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 backdrop-blur-md bg-opacity-70 border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-accent to-neon flex items-center justify-center shadow-glow">
              <ShieldCheck className="w-5 h-5 text-charcoal font-bold" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-wider text-white">SIRAQ</span>
              <span className="text-[10px] uppercase tracking-widest text-slateSoft block font-semibold">
                Official Verification System
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl border transition ${
                isDarkMode
                  ? 'border-white/10 bg-white/5 hover:bg-white/10 text-accent'
                  : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700 shadow-sm'
              }`}
              title="Toggle Dark/Light Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${student?.name || 'Student'} - Verification Profile`,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Verification link copied to clipboard!');
                }
              }}
              className={`p-2 rounded-xl border transition ${
                isDarkMode
                  ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white'
                  : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700 shadow-sm'
              }`}
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Container */}
        <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
          {/* Skeleton Loading State */}
          {loading && (
            <div className="space-y-6">
              <div className="h-14 rounded-2xl bg-white/5 animate-pulse"></div>
              <div className={`p-8 rounded-3xl border ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'} space-y-6 animate-pulse`}>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-32 h-32 rounded-2xl bg-white/10"></div>
                  <div className="flex-1 space-y-3 w-full">
                    <div className="h-8 w-48 bg-white/10 rounded-lg"></div>
                    <div className="h-5 w-32 bg-white/10 rounded-lg"></div>
                    <div className="h-4 w-64 bg-white/10 rounded-lg"></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-16 rounded-xl bg-white/5"></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 404 Student Not Found State */}
          {!loading && notFound && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-8 md:p-12 rounded-3xl text-center border ${
                isDarkMode
                  ? 'bg-space/80 border-red-500/20 shadow-2xl'
                  : 'bg-white border-red-200 shadow-xl'
              }`}
            >
              <div className="w-20 h-20 mx-auto rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-6 shadow-lg">
                <SearchX className="w-10 h-10" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-red-400 mb-3">
                Student Record Not Found
              </h2>
              <p className={`text-sm md:text-base max-w-md mx-auto mb-6 ${isDarkMode ? 'text-slateSoft' : 'text-slate-600'}`}>
                The requested verification ID <span className="font-mono font-bold text-accent">&quot;{rawStudentId}&quot;</span> does not exist or has been removed from the official register.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-xs font-semibold text-red-400">
                <AlertTriangle className="w-4 h-4" /> Unverified / Invalid Credential
              </div>
            </motion.div>
          )}

          {/* Student Profile Card */}
          {!loading && student && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Verification Header Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-emerald-500/20 border border-emerald-500/40 p-6 backdrop-blur-xl shadow-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-charcoal flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                          Official Record
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                          <Sparkles className="w-3 h-3 text-emerald-300" /> SIRAQ Verified
                        </span>
                      </div>
                      <h1 className="text-xl md:text-2xl font-bold font-display text-emerald-300 tracking-wide mt-0.5">
                        ✓ VERIFIED STUDENT
                      </h1>
                    </div>
                  </div>

                  {/* Status Pill (Active / Inactive) */}
                  <div className="flex items-center gap-2">
                    {student.status === 'active' && !isExpired ? (
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 border border-emerald-500 text-emerald-400 shadow-glow">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        Active Student
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-red-500/20 border border-red-500 text-red-400">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        {isExpired ? 'Expired Student ID' : 'Inactive Student'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expiry Warning Banner if expired */}
                {isExpired && (
                  <div className="mt-4 p-3 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center gap-3 text-red-300 text-xs">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
                    <span>
                      <strong>Warning:</strong> This student ID expired on{' '}
                      {new Date(student.expiryDate!).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      .
                    </span>
                  </div>
                )}
              </div>

              {/* Main Card Container */}
              <div
                className={`rounded-3xl border p-6 md:p-8 shadow-2xl relative overflow-hidden transition-all ${
                  isDarkMode
                    ? 'bg-space/90 border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]'
                    : 'bg-white border-slate-200 shadow-xl'
                }`}
              >
                {/* Background Glass Ornaments */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-neon/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Header Profile Section */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-8 border-b border-white/10">
                  {/* Photo Container */}
                  <div className="relative group cursor-pointer" onClick={() => setPhotoZoom(true)}>
                    <div className="w-36 h-36 md:w-40 md:h-40 rounded-3xl overflow-hidden border-2 border-accent/40 shadow-glow relative bg-slate-800 flex items-center justify-center">
                      {student.photo ? (
                        <Image
                          src={student.photo}
                          alt={student.name}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <User className="w-16 h-16 text-slate-500" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs font-semibold text-white">
                        <Eye className="w-4 h-4 mr-1" /> Click to Zoom
                      </div>
                    </div>
                    {/* Badge Overlay */}
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-accent to-neon p-1.5 rounded-xl shadow-lg text-charcoal font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Student Title Details */}
                  <div className="flex-1 text-center md:text-left space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-accent/15 border border-accent/30 text-accent">
                      ID: {student.studentId}
                    </div>

                    <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-white">
                      {student.name}
                    </h2>

                    <p className="text-sm md:text-base text-slateSoft font-medium flex items-center justify-center md:justify-start gap-2">
                      <Building2 className="w-4 h-4 text-neon shrink-0" />
                      {student.institution}
                    </p>

                    <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-2 text-xs">
                      <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-medium">
                        {student.department}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-medium">
                        {student.course}
                      </span>
                    </div>
                  </div>

                  {/* QR Code Mini Badge */}
                  {qrCodeDataUrl && (
                    <div className="hidden lg:flex flex-col items-center p-3 rounded-2xl bg-white p-2 border border-white/20 shadow-md">
                      <img src={qrCodeDataUrl} alt="Student QR" className="w-24 h-24 rounded-lg" />
                      <span className="text-[10px] font-mono font-semibold text-slate-800 mt-1">
                        {student.studentId}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details Grid */}
                <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Item: Semester & Section */}
                  <div className={`p-4 rounded-2xl border transition ${isDarkMode ? 'border-white/5 bg-white/[0.03]' : 'border-slate-100 bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slateSoft font-semibold">Semester & Section</p>
                        <p className="text-sm font-semibold text-white mt-0.5">
                          {student.semester} — {student.section}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Item: Roll Number */}
                  <div className={`p-4 rounded-2xl border transition ${isDarkMode ? 'border-white/5 bg-white/[0.03]' : 'border-slate-100 bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-neon/10 text-neon">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slateSoft font-semibold">Roll Number</p>
                        <p className="text-sm font-semibold text-white font-mono mt-0.5">
                          {student.rollNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Item: Blood Group */}
                  <div className={`p-4 rounded-2xl border transition ${isDarkMode ? 'border-white/5 bg-white/[0.03]' : 'border-slate-100 bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400">
                        <Heart className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slateSoft font-semibold">Blood Group</p>
                        <p className="text-sm font-bold text-red-400 font-mono mt-0.5">
                          {student.bloodGroup}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Item: Date of Birth */}
                  {student.dob && (
                    <div className={`p-4 rounded-2xl border transition ${isDarkMode ? 'border-white/5 bg-white/[0.03]' : 'border-slate-100 bg-slate-50'}`}>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slateSoft font-semibold">Date of Birth</p>
                          <p className="text-sm font-semibold text-white mt-0.5">
                            {new Date(student.dob).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Item: Parent / Guardian Name */}
                  <div className={`p-4 rounded-2xl border transition ${isDarkMode ? 'border-white/5 bg-white/[0.03]' : 'border-slate-100 bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slateSoft font-semibold">Parent / Guardian</p>
                        <p className="text-sm font-semibold text-white mt-0.5">
                          {student.parentName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Item: Emergency Contact */}
                  <div className={`p-4 rounded-2xl border transition ${isDarkMode ? 'border-white/5 bg-white/[0.03]' : 'border-slate-100 bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <PhoneCall className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slateSoft font-semibold">Emergency Contact</p>
                        <a
                          href={`tel:${student.phone}`}
                          className="text-sm font-semibold text-emerald-400 hover:underline mt-0.5 block"
                        >
                          {student.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Item: Admission Year */}
                  <div className={`p-4 rounded-2xl border transition ${isDarkMode ? 'border-white/5 bg-white/[0.03]' : 'border-slate-100 bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slateSoft font-semibold">Admission Year</p>
                        <p className="text-sm font-semibold text-white mt-0.5">
                          {student.admissionYear}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Item: Issue & Expiry Dates */}
                  <div className={`p-4 rounded-2xl border transition ${isDarkMode ? 'border-white/5 bg-white/[0.03]' : 'border-slate-100 bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slateSoft font-semibold">Issue / Expiry Date</p>
                        <p className="text-xs font-semibold text-white mt-0.5">
                          Issued: {student.issueDate}
                          {student.expiryDate && ` | Valid Till: ${student.expiryDate}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Metadata & Badges */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slateSoft">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <QrIcon className="w-4 h-4 text-accent" /> Scan Verified
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      Total Scans: <strong className="text-white font-mono">{student.scanCount || 1}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Authentic Digital Credential
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>

        {/* Image Zoom Modal */}
        {photoZoom && student?.photo && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setPhotoZoom(false)}
          >
            <div className="relative max-w-md w-full rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-charcoal">
              <img src={student.photo} alt={student.name} className="w-full h-auto object-cover max-h-[80vh]" />
              <div className="p-4 bg-space/90 text-center">
                <p className="font-bold text-white text-lg">{student.name}</p>
                <p className="text-xs text-accent font-mono">ID: {student.studentId}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
