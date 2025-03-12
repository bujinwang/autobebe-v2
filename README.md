# AutoBebe v2

A modern healthcare application built with Node.js, Express, Prisma ORM, PostgreSQL, and React Native.

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
└── StaffApp/        # React Native staff mobile app
    ├── src/
    │   ├── screens/
    │   ├── components/
    │   ├── navigation/
    │   ├── services/
    │   ├── utils/
    │   ├── hooks/
    │   ├── types/
    │   └── assets/
    └── App.tsx
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL
- Expo CLI
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

3. Start the Expo development server:
   ```bash
   npm start
   ```

### Staff App Setup

1. Navigate to the StaffApp directory:
   ```bash
   cd StaffApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
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

### Staff App
- Staff authentication
- Patient management
- Appointment management
- Medical records management
- Treatment planning
- Prescription management

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 