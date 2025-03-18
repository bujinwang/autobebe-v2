# AutoBebe v2

A modern healthcare application built with Node.js, Express, Prisma ORM, PostgreSQL, React Native, and React.

## System Architecture

### Overview
AutoBebe v2 is a full-stack healthcare application consisting of three main components:
1. Backend Service (Express.js + Prisma)
2. Patient Mobile App (React Native)
3. Clinic Web Application (React)

### Backend Architecture
The backend service is built with:
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: OpenAPI/Swagger
- **Key Features**:
  - RESTful API endpoints
  - Role-based access control
  - Data validation using express-validator
  - Secure password hashing with bcrypt
  - CORS enabled for cross-origin requests
  - Environment-based configuration

### Patient Mobile App Architecture
The patient-facing mobile application is built with:
- **Framework**: React Native with TypeScript
- **State Management**: React Context API
- **Navigation**: React Navigation
- **Key Features**:
  - Cross-platform (iOS & Android)
  - Offline-first architecture
  - Push notifications
  - Secure local storage
  - Responsive UI components
  - Type-safe development

### Clinic Web Application Architecture
The clinic-facing web application is built with:
- **Framework**: React with TypeScript
- **State Management**: React Context API
- **UI Framework**: Material-UI
- **Key Features**:
  - Responsive design
  - Role-based access control
  - Real-time updates
  - Secure authentication
  - Dashboard analytics
  - Patient management interface

### Database Schema
The application uses a PostgreSQL database with the following main entities:
- Users (Patients, Staff)
- Appointments
- Medical Records
- Prescriptions
- Notifications
- Treatment Plans

### Security Architecture
- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- HTTPS encryption
- Input validation and sanitization
- Rate limiting
- CORS configuration

### Deployment Architecture
- Backend: Node.js server with PM2 process manager
- Database: PostgreSQL with automated backups
- Mobile App: App Store and Play Store distribution
- Web App: Static hosting with CDN
- CI/CD: Automated testing and deployment pipeline

## Project Structure

```
autobebe-v2/
├── backend/           # Express.js + Prisma backend
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   └── services/
│   └── prisma/
│       └── schema.prisma
├── PatientApp/       # React Native patient mobile app
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── navigation/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── assets/
│   └── App.tsx
└── clinicwebapp/    # React clinic web application
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── contexts/
    │   ├── types/
    │   ├── styles/
    │   └── App.tsx
    └── public/
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   - Copy `.env.example` to `.env`
   - Update the database connection string and other variables

4. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Patient App Setup

1. Navigate to the PatientApp directory:
   ```bash
   cd PatientApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Clinic Web App Setup

1. Navigate to the clinicwebapp directory:
   ```bash
   cd clinicwebapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the API endpoint and other required variables

4. Start the development server:
   ```bash
   npm start
   ```

## Features

### Patient App
- User registration and authentication
- Appointment scheduling
- Medical history view
- Prescription tracking
- Notifications for appointments and medications

### Clinic Web App
- Staff authentication and authorization
- Patient management interface
- Appointment scheduling and management
- Medical records management
- Treatment plan creation and tracking
- Dashboard analytics
- Real-time updates

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 