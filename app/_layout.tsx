import { AuthProvider } from "@/core/providers/AuthProvider";
import { QueryProvider } from "@/core/providers/QueryProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </QueryProvider>
  );
}