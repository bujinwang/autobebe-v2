export default {
  API: {
    BASE_URL: 'https://autobebe-backend.fly.dev/api', // Replace with your actual production API URL
    TIMEOUT: 30000, // Longer timeout for production
    RETRY_COUNT: 3,
  },
  AUTH: {
    TOKEN_EXPIRY_HOURS: 8,
    STORAGE_KEYS: {
      TOKEN: 'authToken',
      TOKEN_EXPIRY: 'tokenExpiry',
      USER_ROLE: 'userRole',
      CLINIC_ID: 'clinicId',
    }
  },
  CACHE: {
    CLINIC_INFO_TTL: 3600000, // 1 hour in milliseconds
    STORAGE_KEYS: {
      CLINIC_INFO: 'clinicInfo',
      CLINIC_INFO_TIMESTAMP: 'clinicInfoTimestamp',
    }
  }
} as const; 