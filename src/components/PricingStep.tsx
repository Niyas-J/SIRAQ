import { useState } from 'react';
import type { ProductConfig, PricingDetails, PaperType } from '../types/order';
import { PAPER_PRICING } from '../types/order';
import { calculateDeliveryTime } from '../utils/orderUtils';

interface PricingStepProps {
  product: ProductConfig;
  onSubmit: (pricing: PricingDetails) => void;
  onBack: () => void;
}

const PricingStep = ({ product, onSubmit, onBack }: PricingStepProps) => {
  const [quantity, setQuantity] = useState(1);
  const [paperType, setPaperType] = useState<PaperType>('standard');

  const paperUpcharge = PAPER_PRICING[paperType].upcharge;
  const unitPrice = product.basePrice + paperUpcharge;
  const totalPrice = unitPrice * quantity;
  const estimatedDelivery = calculateDeliveryTime(product.id, quantity);

  const handleSubmit = () => {
    const pricing: PricingDetails = {
      basePrice: product.basePrice,
      quantity,
      paperType,
      paperUpcharge,
      unitPrice,
      totalPrice,
      estimatedDelivery,
    };
    onSubmit(pricing);
  };

  return (
    <div className="space-y-6">
      {/* Quantity */}
      <div>
        <label className="mb-2 block text-sm font-medium text-white">
          Quantity <span className="text-[#F9B234]">*</span>
        </label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="glass w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#F9B234]/50"
        />
      </div>

      {/* Paper Type */}
      <div>
        <label className="mb-3 block text-sm font-medium text-white">
          Paper / Material Type
        </label>
        <div className="space-y-3">
          {(Object.keys(PAPER_PRICING) as PaperType[]).map((type) => (
            <label
              key={type}
              className={`glass flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                paperType === type
                  ? 'border-[#F9B234] bg-[#F9B234]/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paperType"
                  value={type}
                  checked={paperType === type}
                  onChange={(e) => setPaperType(e.target.value as PaperType)}
                  className="h-4 w-4 accent-[#F9B234]"
                />
                <div>
                  <p className="font-medium text-white">{PAPER_PRICING[type].name}</p>
                  {PAPER_PRICING[type].upcharge > 0 && (
                    <p className="text-xs text-[#9CA5C2]">
                      +₹{PAPER_PRICING[type].upcharge} per unit
                    </p>
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <div className="glass rounded-2xl border border-[#15F4EE]/30 bg-[#15F4EE]/5 p-6">
        <h3 className="mb-4 font-display text-lg text-white">Price Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-[#9CA5C2]">
            <span>Base Price:</span>
            <span>₹{product.basePrice}</span>
          </div>
          {paperUpcharge > 0 && (
            <div className="flex justify-between text-[#9CA5C2]">
              <span>Paper Upcharge:</span>
              <span>+₹{paperUpcharge}</span>
            </div>
          )}
          <div className="flex justify-between text-[#9CA5C2]">
            <span>Unit Price:</span>
            <span>₹{unitPrice}</span>
          </div>
          <div className="flex justify-between text-[#9CA5C2]">
            <span>Quantity:</span>
            <span>× {quantity}</span>
          </div>
          <div className="border-t border-white/10 pt-2"></div>
          <div className="flex justify-between text-lg font-semibold text-white">
            <span>Total Price:</span>
            <span className="text-[#F9B234]">₹{totalPrice}</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-[#15F4EE]">
            <span>⚡</span>
            <span>Estimated Delivery: {estimatedDelivery}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:-translate-y-1"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 rounded-full bg-gradient-to-r from-[#F9B234] to-[#15F4EE] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#06070C] shadow-[0_20px_45px_rgba(21,244,238,0.35)] transition hover:-translate-y-1"
        >
          Preview Order
        </button>
      </div>
    </div>
  );
};

export default PricingStep;
