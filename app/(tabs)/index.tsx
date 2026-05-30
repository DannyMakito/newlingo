import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/expo';
import { Image } from 'expo-image';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useLanguageStore } from '@/store/languageStore';
import { useUserProgressStore } from '@/store/userProgressStore';
import { languages } from '@/data/languages';
import { images } from '@/constants/images';

export default function Home() {
  const { user } = useUser();
  const { selectedLanguageId } = useLanguageStore();
  const selectedLanguage = languages.find((lang) => lang.id === selectedLanguageId);

  const { streak, currentXP, targetXP } = useUserProgressStore();

  const firstName = user?.firstName || 'Alex';

  const greetingByLanguage: Record<string, string> = {
    es: 'Hola',
    fr: 'Bonjour',
    ja: 'こんにちは',
    ko: '안녕하세요',
    de: 'Hallo',
    zh: '你好',
  };
  const greeting = selectedLanguageId ? (greetingByLanguage[selectedLanguageId] ?? 'Hello') : 'Hello';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'left', 'right']}>
      <ScrollView 
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-8 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-100 overflow-hidden border border-gray-200">
              <Text className="text-2xl">{selectedLanguage?.flag || '🌍'}</Text>
            </View>
            <Text className="font-poppins-semibold text-xl text-text-primary">
              {greeting}, {firstName}! 👋
            </Text>
          </View>
          <View className="flex-row items-center">
            <Image 
              source={images.streakFire} 
              style={{ width: 24, height: 24 }} 
              contentFit="contain"
            />
            <Text className="ml-1 mr-4 font-poppins-semibold text-lg text-text-primary">
              {streak}
            </Text>
            <Feather name="bell" size={24} color="#111827" />
          </View>
        </View>

        {/* Daily goal */}
        <View className="mb-6 rounded-3xl bg-[#FFF5EE] p-5 flex-row items-center justify-between">
          <View className="flex-1 mr-4">
            <Text className="mb-2 font-poppins-semibold text-base text-text-primary">
              Daily goal
            </Text>
            <View className="flex-row items-baseline mb-3">
              <Text className="font-poppins-bold text-3xl text-text-primary mr-1">{currentXP}</Text>
              <Text className="font-poppins-medium text-base text-text-secondary">/ {targetXP} XP</Text>
            </View>
            <View className="h-3 w-full rounded-full bg-[#FCE5D8] overflow-hidden">
              <View 
                className="h-full rounded-full bg-[#FF7918]" 
                style={{ width: `${(currentXP / targetXP) * 100}%` }} 
              />
            </View>
          </View>
          <Image 
            source={images.treasure} 
            style={{ width: 80, height: 80 }} 
            contentFit="contain"
          />
        </View>

        {/* Continue learning */}
        <View className="mb-8 rounded-3xl bg-lingua-purple overflow-hidden">
          <View className="p-6 relative z-10">
            <Text className="mb-1 font-poppins-medium text-sm text-white opacity-90">
              Continue learning
            </Text>
            <Text className="mb-1 font-poppins-bold text-3xl text-white">
              {selectedLanguage?.name || 'Spanish'}
            </Text>
            <Text className="mb-5 font-poppins-medium text-base text-white opacity-90">
              A1 • Unit 3
            </Text>
            <Pressable className="self-start rounded-full bg-white px-6 py-3" style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
              <Text className="font-poppins-semibold text-base text-lingua-purple">
                Continue
              </Text>
            </Pressable>
          </View>
          <View className="absolute bottom-0 right-0 h-40 w-40 z-0">
             <Image 
               source={images.palace} 
               style={{ width: '100%', height: '100%' }} 
               contentFit="contain"
             />
          </View>
        </View>

        {/* Today's plan */}
        <View className="mb-8">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="font-poppins-bold text-xl text-text-primary">Today's plan</Text>
            <Pressable>
              <Text className="font-poppins-semibold text-base text-lingua-purple">View all</Text>
            </Pressable>
          </View>

          {/* Lesson Task */}
          <View className="mb-5 flex-row items-center">
            <View className="mr-4 h-16 w-16 items-center justify-center rounded-2xl bg-lingua-purple">
              <Feather name="book-open" size={28} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="font-poppins-bold text-lg text-text-primary">Lesson</Text>
              <Text className="font-poppins-regular text-sm text-text-secondary">At the café</Text>
            </View>
            <View className="h-8 w-8 items-center justify-center rounded-full bg-lingua-purple">
              <Feather name="check" size={16} color="#FFFFFF" />
            </View>
          </View>

          {/* AI Conversation Task */}
          <View className="mb-5 flex-row items-center">
            <View className="mr-4 h-16 w-16 items-center justify-center rounded-2xl bg-lingua-purple">
              <Feather name="headphones" size={28} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="font-poppins-bold text-lg text-text-primary">AI Conversation</Text>
              <Text className="font-poppins-regular text-sm text-text-secondary">Talk about your day</Text>
            </View>
            <View className="h-8 w-8 rounded-full border-2 border-gray-300" />
          </View>

          {/* New words Task */}
          <View className="flex-row items-center">
            <View className="mr-4 h-16 w-16 items-center justify-center rounded-2xl bg-[#FF4B4B]">
              <Ionicons name="chatbubbles" size={28} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="font-poppins-bold text-lg text-text-primary">New words</Text>
              <Text className="font-poppins-regular text-sm text-text-secondary">10 words</Text>
            </View>
            <View className="h-8 w-8 rounded-full border-2 border-gray-300" />
          </View>
        </View>

        {/* Next up */}
        <View className="rounded-3xl bg-[#F0F8EC] p-5 flex-row items-center justify-between">
          <View className="flex-1 mr-4">
            <Text className="mb-1 font-poppins-medium text-sm text-text-secondary">Next up</Text>
            <Text className="mb-1 font-poppins-bold text-xl text-text-primary">AI Video Call</Text>
            <Text className="font-poppins-regular text-sm text-text-secondary">Practice speaking</Text>
          </View>
          <View className="relative">
            <Image 
              source={images.mascotAuth}
              style={{ width: 72, height: 72, borderRadius: 36 }}
            />
            <View className="absolute -bottom-2 -right-2 h-10 w-10 items-center justify-center rounded-full border-4 border-[#F0F8EC] bg-[#34C759]">
              <Feather name="video" size={16} color="#FFFFFF" />
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
