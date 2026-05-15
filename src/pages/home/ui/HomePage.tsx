import { View, Text, Alert, SafeAreaView } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { supabase } from "@/shared/api/supabase";
import { Button } from "@/shared/ui/Button";
import { useLogout } from "@/features/auth/model/useLogout";
import { AuthUser } from "@/shared/types/auth";

export const HomePage = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const logout = useLogout();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/(auth)/login");
          return;
        }

        setUser({
          id: user.id,
          email: user.email || "",
          user_metadata: user.user_metadata,
        });
      } catch (error) {
        console.error("Error loading user:", error);
        router.replace("/(auth)/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error al cerrar sesión");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Cargando...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return null;
  }

  const userName = user.user_metadata?.name || user.email;

  return (
    <SafeAreaView style={{ flex: 1, padding: 24 }}>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontSize: 32, fontWeight: "700", marginBottom: 24 }}>
            👋 Bienvenido ESFOT
          </Text>

          <View
            style={{
              backgroundColor: "#f0f4f8",
              padding: 16,
              borderRadius: 10,
              marginBottom: 24,
            }}
          >
            <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
              Sesión activa
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#1B3A6B" }}>
              {userName}
            </Text>
            <Text style={{ fontSize: 12, color: "#999", marginTop: 8 }}>
              ID: {user.id.substring(0, 8)}...
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#e0f2fe",
              padding: 12,
              borderRadius: 8,
              marginBottom: 24,
            }}
          >
            <Text style={{ fontSize: 12, color: "#0369a1", fontWeight: "500" }}>
              💡 Sesión persistente: Token guardado en SecureStore
            </Text>
          </View>
        </View>

        <Button
          label="Cerrar Sesión"
          onPress={handleLogout}
          loading={logout.isPending}
          disabled={logout.isPending}
          style={{
            backgroundColor: "#DC2626",
          }}
        />
      </View>
    </SafeAreaView>
  );
};