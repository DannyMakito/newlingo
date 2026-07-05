import "../global.css";

import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PostHogProvider } from "posthog-react-native";

import { clerkPublishableKey } from "@/lib/auth";
import { fontAssets } from "@/theme/fonts";
import { StreamVideoProvider } from "@/components/StreamVideoProvider";

WebBrowser.maybeCompleteAuthSession();
SplashScreen.preventAutoHideAsync();

if (!clerkPublishableKey) {
  throw new Error(
    "Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file",
  );
}

const postHogKey = process.env.EXPO_PUBLIC_POSTHOG_KEY;
if (!postHogKey) {
  console.warn("Add EXPO_PUBLIC_POSTHOG_KEY to your .env file");
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PostHogProvider
          apiKey={postHogKey ?? 'disabled'}
          options={{
            host: process.env.EXPO_PUBLIC_POSTHOG_HOST,
            captureAppLifecycleEvents: true,
            disabled: !postHogKey,
          }}
          autocapture={{
            captureScreens: true,
            captureTouches: true,
            propsToCapture: ['testID'],
          }}
        >
          <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
            <StreamVideoProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </StreamVideoProvider>
          </ClerkProvider>
        </PostHogProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
