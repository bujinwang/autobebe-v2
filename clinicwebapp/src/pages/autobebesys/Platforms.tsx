import React, { useState, useEffect } from 'react';
import Button from '../../components/autobebesys/Button';

export default function Platforms() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <h1 className="text-5xl font-bold text-center text-gray-900">
          Our Platforms
        </h1>
        <div className="w-24 h-1 bg-blue-500 mx-auto mt-6 rounded-full"></div>
      </div>

      {/* Platforms Cards Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-12">
          {/* JoyTriage Patient Platform Card */}
          <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="p-8 sm:p-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                JoyTriage Patient Platform
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Innovative patient-centered application that simplifies healthcare access. Smart symptom assessment, secure provider messaging, and seamless appointment scheduling.
              </p>
              <Button to="/joytriage" variant="primary" size="lg" className="w-full sm:w-auto">
                Enter JoyTriage
              </Button>
            </div>
            <div className="relative h-64 sm:h-96 bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
                alt="JoyTriage platform interface"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Clinic Management Platform Card */}
          <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '150ms' }}>
            <div className="p-8 sm:p-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Clinic Management Platform
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Comprehensive healthcare management system designed for medical practices. Streamline operations, enhance patient care, and improve efficiency.
              </p>
              <Button to="/demo" variant="primary" size="lg" className="w-full sm:w-auto">
                Request Demo
              </Button>
            </div>
            <div className="relative h-64 sm:h-96 bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
                alt="Clinic platform dashboard"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid Section */}
      <div className="bg-gray-50 py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Scheduling",
                description: "Intelligent appointment management with automated reminders and waitlist optimization."
              },
              {
                title: "Secure Communication",
                description: "HIPAA-compliant messaging between providers and patients."
              },
              {
                title: "Health Records",
                description: "Comprehensive electronic health records with easy access and updates."
              },
              {
                title: "Analytics Dashboard",
                description: "Real-time insights and reporting for informed decision-making."
              },
              {
                title: "Mobile Access",
                description: "Full platform functionality on any device, anywhere."
              },
              {
                title: "Integration Ready",
                description: "Seamless integration with existing healthcare systems."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Healthcare Practice?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Experience how our platforms can revolutionize your healthcare delivery
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button to="/demo" variant="white" size="lg">
              Request Demo
            </Button>
            <Button to="/contact" variant="secondary" size="lg">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 