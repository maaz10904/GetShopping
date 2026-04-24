import SafeScreen from "@/components/SafeScreen";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeScreen>
      <Stack.Screen options={{ title: "Product" }} />
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-text-primary text-xl font-bold">Product Details</Text>
        <Text className="text-text-secondary mt-2 text-center">
          Product id: {id ?? "unknown"}
        </Text>
      </View>
    </SafeScreen>
  );
}
