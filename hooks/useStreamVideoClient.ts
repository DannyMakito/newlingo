import { useEffect, useState } from 'react';
import { StreamVideoClient, type User } from '@/lib/streamVideo';
import { useUser } from '@clerk/expo';
import Constants from 'expo-constants';

export function useStreamVideoClient() {
  const { user } = useUser();
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);

  useEffect(() => {
    if (!user) return;

    let client: StreamVideoClient | undefined;
    let cancelled = false;

    const initClient = async () => {
      try {
        const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY;
        if (!apiKey) throw new Error('Missing Stream API Key');

        // Using absolute URL for Expo API route in development might be needed,
        // but relative fetch works on web. For React Native, we need full URL.
        // Let's dynamically construct it or let fetch handle it if running through Expo router
        const hostUri = Constants.expoConfig?.hostUri;
        const apiUrl = hostUri ? `http://${hostUri}` : 'http://localhost:8081';
        
        const response = await fetch(`${apiUrl}/api/stream/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });

        if (!response.ok) {
           throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        if (!data.token) throw new Error('Failed to get Stream token');
        if (cancelled) return;

        // Setup the user object for Stream
        const streamUser: User = {
          id: user.id,
          name: user.firstName || user.username || user.id,
          image: user.imageUrl,
        };

        const tokenProvider = async () => {
          const tokenResponse = await fetch(`${apiUrl}/api/stream/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id }),
          });

          if (!tokenResponse.ok) {
            throw new Error(`API error: ${tokenResponse.status}`);
          }

          const tokenData = await tokenResponse.json();
          if (!tokenData.token) throw new Error('Failed to get Stream token');

          return tokenData.token as string;
        };

        client = StreamVideoClient.getOrCreateInstance({
          apiKey,
          user: streamUser,
          token: data.token,
          tokenProvider,
        });

        setVideoClient(client);
      } catch (error) {
        console.error('Error initializing Stream Video client:', error);
      }
    };

    initClient();

    return () => {
      cancelled = true;
      if (client) {
        client.disconnectUser();
        setVideoClient(null);
      }
    };
  }, [user]);

  return videoClient;
}
