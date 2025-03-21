import developmentConfig from './env/development';
import productionConfig from './env/production';

// Type for our config
export type Config = typeof developmentConfig;

/**
 * Environment types supported by the app
 */
export type Environment = 'development' | 'production';

/**
 * Get the current environment based on React Native's __DEV__ flag
 * __DEV__ is automatically set by React Native:
 * - true when running in development (npm start, react-native run-ios/android)
 * - false when running a production build
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
      return developmentConfig;
  }
};

// Export the config
const config = getConfig();
export default config; 