import React from 'react';
import Home from './autobebesys/Home';
import MedicalScene from '../components/MedicalScene';
import PublicLayout from '../components/PublicLayout';

const LandingPage = () => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Background Medical AI Visualization */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <MedicalScene />
      </div>
      
      {/* Content with PublicLayout */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <PublicLayout>
          <Home />
        </PublicLayout>
      </div>
    </div>
  );
};

export default LandingPage; 