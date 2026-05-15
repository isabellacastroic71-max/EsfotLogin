import { View, Text, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { useLogin } from "@/features/auth/model/useLogin";
import { loginSchema } from "@/shared/validation/auth";
import { ZodError } from "zod";

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const login = useLogin();

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleLogin = async () => {
    try {
      setErrors({});
      
      const validated = loginSchema.parse(formData);
      
      await login.mutateAsync({
        email: validated.email,
        password: validated.password,
      });

      router.replace("/home");
    } catch (err: any) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          const path = error.path[0];
          if (path) {
            fieldErrors[path] = error.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        const errorMessage = err.message || "Error al iniciar sesión";
        Alert.alert("Error", errorMessage);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          padding: 24,
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: "700", marginBottom: 24 }}>
          🔐 Login ESFOT
        </Text>

        <Input
          label="Email"
          placeholder="tu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(value) => handleChange("email", value)}
          error={errors.email}
          editable={!login.isPending}
        />

        <Input
          label="Contraseña"
          placeholder="Tu contraseña"
          secureTextEntry
          value={formData.password}
          onChangeText={(value) => handleChange("password", value)}
          error={errors.password}
          editable={!login.isPending}
          style={{ marginTop: 16 }}
        />

        <Text
          onPress={() => router.push("/(auth)/forgot-password")}
          style={{
            marginTop: 12,
            textAlign: "right",
            color: "#1B3A6B",
            fontSize: 12,
            textDecorationLine: "underline",
          }}
        >
          ¿Olvidaste tu contraseña?
        </Text>

        <Button
          label="Ingresar"
          onPress={handleLogin}
          loading={login.isPending}
          disabled={login.isPending}
          style={{ marginTop: 24 }}
        />

        <Text
          onPress={() => router.push("/(auth)/register")}
          style={{
            marginTop: 16,
            textAlign: "center",
            color: "#1B3A6B",
            fontSize: 14,
            textDecorationLine: "underline",
          }}
        >
          ¿No tienes cuenta? Regístrate
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};