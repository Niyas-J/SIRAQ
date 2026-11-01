export interface CSCService {
  id: string;
  title: string;
  category: 'Aadhaar' | 'Passport' | 'PAN' | 'Certificates' | 'Identity' | 'Utility';
  icon: string;
  badge: string;
  description: string;
  documents: string[];
  turnaroundTime: string;
  feeEstimate: string;
  features: string[];
}

export interface SchemeScholarship {
  id: string;
  title: string;
  department: string;
  category: 'Scholarship' | 'Welfare' | 'Minority & Girls' | 'Farmers & Artisans' | 'Healthcare';
  benefitAmount: string;
  deadline: string;
  status: 'Open Now' | 'Closing Soon' | 'Year-round';
  eligibility: {
    educationLevels: ('School (1-10)' | 'Higher Secondary (11-12)' | 'Undergraduate' | 'Postgraduate' | 'Professional Course' | 'General Citizen / Farmer')[];
    minPercentage?: number;
    maxAnnualIncome?: number; // in INR
    communities: ('Minority' | 'OBC' | 'SC' | 'ST' | 'General')[];
    gender?: 'All' | 'Female Only';
    ageLimit?: string;
  };
  summary: string;
  documentsRequired: string[];
  officialPortal: string;
}

export interface FrameProduct {
  id: string;
  name: string;
  tagline: string;
  priceStart: number;
  badge?: string;
  image: string;
  materials: string;
  popularSizes: string[];
  features: string[];
}

export interface HamperProduct {
  id: string;
  name: string;
  occasion: string;
  priceStart: number;
  badge?: string;
  image: string;
  includedItems: string[];
  packaging: string;
  features: string[];
}

export const CSC_SERVICES: CSCService[] = [
  {
    id: 'aadhaar-updates',
    title: 'Aadhaar Card Updates & PVC',
    category: 'Aadhaar',
    icon: '🪪',
    badge: 'High Demand',
    description: 'Quick demographic updates, address correction, biometric appointments, and official UIDAI waterproof PVC card ordering.',
    documents: ['Aadhaar Number', 'Proof of Address (Utility bill/Voter ID)', 'Active Mobile for OTP'],
    turnaroundTime: '24–48 Hours',
    feeEstimate: 'From ₹50',
    features: ['Address & Name Correction', 'Mobile Number Linking Guidance', 'Biometric Slot Booking', 'Official PVC Card Delivery'],
  },
  {
    id: 'passport-seva',
    title: 'Passport Application & Tatkal',
    category: 'Passport',
    icon: '🛂',
    badge: 'Certified Desk',
    description: 'Complete online application, document validation, PSK / Post Office Passport Seva Kendra slot booking, and Tatkal expedited service.',
    documents: ['Aadhaar Card', 'Birth Certificate / 10th Marksheet', 'PAN Card', 'Bank Passbook / Voter ID'],
    turnaroundTime: 'Instant Appointment Booking',
    feeEstimate: 'Govt Fee + Nominal Desk Charge',
    features: ['Fresh & Re-issue Passport', 'Tatkal Scheme Booking', 'PCC (Police Clearance) Filing', 'Document Verification Pre-check'],
  },
  {
    id: 'pan-card',
    title: 'Instant PAN & Corrections',
    category: 'PAN',
    icon: '💳',
    badge: '10-Min e-PAN',
    description: 'Instant 10-minute digital e-PAN generation, new physical PVC card dispatch, minor to major conversion, and name/photo correction.',
    documents: ['Aadhaar Card with linked mobile', '2 Passport size photos (for physical PAN)'],
    turnaroundTime: '10 mins (e-PAN) / 5–7 Days (Physical)',
    feeEstimate: 'From ₹120',
    features: ['Instant Paperless e-PAN', 'Minor Child PAN Application', 'PAN-Aadhaar Linking', 'Photo & Signature Updates'],
  },
  {
    id: 'voter-dl',
    title: 'Voter ID & Driving License',
    category: 'Identity',
    icon: '🗳️',
    badge: 'Official Portal',
    description: 'New Voter ID (Form 6) registration, constituency shifting, online Driving License learner slot booking, and DL renewal assistance.',
    documents: ['Aadhaar Card', 'Age Proof (10th marksheet / Birth cert)', 'Address Proof', 'Photo'],
    turnaroundTime: 'Slot Booking in 15 Mins',
    feeEstimate: 'From ₹80',
    features: ['New Voter Registration (Form 6)', 'Constituency Transfer (Form 8)', 'Learner License (LLR) Slot', 'Driving License Renewal'],
  },
  {
    id: 'govt-certificates',
    title: 'Govt Revenue Certificates',
    category: 'Certificates',
    icon: '📜',
    badge: 'e-Sevai Linked',
    description: 'Income, Caste/Community, Domicile/Nativity, First Graduate, and Legal Heir certificates issued through official state revenue portals.',
    documents: ['Aadhaar Card', 'Ration Card / Smart Card', 'Income Proof / Salary Slip', 'School TC'],
    turnaroundTime: '3–7 Days (Govt Approval)',
    feeEstimate: 'From ₹100',
    features: ['Income Certificate', 'Community / Caste Certificate', 'Nativity / Residence Certificate', 'First Graduate Assistance'],
  },
  {
    id: 'utility-fastag',
    title: 'FASTag, Bills & PF Withdrawal',
    category: 'Utility',
    icon: '⚡',
    badge: 'Instant Processing',
    description: 'Instant FASTag activation, commercial & residential electricity bill settlement, EPF/UAN claim submission, and pension verification.',
    documents: ['Vehicle RC (for FASTag)', 'Consumer Number (for Bills)', 'UAN & Linked Aadhaar (for PF)'],
    turnaroundTime: 'Instant / Same Day',
    feeEstimate: 'Instant Receipt',
    features: ['Instant FASTag Issuance & Recharge', 'Electricity & Water Bill Pay', 'EPF Advance & Full Withdrawal', 'Life Certificate (Jeevan Pramaan)'],
  },
];

