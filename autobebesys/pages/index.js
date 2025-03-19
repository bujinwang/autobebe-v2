import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const FeatureIcon = ({ path }) => (
  <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md">
    <svg 
      className="w-5 h-5" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      style={{ maxWidth: '100%', height: 'auto' }}
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

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [faqOpen, setFaqOpen] = React.useState({});

  const toggleFaq = (id) => {
    setFaqOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Feature icons paths
  const iconPaths = {
    security: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    records: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    appointments: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    telehealth: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md fixed w-full top-0 z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">AutoBebeSys</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-6">
                <Link href="#features" className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-blue-500 transition-colors">
                  Features
                </Link>
                <Link href="#testimonials" className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-blue-500 transition-colors">
                  Testimonials
                </Link>
                <Link href="#faq" className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-blue-500 transition-colors">
                  FAQ
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link href="https://www.autobebesys.com/joytriage/signup" 
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-200">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24">
        <div className="container">
          <div className="relative z-10 pt-16 pb-8 sm:pt-20 sm:pb-12 md:pt-24 lg:pt-32">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                <span className="block text-gray-900 mb-3">Modern Healthcare</span>
                <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  for Modern Families
                </span>
              </h1>
              <p className="mt-5 text-lg text-gray-500 leading-relaxed">
                Streamline your pediatric practice with our comprehensive healthcare management system. 
                Designed for both healthcare providers and parents.
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://www.autobebesys.com/joytriage/signup"
                  className="px-6 py-3 text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Start Free Trial
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="#features"
                  className="px-6 py-3 text-base font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all duration-200"
                >
                  Learn More
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-sm text-blue-600 font-semibold tracking-wide uppercase mb-2">Features</h2>
              <p className="text-3xl font-bold text-gray-900 mb-4">
                Everything you need to manage your pediatric practice
              </p>
              <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
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
                icon: iconPaths.appointments,
                title: "Smart Scheduling",
                description: "AI-powered appointment management with automated reminders"
              },
              {
                icon: iconPaths.telehealth,
                title: "Telehealth Integration",
                description: "Secure video consultations with built-in health monitoring"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300"
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
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-sm text-blue-600 font-semibold tracking-wide uppercase mb-2">Testimonials</h2>
              <p className="text-3xl font-bold text-gray-900 mb-4">
                Trusted by Leading Healthcare Providers
              </p>
              <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                quote: "AutoBebeSys has completely transformed our practice. Our staff saves hours each day on administrative tasks.",
                author: "Dr. Sarah Johnson",
                role: "Pediatrician, Sunshine Children's Clinic"
              },
              {
                quote: "As a first-time parent, having all my baby's health information in one place has been incredible.",
                author: "Emma Rodriguez",
                role: "Parent of 8-month-old"
              },
              {
                quote: "The telehealth feature saved us during the pandemic. We were able to continue providing quality care.",
                author: "Dr. Michael Chen",
                role: "Medical Director, KidsCare Medical Group"
              },
              {
                quote: "The vaccination tracking system has dramatically improved our compliance rates by 30%.",
                author: "Lisa Patel",
                role: "Practice Manager, Little Stars Pediatrics"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex flex-col h-full">
                  <div className="flex-grow">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                      <svg className="h-3 w-3 text-blue-500" width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"/>
                      </svg>
                    </div>
                    <p className="text-gray-800 text-base leading-relaxed mb-4">{testimonial.quote}</p>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <p className="font-medium text-gray-900">{testimonial.author}</p>
                    <p className="text-blue-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase mb-3">FAQ</h2>
              <p className="text-4xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </p>
              <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </motion.div>
          </div>

          <div className="space-y-6">
            {[
              {
                id: 1,
                question: "Is AutoBebeSys HIPAA compliant?",
                answer: "Yes, AutoBebeSys is fully HIPAA compliant. We implement industry-leading security measures to ensure all patient data is encrypted and protected at all times."
              },
              {
                id: 2,
                question: "How do I get started with AutoBebeSys?",
                answer: "Getting started is simple! Sign up for a free trial, and our onboarding team will guide you through the setup process. We offer comprehensive training for your staff and can help migrate your existing patient data."
              },
              {
                id: 3,
                question: "Can patients access their records on mobile devices?",
                answer: "Absolutely! AutoBebeSys offers native mobile apps for both iOS and Android, allowing parents to access their children's health information anytime, anywhere."
              }
            ].map((faq) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-gray-50 rounded-2xl overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-blue-600 transform transition-transform duration-200 ${faqOpen[faq.id] ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`px-6 pb-4 ${faqOpen[faq.id] ? 'block' : 'hidden'}`}
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl mb-6">
              Ready to transform your pediatric practice?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://www.autobebesys.com/joytriage/signup"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                Start Free Trial
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://www.autobebesys.com/joytriage/contact"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-white border-2 border-white hover:bg-white/10 transition-colors duration-200"
              >
                Contact Sales
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4">
                AutoBebeSys
              </h3>
              <p className="text-gray-400 mb-4 max-w-md">
                Modern pediatric healthcare management for clinics and families.
              </p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <a
                    key={social}
                    href={`#${social}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <svg 
                      className="h-5 w-5" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2"
                        d={
                          social === 'facebook' 
                            ? "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            : social === 'twitter'
                            ? "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
                            : social === 'instagram'
                            ? "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                            : "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                        }
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Solutions</h3>
              <ul className="space-y-3">
                {['For Clinics', 'For Parents', 'For Networks', 'Integrations'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-3">
                {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-gray-400 text-center">
              &copy; {new Date().getFullYear()} AutoBebeSys Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  };
}
