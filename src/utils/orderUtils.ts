import type { OrderData } from '../types/order';

export const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `SIRQ-2025-${timestamp}${random}`.toUpperCase();
};

export const generateWhatsAppLink = (orderData: OrderData): string => {
  const { productType, pricing, orderId } = orderData;
  let message = '';

  switch (productType) {
    case 'wedding-card':
      message = `SIRAQ Order — WEDDING CARD
Bride: ${orderData.brideName}
Groom: ${orderData.groomName}
Date: ${orderData.weddingDate}
Venue: ${orderData.venue}
Quantity: ${pricing.quantity}
Total Price: ₹${pricing.totalPrice}
Order ID: ${orderId}
My Email: niyasjahangeer772@gmail.com`;
      break;

    case 'id-card':
      message = `SIRAQ Order — ID CARD
Name: ${orderData.fullName}
ID No: ${orderData.idNumber}
Department: ${orderData.department}
Quantity: ${pricing.quantity}
Total Price: ₹${pricing.totalPrice}
Order ID: ${orderId}`;
      break;

    case 'poster':
      message = `SIRAQ Order — POSTER ${orderData.designChoice === 'Request Design' ? 'DESIGN' : ''}
Size: ${orderData.size}
Orientation: ${orderData.orientation}
${orderData.designChoice === 'Request Design' ? 'Request: Custom Design Needed' : 'Design: Uploaded'}
Quantity: ${pricing.quantity}
Total Price: ₹${pricing.totalPrice}
Order ID: ${orderId}`;
      break;

    case 'invitation':
      message = `SIRAQ Order — EVENT INVITATION
Event: ${orderData.eventName}
Date: ${orderData.eventDate}
Venue: ${orderData.venue}
Quantity: ${pricing.quantity}
Total Price: ₹${pricing.totalPrice}
Order ID: ${orderId}`;
      break;

    case 'custom-print':
      message = `SIRAQ Order — CUSTOM PRINT
Type: ${orderData.printType}
Size: ${orderData.size}
Description: ${orderData.description}
Quantity: ${pricing.quantity}
Total Price: ₹${pricing.totalPrice}
Order ID: ${orderId}`;
      break;

    case 'graphic-work':
      message = `SIRAQ Order — GRAPHIC DESIGN WORK
Project Type: ${orderData.projectType}
Description: ${orderData.description}
Total Price: ₹${pricing.totalPrice}
Order ID: ${orderId}`;
      break;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/918217469646?text=${encodedMessage}`;
};

export const calculateDeliveryTime = (productType: string, quantity: number): string => {
  if (productType === 'graphic-work') {
    return '3-5 business days';
  }
  
  if (quantity <= 50) {
    return '24-48 hours';
  } else if (quantity <= 200) {
    return '2-3 business days';
  } else {
    return '4-7 business days';
  }
};
