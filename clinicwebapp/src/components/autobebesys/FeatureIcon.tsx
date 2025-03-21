import React from 'react';

interface FeatureIconProps {
  path: string;
}

const FeatureIcon: React.FC<FeatureIconProps> = ({ path }) => (
  <div className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200">
    <svg 
      className="w-6 h-6" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d={path} 
      />
    </svg>
  </div>
);

export default FeatureIcon; 