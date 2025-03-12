# AutoBebe v2 Backend

## Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Update the `.env` file with your actual values:
- `DATABASE_URL`: Your PostgreSQL connection string
- `MEDICAL_AI_API_KEY`: Your DeepSeek API key
- `JWT_SECRET`: A secure random string for JWT signing

⚠️ **IMPORTANT: Never commit the `.env` file or any actual credentials to version control!**

## Development

1. Install dependencies:
```bash
npm install
```

2. Run database migrations:
```bash
npm run prisma:migrate
```

3. Start the development server:
```bash
npm run dev
```

## Security Best Practices

1. Environment Variables:
   - Always use environment variables for sensitive information
   - Keep `.env` file out of version control
   - Use different values for development and production
   - Regularly rotate secrets and API keys

2. Database:
   - Use strong, unique passwords
   - Limit database user permissions
   - Use connection pooling
   - Enable SSL for database connections

3. API Keys:
   - Use separate API keys for development and production
   - Regularly rotate API keys
   - Monitor API key usage

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run prisma:generate`: Generate Prisma client
- `npm run prisma:migrate`: Run database migrations
 