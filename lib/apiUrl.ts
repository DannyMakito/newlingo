import Constants from 'expo-constants';

const PRODUCTION_API_URL = process.env.EXPO_PUBLIC_API_URL;

export function getExpoApiUrl(): string {
  // In production, use the configured API URL
  if (PRODUCTION_API_URL) {
    return PRODUCTION_API_URL;
  }

  // In development, use the Expo dev server host
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return `http://${hostUri}`;
  }

  // Last resort fallback for local development
  console.warn('Could not determine API URL — falling back to localhost:8081');
  return 'http://localhost:8081';
}
