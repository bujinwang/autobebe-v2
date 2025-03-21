import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FeatureIcon from '../../components/autobebesys/FeatureIcon';
import Button from '../../components/autobebesys/Button';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true to enable animations after component is mounted
    setMounted(true);
  }, []);

  const toggleFaq = (id: string) => {
    setFaqOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Feature icons paths
  const iconPaths = {
    security: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    records: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    telehealth: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
    aiMedical: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">AutoBebeSys</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="#features" className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-blue-500 transition-colors">
                  Features
                </a>
                <a href="#testimonials" className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-blue-500 transition-colors">
                  Testimonials
                </a>
                <a href="#faq" className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-blue-500 transition-colors">
                  FAQ
                </a>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              <Button to="/joytriage" variant="outline" size="md">
                JoyTriage Login
              </Button>
              <Button to="/joytriage/signup" variant="primary" size="md">
                Get Started Free
              </Button>
            </div>
            <div className="flex items-center sm:hidden">
              <button 
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'} fixed top-16 inset-x-0 z-40 bg-white border-b border-gray-200 transition-all duration-300 ease-in-out`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a href="#features" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Features
          </a>
          <a href="#testimonials" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Testimonials
          </a>
          <a href="#faq" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            FAQ
          </a>
          <div className="pt-4 pb-2 border-t border-gray-200">
            <div className="mb-3">
              <Button to="/joytriage" variant="outline" size="md" fullWidth onClick={() => setIsMenuOpen(false)}>
                JoyTriage Login
              </Button>
            </div>
            <div>
              <Button to="/joytriage/signup" variant="primary" size="md" fullWidth onClick={() => setIsMenuOpen(false)}>
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 pt-20 pb-8 sm:pt-24 sm:pb-12 md:pt-32 lg:pt-40">
            <div 
              className={`text-center max-w-3xl mx-auto ${mounted ? 'animate-fadeIn' : 'opacity-0'}`}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                <span className="block text-gray-900 mb-3">Modern Healthcare</span>
                <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  for Modern Families
                </span>
              </h1>
              <p className="mt-5 text-lg text-gray-500 leading-relaxed">
                Streamline your medical practice with our comprehensive healthcare management system. 
                Designed for both healthcare providers and parents.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                <Button to="/joytriage/signup" variant="primary" size="lg">
                  Start Free Trial
                </Button>
                <Button href="#features" variant="secondary" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className={mounted ? 'animate-fadeIn' : 'opacity-0'}>
              <h2 className="text-sm text-blue-600 font-semibold tracking-wide uppercase mb-2">Features</h2>
              <p className="text-3xl font-bold text-gray-900 mb-4">
                Everything you need to manage your medical practice
              </p>
              <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {[
              {
                icon: iconPaths.security,
                title: "Advanced Security",
                description: "HIPAA-compliant security measures to protect sensitive patient data"
              },
              {
                icon: iconPaths.records,
                title: "Patient Records",
                description: "Comprehensive digital health records accessible anytime, anywhere"
              },
              {
                icon: iconPaths.telehealth,
                title: "Telehealth Integration",
                description: "Secure video consultations with built-in health monitoring"
              },
              {
                icon: iconPaths.aiMedical,
                title: "AI Medical Assistant",
                description: "AI-powered dynamic doctor-like questions, specialized waiting instructions, suggested treatments and prescriptions"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`relative bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300 ${mounted ? 'animate-fadeIn' : 'opacity-0'}`}
                style={{ animationDelay: `${(index + 1) * 150}ms` }}
              >
                <div className="flex items-start space-x-5">
                  <div className="shrink-0">
                    <FeatureIcon path={feature.icon} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className={mounted ? 'animate-fadeIn' : 'opacity-0'}>
              <h2 className="text-sm text-blue-600 font-semibold tracking-wide uppercase mb-2">Testimonials</h2>
              <p className="text-3xl font-bold text-gray-900 mb-4">
                Trusted by healthcare professionals
              </p>
              <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section (placeholder) */}
      <div id="faq" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className={mounted ? 'animate-fadeIn' : 'opacity-0'}>
              <h2 className="text-sm text-blue-600 font-semibold tracking-wide uppercase mb-2">FAQ</h2>
              <p className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </p>
              <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 