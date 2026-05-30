import { View, Text, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Feather, Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

const INACTIVE_COLOR = '#9CA3AF'; // gray-400

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  
  // Create an animated component for the active indicator circle
  const [layoutWidth, setLayoutWidth] = useState(0);
  const tabWidth = layoutWidth > 0 ? layoutWidth / state.routes.length : 0;
  
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withTiming(state.index * tabWidth, { duration: 250, easing: Easing.linear }) }
      ]
    };
  });

  return (
    <View 
      className="flex-row items-center justify-between border-t border-gray-200 bg-white"
      style={{ paddingBottom: insets.bottom, height: 65 + insets.bottom }}
      onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}
    >
      {/* Animated Indicator */}
      {layoutWidth > 0 && (
        <Animated.View 
          className="absolute top-0 h-full justify-center items-center"
          style={[{ width: tabWidth }, indicatorStyle]}
        >
          <View className="h-12 w-12 rounded-full bg-lingua-purple shadow-sm" />
        </Animated.View>
      )}

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        let iconName: any = 'home';
        let label = options.title !== undefined ? options.title : route.name;

        if (route.name === 'index') { iconName = 'home'; label = 'Home'; }
        else if (route.name === 'learn') { iconName = 'book-open'; label = 'Learn'; }
        else if (route.name === 'teacher') { iconName = 'sparkles'; label = 'Teacher'; }
        else if (route.name === 'chat') { iconName = 'message-circle'; label = 'Chat'; }
        else if (route.name === 'profile') { iconName = 'user'; label = 'Profile'; }

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            className="flex-1 items-center justify-center pt-2 pb-1 h-full z-10"
          >
            {route.name === 'teacher' ? (
              <Ionicons 
                name="sparkles" 
                size={24} 
                color={isFocused ? '#FFFFFF' : INACTIVE_COLOR} 
              />
            ) : (
              <Feather 
                name={iconName} 
                size={24} 
                color={isFocused ? '#FFFFFF' : INACTIVE_COLOR} 
              />
            )}
            {!isFocused && (
              <Text className="text-xs mt-1 font-poppins-regular" style={{ color: INACTIVE_COLOR }}>
                {label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
