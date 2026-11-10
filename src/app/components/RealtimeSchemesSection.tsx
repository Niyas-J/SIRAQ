'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Calendar,
  Building,
  ArrowRight,
  ExternalLink,
  Send,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Phone,
  Globe,
  User,
} from 'lucide-react';
import { SCHEMES_AND_SCHOLARSHIPS, SchemeScholarship } from '@/lib/servicesData';

export default function RealtimeSchemesSection() {
  const [selectedSchemeForDocs, setSelectedSchemeForDocs] = useState<SchemeScholarship | null>(null);

  // Other scholarship assistance form state
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [scholarshipName, setScholarshipName] = useState('');
  const [scholarshipWebsite, setScholarshipWebsite] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const handleApplyWhatsApp = (scheme: SchemeScholarship) => {
    const msg = encodeURIComponent(
      `Hi SIRAQ, I want assistance to apply for: "${scheme.title}" (${scheme.department}). Please guide me with eligibility criteria, document checklist, and submission.`
    );
    window.open(`https://wa.me/918217469646?text=${msg}`, '_blank');
  };

  const handleAssistanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!studentName.trim() || !phone.trim() || !scholarshipName.trim()) {
      setFormError('Please enter student name, phone number, and scholarship name.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: studentName.trim(),
          phone: phone.trim(),
          scholarshipName: scholarshipName.trim(),
          scholarshipWebsite: scholarshipWebsite.trim(),
          additionalInfo: additionalInfo.trim(),
          type: 'SCHOLARSHIP',
          serviceOrProduct: `Scholarship: ${scholarshipName.trim()}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit enquiry');
      }

      setSubmitSuccess(true);
      // Also open WhatsApp prefilled
      const waMsg = encodeURIComponent(
        `Hi SIRAQ, I need assistance for Scholarship application.\n\n*Student Name:* ${studentName.trim()}\n*Phone:* ${phone.trim()}\n*Scholarship:* ${scholarshipName.trim()}${scholarshipWebsite ? `\n*Website:* ${scholarshipWebsite.trim()}` : ''}${additionalInfo ? `\n*Details:* ${additionalInfo.trim()}` : ''}`
      );
      window.open(`https://wa.me/918217469646?text=${waMsg}`, '_blank');

      // Reset form
      setStudentName('');
      setPhone('');
      setScholarshipName('');
      setScholarshipWebsite('');
      setAdditionalInfo('');
    } catch (err: any) {
      setFormError(err.message || 'Something went wrong. Please try again or message us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="scholarships-schemes" className="container mx-auto px-6 py-24 border-t border-[#DDF1DF] bg-[#FFFFFF] relative">
      {/* Section Header */}
      <div className="mb-14 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDF1DF] text-[#477D55] border border-[#A8CFAE] text-xs font-bold uppercase tracking-wider mb-3">
          <GraduationCap className="w-4 h-4 text-[#477D55]" /> Student Scholarship Portal
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#25352B]">
          Scholarships & Financial Assistance
        </h2>
        <p className="mt-4 text-[#477D55]/85 text-sm sm:text-base leading-relaxed">
          Official scholarship application facilitation at SIRAQ. We handle registration, e-attestation, document scanning, and status tracking for central and state portals.
        </p>
      </div>

      {/* Exactly the 2 Approved Scholarships: SSP and NSP */}
      <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto mb-16">
        {SCHEMES_AND_SCHOLARSHIPS.map((scheme, idx) => (
          <div
            key={scheme.id}
            className="group rounded-3xl border border-[#DDF1DF] bg-[#F5F9F5] p-7 sm:p-8 shadow-[0_4px_20px_rgba(71,125,85,0.04)] hover:shadow-[0_12px_32px_rgba(71,125,85,0.08)] hover:border-[#A8CFAE] transition duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-[#FFFFFF] text-[#477D55] border border-[#DDF1DF] text-[11px] font-bold uppercase tracking-wider shadow-sm">
                  {idx === 0 ? 'Karnataka State Portal' : 'Central Government Portal'}
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#DDF1DF] text-[#477D55] border border-[#A8CFAE]">
                  {scheme.status}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-display text-[#25352B] mb-1 group-hover:text-[#477D55] transition">
                {scheme.title}
              </h3>
              <p className="text-xs text-[#25352B]/70 mb-4 flex items-center gap-1.5 font-medium">
                <Building className="w-3.5 h-3.5 text-[#477D55]" /> {scheme.department}
              </p>

              {/* Benefit Highlight Card */}
              <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#DDF1DF] text-[#25352B] mb-5 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider block text-[#477D55]">Benefit Coverage</span>
                <span className="text-sm sm:text-base font-bold font-display text-[#25352B]">{scheme.benefitAmount}</span>
              </div>

              <p className="text-xs sm:text-sm text-[#25352B]/80 leading-relaxed mb-5">
                {scheme.summary}
              </p>

              {/* Key Features List */}
              <div className="space-y-1.5 mb-6">
                {scheme.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-xs text-[#25352B]/85">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#477D55] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#DDF1DF] flex items-center justify-between gap-3">
              <span className="text-xs text-[#25352B]/60 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#477D55]" /> {scheme.deadline}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSchemeForDocs(scheme)}
                  className="px-3.5 py-2 rounded-full border border-[#A8CFAE] bg-white text-xs font-semibold text-[#25352B] hover:bg-[#DDF1DF] transition"
                >
                  Documents
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyWhatsApp(scheme)}
                  className="px-4 py-2 rounded-full bg-[#F5D76E] hover:bg-[#eed063] text-[#25352B] text-xs font-bold transition flex items-center gap-1 shadow-sm"
                >
                  <span>Apply with SIRAQ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* OTHER SCHOLARSHIP ASSISTANCE INTERACTIVE FORM */}
      <div className="max-w-4xl mx-auto rounded-3xl border border-[#A8CFAE] bg-[#F5F9F5] p-8 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#DDF1DF]/60 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#DDF1DF]">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] text-[#477D55] border border-[#A8CFAE] text-xs font-bold uppercase tracking-wider mb-2">
                <HelpCircle className="w-3.5 h-3.5 text-[#477D55]" /> Need Help With Another Scholarship?
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#25352B]">
                OTHER SCHOLARSHIP ASSISTANCE
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-[#25352B]/80 max-w-xl">
                Applying for private trust, corporate, minority or university scholarships? Submit your details below. Our team verifies eligibility and processes your application.
              </p>
            </div>
            <div className="shrink-0">
              <span className="px-3.5 py-1.5 rounded-full bg-[#B9DDF2] text-[#1E3A8A] text-xs font-bold border border-[#93C5FD]">
                Direct Desk Support
              </span>
            </div>
          </div>

          {submitSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-white border border-[#A8CFAE] text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#DDF1DF] text-[#477D55] flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                ✓
              </div>
              <h4 className="text-lg font-bold text-[#25352B]">Assistance Request Submitted!</h4>
              <p className="text-xs sm:text-sm text-[#25352B]/75 mt-1 max-w-md mx-auto">
                Your request has been logged in our system and forwarded to the SIRAQ front desk. We will contact you or review your documents shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitSuccess(false)}
                className="mt-4 px-5 py-2 rounded-full bg-[#F5D76E] text-[#25352B] text-xs font-bold hover:bg-[#eed063] transition shadow-sm"
              >
                Submit Another Request
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleAssistanceSubmit} className="space-y-4">
              {formError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Student Name */}
                <div>
                  <label className="block text-xs font-bold text-[#25352B] mb-1.5">
                    Student Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#477D55]/60" />
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Rahul Patil / Ayesha Siddiqa"
                      className="w-full bg-white border border-[#DDF1DF] rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-[#25352B] placeholder-[#25352B]/40 focus:border-[#477D55] focus:outline-none transition shadow-sm"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-[#25352B] mb-1.5">
                    Phone Number (WhatsApp) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#477D55]/60" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-white border border-[#DDF1DF] rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-[#25352B] placeholder-[#25352B]/40 focus:border-[#477D55] focus:outline-none transition shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Scholarship Name */}
                <div>
                  <label className="block text-xs font-bold text-[#25352B] mb-1.5">
                    Scholarship Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#477D55]/60" />
                    <input
                      type="text"
                      required
                      value={scholarshipName}
                      onChange={(e) => setScholarshipName(e.target.value)}
                      placeholder="e.g. Jindal Scholarship / Vidyasaarathi / HDFC Badhte Kadam"
                      className="w-full bg-white border border-[#DDF1DF] rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-[#25352B] placeholder-[#25352B]/40 focus:border-[#477D55] focus:outline-none transition shadow-sm"
                    />
                  </div>
                </div>

                {/* Scholarship Website */}
                <div>
                  <label className="block text-xs font-bold text-[#25352B] mb-1.5">
                    Scholarship Website (Optional)
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#477D55]/60" />
                    <input
                      type="url"
                      value={scholarshipWebsite}
                      onChange={(e) => setScholarshipWebsite(e.target.value)}
                      placeholder="e.g. https://www.sitaramjindalfoundation.org"
                      className="w-full bg-white border border-[#DDF1DF] rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-[#25352B] placeholder-[#25352B]/40 focus:border-[#477D55] focus:outline-none transition shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <label className="block text-xs font-bold text-[#25352B] mb-1.5">
                  Additional Information (Course, College, Requirements, Last Date)
                </label>
                <textarea
                  rows={3}
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Tell us about your course, semester, family income, or specific documents needed..."
                  className="w-full bg-white border border-[#DDF1DF] rounded-xl p-3 text-xs text-[#25352B] placeholder-[#25352B]/40 focus:border-[#477D55] focus:outline-none transition shadow-sm"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-[#25352B]/70">
                  Instant registration in our system + direct WhatsApp verification.
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#F5D76E] hover:bg-[#eed063] text-[#25352B] text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Saving Enquiry...' : 'Request Assistance'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Scheme Documents Modal */}
      <AnimatePresence>
        {selectedSchemeForDocs && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#DDF1DF] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative"
            >
              <div className="flex items-start justify-between mb-4 pb-3 border-b border-[#DDF1DF]">
                <div>
                  <h3 className="text-lg font-bold font-display text-[#25352B]">{selectedSchemeForDocs.title}</h3>
                  <p className="text-xs text-[#477D55]">{selectedSchemeForDocs.department}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSchemeForDocs(null)}
                  className="p-1 text-[#25352B]/60 hover:text-[#25352B] text-base"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 my-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#25352B]">
                  Required Documents Checklist:
                </h4>
                <ul className="space-y-2.5">
                  {selectedSchemeForDocs.documentsRequired.map((docItem, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-[#25352B]">
                      <div className="w-4 h-4 rounded-full bg-[#DDF1DF] text-[#477D55] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        ✓
                      </div>
                      <span>{docItem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3 pt-3 border-t border-[#DDF1DF]">
                <button
                  type="button"
                  onClick={() => setSelectedSchemeForDocs(null)}
                  className="flex-1 py-2.5 rounded-full border border-[#A8CFAE] text-xs font-bold text-[#25352B] hover:bg-[#F5F9F5]"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleApplyWhatsApp(selectedSchemeForDocs);
                    setSelectedSchemeForDocs(null);
                  }}
                  className="flex-1 py-2.5 rounded-full bg-[#F5D76E] text-[#25352B] text-xs font-bold shadow-sm hover:bg-[#eed063]"
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
