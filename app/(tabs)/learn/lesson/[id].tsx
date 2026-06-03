import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { lessons } from '@/data/lessons';
import { images } from '@/constants/images';

export default function AudioLessonScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Ensure id is a string to look it up correctly
  const lessonIdStr = Array.isArray(id) ? id[0] : id;
  const lesson = lessons.find(l => l.id === lessonIdStr);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-100">
        <Pressable onPress={() => router.back()} className="mr-4">
          <Feather name="chevron-left" size={28} color="#111827" />
        </Pressable>
        <View className="flex-1">
          <Text className="font-poppins-semibold text-lg text-text-primary">
            AI Teacher
          </Text>
          <View className="flex-row items-center mt-1">
            <View className="h-2 w-2 rounded-full bg-[#34C759] mr-1.5" />
            <Text className="font-poppins-medium text-xs text-text-secondary">
              Online {lesson ? `• ${lesson.title}` : ''}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <View className="h-10 w-10 items-center justify-center rounded-full border border-gray-200 mr-2">
            <Feather name="video" size={20} color="#111827" />
          </View>
          <View className="h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50">
            <Text className="font-poppins-medium text-sm text-text-primary">12</Text>
          </View>
        </View>
      </View>

      <View className="flex-1 relative bg-[#F9FAFB]">
        {/* Main Background Image */}
        <View className="absolute inset-0 items-center justify-center pb-[250px]">
          <Image 
            source={images.mascotAuth} 
            style={{ width: '85%', height: '85%', opacity: 0.95 }}
            contentFit="contain"
          />
        </View>

        {/* Bottom Overlay Area */}
        <View className="absolute bottom-0 left-0 right-0 p-6 pt-12" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
          
          {/* Chat Bubble */}
          <View className="bg-white rounded-2xl p-5 shadow-sm mb-6 self-start max-w-[85%] border border-gray-100 relative">
            <Text className="font-poppins-semibold text-lg text-text-primary mb-1">
              ¡Muy bien!
            </Text>
            <Text className="font-poppins-medium text-base text-text-secondary pr-8">
              That was great! 👏
            </Text>
            <Pressable className="absolute right-4 bottom-4">
              <Ionicons name="volume-high" size={24} color="#8A2BE2" />
            </Pressable>
            {/* Bubble tail */}
            <View className="absolute -bottom-2 left-6 h-4 w-4 bg-white border-b border-r border-gray-100" style={{ transform: [{ rotate: '45deg' }] }} />
          </View>

          {/* Controls */}
          <View className="flex-row items-center justify-between mb-8 px-2">
            <View className="items-center">
              <View className="h-14 w-14 rounded-full bg-white items-center justify-center shadow-sm border border-gray-100 mb-2">
                <Feather name="video" size={24} color="#111827" />
              </View>
              <Text className="font-poppins-medium text-xs text-text-secondary">Camera</Text>
            </View>
            <View className="items-center">
              <View className="h-14 w-14 rounded-full bg-white items-center justify-center shadow-sm border border-gray-100 mb-2">
                <Feather name="mic" size={24} color="#111827" />
              </View>
              <Text className="font-poppins-medium text-xs text-text-secondary">Mic</Text>
            </View>
            <View className="items-center">
              <View className="h-14 w-14 rounded-full bg-white items-center justify-center shadow-sm border border-gray-100 mb-2">
                <Ionicons name="language" size={24} color="#111827" />
              </View>
              <Text className="font-poppins-medium text-xs text-text-secondary">Subtitles</Text>
            </View>
            <View className="items-center">
              <Pressable 
                onPress={() => router.back()}
                className="h-14 w-14 rounded-full bg-[#FF4B4B] items-center justify-center shadow-sm mb-2"
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
              >
                <Feather name="phone-off" size={24} color="#FFFFFF" />
              </Pressable>
              <Text className="font-poppins-medium text-xs text-text-secondary">End Call</Text>
            </View>
          </View>

          {/* Feedback Card */}
          <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex-row justify-between mb-4">
            <View className="items-center flex-1">
              <Text className="font-poppins-medium text-xs text-text-primary mb-1">Speaking</Text>
              <Text className="font-poppins-semibold text-sm text-[#34C759]">Excellent</Text>
            </View>
            <View className="w-px bg-gray-200 mx-2" />
            <View className="items-center flex-1">
              <Text className="font-poppins-medium text-xs text-text-primary mb-1">Pronunciation</Text>
              <Text className="font-poppins-semibold text-sm text-[#007AFF]">Great</Text>
            </View>
            <View className="w-px bg-gray-200 mx-2" />
            <View className="items-center flex-1">
              <Text className="font-poppins-medium text-xs text-text-primary mb-1">Grammar</Text>
              <Text className="font-poppins-semibold text-sm text-lingua-purple">Good</Text>
            </View>
          </View>
          
        </View>
      </View>
    </SafeAreaView>
  );
}
