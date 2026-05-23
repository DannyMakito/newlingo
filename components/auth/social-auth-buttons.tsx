import { FontAwesome5 } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

type SocialAuthButtonsProps = {
  onGooglePress?: () => void;
  onFacebookPress?: () => void;
  onApplePress?: () => void;
  disabled?: boolean;
};

function SocialButton({
  icon,
  label,
  onPress,
  disabled = false,
}: {
  icon: ReactNode;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="mb-3 h-14 w-full flex-row items-center rounded-2xl border border-border bg-background px-5 active:opacity-90 disabled:opacity-50"
    >
      <View className="w-7 items-center justify-center">{icon}</View>
      <Text className="flex-1 text-center font-poppins-medium text-base text-text-primary">
        {label}
      </Text>
      <View className="w-7" />
    </Pressable>
  );
}

export function SocialAuthButtons({
  onGooglePress,
  onFacebookPress,
  onApplePress,
  disabled = false,
}: SocialAuthButtonsProps) {
  return (
    <View className="mt-1">
      <View className="my-5 flex-row items-center">
        <View className="h-px flex-1 bg-border" />
        <Text className="mx-4 font-poppins-regular text-body-sm text-text-secondary">
          or continue with
        </Text>
        <View className="h-px flex-1 bg-border" />
      </View>

      <SocialButton
        icon={<FontAwesome5 name="google" size={20} color="#4285F4" />}
        label="Continue with Google"
        onPress={onGooglePress}
        disabled={disabled}
      />
      <SocialButton
        icon={<FontAwesome5 name="facebook" size={20} color="#1877F2" />}
        label="Continue with Facebook"
        onPress={onFacebookPress}
        disabled={disabled}
      />
      <SocialButton
        icon={<FontAwesome5 name="apple" size={22} color="#0D132B" />}
        label="Continue with Apple"
        onPress={onApplePress}
        disabled={disabled}
      />
    </View>
  );
}
