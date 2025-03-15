import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">AutoBebe</Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Open menu</span>
          <svg 
            className="h-6 w-6" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        
        {/* Desktop menu */}
        <div className="hidden md:flex space-x-4">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/appointments" className="nav-link">Appointments</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </div>
        
        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md p-4 z-50">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/services" className="nav-link" onClick={() => setIsOpen(false)}>Services</Link>
              <Link to="/appointments" className="nav-link" onClick={() => setIsOpen(false)}>Appointments</Link>
              <Link to="/about" className="nav-link" onClick={() => setIsOpen(false)}>About</Link>
              <Link to="/contact" className="nav-link" onClick={() => setIsOpen(false)}>Contact</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;