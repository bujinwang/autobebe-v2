export default {
  API: {
    BASE_URL: 'API_BASE_URL', // Will be replaced with actual URL
    TIMEOUT: 10000,
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
    CLINIC_INFO_TTL: 3600000,
    STORAGE_KEYS: {
      CLINIC_INFO: 'clinicInfo',
      CLINIC_INFO_TIMESTAMP: 'clinicInfoTimestamp',
    }
  }
} as const; 