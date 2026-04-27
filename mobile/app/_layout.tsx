import { Stack } from "expo-router";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/expo";
import { StripeProvider } from "@stripe/stripe-react-native";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://b163d10cc8ce6172b4cf3e05ebee2f16@o4510995944701952.ingest.us.sentry.io/4511274566418433',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const queryClient = new QueryClient();
const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const stripePublishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const tokenCache = (() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("@clerk/expo/token-cache").tokenCache;
  } catch (error) {
    console.warn(
      "Clerk token cache is unavailable because the native secure storage module is missing. Rebuild the Expo app to restore persisted auth sessions.",
      error
    );
    return undefined;
  }
})();

export default Sentry.wrap(function RootLayout() {
  if (!clerkPublishableKey) {
    throw new Error(
      "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Check mobile/.env and restart Expo."
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <StripeProvider publishableKey={stripePublishableKey ?? ""}>
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{headerShown: false,}}/>
        </QueryClientProvider>
      </StripeProvider>
    </ClerkProvider>
    
  );
});
