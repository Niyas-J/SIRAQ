export type ProductType = 
  | 'wedding-card' 
  | 'id-card' 
  | 'poster' 
  | 'invitation'
  | 'custom-print'
  | 'graphic-work';

export type PaperType = 'standard' | 'premium' | 'luxury';

export interface ProductConfig {
  id: ProductType;
  name: string;
  icon: string;
  basePrice: number;
  fields: FormField[];
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'file' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface OrderFormData {
  productType: ProductType;
  [key: string]: any;
}

export interface PricingDetails {
  basePrice: number;
  quantity: number;
  paperType: PaperType;
  paperUpcharge: number;
  unitPrice: number;
  totalPrice: number;
  estimatedDelivery: string;
}

export interface OrderData extends OrderFormData {
  pricing: PricingDetails;
  uploadedFiles?: File[];
  orderId?: string;
}

export const PRODUCT_CONFIGS: ProductConfig[] = [
  {
    id: 'wedding-card',
    name: 'Wedding Card',
    icon: '💌',
    basePrice: 20,
    fields: [
      { name: 'brideName', label: 'Bride Name', type: 'text', required: true, placeholder: 'Enter bride name' },
      { name: 'groomName', label: 'Groom Name', type: 'text', required: true, placeholder: 'Enter groom name' },
      { name: 'weddingDate', label: 'Wedding Date', type: 'date', required: true, placeholder: '' },
      { name: 'venue', label: 'Venue', type: 'text', required: true, placeholder: 'Enter venue' },
      { name: 'photo', label: 'Upload Photo (Optional)', type: 'file', required: false, placeholder: '' },
    ],
  },
  {
    id: 'id-card',
    name: 'ID Card',
    icon: '💼',
    basePrice: 150,
    fields: [
      { name: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter full name' },
      { name: 'idNumber', label: 'ID / Roll Number', type: 'text', required: true, placeholder: 'Enter ID number' },
      { name: 'department', label: 'Department', type: 'text', required: true, placeholder: 'Enter department' },
      { name: 'photo', label: 'Upload Photo (Required)', type: 'file', required: true, placeholder: '' },
    ],
  },
  {
    id: 'poster',
    name: 'Poster',
    icon: '🖼️',
    basePrice: 150,
    fields: [
      { name: 'size', label: 'Size', type: 'select', required: true, options: ['A4', 'A3', 'A2', 'A1', 'Custom'], placeholder: '' },
      { name: 'orientation', label: 'Orientation', type: 'select', required: true, options: ['Portrait', 'Landscape'], placeholder: '' },
      { name: 'designChoice', label: 'Design Choice', type: 'select', required: true, options: ['Upload My Design', 'Request Design'], placeholder: '' },
      { name: 'design', label: 'Upload Design File', type: 'file', required: false, placeholder: '' },
    ],
  },
  {
    id: 'invitation',
    name: 'Event Invitation',
    icon: '🎉',
    basePrice: 15,
    fields: [
      { name: 'eventName', label: 'Event Name', type: 'text', required: true, placeholder: 'e.g., Birthday Party' },
      { name: 'eventDate', label: 'Event Date', type: 'date', required: true, placeholder: '' },
      { name: 'venue', label: 'Venue', type: 'text', required: true, placeholder: 'Enter venue' },
      { name: 'message', label: 'Special Message', type: 'textarea', required: false, placeholder: 'Any special message' },
      { name: 'design', label: 'Upload Design (Optional)', type: 'file', required: false, placeholder: '' },
    ],
  },
  {
    id: 'custom-print',
    name: 'Custom Print',
    icon: '🎨',
    basePrice: 100,
    fields: [
      { name: 'printType', label: 'Print Type', type: 'text', required: true, placeholder: 'e.g., Flyer, Brochure' },
      { name: 'size', label: 'Size', type: 'select', required: true, options: ['A4', 'A3', 'A2', 'Custom'], placeholder: '' },
      { name: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Describe your requirements' },
      { name: 'design', label: 'Upload Design', type: 'file', required: false, placeholder: '' },
    ],
  },
  {
    id: 'graphic-work',
    name: 'Graphic Design Work',
    icon: '✨',
    basePrice: 500,
    fields: [
      { name: 'projectType', label: 'Project Type', type: 'select', required: true, options: ['Logo Design', 'Brand Identity', 'Social Media Graphics', 'Custom Design'], placeholder: '' },
      { name: 'description', label: 'Project Description', type: 'textarea', required: true, placeholder: 'Describe your design needs' },
      { name: 'reference', label: 'Upload Reference (Optional)', type: 'file', required: false, placeholder: '' },
    ],
  },
];

export const PAPER_PRICING = {
  standard: { name: 'Standard', upcharge: 0 },
  premium: { name: 'Premium (Glossy)', upcharge: 5 },
  luxury: { name: 'Luxury (Textured)', upcharge: 10 },
};

export const CONTACT_INFO = {
  whatsapp: '+918217469646',
  email: 'niyasjahangeer772@gmail.com',
};
