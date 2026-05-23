import { AuthInput } from "@/components/auth/auth-input";
import { AuthMascot } from "@/components/auth/auth-mascot";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { VerificationModal } from "@/components/auth/verification-modal";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

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
          </View>

          <Pressable
            onPress={() => setShowVerification(true)}
            className="mt-6 h-14 items-center justify-center rounded-2xl bg-lingua-purple active:opacity-90"
          >
            <Text className="font-poppins-semibold text-base text-white">
              Sign Up
            </Text>
          </Pressable>

          <SocialAuthButtons />

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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>

    <VerificationModal
      visible={showVerification}
      email={email}
      onClose={() => setShowVerification(false)}
    />
    </>
  );
}
