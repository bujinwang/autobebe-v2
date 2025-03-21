// Global type definitions
declare const __DEV__: boolean;

// Add other global type declarations as needed
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';

if (__DEV__) {
  console.log('Debug information in development only');
}