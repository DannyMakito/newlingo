import type { useSignIn, useSignUp } from "@clerk/expo";
import type { Href, Router } from "expo-router";

type SignUpResource = ReturnType<typeof useSignUp>["signUp"];
type SignInResource = ReturnType<typeof useSignIn>["signIn"];

export const clerkPublishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

export function getClerkErrorMessage(error: unknown): string {
  if (!error) {
    return "Something went wrong. Please try again.";
  }

  if (
    typeof error === "object" &&
    "longMessage" in error &&
    typeof (error as { longMessage?: string }).longMessage === "string"
  ) {
    return (error as { longMessage: string }).longMessage;
  }

  if (
    typeof error === "object" &&
    "errors" in error &&
    Array.isArray((error as { errors: { message?: string }[] }).errors)
  ) {
    return (
      (error as { errors: { message?: string }[] }).errors[0]?.message ??
      "Something went wrong. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export async function finalizeSignUp(signUp: SignUpResource, router: Router) {
  const { error } = await signUp.finalize({
    navigate: ({ session, decorateUrl }) => {
      if (session?.currentTask) {
        return;
      }

      router.replace(decorateUrl("/") as Href);
    },
  });

  if (error) {
    throw error;
  }
}

export async function finalizeSignIn(signIn: SignInResource, router: Router) {
  const { error } = await signIn.finalize({
    navigate: ({ session, decorateUrl }) => {
      if (session?.currentTask) {
        return;
      }

      router.replace(decorateUrl("/") as Href);
    },
  });

  if (error) {
    throw error;
  }
}