export const SCHEMES_AND_SCHOLARSHIPS: SchemeScholarship[] = [
  {
    id: 'post-matric-minority',
    title: 'Post-Matric Scholarship for Minorities',
    department: 'Ministry of Minority Affairs (NSP Portal)',
    category: 'Minority & Girls',
    benefitAmount: 'Up to ₹25,000 / year + Maintenance Allowance',
    deadline: 'Nov 30, 2026',
    status: 'Open Now',
    eligibility: {
      educationLevels: ['Higher Secondary (11-12)', 'Undergraduate', 'Postgraduate'],
      minPercentage: 50,
      maxAnnualIncome: 200000,
      communities: ['Minority'],
      gender: 'All',
    },
    summary: 'Government financial assistance covering tuition fees and maintenance for minority students (Muslim, Christian, Sikh, Buddhist, Jain, Parsi) studying in Class 11, 12, ITI, Diploma, Degree, or PG.',
    documentsRequired: ['Student Aadhaar Card', 'Previous Year Marksheet (min 50%)', 'Annual Income Certificate (< ₹2 Lakh)', 'Minority Community Self-Declaration', 'Bank Passbook copy in student name', 'College Fee Receipt & Bonafide'],
    officialPortal: 'https://scholarships.gov.in',
  },
  {
    id: 'mcm-technical-professional',
    title: 'Merit-cum-Means (MCM) Professional Scholarship',
    department: 'National Scholarship Portal (Central Sector)',
    category: 'Scholarship',
    benefitAmount: 'Up to ₹30,000 / year',
    deadline: 'Dec 15, 2026',
    status: 'Open Now',
    eligibility: {
      educationLevels: ['Undergraduate', 'Postgraduate', 'Professional Course'],
      minPercentage: 50,
      maxAnnualIncome: 250000,
      communities: ['Minority', 'OBC', 'SC', 'ST'],
      gender: 'All',
    },
    summary: 'Financial support for deserving students admitted into professional & technical degree courses (B.Tech, MBBS, B.Pharm, MBA, MCA, Law, Architecture).',
    documentsRequired: ['Entrance Exam Scorecard / Allotment Order', 'College Bonafide Certificate', 'Income Certificate (< ₹2.5 Lakh)', 'Previous Academic Marksheets', 'Aadhaar & Bank Account Details'],
    officialPortal: 'https://scholarships.gov.in',
  },
  {
    id: 'begum-hazrat-mahal',
    title: 'Begum Hazrat Mahal National Scholarship',
    department: 'Maulana Azad Education Foundation (MAEF)',
    category: 'Minority & Girls',
    benefitAmount: '₹6,000 to ₹12,000 / year',
    deadline: 'Nov 25, 2026',
    status: 'Closing Soon',
    eligibility: {
      educationLevels: ['School (1-10)', 'Higher Secondary (11-12)'],
      minPercentage: 55,
      maxAnnualIncome: 200000,
      communities: ['Minority'],
      gender: 'Female Only',
    },
    summary: 'Direct benefit transfer scholarship exclusively for girl students belonging to minority communities enrolled in Classes 9, 10, 11, and 12 with at least 55% marks.',
    documentsRequired: ['School Principal Verified Institution Verification Form', 'Previous Class Marksheet (min 55%)', 'Income Certificate', 'Aadhaar Card', 'Bank Passbook'],
    officialPortal: 'https://scholarships.gov.in',
  },
  {
    id: 'pm-kisan',
    title: 'PM Kisan Samman Nidhi Yojana',
    department: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Farmers & Artisans',
    benefitAmount: '₹6,000 / year (₹2,000 per 4 months direct to bank)',
    deadline: 'Year-Round Active',
    status: 'Year-round',
    eligibility: {
      educationLevels: ['General Citizen / Farmer'],
      communities: ['Minority', 'OBC', 'SC', 'ST', 'General'],
      gender: 'All',
    },
    summary: 'Guaranteed income support of ₹6,000 annually in three equal tranches directly credited into the bank accounts of eligible landholder farmer families.',
    documentsRequired: ['Aadhaar Card (Mandatory e-KYC)', 'Land Revenue Records (Khatauni / Chitta / Patta)', 'Bank Account linked with NPCI / Aadhaar', 'Active Mobile Number'],
    officialPortal: 'https://pmkisan.gov.in',
  },
  {
    id: 'ayushman-bharat',
    title: 'Ayushman Bharat PM-JAY Golden Card',
    department: 'National Health Authority (NHA)',
    category: 'Healthcare',
    benefitAmount: '₹5,00,000 / family / year Free Medical Treatment',
    deadline: 'Open Ongoing Enrollment',
    status: 'Open Now',
    eligibility: {
      educationLevels: ['General Citizen / Farmer'],
      communities: ['Minority', 'OBC', 'SC', 'ST', 'General'],
      gender: 'All',
    },
    summary: 'World’s largest cashless healthcare cover providing up to ₹5 Lakhs per family per year for secondary and tertiary care hospitalization across all empaneled hospitals.',
    documentsRequired: ['Ration Card / Smart Card', 'Aadhaar Card with linked mobile', 'Family Member KYC details'],
    officialPortal: 'https://beneficiary.nha.gov.in',
  },
  {
    id: 'pm-vishwakarma',
    title: 'PM Vishwakarma Kaushal Samman Yojana',
    department: 'Ministry of Micro, Small and Medium Enterprises',
    category: 'Farmers & Artisans',
    benefitAmount: '₹15,000 Tool Kit Grant + Loans up to ₹3,00,000 @ 5%',
    deadline: 'Ongoing Open Admissions',
    status: 'Open Now',
    eligibility: {
      educationLevels: ['General Citizen / Farmer'],
      communities: ['Minority', 'OBC', 'SC', 'ST', 'General'],
      gender: 'All',
      ageLimit: 'Minimum 18 years',
    },
    summary: 'Holistic support for 18 traditional trade artisans (carpenters, blacksmiths, tailors, potters, cobblers, goldsmiths, masons) including free skill training, ₹500/day stipend, ₹15,000 toolkit voucher, and collateral-free enterprise loans.',
    documentsRequired: ['Aadhaar Card', 'Mobile Number linked to Aadhaar', 'Bank Account details', 'Ration Card', 'Trade Declaration'],
    officialPortal: 'https://pmvishwakarma.gov.in',
  },
  {
    id: 'sukanya-samriddhi',
    title: 'Sukanya Samriddhi Yojana (SSY)',
    department: 'Ministry of Finance / India Post',
    category: 'Minority & Girls',
    benefitAmount: '8.2% Compound Interest + Complete Tax Exemption (80C)',
    deadline: 'Year-Round Active',
    status: 'Year-round',
    eligibility: {
      educationLevels: ['School (1-10)'],
      communities: ['Minority', 'OBC', 'SC', 'ST', 'General'],
      gender: 'Female Only',
      ageLimit: 'Girl child below 10 years of age',
    },
    summary: 'Highest-yielding government savings scheme created for the education and marriage fund of a girl child with guaranteed sovereign backing and triple tax-free benefits.',
    documentsRequired: ['Girl Child Birth Certificate', 'Parent / Guardian Aadhaar & PAN Card', 'Address Proof & Initial Deposit (min ₹250)'],
    officialPortal: 'https://www.indiapost.gov.in',
  },
  {
    id: 'e-shram-card',
    title: 'e-Shram Card Welfare Scheme',
    department: 'Ministry of Labour & Employment',
    category: 'Welfare',
    benefitAmount: '₹2,00,000 Accidental Insurance + Pension Benefits',
    deadline: 'Continuous Registration',
    status: 'Open Now',
    eligibility: {
      educationLevels: ['General Citizen / Farmer'],
      communities: ['Minority', 'OBC', 'SC', 'ST', 'General'],
      gender: 'All',
      ageLimit: '16 to 59 years',
    },
    summary: 'Universal UAN identity for unorganized sector workers (gig workers, drivers, construction, vendors, domestic workers) ensuring instant access to central disaster relief and accident cover.',
    documentsRequired: ['Aadhaar Card linked with active mobile', 'Savings Bank Account IFSC & Account Number'],
    officialPortal: 'https://eshram.gov.in',
  },
  {
    id: 'free-laptop-scheme',
    title: 'Higher Education Digital Aid / Laptop Scheme',
    department: 'State Higher Education Council & Skill Dept',
    category: 'Scholarship',
    benefitAmount: 'Free Branded Laptop / Tablet for College Studies',
    deadline: 'Dec 10, 2026',
    status: 'Closing Soon',
    eligibility: {
      educationLevels: ['Higher Secondary (11-12)', 'Undergraduate', 'Professional Course'],
      minPercentage: 60,
      maxAnnualIncome: 250000,
      communities: ['Minority', 'OBC', 'SC', 'ST'],
      gender: 'All',
    },
    summary: 'Free digital learning laptop distribution for meritorious students admitted to recognized government and government-aided colleges to bridge the digital education divide.',
    documentsRequired: ['College Admission Receipt & Identity Card', '10th & 12th Marksheets', 'Family Income Certificate', 'Community Certificate', 'Aadhaar Card'],
    officialPortal: 'https://scholarships.gov.in',
  },
];

