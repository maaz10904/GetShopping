import { Stack } from "expo-router";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";

const queryClient = new QueryClient();
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

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
