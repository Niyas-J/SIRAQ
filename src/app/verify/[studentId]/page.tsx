'use client';

import React, { useEffect, useState, useMemo } from 'react';
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
  Mail,
  MapPin,
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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // Apple Minimal White by default
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
          studentService.recordScan(foundStudent.studentId);
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
  const isExpired = useMemo(() => {
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
        className={`min-h-screen transition-colors duration-300 font-sans ${
          isDarkMode ? 'bg-[#0B0C10] text-slate-100' : 'bg-[#F5F5F7] text-slate-900'
        }`}
      >
        {/* Apple Style Top Navigation Bar */}
        <header
          className={`sticky top-0 z-30 backdrop-blur-xl border-b px-6 py-3.5 flex items-center justify-between transition-all ${
            isDarkMode
              ? 'bg-black/60 border-white/10'
              : 'bg-white/80 border-slate-200/80 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <span className="font-display font-semibold text-base tracking-tight text-slate-900 dark:text-white">
                SIRAQ
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 block font-medium">
                Verification Network
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full border transition ${
                isDarkMode
                  ? 'border-white/10 bg-white/5 hover:bg-white/10 text-amber-400'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm'
              }`}
              title="Toggle Light/Dark Theme"
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
              className={`p-2 rounded-full border transition ${
                isDarkMode
                  ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm'
              }`}
              title="Share Verification Profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="max-w-2xl mx-auto px-4 py-8 md:py-14">
          {/* Skeleton Loading State */}
          {loading && (
            <div className="space-y-6">
              <div className="h-16 rounded-3xl bg-slate-200/60 dark:bg-white/5 animate-pulse"></div>
              <div
                className={`p-8 rounded-[32px] border ${
                  isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'
                } space-y-6 animate-pulse shadow-sm`}
              >
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-32 h-32 rounded-3xl bg-slate-200 dark:bg-white/10"></div>
                  <div className="flex-1 space-y-3 w-full text-center sm:text-left">
                    <div className="h-8 w-48 bg-slate-200 dark:bg-white/10 rounded-xl mx-auto sm:mx-0"></div>
                    <div className="h-5 w-32 bg-slate-200 dark:bg-white/10 rounded-lg mx-auto sm:mx-0"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 404 Student Not Found */}
          {!loading && notFound && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-8 md:p-12 rounded-[32px] text-center border shadow-xl ${
                isDarkMode
                  ? 'bg-black/60 border-red-500/20 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 mb-6 shadow-sm">
                <SearchX className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-display font-semibold text-red-600 mb-2">
                Student Record Not Found
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                Verification ID <span className="font-mono font-bold text-slate-800 dark:text-white">&quot;{rawStudentId}&quot;</span> is invalid or has expired.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 bg-red-50 text-xs font-semibold text-red-600">
                <AlertTriangle className="w-4 h-4" /> Unverified Record
              </div>
            </motion.div>
          )}

          {/* Apple Style Verified Profile Card */}
          {!loading && student && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="space-y-6"
            >
              {/* Apple Clean Verification Header Pill */}
              <div
                className={`rounded-[28px] p-6 border backdrop-blur-xl shadow-sm transition-all ${
                  isDarkMode
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-white border-emerald-500/30 text-emerald-900 shadow-[0_4px_25px_rgba(16,185,129,0.08)]'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                          Official Credential
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40">
                          <Sparkles className="w-3 h-3 text-emerald-600" /> SIRAQ Verified
                        </span>
                      </div>
                      <h1 className="text-xl md:text-2xl font-bold font-display tracking-tight text-emerald-950 dark:text-emerald-300 mt-0.5">
                        ✓ VERIFIED STUDENT
                      </h1>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div>
                    {student.status === 'active' && !isExpired ? (
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Active Student
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/40">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        {isExpired ? 'Expired Student ID' : 'Inactive Student'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expiry Alert */}
                {isExpired && (
                  <div className="mt-4 p-3 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 flex items-center gap-3 text-red-700 dark:text-red-300 text-xs">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>
                      Notice: This student ID expired on{' '}
                      <strong>{new Date(student.expiryDate!).toLocaleDateString()}</strong>.
                    </span>
                  </div>
                )}
              </div>

              {/* Main Apple Clean White Profile Container */}
              <div
                className={`rounded-[32px] border p-6 md:p-8 transition-all ${
                  isDarkMode
                    ? 'bg-[#121318] border-white/10 shadow-2xl'
                    : 'bg-white border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.05)]'
                }`}
              >
                {/* Header Profile Section */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-slate-100 dark:border-white/10">
                  {/* Photo Container with Apple-like elevation */}
                  <div className="relative group cursor-pointer" onClick={() => setPhotoZoom(true)}>
                    <div className="w-32 h-32 md:w-36 md:h-36 rounded-3xl overflow-hidden border-2 border-slate-200/80 dark:border-white/20 shadow-lg relative bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {student.photo ? (
                        <Image
                          src={student.photo}
                          alt={student.name}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <User className="w-14 h-14 text-slate-400" />
                      )}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs font-medium text-white">
                        <Eye className="w-4 h-4 mr-1" /> Zoom
                      </div>
                    </div>
                  </div>

                  {/* Student Title Details */}
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10">
                      ID: {student.studentId}
                    </div>

                    <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
                      {student.name}
                    </h2>

                    {student.institution && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 font-medium flex items-center justify-center sm:justify-start gap-2">
                        <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        {student.institution}
                      </p>
                    )}

                    <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-2 text-xs">
                      {student.department && (
                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium">
                          {student.department}
                        </span>
                      )}
                      {student.course && (
                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium">
                          {student.course}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* QR Badge */}
                  {qrCodeDataUrl && (
                    <div className="hidden sm:flex flex-col items-center p-2 rounded-2xl bg-white border border-slate-200 shadow-sm shrink-0">
                      <img src={qrCodeDataUrl} alt="QR Badge" className="w-20 h-20 rounded-lg" />
                      <span className="text-[10px] font-mono text-slate-500 mt-1">Scan Verified</span>
                    </div>
                  )}
                </div>

                {/* Conditional Slots Grid - ONLY SHOW FILLED SLOTS */}
                <div className="py-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Semester & Section */}
                  {(student.semester || student.section) && (
                    <div className={`p-4 rounded-2xl border transition ${isDarkMode ? 'border-white/5 bg-white/[0.03]' : 'border-slate-100 bg-slate-50/80'}`}>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Semester / Section</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                            {[student.semester, student.section].filter(Boolean).join(' — ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Roll Number */}
                  {student.rollNumber && (
                    <div className={`p-4 rounded-2xl border transition ${isDarkMode ? 'border-white/5 bg-white/[0.03]' : 'border-slate-100 bg-slate-50/80'}`}>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Roll Number</p>
                          <p className="text-sm font-semibold font-mono text-slate-900 dark:text-white mt-0.5">
                            {student.rollNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Blood Group */}
                  {student.bloodGroup && (
                    <div className={`p-4 rounded-2xl border transition ${isDarkMode ? 'border-white/5 bg-white/[0.03]' : 'border-slate-100 bg-slate-50/80'}`}>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
                          <Heart className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Blood Group</p>
                          <p className="text-sm font-bold text-rose-600 dark:text-rose-400 font-mono mt-0.5">
                            {student.bloodGroup}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Date of Birth */}
                  {student.dob && (
                    <div className={`p-4 rounded-2xl border transition ${isDarkMode ? 'border-white/5 bg-white/[0.03]' : 'border-slate-100 bg-slate-50/80'}`}>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Date of Birth</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                            {new Date(student.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Parent / Guardian */}
                  {student.parentName && (
                    <div className={`p-4 rounded-2xl border transition ${isDarkMode ? 'border-white/5 bg-white/[0.03]' : 'border-slate-100 bg-slate-50/80'}`}>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Parent / Guardian</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                            {student.parentName}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {student.phone && (
                    <div className={`p-4 rounded-2xl border transition ${isDarkMode ? 'border-white/5 bg-white/[0.03]' : 'border-slate-100 bg-slate-50/80'}`}>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400">
                          <PhoneCall className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Contact Phone</p>
                          <a href={`tel:${student.phone}`} className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mt-0.5 block">
                            {student.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {student.email && (
                    <div className={`p-4 rounded-2xl border transition ${isDarkMode ? 'border-white/5 bg-white/[0.03]' : 'border-slate-100 bg-slate-50/80'}`}>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Email Address</p>
                          <a href={`mailto:${student.email}`} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mt-0.5 block line-clamp-1">
                            {student.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Admission Year */}
                  {student.admissionYear && (
                    <div className={`p-4 rounded-2xl border transition ${isDarkMode ? 'border-white/5 bg-white/[0.03]' : 'border-slate-100 bg-slate-50/80'}`}>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Admission Year</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                            {student.admissionYear}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Issue / Expiry Dates */}
                  {(student.issueDate || student.expiryDate) && (
                    <div className={`p-4 rounded-2xl border transition ${isDarkMode ? 'border-white/5 bg-white/[0.03]' : 'border-slate-100 bg-slate-50/80'}`}>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Validity Dates</p>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5">
                            {student.issueDate && `Issued: ${student.issueDate}`}
                            {student.expiryDate && ` | Valid: ${student.expiryDate}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Address */}
                  {student.address && (
                    <div className={`p-4 rounded-2xl border transition sm:col-span-2 ${isDarkMode ? 'border-white/5 bg-white/[0.03]' : 'border-slate-100 bg-slate-50/80'}`}>
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-slate-200/60 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Address</p>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed">
                            {student.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Metadata */}
                <div className="pt-6 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 font-medium">
                      <QrIcon className="w-4 h-4 text-emerald-600" /> Digital Scan Verified
                    </span>
                    <span>•</span>
                    <span>
                      Scans: <strong className="text-slate-800 dark:text-white font-mono">{student.scanCount || 1}</strong>
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-200 dark:border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" /> SIRAQ Verified Credential
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </main>

        {/* Photo Zoom Modal */}
        {photoZoom && student?.photo && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setPhotoZoom(false)}
          >
            <div className="relative max-w-sm w-full rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-white text-slate-900 text-center">
              <img src={student.photo} alt={student.name} className="w-full h-auto object-cover max-h-[80vh]" />
              <div className="p-4 bg-white">
                <p className="font-bold text-slate-900 text-base">{student.name}</p>
                <p className="text-xs font-mono text-emerald-600">ID: {student.studentId}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
