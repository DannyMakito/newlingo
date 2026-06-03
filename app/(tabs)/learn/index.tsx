import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useLanguageStore } from '@/store/languageStore';
import { useUserProgressStore } from '@/store/userProgressStore';
import { units } from '@/data/units';
import { lessons } from '@/data/lessons';
import { languages } from '@/data/languages';
import { usePostHog } from 'posthog-react-native';
import { images } from '@/constants/images';

export default function LearnScreen() {
  const router = useRouter();
  const { selectedLanguageId } = useLanguageStore();
  const { completedLessons, markLessonCompleted } = useUserProgressStore();
  const posthog = usePostHog();

  const selectedLanguage = languages.find(l => l.id === selectedLanguageId);
  
  const languageUnits = units
    .filter(u => u.languageId === selectedLanguageId)
    .sort((a, b) => a.order - b.order);

  const getLessonsForUnit = (unitId: string) => {
    return lessons.filter(l => l.unitId === unitId);
  };

  const handleLessonPress = (lessonId: string, lessonTitle: string) => {
    markLessonCompleted(lessonId);
    posthog.capture('lesson_started', {
      lesson_id: lessonId,
      lesson_title: lessonTitle,
      language_id: selectedLanguageId
    });
    router.push({ pathname: '/(tabs)/learn/lesson/[id]', params: { id: lessonId } });
  };

  if (!selectedLanguageId) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="flex-1 items-center justify-center p-6">
          <Text className="font-poppins-bold text-2xl text-text-primary text-center mb-4">
            No language selected
          </Text>
          <Text className="font-poppins-regular text-base text-text-secondary text-center">
            Please select a language from the Home tab.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const allLanguageLessons = languageUnits.flatMap(u => getLessonsForUnit(u.id));
  const inProgressLessonId = allLanguageLessons.find(l => !completedLessons.includes(l.id))?.id;
  const currentUnit = languageUnits[0]; // For header display

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between">
        <Pressable>
          <Feather name="chevron-left" size={28} color="#111827" />
        </Pressable>
        <View className="items-center">
          <Text className="font-poppins-semibold text-lg text-text-primary">
            {currentUnit?.title || selectedLanguage?.name}
          </Text>
          <Text className="font-poppins-regular text-xs text-text-secondary">
            Unit {currentUnit?.order || 1} • {completedLessons.length} / {allLanguageLessons.length} lessons
          </Text>
        </View>
        <Pressable>
          <Feather name="bookmark" size={24} color="#FF7918" />
        </Pressable>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View className="h-64 w-full relative bg-[#F9FAFB]">
          <Image 
            source={images.palace} 
            style={{ width: '100%', height: '100%' }}
            contentFit="contain"
          />
        </View>

        {/* Segmented Control */}
        <View className="mx-6 -mt-8 bg-[#F9FAFB] rounded-2xl flex-row items-center p-1 border border-gray-200 shadow-sm z-10">
          <Pressable className="flex-1 items-center py-3 bg-white rounded-xl shadow-sm border border-lingua-purple border-b-2">
            <Text className="font-poppins-semibold text-sm text-lingua-purple">Lessons</Text>
          </Pressable>
          <Pressable className="flex-1 items-center py-3">
            <Text className="font-poppins-medium text-sm text-text-secondary">Practice</Text>
          </Pressable>
        </View>

        {/* Lesson Cards */}
        <View className="px-6 pt-6">
          {languageUnits.length === 0 ? (
            <View className="items-center justify-center mt-12">
              <Text className="font-poppins-medium text-lg text-text-secondary">
                More lessons coming soon!
              </Text>
            </View>
          ) : (
            languageUnits.map((unit) => (
              <View key={unit.id} className="mb-4">
                {getLessonsForUnit(unit.id).map((lesson, idx) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isInProgress = lesson.id === inProgressLessonId;
                  const isLocked = !isCompleted && !isInProgress;

                  return (
                    <Pressable
                      key={lesson.id}
                      onPress={() => handleLessonPress(lesson.id, lesson.title)}
                      className={`mb-4 rounded-3xl p-5 flex-row items-center justify-between border ${
                        isInProgress ? 'border-lingua-purple border-2 bg-[#F9F5FF]' : 'border-gray-200 bg-white'
                      }`}
                      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                    >
                      <View className="flex-1 mr-4">
                        <Text className={`font-poppins-medium text-xs mb-1 ${isInProgress ? 'text-lingua-purple' : 'text-text-secondary'}`}>
                          Lesson {idx + 1}
                        </Text>
                        <Text className={`font-poppins-semibold text-base mb-1 ${isInProgress ? 'text-text-primary' : 'text-text-primary'}`}>
                          {lesson.title}
                        </Text>
                        {isInProgress && (
                          <Text className="font-poppins-medium text-xs text-lingua-purple">
                            In progress
                          </Text>
                        )}
                        {isLocked && (
                          <Text className="font-poppins-medium text-xs text-text-secondary">
                            0 / {lesson.activities?.length || 6} lessons
                          </Text>
                        )}
                      </View>
                      
                      <View className="items-center justify-center">
                        {isCompleted ? (
                          <View className="h-7 w-7 rounded-full bg-[#34C759] items-center justify-center">
                            <Feather name="check" size={14} color="#FFFFFF" />
                          </View>
                        ) : isInProgress ? (
                          <View className="h-12 w-12 items-center justify-center">
                            {lesson.image ? (
                              <Image 
                                source={typeof lesson.image === 'string' ? { uri: lesson.image } : lesson.image}
                                style={{ width: 48, height: 48 }}
                                contentFit="contain"
                              />
                            ) : (
                              <Feather name="play-circle" size={32} color="#8A2BE2" />
                            )}
                          </View>
                        ) : (
                          <Feather name="lock" size={20} color="#9CA3AF" />
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
