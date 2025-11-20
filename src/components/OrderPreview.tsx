import type { OrderData, ProductConfig } from '../types/order';
import { PAPER_PRICING } from '../types/order';

interface OrderPreviewProps {
  orderData: OrderData;
  product: ProductConfig;
  uploadedFiles: File[];
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const OrderPreview = ({ 
  orderData, 
  product, 
  uploadedFiles, 
  onConfirm, 
  onBack,
  isSubmitting 
}: OrderPreviewProps) => {
  const { pricing } = orderData;

  return (
    <div className="space-y-6">
      {/* Product Info */}
      <div className="glass rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-4xl">{product.icon}</span>
          <div>
            <h3 className="font-display text-xl text-white">{product.name}</h3>
            <p className="text-sm text-[#9CA5C2]">Order Preview</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-3">
          {product.fields.map((field) => {
            const value = orderData[field.name];
            if (!value || field.type === 'file') return null;
            
            return (
              <div key={field.name} className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-sm text-[#9CA5C2]">{field.label}:</span>
                <span className="text-sm font-medium text-white">{value}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="glass rounded-2xl border border-white/10 bg-white/5 p-6">
          <h4 className="mb-3 text-sm font-medium text-white">Uploaded Files</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3"
              >
                {file.type.startsWith('image/') && (
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={file.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{file.name}</p>
                  <p className="text-xs text-[#9CA5C2]">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Summary */}
      <div className="glass rounded-2xl border border-[#15F4EE]/30 bg-[#15F4EE]/5 p-6">
        <h4 className="mb-4 font-display text-lg text-white">Price Breakdown</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-[#9CA5C2]">
            <span>Unit Price:</span>
            <span>₹{pricing.unitPrice}</span>
          </div>
          <div className="flex justify-between text-[#9CA5C2]">
            <span>Quantity:</span>
            <span>× {pricing.quantity}</span>
          </div>
          <div className="flex justify-between text-[#9CA5C2]">
            <span>Paper Type:</span>
            <span>{PAPER_PRICING[pricing.paperType].name}</span>
          </div>
          <div className="border-t border-white/10 pt-3"></div>
          <div className="flex justify-between text-xl font-semibold text-white">
            <span>Total:</span>
            <span className="text-[#F9B234]">₹{pricing.totalPrice}</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-[#15F4EE]">
            <span>⚡</span>
            <span>Delivery: {pricing.estimatedDelivery}</span>
          </div>
        </div>
      </div>

      {/* WhatsApp Notice */}
      <div className="rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💬</span>
          <div>
            <p className="text-sm font-medium text-white">Order via WhatsApp</p>
            <p className="mt-1 text-xs text-[#9CA5C2]">
              After confirmation, you'll be redirected to WhatsApp to complete your order with us.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:-translate-y-1 disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="flex-1 rounded-full bg-gradient-to-r from-[#F9B234] to-[#15F4EE] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#06070C] shadow-[0_20px_45px_rgba(21,244,238,0.35)] transition hover:-translate-y-1 disabled:opacity-50"
        >
          {isSubmitting ? 'Processing...' : 'Confirm & Send Order'}
        </button>
      </div>
    </div>
  );
};

export default OrderPreview;
