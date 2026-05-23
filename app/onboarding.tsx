import { AuthLoading } from "@/components/auth/auth-loading";
import { images } from "@/constants/images";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Redirect, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function SpeechBubble({
  label,
  className,
  textClassName,
}: {
  label: string;
  className: string;
  textClassName: string;
}) {
  return (
    <View
      className={`absolute rounded-2xl px-3 py-2 shadow-sm ${className}`}
      style={{
        shadowColor: "#0D132B",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Text className={`font-poppins-semibold text-[13px] ${textClassName}`}>
        {label}
      </Text>
    </View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <AuthLoading />;
  }

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 px-6">
        <View className="mt-2 flex-row items-center justify-center gap-2">
          <Image
            source={images.mascotLogo}
            style={{ width: 32, height: 32 }}
            contentFit="contain"
          />
          <Text className="font-poppins-bold text-[22px] text-text-primary">
            newlingo
          </Text>
        </View>

        <View className="mt-8 items-center px-2">
          <Text className="text-center font-poppins-bold text-[28px] leading-[34px] text-text-primary">
            Your AI language{"\n"}
            <Text className="text-lingua-purple">teacher.</Text>
          </Text>
          <Text className="typo__body-md mt-3 max-w-[300px] text-center">
            Real conversations, personalized lessons, anytime, anywhere.
          </Text>
        </View>

        <View className="relative mt-4 flex-1 items-center justify-center">
          <SpeechBubble
            label="Hello!"
            className="left-2 top-6 bg-[#E3EDFF]"
            textClassName="text-text-primary"
          />
          <SpeechBubble
            label="¡Hola!"
            className="right-0 top-2 bg-[#EDE8FF]"
            textClassName="text-lingua-purple"
          />
          <SpeechBubble
            label="你好!"
            className="right-4 top-[38%] bg-[#FFF0E6]"
            textClassName="text-[#FF6B35]"
          />
          <Image
            source={images.mascotWelcome}
            style={{ width: 280, height: 320 }}
            contentFit="contain"
          />
        </View>

        <Pressable
          onPress={() => router.push("/sign-up")}
          className="mb-2 h-14 w-full flex-row items-center justify-center rounded-2xl bg-lingua-purple active:opacity-90"
          style={{
            shadowColor: "#6C4EF5",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <Text className="font-poppins-semibold text-base text-white">
            Get Started
          </Text>
          <View className="absolute right-5">
            <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
