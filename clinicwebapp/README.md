# AutoBebe Clinic Web Application

This is the clinic-facing web application component of the AutoBebe v2 healthcare system. Built with React and TypeScript, it provides a comprehensive interface for clinic staff to manage patients, appointments, and medical records.

## Features

- Staff authentication and authorization
- Patient management interface
- Appointment scheduling and management
- Medical records management
- Treatment plan creation and tracking
- Dashboard analytics
- Real-time updates

## Tech Stack

- React with TypeScript
- Material-UI for components
- React Context API for state management
- JWT for authentication
- RESTful API integration

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Project Structure

```
clinicwebapp/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── services/      # API and other services
│   ├── contexts/      # React Context providers
│   ├── types/         # TypeScript type definitions
│   ├── styles/        # CSS and style-related files
│   ├── App.tsx        # Main App component
│   ├── App.css        # App-specific styles
│   ├── index.tsx      # Application entry point
│   ├── index.css      # Global styles
│   └── logo.svg       # Application logo
├── public/            # Public assets
├── .next/             # Next.js build output
├── node_modules/      # Project dependencies
├── package.json       # Project configuration and dependencies
├── package-lock.json  # Dependency lock file
├── tsconfig.json      # TypeScript configuration
├── .env              # Environment variables
└── .gitignore        # Git ignore rules
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the API endpoint and other required variables

3. Start the development server:
   ```bash
   npm start
   ```

## Related Projects

- Backend API Service: Located in `/backend`
- Patient Mobile App: Located in `/PatientApp`
- Clinic Web App: You are here (`/clinicwebapp`)

For more information about the overall project architecture and setup, please refer to the main project README in the root directory.
