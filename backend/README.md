# AutoBebe Backend

Backend service for the AutoBebe healthcare management system.

## Local Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Deployment to Fly.io

### Prerequisites

1. Install the Fly.io CLI:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. Log in to Fly.io:
   ```bash
   fly auth login
   ```

### Setting Up PostgreSQL on Fly.io

1. Create a PostgreSQL database:
   ```bash
   fly postgres create --name autobebe-db --region yyz
   ```

2. Connect the database to your app:
   ```bash
   fly postgres attach --postgres-app autobebe-db --app autobebe-backend
   ```

3. When you attach a PostgreSQL database with the command above, Fly.io automatically:
   - Creates a `DATABASE_URL` secret with the correct connection string
   - Sets up the internal networking between your app and database
   - No need to manually configure database connection parameters

### Optimizing PostgreSQL Connections

The application uses a single shared PrismaClient instance to avoid connection pool exhaustion. This is critical for Fly.io deployments because:

1. Each PostgreSQL database on Fly.io has a limited number of concurrent connections (usually 20-50).
2. Creating multiple PrismaClient instances can quickly exhaust this limit.

If you're experiencing database connection issues:

1. Check your connection logs with `fly logs -a autobebe-backend`
2. Monitor connection count with `fly postgres connect -a autobebe-db -C 'SELECT count(*) FROM pg_stat_activity'`
3. Adjust Prisma connection settings in `src/lib/prisma.ts` if needed:
   ```typescript
   new PrismaClient({
     log: ['error'],
     datasources: {
       db: {
         url: process.env.DATABASE_URL,
       },
     },
     // Adjust connection pool settings
     // Connection timeout in milliseconds (default: 10000)
     connectionTimeout: 10000,
     // Connection limit (default: num_physical_cpus*2+1)
     connection_limit: 10,
   });
   ```

### Troubleshooting PostgreSQL Connections

If you see "PostgreSQL database at localhost:5432" in your logs:

1. The application is connecting to your local database in development mode.
2. For production, ensure your `DATABASE_URL` is correctly set via Fly.io secrets.
3. You can check current database settings with:
   ```bash
   fly ssh console -a autobebe-backend -C 'printenv | grep DATABASE'
   ```

### Setting Secrets

Configure sensitive environment variables as secrets:

```bash
# Generate a secure JWT secret
JWT_SECRET=$(openssl rand -base64 32)
fly secrets set JWT_SECRET=$JWT_SECRET --app autobebe-backend

# Set Medical AI API key
fly secrets set MEDICAL_AI_API_KEY=your_api_key_here --app autobebe-backend
```

You can verify that your secrets are set correctly with:

```bash
fly secrets list --app autobebe-backend
```

The PostgreSQL-related secrets (like those seen in `autobebe-db` secrets) are managed automatically by Fly.io and don't need to be manually set in your application.

### Deploying the App

1. Deploy your application:
   ```bash
   fly deploy
   ```

2. Check the deployment status:
   ```bash
   fly status
   ```

3. View app logs:
   ```bash
   fly logs
   ```

### Accessing Your App

Once deployed, your app will be accessible at:
```
https://autobebe-backend.fly.dev
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| JWT_SECRET | Secret key for JWT tokens | Yes |
| JWT_ISSUER | Issuer for JWT tokens | Yes |
| JWT_AUDIENCE | Audience for JWT tokens | Yes |
| JWT_EXPIRY_IN_MINUTES | JWT token expiry time | Yes |
| MEDICAL_AI_API_KEY | API key for medical AI service | Yes |
| MEDICAL_AI_URL | URL for medical AI service | Yes |
| PORT | Port for the server (default: 8080) | No |
| ALLOWED_ORIGINS | CORS allowed origins | No |

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
 