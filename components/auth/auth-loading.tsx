import { ActivityIndicator, View } from "react-native";

export function AuthLoading() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color="#6C4EF5" />
    </View>
  );
}
