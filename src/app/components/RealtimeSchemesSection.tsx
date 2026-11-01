'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Building,
  ArrowRight,
  Sparkles,
  Info,
  ExternalLink,
  Users,
  AlertCircle
} from 'lucide-react';
import { SCHEMES_AND_SCHOLARSHIPS, SchemeScholarship } from '@/lib/servicesData';

export default function RealtimeSchemesSection() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterEdu, setFilterEdu] = useState<string>('all');
  const [filterIncome, setFilterIncome] = useState<string>('all');
  const [filterCommunity, setFilterCommunity] = useState<string>('all');
  const [selectedSchemeForDocs, setSelectedSchemeForDocs] = useState<SchemeScholarship | null>(null);

  // Category Tabs
  const categories = [
    { id: 'all', label: 'All Schemes & Aid' },
    { id: 'Scholarship', label: '🎓 Scholarships' },
    { id: 'Minority & Girls', label: '👩‍🎓 Minority & Girls' },
    { id: 'Farmers & Artisans', label: '🌾 Farmers & Artisans' },
    { id: 'Healthcare', label: '🏥 Healthcare' },
    { id: 'Welfare', label: '🛡️ Social Welfare' },
  ];

  // Real-time Filtering & Matching
  const filteredSchemes = useMemo(() => {
    return SCHEMES_AND_SCHOLARSHIPS.filter((item) => {
      // Search text match
      const term = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.department.toLowerCase().includes(term) ||
        item.summary.toLowerCase().includes(term);

      // Category match
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      // Education match
      const matchesEdu =
        filterEdu === 'all' ||
        item.eligibility.educationLevels.includes(filterEdu as any);

      // Income match
      let matchesIncome = true;
      if (filterIncome !== 'all' && item.eligibility.maxAnnualIncome) {
        const incomeLimit = parseInt(filterIncome, 10);
        matchesIncome = incomeLimit <= item.eligibility.maxAnnualIncome;
      }

      // Community match
      const matchesCommunity =
        filterCommunity === 'all' ||
        item.eligibility.communities.includes(filterCommunity as any);

      return matchesSearch && matchesCategory && matchesEdu && matchesIncome && matchesCommunity;
    });
  }, [searchQuery, selectedCategory, filterEdu, filterIncome, filterCommunity]);

  // Check if current scheme is a direct match for the active filters
  const isDirectMatch = (scheme: SchemeScholarship) => {
    const hasActiveFilters = filterEdu !== 'all' || filterIncome !== 'all' || filterCommunity !== 'all';
    return hasActiveFilters;
  };

  const handleApplyWhatsApp = (scheme: SchemeScholarship) => {
    const msg = encodeURIComponent(
      `Hi SIRAQ, I would like to apply for the government scheme/scholarship: "${scheme.title}" (${scheme.department}). Please guide me with eligibility verification, document preparation, and online submission.`
    );
    window.open(`https://wa.me/918217469646?text=${msg}`, '_blank');
  };

  return (
    <section id="scholarships-schemes" className="container mx-auto px-6 py-20 border-t border-white/10 relative">
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Section Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/30 text-xs font-semibold uppercase tracking-wider mb-3">
          <GraduationCap className="w-3.5 h-3.5" /> Realtime Digital Facilitation Desk
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Latest Scholarships & Government Schemes
        </h2>
        <p className="mt-4 text-slateSoft text-sm sm:text-base leading-relaxed">
          Search real-time active central & state government scholarships, check exact eligibility criteria, and apply with complete document assistance through SIRAQ.
        </p>
      </div>

      {/* Interactive Realtime Search & Eligibility Engine */}
      <div className="max-w-5xl mx-auto mb-10 p-6 sm:p-8 rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-2xl shadow-glass">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slateSoft" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scheme name, department, or keyword (e.g. Post-Matric, PM-Kisan)..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-slateSoft focus:border-neon focus:outline-none transition"
            />
          </div>
        </div>

        {/* Realtime Eligibility Matcher Bar */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-accent">
            <Sparkles className="w-3.5 h-3.5" /> Realtime Eligibility Matcher
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Education Level */}
            <div>
              <label className="block text-[11px] text-slateSoft mb-1 font-medium">Education Level</label>
              <select
                value={filterEdu}
                onChange={(e) => setFilterEdu(e.target.value)}
                className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-neon focus:outline-none"
              >
                <option value="all">All Education Levels</option>
                <option value="School (1-10)">School (Class 1-10)</option>
                <option value="Higher Secondary (11-12)">Higher Secondary (11-12)</option>
                <option value="Undergraduate">Undergraduate / College</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Professional Course">Professional (BTech/MBBS/Law)</option>
                <option value="General Citizen / Farmer">General Citizen / Farmer</option>
              </select>
            </div>

            {/* Annual Income */}
            <div>
              <label className="block text-[11px] text-slateSoft mb-1 font-medium">Annual Family Income</label>
              <select
                value={filterIncome}
                onChange={(e) => setFilterIncome(e.target.value)}
                className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-neon focus:outline-none"
              >
                <option value="all">Any Annual Income</option>
                <option value="150000">Below ₹1.5 Lakh / year</option>
                <option value="250000">Below ₹2.5 Lakh / year</option>
                <option value="800000">Below ₹8 Lakh / year (EWS)</option>
              </select>
            </div>

            {/* Community / Category */}
            <div>
              <label className="block text-[11px] text-slateSoft mb-1 font-medium">Community / Category</label>
              <select
                value={filterCommunity}
                onChange={(e) => setFilterCommunity(e.target.value)}
                className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-neon focus:outline-none"
              >
                <option value="all">All Communities</option>
                <option value="Minority">Minority (Muslim, Christian, etc.)</option>
                <option value="OBC">OBC / MBC</option>
                <option value="SC">SC / ST</option>
                <option value="General">General / Open Category</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-accent to-neon text-charcoal font-bold shadow-glow scale-105'
                : 'bg-white/5 border border-white/10 text-slateSoft hover:text-white hover:bg-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results Count & Match Indicator */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between text-xs text-slateSoft px-2">
        <span>Showing <strong>{filteredSchemes.length}</strong> active schemes and scholarships</span>
        {(filterEdu !== 'all' || filterIncome !== 'all' || filterCommunity !== 'all') && (
          <button
            onClick={() => {
              setFilterEdu('all');
              setFilterIncome('all');
              setFilterCommunity('all');
            }}
            className="text-neon hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Schemes Grid */}
      <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
        {filteredSchemes.map((scheme) => {
          const eligibleMatch = isDirectMatch(scheme);

          return (
            <div
              key={scheme.id}
              className={`rounded-3xl border transition-all duration-300 p-7 backdrop-blur-xl relative flex flex-col justify-between ${
                eligibleMatch
                  ? 'border-emerald-500/50 bg-gradient-to-b from-emerald-950/25 via-white/[0.03] to-transparent shadow-[0_15px_40px_rgba(16,185,129,0.15)]'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20'
              }`}
            >
              <div>
                {/* Status Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-mono text-slateSoft uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-neon" /> {scheme.department}
                  </span>
                  <div className="flex items-center gap-2">
                    {eligibleMatch && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Eligible Match
                      </span>
                    )}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        scheme.status === 'Closing Soon'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {scheme.status}
                    </span>
                  </div>
                </div>

                {/* Scheme Title */}
                <h3 className="text-xl font-bold font-display text-white mb-2 leading-snug">
                  {scheme.title}
                </h3>

                {/* Benefit Amount Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/30 text-accent font-semibold text-xs mb-4">
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>Benefit: <strong>{scheme.benefitAmount}</strong></span>
                </div>

                <p className="text-xs text-slateSoft leading-relaxed mb-6">
                  {scheme.summary}
                </p>

                {/* Eligibility Specs Matrix */}
                <div className="space-y-2 py-3 border-t border-b border-white/10 mb-5 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slateSoft">Education Level:</span>
                    <span className="font-semibold text-right max-w-[60%] truncate">
                      {scheme.eligibility.educationLevels.join(', ')}
                    </span>
                  </div>
                  {scheme.eligibility.maxAnnualIncome && (
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="text-slateSoft">Max Family Income:</span>
                      <span className="font-semibold text-amber-300">
                        ₹{(scheme.eligibility.maxAnnualIncome / 100000).toFixed(1)} Lakhs / year
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slateSoft">Communities Covered:</span>
                    <span className="font-semibold">
                      {scheme.eligibility.communities.join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slateSoft flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-neon" /> Application Deadline:
                    </span>
                    <span className="font-semibold text-neon">{scheme.deadline}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setSelectedSchemeForDocs(scheme)}
                  className="py-2.5 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition"
                >
                  Required Docs
                </button>
                <button
                  onClick={() => handleApplyWhatsApp(scheme)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-accent to-neon text-charcoal font-bold text-xs transition hover:brightness-110 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Apply via SIRAQ Desk <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="text-center py-12 text-slateSoft max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 mx-auto text-accent mb-3" />
          <p className="text-base font-semibold text-white mb-1">No matching schemes found</p>
          <p className="text-xs">Try broadening your income, education, or community filters to view more central & state opportunities.</p>
        </div>
      )}

      {/* Required Documents Modal */}
      <AnimatePresence>
        {selectedSchemeForDocs && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-[#0e1017] border border-white/20 rounded-3xl p-6 text-white shadow-2xl relative"
            >
              <div className="flex items-start justify-between pb-4 border-b border-white/10">
                <div>
                  <h4 className="font-bold text-base text-white">{selectedSchemeForDocs.title}</h4>
                  <p className="text-xs text-accent mt-0.5">{selectedSchemeForDocs.benefitAmount}</p>
                </div>
                <button
                  onClick={() => setSelectedSchemeForDocs(null)}
                  className="p-1 rounded-full hover:bg-white/10 text-slateSoft hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="py-5 space-y-3">
                <p className="text-xs text-slateSoft font-semibold uppercase tracking-wider">
                  Mandatory Documents for SIRAQ Online Submission:
                </p>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {selectedSchemeForDocs.documentsRequired.map((doc, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        ✓
                      </span>
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slateSoft/80 pt-2">
                  💡 Bring original documents or soft copies to SIRAQ Studio for scanning, photo resizing, and error-free submission.
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                <button
                  onClick={() => setSelectedSchemeForDocs(null)}
                  className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleApplyWhatsApp(selectedSchemeForDocs);
                    setSelectedSchemeForDocs(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-accent to-neon text-charcoal font-bold text-xs flex items-center justify-center gap-1.5 shadow-glow"
                >
                  Submit with SIRAQ on WhatsApp <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
