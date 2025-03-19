// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  // In a production environment, you would likely:
  // 1. Validate the request
  // 2. Possibly add authentication tokens
  // 3. Use environment variables for the URL

  // This is a configurable URL that you can change to point to your clinicwebapp
  // location. In a real deployment, you might use environment variables.
  const clinicwebappUrl = process.env.CLINIC_WEBAPP_URL || 'http://localhost:3001';
  
  // Return the login URL with any necessary parameters
  res.status(200).json({ 
    loginUrl: `${clinicwebappUrl}/login`,
    appName: 'JoyTriage'
  });
} 