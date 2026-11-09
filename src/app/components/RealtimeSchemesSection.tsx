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

  const handleApplyWhatsApp = (scheme: SchemeScholarship) => {
    const msg = encodeURIComponent(
      `Hi SIRAQ, I would like to apply for the government scheme/scholarship: "${scheme.title}" (${scheme.department}). Please guide me with eligibility verification, document preparation, and online submission.`
    );
    window.open(`https://wa.me/918217469646?text=${msg}`, '_blank');
  };

  return (
    <section id="scholarships-schemes" className="container mx-auto px-6 py-24 border-t border-[#E5E5E7] relative bg-white">
      {/* Section Header */}
      <div className="mb-14 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#87CEEB]/15 text-[#0284C7] border border-[#87CEEB]/30 text-xs font-bold uppercase tracking-wider mb-3">
          <GraduationCap className="w-3.5 h-3.5 text-[#0284C7]" /> Realtime Digital Facilitation Desk
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D1D1F]">
          Latest Scholarships & Government Schemes
        </h2>
        <p className="mt-4 text-[#6E6E73] text-sm sm:text-base leading-relaxed">
          Search real-time active central & state government scholarships, check exact eligibility criteria, and apply with complete document assistance through SIRAQ.
        </p>
      </div>

      {/* Interactive Realtime Search & Eligibility Engine */}
      <div className="max-w-5xl mx-auto mb-10 p-6 sm:p-8 rounded-3xl border border-[#E5E5E7] bg-[#FAFAFC] shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scheme name, department, or keyword (e.g. Post-Matric, PM-Kisan)..."
              className="w-full bg-white border border-[#D1D5DB] rounded-2xl py-3 pl-11 pr-4 text-sm text-[#1D1D1F] placeholder-[#86868B] focus:border-[#FFD43B] focus:outline-none transition"
            />
          </div>
        </div>

        {/* Realtime Eligibility Matcher Bar */}
        <div className="pt-4 border-t border-[#E5E5E7]">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-[#855B00]">
            <Sparkles className="w-3.5 h-3.5" /> Realtime Eligibility Matcher
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Education Level */}
            <div>
              <label className="block text-[11px] text-[#6E6E73] mb-1 font-semibold">Education Level</label>
              <select
                value={filterEdu}
                onChange={(e) => setFilterEdu(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3 py-2 text-xs text-[#1D1D1F] focus:border-[#FFD43B] focus:outline-none"
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
              <label className="block text-[11px] text-[#6E6E73] mb-1 font-semibold">Annual Family Income</label>
              <select
                value={filterIncome}
                onChange={(e) => setFilterIncome(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3 py-2 text-xs text-[#1D1D1F] focus:border-[#FFD43B] focus:outline-none"
              >
                <option value="all">Any Annual Income</option>
                <option value="150000">Below ₹1.5 Lakh / year</option>
                <option value="250000">Below ₹2.5 Lakh / year</option>
                <option value="800000">Below ₹8 Lakh / year (EWS)</option>
              </select>
            </div>

            {/* Community / Category */}
            <div>
              <label className="block text-[11px] text-[#6E6E73] mb-1 font-semibold">Community / Category</label>
              <select
                value={filterCommunity}
                onChange={(e) => setFilterCommunity(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3 py-2 text-xs text-[#1D1D1F] focus:border-[#FFD43B] focus:outline-none"
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
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#FFD43B] text-black shadow-sm font-bold scale-105'
                : 'bg-[#FAFAFC] border border-[#E5E5E7] text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Schemes Grid */}
      <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="group rounded-3xl border border-[#E5E5E7] bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-[#D1D5DB] transition duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-[#87CEEB]/15 text-[#0284C7] text-[10px] font-bold uppercase tracking-wider">
                  {scheme.category}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    scheme.status === 'Open Now'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {scheme.status}
                </span>
              </div>

              <h3 className="text-xl font-bold font-display text-[#1D1D1F] mb-1 group-hover:text-[#0284C7] transition">
                {scheme.title}
              </h3>
              <p className="text-xs text-[#86868B] mb-3 flex items-center gap-1.5 font-medium">
                <Building className="w-3.5 h-3.5 text-[#6E6E73]" /> {scheme.department}
              </p>

              <div className="p-3.5 rounded-2xl bg-[#FFF9DB] border border-[#FDE68A] text-[#855B00] mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider block">Benefit Coverage</span>
                <span className="text-sm font-bold font-display text-[#1D1D1F]">{scheme.benefitAmount}</span>
              </div>

              <p className="text-xs text-[#6E6E73] leading-relaxed mb-4">
                {scheme.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-[#F2F2F7] flex items-center justify-between">
              <span className="text-xs text-[#86868B] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {scheme.deadline}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSchemeForDocs(scheme)}
                  className="px-3.5 py-1.5 rounded-full border border-[#E5E5E7] text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#FAFAFC]"
                >
                  Documents
                </button>
                <button
                  onClick={() => handleApplyWhatsApp(scheme)}
                  className="px-4 py-1.5 rounded-full bg-[#FFD43B] hover:bg-[#F5C724] text-black text-xs font-bold transition flex items-center gap-1 shadow-sm"
                >
                  <span>Apply</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scheme Documents Modal */}
      <AnimatePresence>
        {selectedSchemeForDocs && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#E5E5E7] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative"
            >
              <div className="flex items-start justify-between mb-4 pb-3 border-b border-[#F2F2F7]">
                <div>
                  <h3 className="text-lg font-bold font-display text-[#1D1D1F]">{selectedSchemeForDocs.title}</h3>
                  <p className="text-xs text-[#6E6E73]">{selectedSchemeForDocs.department}</p>
                </div>
                <button onClick={() => setSelectedSchemeForDocs(null)} className="p-1 text-[#86868B] hover:text-black">
                  ✕
                </button>
              </div>

              <div className="space-y-4 my-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D1D1F]">
                  Required Documents Checklist:
                </h4>
                <ul className="space-y-2">
                  {selectedSchemeForDocs.documentsRequired.map((docItem, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-[#424245]">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        ✓
                      </div>
                      <span>{docItem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3 pt-3 border-t border-[#F2F2F7]">
                <button
                  onClick={() => setSelectedSchemeForDocs(null)}
                  className="flex-1 py-2.5 rounded-full border border-[#E5E5E7] text-xs font-bold text-[#6E6E73]"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleApplyWhatsApp(selectedSchemeForDocs);
                    setSelectedSchemeForDocs(null);
                  }}
                  className="flex-1 py-2.5 rounded-full bg-[#FFD43B] text-black text-xs font-bold shadow-sm"
                >
                  Apply on WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
