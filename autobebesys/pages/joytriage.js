import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function JoyTriageRedirect() {
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchRedirectInfo = async () => {
      try {
        // Get the redirect URL from our API
        const response = await fetch('/api/joytriage-redirect');
        
        if (!response.ok) {
          throw new Error('Failed to get redirect information');
        }
        
        const data = await response.json();
        
        // Redirect to the clinic web app
        window.location.href = data.loginUrl;
      } catch (err) {
        console.error('Redirect error:', err);
        setError('Failed to redirect to JoyTriage. Please try again later.');
      }
    };
    
    fetchRedirectInfo();
  }, []);

  return (
    <>
      <Head>
        <title>Redirecting to JoyTriage...</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
              {error}
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-5">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">Redirecting to JoyTriage</h2>
              <p className="text-gray-500">Please wait while we redirect you to the login page...</p>
            </>
          )}
        </div>
      </div>
    </>
  );
} 