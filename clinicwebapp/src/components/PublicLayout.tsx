import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './autobebesys/Button';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-blue-600">AutoBebe</Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link 
                  to="/" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    window.location.pathname === '/' 
                      ? 'border-blue-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  to="/platforms" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    window.location.pathname === '/platforms' 
                      ? 'border-blue-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Our Platforms
                </Link>
                <Link 
                  to="/joytriage" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    window.location.pathname === '/joytriage' 
                      ? 'border-blue-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  JoyTriage
                </Link>
                <Link 
                  to="/about" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    window.location.pathname === '/about' 
                      ? 'border-blue-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    window.location.pathname === '/contact' 
                      ? 'border-blue-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Contact
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              <Button to="/login" variant="outline" size="md">
                Login
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {/* Menu icon */}
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* Close icon */}
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                window.location.pathname === '/'
                  ? 'border-blue-500 text-blue-700 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/platforms"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                window.location.pathname === '/platforms'
                  ? 'border-blue-500 text-blue-700 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Our Platforms
            </Link>
            <Link
              to="/joytriage"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                window.location.pathname === '/joytriage'
                  ? 'border-blue-500 text-blue-700 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              JoyTriage
            </Link>
            <Link
              to="/about"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                window.location.pathname === '/about'
                  ? 'border-blue-500 text-blue-700 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                window.location.pathname === '/contact'
                  ? 'border-blue-500 text-blue-700 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 px-4">
              <Button to="/login" variant="outline" size="md" fullWidth onClick={() => setIsMenuOpen(false)}>
                Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};

export default PublicLayout; 