import "../global.css";

import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack, useNavigationContainerRef } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { PostHogProvider } from "posthog-react-native";

import { clerkPublishableKey } from "@/lib/auth";
import { fontAssets } from "@/theme/fonts";

WebBrowser.maybeCompleteAuthSession();
SplashScreen.preventAutoHideAsync();

if (!clerkPublishableKey) {
  throw new Error(
    "Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file",
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <PostHogProvider
      apiKey={process.env.EXPO_PUBLIC_POSTHOG_KEY!}
      options={{
        host: process.env.EXPO_PUBLIC_POSTHOG_HOST,
        captureAppLifecycleEvents: true,
        debug: __DEV__,
      }}
      autocapture={{
        captureScreens: true,
        captureTouches: true,
        propsToCapture: ['testID'],
      }}
      navigationRef={navigationRef}
    >
      <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
        <Stack screenOptions={{ headerShown: false }} />
      </ClerkProvider>
    </PostHogProvider>
  );
}
