import developmentConfig from './env/development';
import productionConfig from './env/production';

/**
 * Environment types supported by the app
 */
export type Environment = 'development' | 'production';

// Define a more flexible Config type that works for both environments
export type Config = {
  readonly API: {
    readonly BASE_URL: string;
    readonly TIMEOUT: number;
    readonly RETRY_COUNT: number;
  };
  readonly AUTH: {
    readonly TOKEN_EXPIRY_HOURS: number;
    readonly STORAGE_KEYS: {
      readonly TOKEN: string;
      readonly TOKEN_EXPIRY: string;
      readonly USER_ROLE: string;
      readonly CLINIC_ID: string;
    };
  };
  readonly CACHE: {
    readonly CLINIC_INFO_TTL: number;
    readonly STORAGE_KEYS: {
      readonly CLINIC_INFO: string;
      readonly CLINIC_INFO_TIMESTAMP: string;
    };
  };
};

/**
 * Get the current environment based on React Native's __DEV__ flag
 */
const getEnvironment = (): Environment => {
  return __DEV__ ? 'development' : 'production';
};

/**
 * Get the configuration for the current environment
 */
const getConfig = (): Config => {
  const environment = getEnvironment();
  
  switch (environment) {
    case 'development':
      return developmentConfig;
    case 'production':
      return productionConfig;
    default:
      return productionConfig;
  }
};

// Export the config
const config = getConfig();
export default config;