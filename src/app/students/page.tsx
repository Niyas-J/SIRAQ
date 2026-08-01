'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  UserCheck,
  ShieldCheck,
  Building2,
  GraduationCap,
  QrCode as QrIcon,
  ExternalLink,
  Download,
  Check,
  Filter,
  RefreshCw,
  ArrowLeft,
  Lock,
  UserX,
  CreditCard,
  Hash,
  School,
  Share2,
} from 'lucide-react';
import { Student } from '@/lib/studentTypes';
import { studentService } from '@/lib/firebase';
import { sampleStudents } from '@/lib/sampleStudents';
import { generateQRCodeDataUrl, downloadQRCodePNG } from '@/lib/qrGenerator';

export default function StudentsPortalPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [qrCodeUrls, setQrCodeUrls] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lookupIdInput, setLookupIdInput] = useState<string>('');
  const [directLookupResult, setDirectLookupResult] = useState<Student | null | 'not_found'>(null);
  const [isSearchingLookup, setIsSearchingLookup] = useState<boolean>(false);

  // Load students on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await studentService.getAllStudents();
        if (data && data.length > 0) {
          setStudents(data);
        } else {
          setStudents(sampleStudents);
        }
      } catch (err) {
        console.error('Error fetching students:', err);
        setStudents(sampleStudents);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Pre-generate QR codes for students
  useEffect(() => {
    async function generateQRs() {
      const urls: Record<string, string> = {};
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://siraq.vercel.app';
      for (const s of students) {
        const verifyUrl = `${origin}/verify/${encodeURIComponent(s.studentId)}`;
        try {
          urls[s.studentId] = await generateQRCodeDataUrl(verifyUrl);
        } catch (e) {
          console.error('QR generation error for student:', s.studentId, e);
        }
      }
      setQrCodeUrls(urls);
    }
    if (students.length > 0) {
      generateQRs();
    }
  }, [students]);

  // Unique departments and institutions for filter dropdowns
  const departments = useMemo(() => {
    const list = Array.from(new Set(students.map((s) => s.department).filter(Boolean)));
    return list.sort();
  }, [students]);

  const institutions = useMemo(() => {
    const list = Array.from(new Set(students.map((s) => s.institution).filter(Boolean)));
    return list.sort();
  }, [students]);

  // Filtered Students List
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        s.name.toLowerCase().includes(term) ||
        s.studentId.toLowerCase().includes(term) ||
        (s.rollNumber && s.rollNumber.toLowerCase().includes(term)) ||
        (s.department && s.department.toLowerCase().includes(term)) ||
        (s.institution && s.institution.toLowerCase().includes(term));

      const matchesDept = selectedDept === 'all' || s.department === selectedDept;
      const matchesInst = selectedInstitution === 'all' || s.institution === selectedInstitution;
      const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;

      return matchesSearch && matchesDept && matchesInst && matchesStatus;
    });
  }, [students, searchTerm, selectedDept, selectedInstitution, selectedStatus]);

  // Quick Direct ID Lookup
  const handleDirectLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupIdInput.trim()) return;
    setIsSearchingLookup(true);
    setDirectLookupResult(null);

    const queryId = lookupIdInput.trim().toUpperCase();
    try {
      const found = await studentService.getStudentById(queryId);
      if (found) {
        setDirectLookupResult(found);
      } else {
        const localMatch = students.find((s) => s.studentId.toUpperCase() === queryId);
        setDirectLookupResult(localMatch || 'not_found');
      }
    } catch {
      const localMatch = students.find((s) => s.studentId.toUpperCase() === queryId);
      setDirectLookupResult(localMatch || 'not_found');
    } finally {
      setIsSearchingLookup(false);
    }
  };

  const copyShareLink = (studentId: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://siraq.vercel.app';
    const link = `${origin}/verify/${encodeURIComponent(studentId)}`;
    navigator.clipboard.writeText(link);
    setCopiedId(studentId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadQR = (studentId: string, studentName: string) => {
    const qrDataUrl = qrCodeUrls[studentId];
    if (qrDataUrl) {
      downloadQRCodePNG(qrDataUrl, `${studentId}_${studentName.replace(/\s+/g, '_')}_QR.png`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f17] text-white selection:bg-accent selection:text-black">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0d0f17]/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-bold tracking-wider font-display text-white hover:text-cyan-400 transition"
            >
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500 bg-clip-text text-transparent">
                SIRAQ
              </span>
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                STUDENTS
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-2 text-xs font-semibold text-black bg-gradient-to-r from-cyan-400 to-teal-300 hover:brightness-110 px-4 py-2 rounded-lg shadow-lg shadow-cyan-500/20 transition"
            >
              <Lock className="w-3.5 h-3.5" /> Admin Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header Banner */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-cyan-950/40 via-transparent to-transparent py-14 px-6">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Digital ID Registry
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display mb-4">
              Student Directory & Verification Portal
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
              Search active student records, view digital ID credentials, scan QR codes, and verify official institutional credentials issued by SIRAQ.
            </p>
          </motion.div>

          {/* Quick Direct ID Search Box */}
          <div className="mt-8 max-w-xl mx-auto">
            <form onSubmit={handleDirectLookup} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={lookupIdInput}
                  onChange={(e) => setLookupIdInput(e.target.value)}
                  placeholder="Enter Student ID (e.g. ST202600001)..."
                  className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
                />
              </div>
              <button
                type="submit"
                disabled={isSearchingLookup}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm transition disabled:opacity-50"
              >
                {isSearchingLookup ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" /> Verify ID
                  </>
                )}
              </button>
            </form>

            {/* Direct Lookup Result Modal/Card */}
            {directLookupResult && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-2xl text-left">
                {directLookupResult === 'not_found' ? (
                  <div className="flex items-center gap-3 text-rose-400 text-sm">
                    <UserX className="w-5 h-5 flex-shrink-0" />
                    <span>No student record found for ID: <strong>{lookupIdInput}</strong></span>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={directLookupResult.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={directLookupResult.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-base">{directLookupResult.name}</h4>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-semibold ${
                              directLookupResult.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {directLookupResult.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{directLookupResult.studentId} • {directLookupResult.department}</p>
                        <p className="text-xs text-slate-500">{directLookupResult.institution}</p>
                      </div>
                    </div>
                    <Link
                      href={`/verify/${encodeURIComponent(directLookupResult.studentId)}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-500/30 transition self-end sm:self-auto"
                    >
                      View Verified Card <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Directory Content Section */}
      <main className="container mx-auto px-6 py-10 max-w-7xl">
        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-medium">Total Registered</p>
                <p className="text-xl font-bold text-white">{students.length}</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-medium">Active Cards</p>
                <p className="text-xl font-bold text-white">
                  {students.filter((s) => s.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-medium">Institutions</p>
                <p className="text-xl font-bold text-white">{institutions.length || 1}</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <QrIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-medium">QR Verification</p>
                <p className="text-xl font-bold text-white">Live 24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 mb-8 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search students by name, ID, roll number, department..."
                className="w-full bg-slate-950 border border-slate-700/80 focus:border-cyan-400 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none transition"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-900 text-white">All Departments</option>
                  {departments.map((d) => (
                    <option key={d} value={d} className="bg-slate-900 text-white">
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2">
                <School className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedInstitution}
                  onChange={(e) => setSelectedInstitution(e.target.value)}
                  className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-900 text-white">All Institutions</option>
                  {institutions.map((inst) => (
                    <option key={inst} value={inst} className="bg-slate-900 text-white">
                      {inst}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-900 text-white">All Statuses</option>
                  <option value="active" className="bg-slate-900 text-white">Active Only</option>
                  <option value="inactive" className="bg-slate-900 text-white">Inactive Only</option>
                </select>
              </div>

              {(searchTerm || selectedDept !== 'all' || selectedInstitution !== 'all' || selectedStatus !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDept('all');
                    setSelectedInstitution('all');
                    setSelectedStatus('all');
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 underline font-medium ml-1"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Loading Student Directory...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-16 text-center p-8 rounded-3xl bg-slate-900/50 border border-slate-800 max-w-md mx-auto">
            <UserX className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">No Students Found</h3>
            <p className="text-slate-400 text-xs mb-4">
              No student records match your current search criteria. Try modifying your filters or clear the search.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDept('all');
                setSelectedInstitution('all');
                setSelectedStatus('all');
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-500/30 transition"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          /* Student Card Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredStudents.map((student, idx) => {
                const qrUrl = qrCodeUrls[student.studentId];
                return (
                  <motion.div
                    key={student.studentId || idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    className="group relative flex flex-col justify-between rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-cyan-500/40 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10"
                  >
                    <div>
                      {/* Top Header Card Info */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700 group-hover:border-cyan-400/50 transition">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={student.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                              alt={student.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition line-clamp-1">
                              {student.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                {student.studentId}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Active/Inactive Status Badge */}
                        <span
                          className={`text-[10px] px-2.5 py-1 rounded-full uppercase font-bold tracking-wider flex items-center gap-1 ${
                            student.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              student.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                            }`}
                          ></span>
                          {student.status}
                        </span>
                      </div>

                      {/* Student Details List */}
                      <div className="space-y-2 text-xs text-slate-300 mb-5 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
                        <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
                          <span className="text-slate-500">Institution:</span>
                          <span className="font-medium text-slate-200 text-right truncate max-w-[180px]">
                            {student.institution}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
                          <span className="text-slate-500">Department:</span>
                          <span className="font-medium text-slate-200 text-right truncate max-w-[180px]">
                            {student.department}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
                          <span className="text-slate-500">Course / Sem:</span>
                          <span className="font-medium text-slate-200">
                            {student.course} {student.semester ? `(${student.semester})` : ''}
                          </span>
                        </div>
                        {student.rollNumber && (
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Roll No:</span>
                            <span className="font-mono text-cyan-400">{student.rollNumber}</span>
                          </div>
                        )}
                      </div>

                      {/* QR Preview & Quick Info */}
                      <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 mb-5">
                        <div className="flex items-center gap-3">
                          {qrUrl ? (
                            <div className="w-12 h-12 p-1 bg-white rounded-xl flex-shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={qrUrl} alt="QR Code" className="w-full h-full" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                              <QrIcon className="w-6 h-6" />
                            </div>
                          )}
                          <div>
                            <p className="text-[11px] font-semibold text-slate-200">Digital QR Verification</p>
                            <p className="text-[10px] text-slate-400">Scan to verify authentic student record</p>
                          </div>
                        </div>

                        {qrUrl && (
                          <button
                            onClick={() => handleDownloadQR(student.studentId, student.name)}
                            title="Download QR Code"
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Footer Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => copyShareLink(student.studentId)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700 transition"
                      >
                        {copiedId === student.studentId ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Link
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" /> Share Link
                          </>
                        )}
                      </button>

                      <Link
                        href={`/verify/${encodeURIComponent(student.studentId)}`}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition shadow-md shadow-cyan-500/20"
                      >
                        <CreditCard className="w-3.5 h-3.5" /> View Card
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950 py-8 px-6 mt-16 text-center text-xs text-slate-500">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SIRAQ Print & Digital ID Systems. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-300 transition">
              Home
            </Link>
            <Link href="/students" className="text-cyan-400 hover:text-cyan-300 transition font-semibold">
              Students Portal
            </Link>
            <Link href="/admin" className="hover:text-slate-300 transition">
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
