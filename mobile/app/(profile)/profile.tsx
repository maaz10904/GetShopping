import SafeScreen from "@/components/SafeScreen";
import { useApi } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/expo";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function EditProfileScreen() {
  const api = useApi();
  const { user, isLoaded } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const email = useMemo(() => user?.emailAddresses?.[0]?.emailAddress || "No email", [user]);

  useEffect(() => {
    if (!user) return;

    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
  }, [user]);

  const handleSave = async () => {
    const normalizedFirstName = firstName.trim();
    const normalizedLastName = lastName.trim();

    if (!normalizedFirstName) {
      Alert.alert("Missing name", "Please enter your first name.");
      return;
    }

    if (!user) return;

    try {
      setIsSaving(true);

      await user.update({
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
      });

      await api.put("/users/profile", {
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        imageUrl: user.imageUrl,
      });

      await user.reload();

      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Update failed",
        error?.response?.data?.message || error?.message || "Failed to update profile"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center px-6">
          <ActivityIndicator size="large" color="#1DB954" />
          <Text className="text-text-secondary mt-4">Loading profile...</Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="px-6 pb-5 border-b border-surface flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-text-primary text-2xl font-bold">Edit Profile</Text>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-6 pt-6">
            <View className="bg-surface rounded-3xl p-6 items-center mb-6">
              <View className="relative mb-4">
                <Image
                  source={user?.imageUrl}
                  style={{ width: 112, height: 112, borderRadius: 56 }}
                  transition={200}
                />
                <View className="absolute -bottom-1 -right-1 bg-primary rounded-full size-9 items-center justify-center border-2 border-surface">
                  <Ionicons name="person" size={18} color="#121212" />
                </View>
              </View>

              <Text className="text-text-primary text-xl font-bold">
                {firstName || "Your"} {lastName || "Name"}
              </Text>
              <Text className="text-text-secondary text-sm mt-1">{email}</Text>
            </View>

            <View className="mb-5">
              <Text className="text-text-primary font-semibold mb-2">First Name</Text>
              <TextInput
                className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
                placeholder="Enter first name"
                placeholderTextColor="#666"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
            </View>

            <View className="mb-5">
              <Text className="text-text-primary font-semibold mb-2">Last Name</Text>
              <TextInput
                className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
                placeholder="Enter last name"
                placeholderTextColor="#666"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
            </View>

            <View className="mb-6">
              <Text className="text-text-primary font-semibold mb-2">Email</Text>
              <View className="bg-surface rounded-2xl px-4 py-4 flex-row items-center">
                <Text className="text-text-secondary text-base flex-1">{email}</Text>
                <Ionicons name="lock-closed-outline" size={18} color="#666" />
              </View>
            </View>

            <TouchableOpacity
              className="bg-primary rounded-2xl py-5 items-center"
              activeOpacity={0.8}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#121212" />
              ) : (
                <Text className="text-background font-bold text-lg">Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

export default EditProfileScreen;
