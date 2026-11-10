export interface CSCService {
  id: string;
  title: string;
  category: 'Aadhaar' | 'PAN' | 'Identity' | 'Certificates' | 'Utility';
  icon: string;
  badge: string;
  description: string;
  documents: string[];
  turnaroundTime: string;
  feeEstimate: string;
  numericPrice?: number;
  features: string[];
}

export interface SchemeScholarship {
  id: string;
  title: string;
  portalName: string;
  department: string;
  category: 'State Scholarship (Karnataka)' | 'Central Scholarship (National)';
  benefitAmount: string;
  deadline: string;
  status: 'Open Now' | 'Closing Soon' | 'Year-round';
  summary: string;
  documentsRequired: string[];
  officialPortal: string;
  features: string[];
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

// Exactly the 5 requested services with updated prices & details
export const CSC_SERVICES: CSCService[] = [
  {
    id: 'aadhaar-updates',
    title: 'Aadhaar Card Updates & Lamination',
    category: 'Aadhaar',
    icon: '🪪',
    badge: 'Standard Service',
    description: 'Demographic updates (Name, Date of Birth, Address), mobile number linking guidance, and high-quality protective thermal lamination.',
    documents: ['Aadhaar Number', 'Proof of Address / Identity', 'Active Mobile for OTP'],
    turnaroundTime: '24–48 Hours',
    feeEstimate: '₹100',
    numericPrice: 100,
    features: ['Demographic Data Correction', 'Address Updating Assistance', 'Biometric Appointment Slot Booking', 'Protective Thermal Lamination'],
  },
  {
    id: 'pan-card',
    title: 'PAN Card Application & Corrections',
    category: 'PAN',
    icon: '💳',
    badge: 'Certified Seva',
    description: 'New PAN Card application, name/DOB/photo corrections, minor to major conversion, and official physical PAN card dispatch via post.',
    documents: ['Aadhaar Card with linked mobile', '2 Passport size photographs', 'Identity / Address Proof'],
    turnaroundTime: '7–14 Days',
    feeEstimate: '₹200',
    numericPrice: 200,
    features: ['New Individual PAN Application', 'Name & Parent Name Correction', 'Photo & Signature Update', 'Official Physical Card Dispatch (7–14 Days)'],
  },
  {
    id: 'voter-id',
    title: 'Voter ID Services',
    category: 'Identity',
    icon: '🗳️',
    badge: 'Election Commission Linked',
    description: 'Official electoral services including fresh voter registration, demographic corrections, and constituency shifting through the ECI portal.',
    documents: ['Aadhaar Card', 'Age Proof (10th Marksheet / Birth Cert)', 'Current Address Proof', 'Recent Passport Photo'],
    turnaroundTime: '7–14 Days (Govt Verification)',
    feeEstimate: '₹100',
    numericPrice: 100,
    features: ['New Voter Registration (Form 6)', 'Voter ID Demographic Corrections (Form 8)', 'Constituency / Assembly Shifting (Form 8A)', 'EPIC Digital Download Assistance'],
  },
  {
    id: 'govt-certificates',
    title: 'Government Revenue Certificates',
    category: 'Certificates',
    icon: '📜',
    badge: 'e-Sevai Portal',
    description: 'Official revenue department certificates including Income Certificate, Community/Caste Certificate, Domicile/Residence, and First Graduate assistance.',
    documents: ['Aadhaar Card', 'Ration Card / Smart Card', 'Income Proof / Salary Slip', 'School Study Certificate / TC'],
    turnaroundTime: '7–14 Days (Subject to Govt Approval)',
    feeEstimate: '₹150',
    numericPrice: 150,
    features: ['Annual Income Certificate', 'Caste & Community Certificate', 'Domicile / Nativity Certificate', '7–14 Days Official Revenue Verification'],
  },
  {
    id: 'utility-bhoomi',
    title: 'FASTag, Bills, PF & Bhoomi',
    category: 'Utility',
    icon: '⚡',
    badge: 'Multi-Utility Counter',
    description: 'Instant FASTag activation & recharge, electricity & water bill payments, EPF/UAN withdrawal assistance, Jeevan Pramaan digital life certificates, and Bhoomi RTC / Pahani land records.',
    documents: ['Vehicle RC (for FASTag)', 'Consumer Number (for Bills)', 'UAN & Linked Aadhaar (for EPF)', 'Survey Number / District (for Bhoomi RTC)'],
    turnaroundTime: 'Instant / Same Day Processing',
    feeEstimate: 'Based on selected service',
    numericPrice: 50,
    features: ['Instant FASTag Activation & Top-up', 'Electricity & Water Utility Bill Settlement', 'EPF Claim & Advance Withdrawal Assistance', 'Jeevan Pramaan (Digital Life Certificate)', 'Bhoomi RTC / Pahani Land Record Fetch'],
  },
];

// Display ONLY SSP and NSP
export const SCHEMES_AND_SCHOLARSHIPS: SchemeScholarship[] = [
  {
    id: 'ssp-karnataka',
    title: 'SSP – Karnataka State Scholarship Portal',
    portalName: 'State Scholarship Portal (SSP)',
    department: 'Government of Karnataka (Social Welfare, Backward Classes, Minority & Tribal Dept)',
    category: 'State Scholarship (Karnataka)',
    benefitAmount: 'Up to ₹20,000–₹50,000 / year + Maintenance Allowance',
    deadline: 'Ongoing for Academic Year 2026',
    status: 'Open Now',
    summary: 'Single unified state scholarship platform for all pre-matric and post-matric students of Karnataka belonging to SC, ST, OBC, and Minority communities. Direct Benefit Transfer (DBT) directly credited to student Aadhaar-seeded bank accounts.',
    documentsRequired: [
      'Student Aadhaar Card (linked with bank account)',
      'Kutumba / Family ID Number',
      'RD Number of Income & Caste Certificate',
      'Previous Class / Semester Marksheet',
      'College Bonafide & Admission Fee Receipt',
      'Hostel Registration Details (if applicable)',
    ],
    officialPortal: 'https://ssp.postmatric.karnataka.gov.in',
    features: [
      'Post-Matric & Pre-Matric State Scholarships',
      'Fee Concession & Free Ship Card',
      'E-Attestation Verification Assistance',
      'Hostel Subsidy & Vidyasiri Allowance',
    ],
  },
  {
    id: 'nsp-central',
    title: 'NSP – National Scholarship Portal',
    portalName: 'National Scholarship Portal (NSP)',
    department: 'Government of India (Central Sector, MoMA, MSJE, MoTA, DoHE)',
    category: 'Central Scholarship (National)',
    benefitAmount: '₹10,000 to ₹30,000 / year for Degree & Professional Courses',
    deadline: 'Nov 30, 2026',
    status: 'Open Now',
    summary: 'Unified central government scholarship portal offering central sector schemes, Post-Matric Minority scholarships, Merit-cum-Means (MCM) for technical and professional education, and central disability allowances.',
    documentsRequired: [
      'Student Aadhaar Card with linked mobile',
      'Academic Marksheet with minimum 50% marks',
      'Annual Family Income Certificate (< ₹2.5 Lakh)',
      'Minority Community Self-Declaration',
      'Bank Account details (Aadhaar Seeded)',
      'Institution Bonafide Verification Form',
    ],
    officialPortal: 'https://scholarships.gov.in',
    features: [
      'Central Sector Scheme of Scholarships',
      'Post-Matric Scholarship for Minorities',
      'Merit-cum-Means (MCM) for Technical/Professional',
      'Institute Verification & Biometric OTR Assistance',
    ],
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
    features: ['Precision Beveled Mount Border', 'Dust-Proof Air-Tight Back Sealing', 'Easy Swivel Wall Mounting Clamps', 'Sturdy Desktop Kickstand'],
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
    packaging: 'Rigid Textured Matte Box with Satin Inner Lining and Wax Seal Ribbon',
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
    packaging: 'Handcrafted Chest with Gold Foil Lettering, Organza Ribbons and Wax Stamp',
    features: ['Custom Theme Color Coordination', 'Bulk Discounts for Wedding Hampers', 'Complete Customization on WhatsApp'],
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
    packaging: 'Sleek Gift Box tied with Double Satin Bow and Personalized Name Tag',
    features: ['Instant Photo Upload via WhatsApp', 'Ready to Gift Unboxing Presentation', 'Affordable Premium Quality'],
  },
];
