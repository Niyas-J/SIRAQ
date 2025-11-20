import { useState, useEffect } from 'react';
import type { ProductType, OrderData, PricingDetails } from '../types/order';
import { PRODUCT_CONFIGS } from '../types/order';
import ProductDetailsForm from './ProductDetailsForm';
import PricingStep from './PricingStep';
import OrderPreview from './OrderPreview';
import { generateWhatsAppLink, generateOrderId } from '../utils/orderUtils';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct: ProductType | null;
}

type Step = 'product' | 'details' | 'pricing' | 'preview' | 'confirm';

const OrderModal = ({ isOpen, onClose, selectedProduct }: OrderModalProps) => {
  const [currentStep, setCurrentStep] = useState<Step>('product');
  const [orderData, setOrderData] = useState<Partial<OrderData>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedProduct && isOpen) {
      setOrderData({ productType: selectedProduct });
      setCurrentStep('details');
    }
  }, [selectedProduct, isOpen]);

  const handleProductSelect = (productType: ProductType) => {
    setOrderData({ productType });
    setCurrentStep('details');
  };

  const handleDetailsSubmit = (data: any, files: File[]) => {
    setOrderData(prev => ({ ...prev, ...data }));
    setUploadedFiles(files);
    setCurrentStep('pricing');
  };

  const handlePricingSubmit = (pricing: PricingDetails) => {
    setOrderData(prev => ({ ...prev, pricing }));
    setCurrentStep('preview');
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    
    try {
      const orderId = generateOrderId();
      const formData = new FormData();
      
      formData.append('orderId', orderId);
      formData.append('productType', orderData.productType!);
      formData.append('orderDetails', JSON.stringify(orderData));
      
      uploadedFiles.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });

      const response = await fetch('/api/orders', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const whatsappLink = generateWhatsAppLink({ ...orderData, orderId } as OrderData);
        window.open(whatsappLink, '_blank');
        
        onClose();
        resetModal();
      } else {
        alert('Order submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setCurrentStep('product');
    setOrderData({});
    setUploadedFiles([]);
  };

  const goBack = () => {
    const steps: Step[] = ['product', 'details', 'pricing', 'preview'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  if (!isOpen) return null;

  const currentProduct = orderData.productType 
    ? PRODUCT_CONFIGS.find(p => p.id === orderData.productType)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="glass relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-[0_25px_60px_rgba(4,6,16,0.75)]">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl md:text-3xl text-white">
              {currentProduct ? `${currentProduct.icon} ${currentProduct.name}` : 'Select Product'}
            </h2>
            <div className="mt-2 flex gap-2">
              {['details', 'pricing', 'preview'].map((step, idx) => (
                <div
                  key={step}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    ['details', 'pricing', 'preview'].indexOf(currentStep) >= idx
                      ? 'bg-gradient-to-r from-[#F9B234] to-[#15F4EE]'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-3xl leading-none transition"
          >
            ×
          </button>
        </div>

        {/* Product Selection */}
        {currentStep === 'product' && (
          <div className="grid gap-4 sm:grid-cols-2">
            {PRODUCT_CONFIGS.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductSelect(product.id)}
                className="glass group rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition hover:-translate-y-1 hover:border-[#F9B234]/50"
              >
                <div className="mb-3 text-4xl">{product.icon}</div>
                <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                <p className="mt-1 text-sm text-[#9CA5C2]">Starting at ₹{product.basePrice}</p>
              </button>
            ))}
          </div>
        )}

        {/* Details Form */}
        {currentStep === 'details' && currentProduct && (
          <ProductDetailsForm
            product={currentProduct}
            onSubmit={handleDetailsSubmit}
            onBack={goBack}
            initialData={orderData}
          />
        )}

        {/* Pricing Step */}
        {currentStep === 'pricing' && currentProduct && (
          <PricingStep
            product={currentProduct}
            onSubmit={handlePricingSubmit}
            onBack={goBack}
          />
        )}

        {/* Preview Step */}
        {currentStep === 'preview' && currentProduct && (
          <OrderPreview
            orderData={orderData as OrderData}
            product={currentProduct}
            uploadedFiles={uploadedFiles}
            onConfirm={handleConfirmOrder}
            onBack={goBack}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};

export default OrderModal;
