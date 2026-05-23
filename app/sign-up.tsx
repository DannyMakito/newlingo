import { AuthInput } from "@/components/auth/auth-input";
import { AuthLoading } from "@/components/auth/auth-loading";
import { AuthMascot } from "@/components/auth/auth-mascot";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { VerificationModal } from "@/components/auth/verification-modal";
import { useSocialAuth } from "@/hooks/use-social-auth";
import { finalizeSignUp, getClerkErrorMessage } from "@/lib/auth";
import { useAuth, useSignUp } from "@clerk/expo";
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

export default function SignUpScreen() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { signUp, errors, fetchStatus } = useSignUp();
  const {
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    isLoading: isSocialLoading,
    error: socialError,
  } = useSocialAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );

  const isSubmitting = fetchStatus === "fetching";

  const handleSignUp = async () => {
    setAuthError(null);

    if (!email.trim() || !password.trim()) {
      setAuthError("Please enter your email and password.");
      return;
    }

    const { error } = await signUp.password({
      emailAddress: email.trim(),
      password,
    });

    if (error) {
      setAuthError(getClerkErrorMessage(error));
      return;
    }

    const sendCodeResult = await signUp.verifications.sendEmailCode();

    if (sendCodeResult.error) {
      setAuthError(getClerkErrorMessage(sendCodeResult.error));
      return;
    }

    setVerificationError(null);
    setShowVerification(true);
  };

  const handleVerifyCode = async (code: string) => {
    setVerificationError(null);

    try {
      const verifyResult = await signUp.verifications.verifyEmailCode({ code });

      if (verifyResult.error) {
        setVerificationError(getClerkErrorMessage(verifyResult.error));
        return;
      }

      // Log the sign-up state to debug
      console.log("Sign-up status after verification:", signUp.status);
      console.log("Email verified:", signUp.verifications.emailAddress?.status);
      console.log("Required fields:", signUp.requiredFields);

      // If sign-up is complete, finalize it
      if (signUp.status === "complete") {
        await finalizeSignUp(signUp, router);
        setShowVerification(false);
      } else {
        setVerificationError(
          `Sign-up incomplete. Status: ${signUp.status}. Please try again or contact support.`,
        );
      }
    } catch (err) {
      const errorMessage = getClerkErrorMessage(err);
      console.error("Sign-up error:", err);
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

            <Text className="typo__h2">Create your account</Text>
            <Text className="typo__body-md mt-2 text-text-secondary">
              Start your language journey today ✨
            </Text>

            <AuthMascot />

            <View className="gap-4">
              <AuthInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="alex@gmail.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.fields.emailAddress ? (
                <Text className="-mt-2 font-poppins-regular text-[13px] text-error">
                  {errors.fields.emailAddress.message}
                </Text>
              ) : null}
              <AuthInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                showPasswordToggle
                isPasswordVisible={isPasswordVisible}
                onTogglePasswordVisibility={() =>
                  setIsPasswordVisible((prev) => !prev)
                }
                autoCapitalize="none"
              />
              {errors.fields.password ? (
                <Text className="-mt-2 font-poppins-regular text-[13px] text-error">
                  {errors.fields.password.message}
                </Text>
              ) : null}
            </View>

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
              onPress={handleSignUp}
              disabled={isSubmitting || isSocialLoading}
              className="mt-6 h-14 items-center justify-center rounded-2xl bg-lingua-purple active:opacity-90 disabled:opacity-60"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="font-poppins-semibold text-base text-white">
                  Sign Up
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
                Already have an account?{" "}
              </Text>
              <Link href="/sign-in" asChild>
                <Pressable hitSlop={8}>
                  <Text className="font-poppins-semibold text-base text-lingua-purple">
                    Log in
                  </Text>
                </Pressable>
              </Link>
            </View>

            <View nativeID="clerk-captcha" />
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