export const FRAMES_COLLECTION: FrameProduct[] = [
  {
    id: 'floating-acrylic',
    name: 'Floating Acrylic Glass Frame',
    tagline: 'Dual crystal-clear acrylic sheets with solid brass standoffs',
    priceStart: 499,
    badge: 'Bestseller',
    image: '/images/frames-showcase.jpg',
    materials: '4mm Optical Grade Imported Cast Acrylic + Brass Gold Standoffs',
    popularSizes: ['6x8 inch', '8x10 inch', '12x18 inch (A3)', 'Custom Dimensions'],
    features: ['High-Def UV Direct Color Printing', 'Frameless Floating 3D Wall Effect', 'Scratch Resistant & Waterproof', 'Portrait or Landscape Mounting'],
  },
  {
    id: 'ambient-led-frame',
    name: 'Ambient Warm LED Night Frame',
    tagline: 'Illuminated portrait on hand-rubbed natural solid wood base',
    priceStart: 699,
    badge: 'Trending Gift',
    image: '/images/frames-showcase.jpg',
    materials: 'High-Transmittance Etched Acrylic + Solid Teak / Walnut Wood Base with USB Warm LED',
    popularSizes: ['6x8 inch Desk Stand', '7x9 inch Custom Cutout'],
    features: ['Warm Golden 3000K Eye-Friendly LED', 'USB Powered (Power Bank / Adapter Compatible)', 'Laser Engraved Custom Personal Message', 'Minimal Touch Power Switch'],
  },
  {
    id: 'spotify-soundwave',
    name: 'Custom Spotify & Soundwave Plaque',
    tagline: 'Scannable Spotify barcode with your special song & memorable photo',
    priceStart: 399,
    badge: 'Romantic Favorite',
    image: '/images/frames-showcase.jpg',
    materials: '3mm Glass Acrylic Plate + Solid Beechwood Slotted Display Stand',
    popularSizes: ['5x7 inch', '6x8 inch', '8x10 inch'],
    features: ['Real-Time Scannable Song Barcode in Spotify App', 'High-Res Direct Photo Print', 'Custom Timestamp & Dedication Text', 'Complimentary Gift Envelope'],
  },
  {
    id: 'minimal-matte-black',
    name: 'Minimal Matte Black Gallery Frame',
    tagline: 'Museum-grade archival matting for portraits, art, and certificates',
    priceStart: 349,
    badge: 'Classic Style',
    image: '/images/frames-showcase.jpg',
    materials: 'Premium Engineered Wood moulding + Shatter-resistant Crystal Glass + 300 GSM Archival Mat',
    popularSizes: ['A4 Certificate Size', '12x18 inch', '16x24 inch Poster Frame'],
    features: ['Precision Beveled Mount Border', 'Dust-Proof Air-Tight Back Sealing', 'Easy Swivel Wall Mounting Clamps', 'Sturdy Desktop Kickstand (sizes up to 8x10)'],
  },
];

