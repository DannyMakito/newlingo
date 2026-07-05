import { StreamVideo, type DeepPartial, type Theme } from '@/lib/streamVideo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStreamVideoClient } from '@/hooks/useStreamVideoClient';

export function StreamVideoProvider({ children }: { children: React.ReactNode }) {
  const videoClient = useStreamVideoClient();
  const { top, right, bottom, left } = useSafeAreaInsets();
  const theme = {
    variants: { insets: { top, right, bottom, left } },
  } as DeepPartial<Theme>;

  if (!videoClient) {
    return <>{children}</>;
  }

  return (
    <StreamVideo client={videoClient} style={theme}>
      {children}
    </StreamVideo>
  );
}
