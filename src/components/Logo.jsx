// components/Logo.jsx
import React from 'react';

const Logo = ({ className = "h-10 w-10" }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Osnova patike */}
      <path 
        d="M20 60Q30 40 40 35Q50 30 60 35Q70 40 80 60Q75 80 65 85Q50 90 35 85Q25 80 20 60Z" 
        fill="#3B82F6" 
        stroke="#1D4ED8" 
        strokeWidth="2"
      />
      
      {/* Jezičak */}
      <path 
        d="M45 40L55 40Q57 45 55 50Q53 55 50 55Q47 55 45 50Q43 45 45 40Z" 
        fill="#1D4ED8" 
      />
      
      {/* Šnire */}
      <path 
        d="M40 45L60 45" 
        stroke="#FFFFFF" 
        strokeWidth="3" 
        strokeLinecap="round"
      />
      <path 
        d="M40 50L60 50" 
        stroke="#FFFFFF" 
        strokeWidth="3" 
        strokeLinecap="round"
      />
      <path 
        d="M40 55L60 55" 
        stroke="#FFFFFF" 
        strokeWidth="3" 
        strokeLinecap="round"
      />
      
      {/* Dizajn detalji */}
      <path 
        d="M30 65Q35 70 45 70Q50 70 55 70Q65 70 70 65" 
        stroke="#1D4ED8" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      
      {/* Tekst */}
      <text 
        x="50" 
        y="95" 
        textAnchor="middle" 
        fill="#1D4ED8" 
        fontSize="12" 
        fontWeight="bold"
      >
        SNKRZ
      </text>
    </svg>
  );
};

export default Logo;