export const HAMPERS_COLLECTION: HamperProduct[] = [
  {
    id: 'executive-box',
    name: 'The SIRAQ Executive Signature Hamper',
    occasion: 'Corporate Gifting, Promotions & Milestones',
    priceStart: 1499,
    badge: 'Luxury Edition',
    image: '/images/hampers-showcase.jpg',
    includedItems: [
      'Custom Gold-Embossed Leather Bound Daily Journal',
      'Heavy Metallic Gold-Accented Executive Rollerball Pen',
      'Personalized Ceramic Coffee Mug with Monogram Print',
      'Cast Acrylic Initial Keychain with Golden Flakes',
      'Vintage Brass Wax Seal Stamp with Sealing Wax Stick',
      'Personalized Welcome Note Card with Gold Gilded Edges',
    ],
    packaging: 'Rigid Textured Matte Black & Gold Foil Gift Chest with Satin Inner Lining and Wax Seal Ribbon',
    features: ['Custom Company / Personal Logo Printing', 'High-Touch Artisanal Finish', 'Express Safe Packing & Doorstep Delivery'],
  },
  {
    id: 'wedding-festive-hamper',
    name: 'Bespoke Wedding & Festive Gift Chest',
    occasion: 'Weddings, Engagements, Anniversaries & VIP Guests',
    priceStart: 1999,
    badge: 'Royal Favorite',
    image: '/images/hampers-showcase.jpg',
    includedItems: [
      'Floating Acrylic Photo Frame with Couple Initials',
      'Handcrafted Luxury Aromatic Candle in Frosted Jar',
      'Gold-Foiled Wedding Invitation Keepsake Card',
      'Customized Gourmet Chocolate Box with Monogram Wrapper',
      'Personalized Resin Photo Coaster Set',
      'Handwritten Calligraphy Envelope Message',
    ],
    packaging: 'Handcrafted Hexagonal or Rectangular Chest with Gold Foil Lettering, Organza Ribbons and Wax Stamp',
    features: ['Custom Theme Color Coordination', 'Bulk Discounts for 20+ Wedding Hampers', 'Complete Customization on WhatsApp'],
  },
  {
    id: 'mini-surprise-box',
    name: 'The Celebration Surprise Memory Hamper',
    occasion: 'Birthdays, Friendship, Valentine & Special Days',
    priceStart: 799,
    badge: 'Best Value',
    image: '/images/hampers-showcase.jpg',
    includedItems: [
      'Custom Scannable Spotify Acrylic Plaque with Wooden Stand',
      'Mini Polaroid Style Photo Prints (Set of 6)',
      'Custom Engraved Acrylic Keychain',
      'Artisanal Chocolate Bar with Custom Photo Wrap',
      'Handcrafted Wish Card with Sealed Envelope',
    ],
    packaging: 'Sleek Matte Black Gift Box tied with Double Satin Bow and Personalized Name Tag',
    features: ['Instant Photo Upload via WhatsApp', 'Ready to Gift Unboxing Presentation', 'Affordable Premium Quality'],
  },
];
