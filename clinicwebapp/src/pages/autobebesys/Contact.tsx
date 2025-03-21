import React, { useState, useEffect } from 'react';
import Button from '../../components/autobebesys/Button';

export default function Contact() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Set mounted to true to enable animations after component is mounted
    setMounted(true);
    // Scroll to top when component mounts
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
    // Here you would typically send the form data to a backend service
    console.log('Form submitted:', formData);
    // Show success message
    setSubmitted(true);
    // Reset form after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <div className="relative bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Contact Us
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Have questions about our healthcare solutions? We're here to help.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16">
            {/* Contact Form */}
            <div className={`${mounted ? 'animate-fadeIn' : 'opacity-0'}`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and one of our team members will get back to you as soon as possible.
              </p>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Thank You!</h3>
                  <p className="text-green-700">
                    Your message has been received. Our team will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 border"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 border"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 border"
                      placeholder="(123) 456-7890"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      I'm interested in
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 border"
                    >
                      <option value="">Please select an option</option>
                      <option value="JoyTriage">JoyTriage Patient Platform</option>
                      <option value="Demo">Scheduling a Demo</option>
                      <option value="Partnership">Partnership Opportunities</option>
                      <option value="Support">Technical Support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 border"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="mt-12 lg:mt-0">
              <div className={`${mounted ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '100ms' }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Headquarters</h3>
                    <p className="text-gray-600">123 Healthcare Avenue</p>
                    <p className="text-gray-600">Suite 500</p>
                    <p className="text-gray-600">San Francisco, CA 94107</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                    <p className="text-gray-600">Main: (415) 555-1234</p>
                    <p className="text-gray-600">Support: (415) 555-5678</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-600">General: info@autobebe.com</p>
                    <p className="text-gray-600">Support: support@autobebe.com</p>
                    <p className="text-gray-600">Sales: sales@autobebe.com</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                    <p className="text-gray-600">Saturday - Sunday: Closed</p>
                  </div>
                </div>
                
                {/* Map Placeholder */}
                <div className="rounded-lg overflow-hidden h-64 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500 text-center px-4">
                    Map of our location would be displayed here.
                    <br />
                    Integration with Google Maps or similar service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Our Network Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`max-w-3xl mx-auto ${mounted ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Join Our Healthcare Network</h2>
            <p className="text-lg text-gray-600 mb-8">
              Interested in becoming a partner, integrating with our platform, or working at AutoBebe? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button to="/careers" variant="outline" size="lg">
                View Career Opportunities
              </Button>
              <Button to="/partnerships" variant="primary" size="lg">
                Partner With Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 