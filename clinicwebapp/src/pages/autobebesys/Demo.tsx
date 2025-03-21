import React, { useState, useEffect } from 'react';
import Button from '../../components/autobebesys/Button';

export default function Demo() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    phone: '',
    platformInterest: 'clinic', // clinic, patient, or both
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Demo request submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        company: '',
        role: '',
        phone: '',
        platformInterest: 'clinic',
        message: ''
      });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Experience AutoBebe in Action
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
              See how our healthcare solutions can transform your practice with a personalized demo
            </p>
          </div>
        </div>
      </div>

      {/* Demo Request Form Section */}
      <div className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`${mounted ? 'animate-fadeIn' : 'opacity-0'}`}>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-center">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Thank You!</h3>
                <p className="text-green-700">
                  Your demo request has been received. Our team will contact you within 24 hours to schedule your personalized demo.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 border"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Work Email*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 border"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company/Organization*
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 border"
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Role*
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      required
                      value={formData.role}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 border"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 border"
                    />
                  </div>

                  <div>
                    <label htmlFor="platformInterest" className="block text-sm font-medium text-gray-700 mb-1">
                      Platform Interest*
                    </label>
                    <select
                      id="platformInterest"
                      name="platformInterest"
                      required
                      value={formData.platformInterest}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 border"
                    >
                      <option value="clinic">Clinic Platform</option>
                      <option value="patient">Patient Platform</option>
                      <option value="both">Both Platforms</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Information
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 border"
                    placeholder="Tell us about your specific needs or any questions you have..."
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Request Demo
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Features Preview Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What You'll See in the Demo</h2>
            <p className="mt-4 text-lg text-gray-600">
              Get a comprehensive look at our platform's capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Intuitive Dashboard",
                description: "Experience our user-friendly interface designed specifically for healthcare providers."
              },
              {
                title: "Patient Management",
                description: "See how easily you can manage patient records, appointments, and communications."
              },
              {
                title: "Analytics & Reporting",
                description: "Preview powerful insights and reporting capabilities to optimize your practice."
              },
              {
                title: "Security Features",
                description: "Learn about our robust security measures ensuring HIPAA compliance."
              },
              {
                title: "Integration Capabilities",
                description: "Discover how our platform integrates with your existing systems."
              },
              {
                title: "Mobile Experience",
                description: "See the platform in action on mobile devices for on-the-go access."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-lg shadow-md ${mounted ? 'animate-fadeIn' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 