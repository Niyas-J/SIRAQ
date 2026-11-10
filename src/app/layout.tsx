import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIRAQ — Digital Citizen Services, Custom Gifting & Smart Print',
  description:
    'SIRAQ: Apple-inspired digital experience with premium sage green tones for CSC Citizen Services, bespoke photo frames, luxury hampers, and self-service QR Smart Printing.',
  icons: {
    icon: '/images/siraq-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className="bg-white min-h-screen text-[#25352B] antialiased selection:bg-[#F5D76E] selection:text-[#25352B]">
        {children}
      </body>
    </html>
  );
}
