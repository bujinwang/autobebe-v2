# AutoBebe Healthcare System - Web Application

This is the unified web application for the AutoBebe Healthcare System. Built with React and TypeScript, it combines the original clinic management interface with the AutoBebeSys patient-facing experience in a single application.

## Features

### Public Features (AutoBebeSys)
- Modern healthcare landing page
- Healthcare blog with articles and resources
- JoyTriage login and redirection

### Clinic Staff Features
- Staff authentication and authorization
- Patient management interface
- Appointment scheduling and management
- Medical records management
- Treatment plan creation and tracking
- Dashboard analytics
- Real-time updates

## Tech Stack

- React with TypeScript
- Material-UI for clinic portal components
- TailwindCSS for public-facing components 
- Framer Motion for animations
- React Context API for state management
- JWT for authentication
- RESTful API integration
- Express server for production deployment

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run serve`

Runs the production build using the Express server, useful for testing the production build locally.

## Deployment

This application is configured for deployment on [Fly.io](https://fly.io) using the provided Dockerfile and fly.toml configuration.

To deploy the application:

1. Install the Fly.io CLI
2. Run `fly launch` (for first deployment) or `fly deploy` (for updates)

## Project Structure

```
clinicwebapp/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── autobebesys/  # Components for AutoBebeSys pages
│   │   └── ...          # Clinic staff components
│   ├── pages/           # Page components
│   │   ├── autobebesys/  # Public-facing AutoBebeSys pages
│   │   └── ...          # Clinic staff pages
│   ├── services/        # API and other services
│   ├── contexts/        # React Context providers
│   ├── types/           # TypeScript type definitions
│   ├── styles/          # CSS and style-related files
│   ├── App.tsx          # Main App component with routing
│   ├── App.css          # App-specific styles
│   ├── index.tsx        # Application entry point
│   └── index.css        # Global styles (includes Tailwind)
├── public/              # Public assets
├── node_modules/        # Project dependencies
├── package.json         # Project configuration and dependencies
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── tsconfig.json        # TypeScript configuration
├── server.js            # Express server for production
├── Dockerfile           # Docker configuration for Fly.io
├── fly.toml             # Fly.io configuration
├── .env                 # Environment variables
└── .gitignore           # Git ignore rules
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
