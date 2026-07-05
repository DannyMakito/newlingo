import { View, Text, Pressable, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CallingState,
  type Call,
  StreamCall,
  useCallStateHooks,
  useStreamVideoClient,
} from '@/lib/streamVideo';
import type { Lesson } from '@/types/learning';
import type { AgentConnectionStatus } from '@/types/agent';
import { lessons } from '@/data/lessons';
import { images } from '@/constants/images';
import { useUser } from '@clerk/expo';
import { useLanguageStore } from '@/store/languageStore';
import { getExpoApiUrl } from '@/lib/apiUrl';

function getAgentStatusLabel(status: AgentConnectionStatus): string {
  switch (status) {
    case 'idle':
      return 'Waiting for teacher';
    case 'connecting':
      return 'Connecting teacher...';
    case 'connected':
      return 'Teacher connected';
    case 'failed':
      return 'Teacher unavailable';
  }
}

function getAgentStatusColor(status: AgentConnectionStatus): string {
  switch (status) {
    case 'connected':
      return 'bg-[#34C759]';
    case 'connecting':
      return 'bg-[#FF9500]';
    case 'failed':
      return 'bg-[#EF4444]';
    default:
      return 'bg-gray-300';
  }
}

function AudioLessonUI({
  lesson,
  call,
  agentStatus,
  onLeave,
  onEndCall,
}: {
  lesson?: Lesson;
  call: Call;
  agentStatus: AgentConnectionStatus;
  onLeave: () => void;
  onEndCall: () => Promise<void>;
}) {
  const { useMicrophoneState, useCallCallingState } = useCallStateHooks();
  const { status } = useMicrophoneState();
  const callingState = useCallCallingState();

  const isMuted = status !== 'enabled';
  const isOnline = callingState === 'joined';

  const toggleMic = async () => {
    await call.microphone.toggle();
  };

  const handleEndCall = async () => {
    await onEndCall();
    onLeave();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-100">
        <Pressable onPress={handleEndCall} className="mr-4">
          <Feather name="chevron-left" size={28} color="#111827" />
        </Pressable>
        <View className="flex-1">
          <Text className="font-poppins-semibold text-lg text-text-primary">
            AI Teacher
          </Text>
          <View className="flex-row items-center mt-1">
            <View className={`h-2 w-2 rounded-full ${isOnline ? 'bg-[#34C759]' : 'bg-[#FF9500]'} mr-1.5`} />
            <Text className="font-poppins-medium text-xs text-text-secondary">
              {isOnline ? 'Online' : 'Connecting...'} {lesson ? `• ${lesson.title}` : ''}
            </Text>
          </View>
          <View className="flex-row items-center mt-1">
            <View className={`h-2 w-2 rounded-full ${getAgentStatusColor(agentStatus)} mr-1.5`} />
            <Text className="font-poppins-medium text-xs text-text-secondary">
              {getAgentStatusLabel(agentStatus)}
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
              {agentStatus === 'connected' ? '¡Muy bien!' : 'One moment...'}
            </Text>
            <Text className="font-poppins-medium text-base text-text-secondary pr-8">
              {agentStatus === 'connected'
                ? 'That was great! 👏'
                : agentStatus === 'failed'
                  ? 'The AI teacher could not join. You can still end the call and try again.'
                  : 'Your AI teacher is joining the lesson.'}
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
                <Feather name="video-off" size={24} color="#9CA3AF" />
              </View>
              <Text className="font-poppins-medium text-xs text-text-secondary">Camera</Text>
            </View>
            <View className="items-center">
              <Pressable 
                onPress={toggleMic}
                className={`h-14 w-14 rounded-full items-center justify-center shadow-sm border border-gray-100 mb-2 ${isMuted ? 'bg-gray-100' : 'bg-white'}`}
              >
                <Feather name={isMuted ? "mic-off" : "mic"} size={24} color={isMuted ? "#EF4444" : "#111827"} />
              </Pressable>
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
                onPress={handleEndCall}
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

export default function AudioLessonScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const streamClient = useStreamVideoClient();
  const [call, setCall] = useState<Call | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState<AgentConnectionStatus>('idle');
  const { user } = useUser();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const agentSessionIdRef = useRef<string | null>(null);

  const lessonIdStr = Array.isArray(id) ? id[0] : id;
  const lesson = lessons.find(l => l.id === lessonIdStr);

  const stopAgentSession = useCallback(async (callId: string) => {
    const sessionId = agentSessionIdRef.current;
    if (!sessionId) return;

    agentSessionIdRef.current = null;
    const apiUrl = getExpoApiUrl();

    try {
      await fetch(`${apiUrl}/api/agent/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId, sessionId }),
      });
    } catch (err) {
      console.error('Failed to stop agent session', err);
    }
  }, []);

  const endCallAndAgent = useCallback(async (currentCall: Call, callId: string) => {
    await stopAgentSession(callId);

    if (currentCall.state.callingState !== CallingState.LEFT) {
      try {
        await currentCall.leave();
      } catch (err) {
        console.error('Failed to leave call during endCallAndAgent', err);
      }
    }
  }, [stopAgentSession]);

  useEffect(() => {
    if (Platform.OS === 'web' || !streamClient || !lessonIdStr || !user) return;
    
    let isMounted = true;
    const callId = `lesson-${lessonIdStr}`;
    const currentCall = streamClient.call('audio_room', callId, { reuseInstance: true });

    const abortController = new AbortController();
    const fetchWithTimeout = (url: string, options: RequestInit, timeoutMs = 15000) => {
      const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);
      return fetch(url, { ...options, signal: abortController.signal }).finally(() => clearTimeout(timeoutId));
    };

    const setupCall = async () => {
      try {
        const apiUrl = getExpoApiUrl();
        
        // Ensure call is created on backend first
        const response = await fetchWithTimeout(`${apiUrl}/api/stream/call`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: user.id,
            lessonId: lessonIdStr,
            languageId: selectedLanguageId
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server error response:', response.status, errorText);
          throw new Error(`Failed to create call on server: ${response.status} ${errorText}`);
        }

        // Now join without creating
        await currentCall.join({ create: false });
        if (!isMounted) return;

        setCall(currentCall);
        setAgentStatus('connecting');

        const agentResponse = await fetchWithTimeout(`${apiUrl}/api/agent/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callId,
            callType: 'audio_room',
          }),
        });

        if (!isMounted) return;

        if (!agentResponse.ok) {
          const errorText = await agentResponse.text();
          console.error('Agent start error:', agentResponse.status, errorText);
          setAgentStatus('failed');
          return;
        }

        const agentData = await agentResponse.json();
        if (agentData.sessionId) {
          agentSessionIdRef.current = agentData.sessionId;
        }

        setAgentStatus('connected');
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          console.warn('Lesson setup was aborted (timeout or unmount)');
        } else {
          console.error('Failed to setup call', err);
        }
        if (isMounted) {
          setError('Failed to connect to the lesson.');
          setAgentStatus('failed');
        }
      }
    };

    const setupPromise = setupCall();

    return () => {
      isMounted = false;
      abortController.abort();
      // Wait for setup to finish before cleaning up to avoid race conditions
      setupPromise.then(() => {
        stopAgentSession(callId);
        if (currentCall.state.callingState !== CallingState.LEFT) {
          currentCall.leave().catch((err) => {
            console.error('Failed to leave call', err);
          });
        }
      });
      setCall(null);
      setAgentStatus('idle');
    };
  }, [streamClient, lessonIdStr, user, selectedLanguageId, stopAgentSession]);

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={['top', 'left', 'right']}>
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-100">
          <Pressable onPress={() => router.back()} className="mr-4">
            <Feather name="chevron-left" size={28} color="#111827" />
          </Pressable>
          <Text className="flex-1 font-poppins-semibold text-lg text-text-primary">AI Teacher</Text>
        </View>
        <View className="flex-1 items-center justify-center bg-[#F9FAFB] px-6">
          <Text className="text-center font-poppins-semibold text-xl text-text-primary">
            AI audio lessons run in the mobile app.
          </Text>
          <Text className="mt-3 text-center font-poppins-medium text-base text-text-secondary">
            Build and open a development client on iOS or Android to use Stream Video.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={['top', 'left', 'right']}>
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-100">
          <Pressable onPress={() => router.back()} className="mr-4">
            <Feather name="chevron-left" size={28} color="#111827" />
          </Pressable>
          <Text className="flex-1 font-poppins-semibold text-lg text-text-primary">AI Teacher</Text>
        </View>
        <View className="flex-1 items-center justify-center bg-[#F9FAFB] px-6">
          <Feather name="alert-circle" size={48} color="#EF4444" className="mb-4" />
          <Text className="text-center font-poppins-semibold text-xl text-text-primary mt-4">
            Connection Error
          </Text>
          <Text className="mt-3 text-center font-poppins-medium text-base text-text-secondary">
            {error}
          </Text>
          <Pressable 
            onPress={() => router.back()}
            className="mt-8 bg-lingua-purple px-8 py-4 rounded-2xl shadow-sm"
          >
            <Text className="font-poppins-semibold text-white text-base">Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!call) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={['top', 'left', 'right']}>
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-100">
          <Pressable onPress={() => router.back()} className="mr-4">
            <Feather name="chevron-left" size={28} color="#111827" />
          </Pressable>
          <Text className="flex-1 font-poppins-semibold text-lg text-text-primary">AI Teacher</Text>
        </View>
        <View className="flex-1 items-center justify-center bg-[#F9FAFB]">
          <ActivityIndicator size="large" color="#8A2BE2" />
          <Text className="font-poppins-medium text-text-secondary mt-4">Connecting to AI Teacher...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const callId = `lesson-${lessonIdStr}`;

  return (
    <StreamCall call={call}>
      <AudioLessonUI
        lesson={lesson}
        call={call}
        agentStatus={agentStatus}
        onLeave={() => router.back()}
        onEndCall={() => endCallAndAgent(call, callId)}
      />
    </StreamCall>
  );
}
