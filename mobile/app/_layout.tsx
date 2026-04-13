import { Stack } from "expo-router";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/expo";

const queryClient = new QueryClient();
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
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

export default function RootLayout() {
  if (!publishableKey) {
    throw new Error(
      "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Check mobile/.env and restart Expo."
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}><QueryClientProvider client={queryClient}>
      <Stack screenOptions={{headerShown: false,}}/>
    </QueryClientProvider></ClerkProvider>
    
  );
}
