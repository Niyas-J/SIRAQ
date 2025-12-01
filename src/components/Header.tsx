import { useState, useEffect } from 'react';
import { getSiteConfig } from '../utils/firebaseUtils';

const Header = () => {
  const [logoUrl, setLogoUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const config = await getSiteConfig();
        setLogoUrl(config.logoUrl || '');
      } catch (error) {
        console.error('Error loading logo:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLogo();
  }, []);

  return (
    <header className="border-b border-white/10 bg-[#0F111A]/70 py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center">
          {loading ? (
            <div className="w-32 h-8 bg-gray-700 rounded animate-pulse"></div>
          ) : logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Siraq Studio logo" 
              className="h-8 md:h-12 lg:h-12 object-contain"
            />
          ) : (
            <h1 className="font-display text-xl md:text-2xl">SIRAQ Studio</h1>
          )}
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li><a href="#products" className="text-[#9CA5C2] hover:text-white transition">Products</a></li>
            <li><a href="#showcase" className="text-[#9CA5C2] hover:text-white transition">Showcase</a></li>
            <li><a href="#order" className="text-[#9CA5C2] hover:text-white transition">Order</a></li>
          </ul>
        </nav>
        <button className="md:hidden text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;