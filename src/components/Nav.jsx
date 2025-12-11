// src/Nav.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // DODAJ OVAJ IMPORT
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import Logo from './Logo';

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  
  // Pročitaj broj stavki iz localStorage
  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('snkrz_cart') || '[]');
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemsCount(totalItems);
    } catch (error) {
      console.error('Greška pri čitanju korpe:', error);
      setCartItemsCount(0);
    }
  };
  
  useEffect(() => {
    updateCartCount();
    
    const handleCartUpdate = () => {
      updateCartCount();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    window.addEventListener('storage', (e) => {
      if (e.key === 'snkrz_cart') {
        updateCartCount();
      }
    });
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);
  
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo i desktop navigation */}
          <div className="flex items-center">
            {/* ZAMENI <a> SA <Link> */}
            <Link to="/" className="flex items-center space-x-3">
              <Logo className="h-12 w-12" />
              <span className="text-2xl font-bold text-gray-900 hidden sm:block">
                SNKRZ<span className="text-blue-600">.</span>
              </span>
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {/* ZAMENI SVE <a> SA <Link> */}
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-md font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-md font-medium transition-colors duration-200"
              >
                Proizvodi
              </Link>
              <Link
                to="/cart"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-md font-medium transition-colors duration-200"
              >
                Korpa
              </Link>
            </div>
          </div>

          {/* Desktop cart and mobile menu button */}
          <div className="flex items-center space-x-6">
            {/* Cart Icon with counter - ZAMENI <a> SA <Link> */}
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
            >
              <div className="p-2 rounded-lg group-hover:bg-blue-50 transition-colors duration-200">
                <ShoppingBag className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount > 9 ? '9+' : cartItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:block text-xs text-gray-500 text-center mt-1">
                Korpa
              </span>
            </Link>

            {/* User Account */}
           

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - ZAMENI <a> SA <Link> */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Proizvodi
            </Link>
            <Link
              to="/cart"
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 flex items-center justify-between"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Korpa</span>
              {cartItemsCount > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            {/* Mobile account link */}
            <Link
              to="/account"
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="h-5 w-5 inline mr-2" />
              Moj nalog
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;