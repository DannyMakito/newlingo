import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, TextInput, View } from "react-native";

type AuthInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onTogglePasswordVisibility?: () => void;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences";
};

export function AuthInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  showPasswordToggle = false,
  isPasswordVisible = false,
  onTogglePasswordVisibility,
  keyboardType = "default",
  autoCapitalize = "sentences",
}: AuthInputProps) {
  return (
    <View className="rounded-2xl border border-border px-4 py-3">
      <Text className="typo__caption text-text-secondary">{label}</Text>
      <View className="mt-0.5 flex-row items-center">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          className="flex-1 font-poppins-regular text-base text-text-primary"
          style={{ padding: 0, margin: 0 }}
        />
        {showPasswordToggle && (
          <Pressable
            onPress={onTogglePasswordVisibility}
            hitSlop={8}
            className="ml-2 p-1"
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#9CA3AF"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}
