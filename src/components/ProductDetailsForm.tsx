import { useState } from 'react';
import type { ProductConfig } from '../types/order';

interface ProductDetailsFormProps {
  product: ProductConfig;
  onSubmit: (data: any, files: File[]) => void;
  onBack: () => void;
  initialData?: any;
}

const ProductDetailsForm = ({ product, onSubmit, onBack, initialData }: ProductDetailsFormProps) => {
  const [formData, setFormData] = useState<any>(initialData || {});
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
    setFormData((prev: any) => ({ ...prev, [fieldName]: selectedFiles[0]?.name || '' }));
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    product.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData, files);
    }
  };

  const showWhatsAppForDesign = formData.designChoice === 'Request Design';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {product.fields.map((field) => {
        if (field.name === 'design' && showWhatsAppForDesign) {
          return (
            <div key={field.name} className="rounded-2xl border border-[#F9B234]/30 bg-[#F9B234]/10 p-4">
              <p className="mb-3 text-sm text-white">Need a custom design? Contact us on WhatsApp!</p>
              <a
                href="https://wa.me/918217469646?text=Hi%2C%20I%20need%20a%20custom%20design%20for%20my%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                <span>💬</span> Contact on WhatsApp
              </a>
            </div>
          );
        }

        return (
          <div key={field.name}>
            <label className="mb-2 block text-sm font-medium text-white">
              {field.label} {field.required && <span className="text-[#F9B234]">*</span>}
            </label>
            
            {field.type === 'text' || field.type === 'date' || field.type === 'number' ? (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="glass w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#F9B234]/50"
              />
            ) : field.type === 'textarea' ? (
              <textarea
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                placeholder={field.placeholder}
                rows={3}
                className="glass w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#F9B234]/50"
              />
            ) : field.type === 'select' ? (
              <select
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className="glass w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#F9B234]/50"
              >
                <option value="">Select {field.label}</option>
                {field.options?.map(option => (
                  <option key={option} value={option} className="bg-[#0a0c18]">
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'file' ? (
              <div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, field.name)}
                  className="glass w-full rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-6 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-[#F9B234] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#06070C] hover:file:bg-[#15F4EE]"
                />
                {formData[field.name] && (
                  <p className="mt-2 text-xs text-[#9CA5C2]">
                    ✓ {formData[field.name]}
                  </p>
                )}
              </div>
            ) : null}
            
            {errors[field.name] && (
              <p className="mt-1 text-xs text-red-400">{errors[field.name]}</p>
            )}
          </div>
        );
      })}

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:-translate-y-1"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 rounded-full bg-gradient-to-r from-[#F9B234] to-[#15F4EE] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#06070C] shadow-[0_20px_45px_rgba(21,244,238,0.35)] transition hover:-translate-y-1"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default ProductDetailsForm;
