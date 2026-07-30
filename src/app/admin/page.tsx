'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Plus,
  Search,
  Download,
  Upload,
  RefreshCw,
  QrCode as QrIcon,
  Printer,
  Copy,
  Edit,
  Trash2,
  Eye,
  LogOut,
  ShieldCheck,
  Filter,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  Mail,
  Key,
  X,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import imageCompression from 'browser-image-compression';

import { Student } from '@/lib/studentTypes';
import { studentService } from '@/lib/firebase';
import { generateQRCodeDataUrl, downloadQRCodePNG } from '@/lib/qrGenerator';

// Flexible Zod Validation Schema - Only studentId and name are required
const studentSchema = z.object({
  studentId: z.string().min(2, 'Student ID is required'),
  name: z.string().min(2, 'Name is required'),
  institution: z.string().optional().default(''),
  department: z.string().optional().default(''),
  course: z.string().optional().default(''),
  semester: z.string().optional().default(''),
  section: z.string().optional().default(''),
  rollNumber: z.string().optional().default(''),
  bloodGroup: z.string().optional().default(''),
  dob: z.string().optional().default(''),
  parentName: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  email: z.string().optional().default(''),
  address: z.string().optional().default(''),
  admissionYear: z.string().optional().default(''),
  status: z.enum(['active', 'inactive']),
  issueDate: z.string().optional().default(''),
  expiryDate: z.string().optional().default(''),
});

type StudentFormInputs = z.infer<typeof studentSchema>;

