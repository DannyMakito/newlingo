import { useSSO } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";

import { getClerkErrorMessage } from "@/lib/auth";

type OAuthStrategy =
  | "oauth_google"
  | "oauth_facebook"
  | "oauth_apple";

export function useSocialAuth() {
  const router = useRouter();
  const { startSSOFlow } = useSSO();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWith = useCallback(
    async (strategy: OAuthStrategy) => {
      setIsLoading(true);
      setError(null);

      try {
        const { createdSessionId, setActive } = await startSSOFlow({ strategy });

        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
          router.replace("/");
        }
      } catch (err) {
        setError(getClerkErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    },
    [router, startSSOFlow],
  );

  return {
    signInWithGoogle: () => signInWith("oauth_google"),
    signInWithFacebook: () => signInWith("oauth_facebook"),
    signInWithApple: () => signInWith("oauth_apple"),
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
