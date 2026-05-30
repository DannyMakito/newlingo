import { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { languages } from '@/data/languages';
import { images } from '@/constants/images';
import { useLanguageStore } from '@/store/languageStore';

export default function LanguageScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { selectedLanguageId, setSelectedLanguageId } = useLanguageStore();

  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}>
        <View className="mt-4 mb-8 flex-row items-center justify-center relative">
          <Pressable 
            onPress={() => router.back()}
            className="absolute left-0 p-2"
          >
            <Feather name="chevron-left" size={24} color="#111827" />
          </Pressable>
          <Text className="text-xl font-poppins-semibold text-text-primary">
            Choose a language
          </Text>
        </View>

        <View className="mb-8 flex-row items-center rounded-3xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.textInput}
            placeholder="Search languages"
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <Text className="mb-4 text-lg font-poppins-semibold text-text-primary">
          Popular
        </Text>

        <View className="flex-col">
          {filteredLanguages.map((lang) => {
            const isSelected = selectedLanguageId === lang.id;
            return (
              <Pressable
                key={lang.id}
                onPress={() => setSelectedLanguageId(lang.id)}
                className={`mb-4 flex-row items-center justify-between rounded-3xl border bg-white p-4 ${
                  isSelected ? 'border-lingua-purple border-2' : 'border-gray-200'
                }`}
              >
                <View className="flex-row items-center">
                  <Text className="mr-4 text-3xl">{lang.flag}</Text>
                  <View>
                    <Text className="text-lg font-poppins-semibold text-text-primary">
                      {lang.name}
                    </Text>
                    {lang.learners && (
                      <Text className="text-sm font-poppins-regular text-text-secondary">
                        {lang.learners}
                      </Text>
                    )}
                  </View>
                </View>
                {isSelected ? (
                  <View className="h-6 w-6 items-center justify-center rounded-full bg-lingua-purple">
                    <Feather name="check" size={14} color="#FFFFFF" />
                  </View>
                ) : (
                  <Feather name="chevron-right" size={20} color="#9CA3AF" />
                )}
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={() => router.back()}
          className="mt-4 mb-12 h-14 w-full items-center justify-center rounded-2xl bg-lingua-purple"
          style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
        >
          <Text className="text-lg font-poppins-semibold text-white">Confirm</Text>
        </Pressable>
        
        <Image
          source={images.earth}
          style={{ width: '100%', height: 200 }}
          contentFit="contain"
          className="self-center"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    marginLeft: 12,
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#111827',
  },
});
