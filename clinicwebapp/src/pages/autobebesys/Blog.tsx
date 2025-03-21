import React from 'react';
import { Link } from 'react-router-dom';

// Sample blog data (in a real project, this would come from an API or CMS)
const blogPosts = [
  {
    id: 1,
    title: "5 Benefits of Digital Health Records for Medical Care",
    excerpt: "Digital health records are revolutionizing how medical practices operate. Learn about the top benefits for both providers and patients.",
    date: "June 15, 2024",
    author: "Dr. Sarah Johnson",
    category: "Digital Health",
    imageUrl: "/images/blog/digital-records.jpg"
  },
  {
    id: 2,
    title: "How AI is Transforming Healthcare Diagnostics",
    excerpt: "Artificial intelligence is changing the way doctors diagnose and treat conditions. Discover the latest innovations in AI-powered medical tools.",
    date: "May 28, 2024",
    author: "Dr. Michael Chen",
    category: "Healthcare Technology",
    imageUrl: "/images/blog/ai-healthcare.jpg"
  },
  {
    id: 3,
    title: "Telehealth Best Practices for Medical Practitioners",
    excerpt: "Telehealth adoption has accelerated across the healthcare industry. Learn the best practices to deliver exceptional care virtually.",
    date: "April 10, 2024",
    author: "Lisa Patel",
    category: "Telehealth",
    imageUrl: "/images/blog/telehealth.jpg"
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Healthcare Insights
            </h1>
            <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
              The latest news, research findings, and best practices for modern healthcare providers.
            </p>
          </div>
        </div>
      </div>

      {/* Blog post list */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <div
              key={post.id}
              className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl"
              style={{ 
                opacity: 0,
                animation: `fadeInUp 0.5s ease-out forwards ${index * 0.1}s`
              }}
            >
              <div className="flex-shrink-0">
                <div className="h-48 w-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                  <svg className="h-20 w-20 text-blue-500 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-600 mb-2">
                    {post.category}
                  </div>
                  <Link to={`/blog/${post.id}`} className="block">
                    <p className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                      {post.title}
                    </p>
                    <p className="mt-3 text-base text-gray-500">
                      {post.excerpt}
                    </p>
                  </Link>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white text-sm font-medium">
                      {post.author.split(' ').map(name => name[0]).join('')}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {post.author}
                    </p>
                    <div className="flex space-x-1 text-sm text-gray-500">
                      <time dateTime={post.date}>{post.date}</time>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter signup */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center">
          <div className="lg:w-0 lg:flex-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Stay updated with our newsletter
            </h2>
            <p className="mt-3 max-w-3xl text-lg leading-6 text-blue-200">
              Get the latest healthcare insights, technology updates, and practice management tips delivered to your inbox.
            </p>
          </div>
          <div className="mt-8 lg:mt-0 lg:ml-8">
            <form className="sm:flex">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-5 py-3 border border-transparent placeholder-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white focus:border-white sm:max-w-xs rounded-md"
                placeholder="Enter your email"
              />
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white"
                >
                  Subscribe
                </button>
              </div>
            </form>
            <p className="mt-3 text-sm text-blue-200">
              We care about your data. Read our{' '}
              <Link to="/privacy-policy" className="text-white font-medium underline">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 