export default function AdminDashboardPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>('admin@siraq.in');
  const [loginPassword, setLoginPassword] = useState<string>('SiraqAdmin2026!');
  const [loginError, setLoginError] = useState<string>('');

  // Dashboard Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterInstitution, setFilterInstitution] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'name' | 'studentId'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // UI Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [printingStudent, setPrintingStudent] = useState<Student | null>(null);
  const [qrModalStudent, setQrModalStudent] = useState<Student | null>(null);
  const [qrModalCode, setQrModalCode] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [uploadingPhoto, setUploadingPhoto] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Form Hook
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormInputs>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      studentId: '',
      name: '',
      institution: '',
      department: '',
      course: '',
      semester: '',
      section: '',
      rollNumber: '',
      bloodGroup: '',
      parentName: '',
      phone: '',
      email: '',
      address: '',
      admissionYear: '',
      status: 'active',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
    },
  });

  // Check persisted session
  useEffect(() => {
    const session = localStorage.getItem('siraq_admin_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch Students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await studentService.getAllStudents();
      setStudents(data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStudents();
    }
  }, [isAuthenticated]);

  // Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail.trim() === 'admin@siraq.in' && loginPassword === 'SiraqAdmin2026!') {
      setIsAuthenticated(true);
      localStorage.setItem('siraq_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('siraq_admin_auth');
  };

  // Image Upload Handling with Compression
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    try {
      setUploadingPhoto(true);
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      setPhotoFile(compressedFile);
      setPhotoPreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error('Image compression error:', error);
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Open Edit Form
  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setPhotoPreview(student.photo || '');
    setValue('studentId', student.studentId);
    setValue('name', student.name);
    setValue('institution', student.institution || '');
    setValue('department', student.department || '');
    setValue('course', student.course || '');
    setValue('semester', student.semester || '');
    setValue('section', student.section || '');
    setValue('rollNumber', student.rollNumber || '');
    setValue('bloodGroup', student.bloodGroup || '');
    setValue('dob', student.dob || '');
    setValue('parentName', student.parentName || '');
    setValue('phone', student.phone || '');
    setValue('email', student.email || '');
    setValue('address', student.address || '');
    setValue('admissionYear', student.admissionYear || '');
    setValue('status', student.status);
    setValue('issueDate', student.issueDate || '');
    setValue('expiryDate', student.expiryDate || '');
    setIsAddModalOpen(true);
  };

  // Duplicate Student
  const handleDuplicate = (student: Student) => {
    const nextNum = students.length + 1;
    const newId = `ST2026${String(nextNum).padStart(5, '0')}`;
    setEditingStudent(null);
    setPhotoPreview(student.photo || '');
    setValue('studentId', newId);
    setValue('name', `${student.name} (Copy)`);
    setValue('institution', student.institution || '');
    setValue('department', student.department || '');
    setValue('course', student.course || '');
    setValue('semester', student.semester || '');
    setValue('section', student.section || '');
    setValue('rollNumber', student.rollNumber ? `${student.rollNumber}-C` : '');
    setValue('bloodGroup', student.bloodGroup || '');
    setValue('dob', student.dob || '');
    setValue('parentName', student.parentName || '');
    setValue('phone', student.phone || '');
    setValue('email', student.email || '');
    setValue('address', student.address || '');
    setValue('admissionYear', student.admissionYear || '');
    setValue('status', 'active');
    setValue('issueDate', new Date().toISOString().split('T')[0]);
    setValue('expiryDate', student.expiryDate || '');
    setIsAddModalOpen(true);
  };

  // Submit Add / Edit Form
  const onStudentFormSubmit = async (data: StudentFormInputs) => {
    try {
      let finalPhotoUrl = editingStudent?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

      if (photoFile) {
        finalPhotoUrl = await studentService.uploadPhoto(photoFile, data.studentId);
      }

      const now = new Date().toISOString();
      const payload: Omit<Student, 'id'> = {
        studentId: data.studentId.trim().toUpperCase(),
        name: data.name.trim(),
        photo: finalPhotoUrl,
        institution: data.institution?.trim() || '',
        department: data.department?.trim() || '',
        course: data.course?.trim() || '',
        semester: data.semester?.trim() || '',
        section: data.section?.trim() || '',
        rollNumber: data.rollNumber?.trim() || '',
        bloodGroup: data.bloodGroup?.trim() || '',
        dob: data.dob || '',
        parentName: data.parentName?.trim() || '',
        phone: data.phone?.trim() || '',
        email: data.email?.trim() || '',
        address: data.address?.trim() || '',
        admissionYear: data.admissionYear?.trim() || '',
        status: data.status,
        issueDate: data.issueDate || new Date().toISOString().split('T')[0],
        expiryDate: data.expiryDate || '',
        scanCount: editingStudent?.scanCount || 0,
        lastScannedAt: editingStudent?.lastScannedAt,
        createdAt: editingStudent?.createdAt || now,
        updatedAt: now,
        createdBy: editingStudent?.createdBy || 'Admin',
        lastEditedBy: 'Admin',
      };

      await studentService.saveStudent(payload, editingStudent?.id);
      await fetchStudents();

      setIsAddModalOpen(false);
      setEditingStudent(null);
      setPhotoFile(null);
      setPhotoPreview('');
      reset();
    } catch (err) {
      console.error('Error saving student:', err);
      alert('Error saving student. Please check input details.');
    }
  };

  // Delete Student
  const confirmDelete = async () => {
    if (!deletingStudent) return;
    try {
      await studentService.deleteStudent(deletingStudent.studentId, deletingStudent.photo);
      await fetchStudents();
      setDeletingStudent(null);
    } catch (err) {
      console.error('Error deleting student:', err);
    }
  };

  // Toggle Status (Activate / Disable)
  const handleToggleStatus = async (student: Student) => {
    try {
      await studentService.toggleStatus(student.studentId, student.status);
      await fetchStudents();
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  // Generate & Display QR Modal
  const openQRModal = async (student: Student) => {
    try {
      const qrDataUrl = await generateQRCodeDataUrl(student.studentId);
      setQrModalCode(qrDataUrl);
      setQrModalStudent(student);
    } catch (err) {
      console.error('QR generation error:', err);
    }
  };

  // Bulk File Import (CSV or Excel)
  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rows: any[] = XLSX.utils.sheet_to_json(ws);

        if (rows.length === 0) {
          alert('Uploaded file contains no rows.');
          return;
        }

        const formattedList: Omit<Student, 'id'>[] = rows.map((row, idx) => ({
          studentId: String(row.StudentId || row.studentId || `ST2026${String(students.length + idx + 1).padStart(5, '0')}`).trim().toUpperCase(),
          name: String(row.Name || row.name || 'Unnamed Student'),
          photo: String(row.Photo || row.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'),
          institution: String(row.Institution || row.institution || ''),
          department: String(row.Department || row.department || ''),
          course: String(row.Course || row.course || ''),
          semester: String(row.Semester || row.semester || ''),
          section: String(row.Section || row.section || ''),
          rollNumber: String(row.RollNumber || row.rollNumber || ''),
          bloodGroup: String(row.BloodGroup || row.bloodGroup || ''),
          dob: String(row.DOB || row.dob || ''),
          parentName: String(row.ParentName || row.parentName || ''),
          phone: String(row.Phone || row.phone || ''),
          email: String(row.Email || row.email || ''),
          address: String(row.Address || row.address || ''),
          admissionYear: String(row.AdmissionYear || row.admissionYear || ''),
          status: 'active',
          issueDate: new Date().toISOString().split('T')[0],
          scanCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'Bulk Upload',
          lastEditedBy: 'Bulk Upload',
        }));

        await studentService.bulkSaveStudents(formattedList);
        await fetchStudents();
        alert(`Successfully imported ${formattedList.length} student records!`);
      } catch (err) {
        console.error('Bulk upload error:', err);
        alert('Failed to parse Excel/CSV file.');
      }
    };

    reader.readAsBinaryString(file);
  };

  // Export Excel / CSV
  const exportData = (format: 'excel' | 'csv') => {
    const exportRows = filteredStudents.map((s) => ({
      StudentID: s.studentId,
      Name: s.name,
      Institution: s.institution || '',
      Department: s.department || '',
      Course: s.course || '',
      Semester: s.semester || '',
      Section: s.section || '',
      RollNumber: s.rollNumber || '',
      BloodGroup: s.bloodGroup || '',
      Phone: s.phone || '',
      Email: s.email || '',
      ParentName: s.parentName || '',
      AdmissionYear: s.admissionYear || '',
      Status: s.status,
      IssueDate: s.issueDate || '',
      ExpiryDate: s.expiryDate || '',
      ScanCount: s.scanCount || 0,
    }));

    if (format === 'csv') {
      const csvStr = Papa.unparse(exportRows);
      const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `SIRAQ_Students_Export_${Date.now()}.csv`;
      link.click();
    } else {
      const ws = XLSX.utils.json_to_sheet(exportRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Students');
      XLSX.writeFile(wb, `SIRAQ_Students_Export_${Date.now()}.xlsx`);
    }
  };

  // Stats Calculations
  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter((s) => s.status === 'active').length;
    const inactive = students.filter((s) => s.status === 'inactive').length;
    const now = new Date();
    const expired = students.filter((s) => s.expiryDate && new Date(s.expiryDate) < now).length;
    return { total, active, inactive, expired };
  }, [students]);

  // Filter Options
  const departments = useMemo(() => {
    return Array.from(new Set(students.map((s) => s.department))).filter(Boolean);
  }, [students]);

  const institutions = useMemo(() => {
    return Array.from(new Set(students.map((s) => s.institution))).filter(Boolean);
  }, [students]);

  // Filtered & Sorted Students
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (s.phone && s.phone.includes(searchTerm)) ||
          (s.department && s.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (s.institution && s.institution.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesDept = filterDepartment === 'all' || s.department === filterDepartment;
        const matchesInst = filterInstitution === 'all' || s.institution === filterInstitution;
        const matchesStatus = filterStatus === 'all' || s.status === filterStatus;

        return matchesSearch && matchesDept && matchesInst && matchesStatus;
      })
      .sort((a, b) => {
        let valA = (a[sortBy] || '').toString().toLowerCase();
        let valB = (b[sortBy] || '').toString().toLowerCase();
        if (sortOrder === 'asc') return valA.localeCompare(valB);
        return valB.localeCompare(valA);
      });
  }, [students, searchTerm, filterDepartment, filterInstitution, filterStatus, sortBy, sortOrder]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage]);

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Admin Login — SIRAQ Verification System</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="min-h-screen bg-[#06070C] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md glass rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-accent to-neon flex items-center justify-center text-charcoal shadow-glow">
                <ShieldCheck className="w-9 h-9" />
              </div>
              <h1 className="text-2xl font-bold font-display text-white pt-2">SIRAQ Admin Portal</h1>
              <p className="text-xs text-slateSoft">Student Verification System Control Panel</p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slateSoft uppercase tracking-wider">Admin Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slateSoft" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slateSoft text-sm outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slateSoft uppercase tracking-wider">Master Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-3.5 text-slateSoft" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slateSoft text-sm outline-none focus:border-accent"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent to-neon font-bold text-charcoal text-sm uppercase tracking-wider shadow-glow hover:opacity-95 transition"
              >
                Authenticate & Access Panel
              </button>
            </form>

            <div className="pt-2 text-center border-t border-white/10">
              <p className="text-[11px] text-slateSoft">
                Default Credentials Pre-Filled for Instant Access
              </p>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard — SIRAQ Student Verification</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-[#06070C] text-white' : 'bg-slate-100 text-slate-900'}`}>
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 backdrop-blur-md bg-opacity-80 border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-neon flex items-center justify-center text-charcoal font-bold shadow-glow">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-wider text-white">SIRAQ ADMIN</span>
              <span className="text-[10px] text-accent block uppercase tracking-widest font-semibold">Verification Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-accent transition"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Overview Metrics Header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-6 rounded-3xl border transition shadow-lg ${isDarkMode ? 'bg-space/80 border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-slateSoft font-semibold">Total Students</span>
                <div className="p-3 rounded-2xl bg-accent/15 text-accent">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <p className="text-3xl font-display font-bold mt-2 text-white">{stats.total}</p>
            </div>

            <div className={`p-6 rounded-3xl border transition shadow-lg ${isDarkMode ? 'bg-space/80 border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-slateSoft font-semibold">Active Verified</span>
                <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400">
                  <UserCheck className="w-6 h-6" />
                </div>
              </div>
              <p className="text-3xl font-display font-bold mt-2 text-emerald-400">{stats.active}</p>
            </div>

            <div className={`p-6 rounded-3xl border transition shadow-lg ${isDarkMode ? 'bg-space/80 border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-slateSoft font-semibold">Inactive IDs</span>
                <div className="p-3 rounded-2xl bg-red-500/15 text-red-400">
                  <UserX className="w-6 h-6" />
                </div>
              </div>
              <p className="text-3xl font-display font-bold mt-2 text-red-400">{stats.inactive}</p>
            </div>

            <div className={`p-6 rounded-3xl border transition shadow-lg ${isDarkMode ? 'bg-space/80 border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-slateSoft font-semibold">Expired IDs</span>
                <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
              <p className="text-3xl font-display font-bold mt-2 text-amber-400">{stats.expired}</p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-space/80 border-white/10' : 'bg-white border-slate-200'} space-y-4 shadow-xl`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slateSoft" />
                <input
                  type="text"
                  placeholder="Search by ID, Name, Phone, Dept..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slateSoft text-xs outline-none focus:border-accent"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <button
                  onClick={() => {
                    setEditingStudent(null);
                    setPhotoPreview('');
                    reset();
                    setIsAddModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent to-neon font-bold text-charcoal text-xs uppercase tracking-wider shadow-glow hover:scale-105 transition"
                >
                  <Plus className="w-4 h-4" /> Add Student
                </button>

                <label className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold cursor-pointer text-white transition">
                  <Upload className="w-4 h-4 text-neon" /> Bulk Import
                  <input type="file" accept=".csv, .xlsx, .xls" onChange={handleBulkUpload} className="hidden" />
                </label>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => exportData('excel')}
                    className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold transition"
                    title="Export Excel"
                  >
                    <FileSpreadsheet className="w-4 h-4" /> Excel
                  </button>
                  <button
                    onClick={() => exportData('csv')}
                    className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 text-xs font-semibold transition"
                    title="Export CSV"
                  >
                    <FileText className="w-4 h-4" /> CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10 text-xs">
              <span className="flex items-center gap-1 text-slateSoft font-semibold">
                <Filter className="w-3.5 h-3.5" /> Filters:
              </span>

              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent"
              >
                <option value="all" className="bg-charcoal">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d} className="bg-charcoal">{d}</option>
                ))}
              </select>

              <select
                value={filterInstitution}
                onChange={(e) => setFilterInstitution(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent"
              >
                <option value="all" className="bg-charcoal">All Institutions</option>
                {institutions.map((inst) => (
                  <option key={inst} value={inst} className="bg-charcoal">{inst}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent"
              >
                <option value="all" className="bg-charcoal">All Statuses</option>
                <option value="active" className="bg-charcoal">Active Only</option>
                <option value="inactive" className="bg-charcoal">Inactive Only</option>
              </select>
            </div>
          </div>

          {/* Student Table */}
          <div className={`rounded-3xl border overflow-hidden shadow-2xl ${isDarkMode ? 'bg-space/90 border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-slateSoft text-xs font-semibold uppercase tracking-wider">
                    <th className="py-4 px-6">Student</th>
                    <th className="py-4 px-6">ID & Roll</th>
                    <th className="py-4 px-6">Institution & Dept</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-center">QR & Card</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slateSoft">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-accent" />
                        Loading student verification records...
                      </td>
                    </tr>
                  ) : paginatedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slateSoft">
                        No student records found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((student) => (
                      <tr key={student.studentId} className="hover:bg-white/[0.02] transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl overflow-hidden border border-white/10 relative bg-slate-800 shrink-0">
                              {student.photo ? (
                                <Image src={student.photo} alt={student.name} fill className="object-cover" unoptimized />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-xs">
                                  {student.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{student.name}</p>
                              <p className="text-xs text-slateSoft">{student.phone || 'No phone'}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span className="font-mono font-bold text-accent text-xs bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-lg">
                            {student.studentId}
                          </span>
                          <p className="text-xs text-slateSoft font-mono mt-1">{student.rollNumber || '—'}</p>
                        </td>

                        <td className="py-4 px-6">
                          <p className="text-xs font-semibold text-white line-clamp-1">{student.institution || '—'}</p>
                          <p className="text-[11px] text-slateSoft">{student.department || '—'}</p>
                        </td>

                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleToggleStatus(student)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
                              student.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'active' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                            {student.status === 'active' ? 'Active' : 'Disabled'}
                          </button>
                        </td>

                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openQRModal(student)}
                              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-accent text-accent transition"
                              title="View & Download QR"
                            >
                              <QrIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setPrintingStudent(student)}
                              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-neon text-neon transition"
                              title="Print Student ID Card"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`/verify/${student.studentId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition"
                              title="View Profile Page"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => openEditModal(student)}
                              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-amber-400 transition"
                              title="Edit Student"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDuplicate(student)}
                              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-blue-400 transition"
                              title="Duplicate Record"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingStudent(student)}
                              className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-slateSoft">
              <span>
                Showing {filteredStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} entries
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded-xl border border-white/10 disabled:opacity-40 hover:bg-white/5 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-white">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-xl border border-white/10 disabled:opacity-40 hover:bg-white/5 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Add / Edit Student Modal */}
        <AnimatePresence>
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-3xl glass rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-xl font-bold font-display text-white">
                      {editingStudent ? 'Edit Student Record' : 'Add New Student'}
                    </h2>
                    <p className="text-xs text-slateSoft">Only Student ID and Name are required. Fill optional slots as needed.</p>
                  </div>
                  <button onClick={() => setIsAddModalOpen(false)} className="text-slateSoft hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onStudentFormSubmit)} className="space-y-6">
                  {/* Photo Upload Box */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-800 border border-white/20 relative flex items-center justify-center">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-8 h-8 text-slate-500" />
                      )}
                    </div>
                    <div className="space-y-2 text-center sm:text-left">
                      <p className="text-sm font-semibold text-white">Student Photo (Optional)</p>
                      <p className="text-xs text-slateSoft">Upload compressed PNG or JPG photo.</p>
                      <input type="file" accept="image/*" onChange={handlePhotoSelect} className="text-xs text-slateSoft file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-accent file:text-charcoal file:font-bold hover:file:opacity-90" />
                    </div>
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    {/* Student ID (Required) */}
                    <div className="space-y-1">
                      <label className="font-semibold text-accent uppercase">Student ID *</label>
                      <input {...register('studentId')} placeholder="ST202600001" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent" />
                      {errors.studentId && <p className="text-red-400 text-[11px]">{errors.studentId.message}</p>}
                    </div>

                    {/* Name (Required) */}
                    <div className="space-y-1">
                      <label className="font-semibold text-accent uppercase">Full Name *</label>
                      <input {...register('name')} placeholder="Aisha Rahman" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent" />
                      {errors.name && <p className="text-red-400 text-[11px]">{errors.name.message}</p>}
                    </div>

                    {/* Institution (Optional) */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slateSoft uppercase">Institution (Optional)</label>
                      <input {...register('institution')} placeholder="SIRAQ Institute" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent" />
                    </div>

                    {/* Department (Optional) */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slateSoft uppercase">Department (Optional)</label>
                      <input {...register('department')} placeholder="Computer Science" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent" />
                    </div>

                    {/* Course (Optional) */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slateSoft uppercase">Course (Optional)</label>
                      <input {...register('course')} placeholder="B.Tech" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent" />
                    </div>

                    {/* Semester (Optional) */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slateSoft uppercase">Semester (Optional)</label>
                      <input {...register('semester')} placeholder="Semester 6" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent" />
                    </div>

                    {/* Section (Optional) */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slateSoft uppercase">Section (Optional)</label>
                      <input {...register('section')} placeholder="Section A" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent" />
                    </div>

                    {/* Roll Number (Optional) */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slateSoft uppercase">Roll Number (Optional)</label>
                      <input {...register('rollNumber')} placeholder="CS2026042" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent" />
                    </div>

                    {/* Blood Group (Optional) */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slateSoft uppercase">Blood Group (Optional)</label>
                      <input {...register('bloodGroup')} placeholder="O+" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent" />
                    </div>

                    {/* DOB (Optional) */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slateSoft uppercase">Date of Birth (Optional)</label>
                      <input type="date" {...register('dob')} className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent" />
                    </div>

                    {/* Parent Name (Optional) */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slateSoft uppercase">Parent Name (Optional)</label>
                      <input {...register('parentName')} placeholder="Tariq Rahman" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent" />
                    </div>

                    {/* Phone (Optional) */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slateSoft uppercase">Phone (Optional)</label>
                      <input {...register('phone')} placeholder="+91 98765 43210" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent" />
                    </div>

                    {/* Email (Optional) */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slateSoft uppercase">Email (Optional)</label>
                      <input type="email" {...register('email')} placeholder="student@siraq.edu.in" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent" />
                    </div>

                    {/* Admission Year (Optional) */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slateSoft uppercase">Admission Year (Optional)</label>
                      <input {...register('admissionYear')} placeholder="2026" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent" />
                    </div>

                    {/* Status */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slateSoft uppercase">Status *</label>
                      <select {...register('status')} className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent">
                        <option value="active" className="bg-charcoal">Active</option>
                        <option value="inactive" className="bg-charcoal">Inactive</option>
                      </select>
                    </div>

                    {/* Issue Date (Optional) */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slateSoft uppercase">Issue Date (Optional)</label>
                      <input type="date" {...register('issueDate')} className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent" />
                    </div>

                    {/* Expiry Date (Optional) */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slateSoft uppercase">Expiry Date (Optional)</label>
                      <input type="date" {...register('expiryDate')} className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent" />
                    </div>

                    {/* Address (Optional) */}
                    <div className="space-y-1 sm:col-span-2 md:col-span-3">
                      <label className="font-semibold text-slateSoft uppercase">Address (Optional)</label>
                      <input {...register('address')} placeholder="Residential address" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent" />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-white/10 text-slateSoft text-xs font-semibold hover:bg-white/5">
                      Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting || uploadingPhoto} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent to-neon text-charcoal text-xs font-bold uppercase tracking-wider shadow-glow hover:opacity-90">
                      {isSubmitting ? 'Saving Record...' : editingStudent ? 'Update Record' : 'Create & Generate QR'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        {deletingStudent && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md glass rounded-3xl p-6 border border-red-500/30 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Delete Student Record?</h3>
              <p className="text-xs text-slateSoft">
                Are you sure you want to delete <strong className="text-white">{deletingStudent.name}</strong> ({deletingStudent.studentId})?
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button onClick={() => setDeletingStudent(null)} className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="px-5 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600">
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QR Code Modal */}
        {qrModalStudent && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-sm glass rounded-3xl p-6 border border-white/20 text-center space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white">QR Verification Badge</h3>
                <button onClick={() => setQrModalStudent(null)} className="text-slateSoft hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-white rounded-2xl inline-block shadow-lg">
                <img src={qrModalCode} alt="QR Code" className="w-48 h-48 mx-auto" />
              </div>

              <div>
                <p className="font-bold text-white text-base">{qrModalStudent.name}</p>
                <p className="text-xs font-mono text-accent">ID: {qrModalStudent.studentId}</p>
                <p className="text-[11px] text-slateSoft mt-1 break-all">
                  https://siraq.in/verify/{qrModalStudent.studentId}
                </p>
              </div>

              <button
                onClick={() => downloadQRCodePNG(qrModalStudent.studentId, qrModalStudent.name)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-accent to-neon text-charcoal font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow"
              >
                <Download className="w-4 h-4" /> Download QR Code PNG
              </button>
            </div>
          </div>
        )}

        {/* Print Student Card Modal */}
        {printingStudent && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-lg">Student ID Card Preview</h3>
                <button onClick={() => setPrintingStudent(null)} className="text-slate-500 hover:text-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="w-full rounded-2xl bg-gradient-to-br from-slate-900 via-space to-charcoal text-white p-5 border-2 border-accent/40 shadow-2xl relative overflow-hidden space-y-4">
                <div className="flex items-center justify-between border-b border-white/20 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-accent" />
                    <div>
                      <h4 className="font-bold text-sm tracking-wider font-display">SIRAQ VERIFIED</h4>
                      <p className="text-[9px] text-slateSoft uppercase tracking-widest">{printingStudent.institution || 'Official Institution'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-accent bg-accent/20 px-2 py-0.5 rounded">
                    {printingStudent.studentId}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-accent shrink-0 relative bg-slate-800">
                    {printingStudent.photo ? (
                      <img src={printingStudent.photo} alt={printingStudent.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-8 h-8 text-slate-500 m-auto mt-7" />
                    )}
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-base text-white">{printingStudent.name}</p>
                    {printingStudent.department && <p className="text-accent font-medium">{printingStudent.department}</p>}
                    {printingStudent.course && <p className="text-slateSoft">{printingStudent.course}</p>}
                    {printingStudent.rollNumber && <p className="text-slateSoft">Roll: {printingStudent.rollNumber}</p>}
                    {printingStudent.bloodGroup && <p className="text-red-400 font-bold">Blood: {printingStudent.bloodGroup}</p>}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slateSoft">
                  <span>Issued: {printingStudent.issueDate || '—'}</span>
                  <span className="text-emerald-400 font-bold">✓ VERIFIED STUDENT</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setPrintingStudent(null)} className="px-4 py-2 rounded-xl border text-xs font-semibold">
                  Close
                </button>
                <button onClick={() => window.print()} className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5">
                  <Printer className="w-4 h-4" /> Print Card
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
