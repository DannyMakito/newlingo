<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Newlingo language learning app. The SDK was already present in the project; the wizard configured it correctly, wired up user identification, and added event capture across all key user flows.

## Changes made

| File | Change |
|------|--------|
| `.env` | Set `EXPO_PUBLIC_POSTHOG_KEY` and `EXPO_PUBLIC_POSTHOG_HOST` to correct values |
| `app/_layout.tsx` | Added `captureAppLifecycleEvents`, `debug`, and `autocapture` options to `PostHogProvider` |
| `app/onboarding.tsx` | Capture `onboarding_get_started` when user taps Get Started |
| `app/sign-up.tsx` | Identify user with email + capture `user_signed_up` on successful email code verification |
| `app/sign-in.tsx` | Identify user with email + capture `user_signed_in` on successful email code verification |
| `app/language.tsx` | Capture `language_selected` (with `language_id` and `language_name`) when user confirms their choice |
| `app/(tabs)/index.tsx` | Capture `lesson_continued` (with language and XP context) on Continue tap; re-identify user via Clerk on session restore |

## Events

| Event | Description | File |
|-------|-------------|------|
| `onboarding_get_started` | User taps "Get Started" on the welcome screen — top of the acquisition funnel | `app/onboarding.tsx` |
| `user_signed_up` | User completes email sign-up and code verification | `app/sign-up.tsx` |
| `user_signed_in` | User successfully verifies their email code and signs in | `app/sign-in.tsx` |
| `language_selected` | User confirms a language selection | `app/language.tsx` |
| `lesson_continued` | User taps "Continue" on the home dashboard to resume their lesson | `app/(tabs)/index.tsx` |

## User identification

- `posthog.identify(email, { email, $set_once: { signup_date } })` called on sign-up completion
- `posthog.identify(email, { email })` called on sign-in completion
- `posthog.identify(userId, { email, name })` called on session restore via Clerk (home screen)

## Autocapture

- Touch events (`captureTouches: true`) — all taps within PostHogProvider are tracked automatically
- Screen views via `navigationRef` — Expo Router navigation changes are tracked automatically
- App lifecycle events (`captureAppLifecycleEvents: true`) — Application Opened, Backgrounded, etc.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/714326)
- [New sign-ups over time](/insights/WajcsBpT) — daily acquisition trend
- [Sign-ins over time](/insights/rjDblnpk) — daily returning-user signal
- [Onboarding to lesson conversion funnel](/insights/DghTSEl7) — Get Started → sign-up → first lesson
- [Language selections by language](/insights/6suh86iS) — which languages users pick (breakdown by name)
- [Lesson engagement (Continue taps)](/insights/v7PXf3kM) — daily unique users resuming lessons

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
