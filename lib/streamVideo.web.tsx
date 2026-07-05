import type { PropsWithChildren } from "react";

export type User = {
  id: string;
  name?: string;
  image?: string;
};

export type Call = {
  leave: () => Promise<void>;
  microphone: {
    toggle: () => Promise<void>;
  };
  state: {
    callingState: string;
  };
};

export type Theme = {
  variants?: {
    insets?: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
};

export type DeepPartial<T> = {
  [Key in keyof T]?: T[Key] extends object ? DeepPartial<T[Key]> : T[Key];
};

export const CallingState = {
  LEFT: "left",
} as const;

export class StreamVideoClient {
  static getOrCreateInstance() {
    return new StreamVideoClient();
  }

  disconnectUser() {
    return Promise.resolve();
  }
}

export function StreamVideo({
  children,
}: PropsWithChildren<{ client?: StreamVideoClient; style?: DeepPartial<Theme> }>) {
  return <>{children}</>;
}

export function StreamCall({ children }: PropsWithChildren<{ call: Call }>) {
  return <>{children}</>;
}

export function useStreamVideoClient() {
  return undefined;
}

export function useCallStateHooks() {
  return {
    useCallCallingState: () => "left",
    useMicrophoneState: () => ({ status: "disabled" }),
  };
}
