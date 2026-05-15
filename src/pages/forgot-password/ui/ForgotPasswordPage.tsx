import { View, Text, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { useForgotPassword } from "@/features/auth/model/useForgotPassword";
import { forgotPasswordSchema } from "@/shared/validation/auth";
import { ZodError } from "zod";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const forgotPassword = useForgotPassword();

  const handleSubmit = async () => {
    try {
      setError("");
      
      const validated = forgotPasswordSchema.parse({ email });
      
      await forgotPassword.mutateAsync(validated.email);

      Alert.alert(
        "Éxito",
        "Se ha enviado un link de recuperación a tu email. Por favor revisa tu bandeja de entrada.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(auth)/login"),
          },
        ]
      );
    } catch (err: any) {
      if (err instanceof ZodError) {
        setError(err.errors[0]?.message || "Error de validación");
      } else {
        setError(err.message || "Error al enviar el correo");
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
          🔐 Recuperar Contraseña
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#666",
            marginBottom: 24,
            lineHeight: 20,
          }}
        >
          Ingresa tu email y te enviaremos un link para restablecer tu contraseña.
        </Text>

        <Input
          label="Email"
          placeholder="tu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            if (error) setError("");
          }}
          error={error}
          editable={!forgotPassword.isPending}
        />

        <Button
          label="Enviar Link"
          onPress={handleSubmit}
          loading={forgotPassword.isPending}
          disabled={forgotPassword.isPending}
          style={{ marginTop: 24 }}
        />

        <Text
          onPress={() => router.push("/(auth)/login")}
          style={{
            marginTop: 16,
            textAlign: "center",
            color: "#1B3A6B",
            fontSize: 14,
            textDecorationLine: "underline",
          }}
        >
          Volver a iniciar sesión
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};