import { images } from "@/constants/images";
import { Image } from "expo-image";
import { Text, View } from "react-native";

export function AuthMascot() {
  return (
    <View className="relative my-2 h-[130px] items-center justify-center">
      <Text
        className="absolute left-[22%] top-2 text-xl"
        style={{ transform: [{ rotate: "-12deg" }] }}
      >
        ✨
      </Text>
      <Text
        className="absolute right-[20%] top-6 text-lg"
        style={{ transform: [{ rotate: "10deg" }] }}
      >
        ✨
      </Text>
      <Text className="absolute bottom-6 left-[28%] text-base text-lingua-blue">
        ✦
      </Text>
      <Image
        source={images.mascotAuth}
        style={{ width: 140, height: 130 }}
        contentFit="contain"
      />
    </View>
  );
}
