import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="typo__h2 mb-8">Home</Text>
        <Link href="/onboarding" asChild>
          <Pressable className="h-12 items-center justify-center rounded-2xl bg-lingua-purple px-8 active:opacity-90">
            <Text className="font-poppins-semibold text-base text-white">
              Open Onboarding
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}
