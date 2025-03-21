import React, { useState, useEffect } from 'react';
import Button from '../../components/autobebesys/Button';

export default function About() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true to enable animations after component is mounted
    setMounted(true);
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <div className="relative bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              About AutoBebe
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Transforming healthcare through innovative technology solutions
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className={`${mounted ? 'animate-fadeIn' : 'opacity-0'}`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At AutoBebe Healthcare, our mission is to revolutionize healthcare delivery by creating intuitive, accessible, and secure technology solutions that empower both healthcare providers and patients.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We believe that modern healthcare should be patient-centered, data-driven, and seamlessly connected. Our platforms bridge the gap between medical professionals and the people they serve, making quality care more accessible to everyone.
              </p>
              <p className="text-gray-600 leading-relaxed">
                By leveraging cutting-edge technology, we're building a future where healthcare is more efficient, personalized, and effective - improving outcomes and experiences for all.
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
                  alt="Healthcare professionals in a meeting"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 mt-10 lg:mt-0">
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
                  alt="Medical technology development"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className={`order-1 lg:order-2 ${mounted ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '150ms' }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                AutoBebe Healthcare was founded in 2018 by a team of healthcare professionals, software engineers, and patient advocates who recognized the need for better digital solutions in the medical field.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                What began as a simple tool to streamline appointment scheduling has evolved into a comprehensive healthcare ecosystem that serves thousands of medical practices and patients worldwide.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our growth has been fueled by a dedication to constant innovation, rigorous security standards, and an unwavering focus on improving healthcare outcomes through technology.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Leadership Team</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Experts from healthcare and technology working together to transform the industry
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Dr. Sarah Chen",
                role: "Chief Executive Officer",
                bio: "Former practicing physician with 15+ years of healthcare experience and a passion for healthcare innovation.",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              },
              {
                name: "Michael Rodriguez",
                role: "Chief Technology Officer",
                bio: "Software architect with a background in healthcare IT and secure systems design.",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              },
              {
                name: "Dr. James Wilson",
                role: "Chief Medical Officer",
                bio: "Board-certified internist focused on improving clinical workflows and patient outcomes through technology.",
                image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              }
            ].map((member, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-xl shadow-md overflow-hidden ${mounted ? 'animate-fadeIn' : 'opacity-0'}`}
                style={{ animationDelay: `${(index + 1) * 150}ms` }}
              >
                <div className="h-64 bg-gray-200">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              The principles that guide our work and define our culture
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Patient-Centered",
                description: "We design all our solutions with patients' needs and experiences at the forefront."
              },
              {
                title: "Security & Privacy",
                description: "We maintain the highest standards of data protection and privacy in everything we do."
              },
              {
                title: "Innovation",
                description: "We continuously push boundaries to develop new solutions to healthcare challenges."
              },
              {
                title: "Accessibility",
                description: "We're committed to making quality healthcare technology available to everyone."
              }
            ].map((value, index) => (
              <div 
                key={index} 
                className={`bg-white p-6 rounded-xl shadow-md ${mounted ? 'animate-fadeIn' : 'opacity-0'}`}
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Healthcare Revolution</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Experience how AutoBebe can transform healthcare delivery and management for your practice or personal health needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button to="/demo" variant="white" size="lg">
              Request a Demo
            </Button>
            <Button to="/contact" variant="secondary" size="lg">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 