import Constants from 'expo-constants';

export function getExpoApiUrl(): string {
  const hostUri = Constants.expoConfig?.hostUri;
  return hostUri ? `http://${hostUri}` : 'http://localhost:8081';
}
