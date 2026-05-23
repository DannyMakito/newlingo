import { AuthInput } from "@/components/auth/auth-input";
import { AuthLoading } from "@/components/auth/auth-loading";
import { AuthMascot } from "@/components/auth/auth-mascot";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { VerificationModal } from "@/components/auth/verification-modal";
import { useSocialAuth } from "@/hooks/use-social-auth";
import { finalizeSignIn, getClerkErrorMessage } from "@/lib/auth";
import { useAuth, useSignIn } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, Redirect, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { signIn, errors, fetchStatus } = useSignIn();
  const {
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    isLoading: isSocialLoading,
    error: socialError,
  } = useSocialAuth();

  const [email, setEmail] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );

  const isSubmitting = fetchStatus === "fetching";

  const handleSignIn = async () => {
    setAuthError(null);

    if (!email.trim()) {
      setAuthError("Please enter your email.");
      return;
    }

    const { error: createError } = await signIn.create({
      identifier: email.trim(),
    });

    if (createError) {
      setAuthError(getClerkErrorMessage(createError));
      return;
    }

    const hasEmailCode = signIn.supportedFirstFactors?.some(
      (factor) => factor.strategy === "email_code",
    );

    if (!hasEmailCode) {
      setAuthError("Email sign-in is not available for this account.");
      return;
    }

    const { error: sendCodeError } = await signIn.emailCode.sendCode();

    if (sendCodeError) {
      setAuthError(getClerkErrorMessage(sendCodeError));
      return;
    }

    setVerificationError(null);
    setShowVerification(true);
  };

  const handleVerifyCode = async (code: string) => {
    setVerificationError(null);

    try {
      const { error: verifyError } = await signIn.emailCode.verifyCode({
        code,
      });

      if (verifyError) {
        setVerificationError(getClerkErrorMessage(verifyError));
        return;
      }

      // Log the sign-in state to debug
      console.log("Sign-in status after verification:", signIn.status);
      console.log(
        "First factor verified:",
        signIn.firstFactorVerification?.status,
      );

      // If sign-in is complete, finalize it
      if (signIn.status === "complete") {
        await finalizeSignIn(signIn, router);
        setShowVerification(false);
      } else if (signIn.status === "needs_second_factor") {
        setVerificationError("Additional verification is required.");
      } else {
        setVerificationError(
          `Sign-in incomplete. Status: ${signIn.status}. Please try again.`,
        );
      }
    } catch (err) {
      const errorMessage = getClerkErrorMessage(err);
      console.error("Sign-in error:", err);
      setVerificationError(errorMessage);
    }
  };

  if (!isLoaded) {
    return <AuthLoading />;
  }

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Pressable
              onPress={() => router.back()}
              className="mb-4 h-10 w-10 items-center justify-center"
              hitSlop={8}
            >
              <Ionicons name="chevron-back" size={28} color="#0D132B" />
            </Pressable>

            <Text className="typo__h2">Welcome back</Text>
            <Text className="typo__body-md mt-2 text-text-secondary">
              Continue your language journey ✨
            </Text>

            <AuthMascot />

            <AuthInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="alex@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.fields.identifier ? (
              <Text className="-mt-2 font-poppins-regular text-[13px] text-error">
                {errors.fields.identifier.message}
              </Text>
            ) : null}

            {authError ? (
              <Text className="mt-3 font-poppins-regular text-[13px] text-error">
                {authError}
              </Text>
            ) : null}

            {socialError ? (
              <Text className="mt-3 font-poppins-regular text-[13px] text-error">
                {socialError}
              </Text>
            ) : null}

            <Pressable
              onPress={handleSignIn}
              disabled={isSubmitting || isSocialLoading}
              className="mt-6 h-14 items-center justify-center rounded-2xl bg-lingua-purple active:opacity-90 disabled:opacity-60"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="font-poppins-semibold text-base text-white">
                  Sign In
                </Text>
              )}
            </Pressable>

            <SocialAuthButtons
              onGooglePress={signInWithGoogle}
              onFacebookPress={signInWithFacebook}
              onApplePress={signInWithApple}
              disabled={isSubmitting || isSocialLoading}
            />

            <View className="mb-6 mt-6 flex-row items-center justify-center">
              <Text className="typo__body-md text-text-secondary">
                Don&apos;t have an account?{" "}
              </Text>
              <Link href="/sign-up" asChild>
                <Pressable hitSlop={8}>
                  <Text className="font-poppins-semibold text-base text-lingua-purple">
                    Sign up
                  </Text>
                </Pressable>
              </Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <VerificationModal
        visible={showVerification}
        email={email}
        onClose={() => setShowVerification(false)}
        onVerify={handleVerifyCode}
        isLoading={isSubmitting}
        error={verificationError}
      />
    </>
  );
}
