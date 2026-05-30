import { AuthLoading } from "@/components/auth/auth-loading";
import { useAuth, useClerk, useUser } from "@clerk/expo";
import { Redirect, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguageStore } from "@/store/languageStore";
import { languages } from "@/data/languages";

export default function Index() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const { selectedLanguageId } = useLanguageStore();

  const selectedLanguage = languages.find((lang) => lang.id === selectedLanguageId);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="typo__h2 mb-2">Home</Text>
        <Text className="typo__body-md mb-8 text-center text-text-secondary">
          Welcome{user?.primaryEmailAddress?.emailAddress ? `, ${user.primaryEmailAddress.emailAddress}` : ""}!
        </Text>

        {selectedLanguage && (
          <View className="mb-8 flex-row items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 px-6 py-4 w-full">
            <Text className="mr-3 text-4xl">{selectedLanguage.flag}</Text>
            <View>
              <Text className="font-poppins-regular text-sm text-text-secondary">Current Language</Text>
              <Text className="font-poppins-semibold text-lg text-text-primary">
                {selectedLanguage.name}
              </Text>
            </View>
          </View>
        )}
        <Pressable
          onPress={() => router.push('/language')}
          className="mb-4 h-12 w-full items-center justify-center rounded-2xl bg-lingua-purple px-8"
          style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
        >
          <Text className="font-poppins-semibold text-base text-white">
            Choose Language
          </Text>
        </Pressable>
        <Pressable
          onPress={() => signOut()}
          className="h-12 w-full items-center justify-center rounded-2xl border border-gray-200 bg-white px-8"
          style={({ pressed }) => ({ backgroundColor: pressed ? '#f9fafb' : '#ffffff' })}
        >
          <Text className="font-poppins-semibold text-base text-text-primary">
            Sign Out
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
