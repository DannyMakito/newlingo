// Mock out the Stream Video SDK for web to prevent WebRTC crashes
export const CallingState = { LEFT: 'left', JOINED: 'joined' } as any;
export const StreamCall = ({ children }: any) => children;
export const StreamVideo = ({ children }: any) => children;
export const StreamVideoClient = class {} as any;
export const useCallStateHooks = () => ({
  useMicrophoneState: () => ({ status: 'disabled' }),
  useCallCallingState: () => 'left',
}) as any;
export const useStreamVideoClient = () => null as any;

export type Call = any;
export type DeepPartial<T> = any;
export type Theme = any;
export type User = any;
