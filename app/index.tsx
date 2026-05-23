import { AuthLoading } from "@/components/auth/auth-loading";
import { useAuth, useClerk, useUser } from "@clerk/expo";
import { Redirect } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return <AuthLoading />;
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="typo__h2 mb-2">Home</Text>
        <Text className="typo__body-md mb-8 text-center text-text-secondary">
          Welcome{user?.primaryEmailAddress?.emailAddress ? `, ${user.primaryEmailAddress.emailAddress}` : ""}!
        </Text>
        <Pressable
          onPress={() => signOut()}
          className="h-12 items-center justify-center rounded-2xl bg-lingua-purple px-8 active:opacity-90"
        >
          <Text className="font-poppins-semibold text-base text-white">
            Sign Out
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
