import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FeatureIcon from '../../components/autobebesys/FeatureIcon';
import Button from '../../components/autobebesys/Button';

export default function Home() {
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
    dashboard: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    appointment: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    patient: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    security: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    messaging: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
    health: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-800 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-blue-900 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div 
            className={`max-w-3xl ${mounted ? 'animate-fadeIn' : 'opacity-0'}`}
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              AutoBebe Healthcare Platform
            </h1>
            <p className="text-xl text-gray-300 max-w-xl">
              Transforming healthcare delivery with integrated solutions for clinics and patients
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button to="/demo" variant="primary" size="lg">
                Request Demo
              </Button>
              <Button to="#platforms" variant="secondary" size="lg">
                Our Platforms
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Platforms Section */}
      <div id="platforms" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Platforms</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 mb-8 rounded-full"></div>
          </div>

          <div className="mx-auto max-w-4xl">
            {/* JoyTriage Patient Platform */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-all hover:shadow-xl">
              <div className="h-64 sm:h-80 bg-[url('https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>
              </div>
              <div className="p-8 sm:p-10">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">JoyTriage Patient Platform</h3>
                <p className="text-gray-600 text-lg mb-8">
                  Innovative patient-centered application that simplifies healthcare access. Smart symptom assessment, secure provider messaging, and seamless appointment scheduling.
                </p>
                <div className="flex justify-start">
                  <Button to="/joytriage" variant="primary" size="lg">
                    Enter JoyTriage
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted Healthcare Partner Section */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Trusted Healthcare Technology Partner</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            AutoBebe connects healthcare providers with patients through secure, intuitive technology. Our mission is to improve healthcare outcomes by making quality care more accessible, efficient, and personalized.
          </p>
          <Button href="/contact" variant="white" size="lg">
            Learn More
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className={mounted ? 'animate-fadeIn' : 'opacity-0'}>
              <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
              <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 mb-8 rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: iconPaths.dashboard,
                title: "Dashboard Analytics",
                description: "Interactive data visualization tools providing actionable insights into clinic performance and patient flow."
              },
              {
                icon: iconPaths.appointment,
                title: "Appointment Management",
                description: "Smart scheduling system with automated reminders, waitlist management, and optimized provider calendars."
              },
              {
                icon: iconPaths.patient,
                title: "Patient Records",
                description: "Comprehensive EHR system with customizable templates, secure document storage, and integrated medical history tracking."
              },
              {
                icon: iconPaths.messaging,
                title: "Secure Messaging",
                description: "HIPAA-compliant communication platform connecting patients directly with their healthcare providers."
              },
              {
                icon: iconPaths.health,
                title: "Health Monitoring",
                description: "Track vital signs and medication adherence with smart insights to better manage chronic conditions."
              },
              {
                icon: iconPaths.security,
                title: "Secure Access",
                description: "HIPAA-compliant security infrastructure with role-based permissions, audit trails, and advanced encryption."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ${mounted ? 'animate-fadeIn' : 'opacity-0'}`}
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="flex items-start">
                  <div className="shrink-0 mr-4">
                    <FeatureIcon path={feature.icon} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">AutoBebe Healthcare</h3>
              <p className="text-gray-400">
                Transforming healthcare delivery with integrated solutions for clinics and patients.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Products</h3>
              <ul className="space-y-2">
                <li><a href="http://localhost:3001/joytriage" className="text-gray-400 hover:text-white">JoyTriage Patient Platform</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="/careers" className="text-gray-400 hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#help" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#privacy" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#terms" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} AutoBebe Healthcare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 