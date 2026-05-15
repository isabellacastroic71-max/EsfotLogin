import { useRegister } from "@/features/auth/model/useRegister";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { registerSchema } from "@/shared/validation/auth";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text } from "react-native";
import { ZodError } from "zod";

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const register = useRegister();

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleRegister = async () => {
    try {
      setErrors({});
      
      const validated = registerSchema.parse(formData);
      
      await register.mutateAsync({
        ...validated,
        name: validated.name,
      });

      Alert.alert(
        "Éxito",
        "Cuenta creada. Por favor verifica tu email.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(auth)/login"),
          },
        ]
      );
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
        Alert.alert("Error", err.message || "Error al registrarse");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 32, fontWeight: "700", marginBottom: 24 }}>
          👤 Crear Cuenta
        </Text>

        <Input
          label="Nombre Completo"
          placeholder="Juan Pérez"
          value={formData.name}
          onChangeText={(value) => handleChange("name", value)}
          error={errors.name}
          editable={!register.isPending}
        />

        <Input
          label="Email"
          placeholder="tu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(value) => handleChange("email", value)}
          error={errors.email}
          editable={!register.isPending}
        />

        <Input
          label="Contraseña"
          placeholder="Min 8 caracteres, 1 mayúscula, 1 número"
          secureTextEntry
          value={formData.password}
          onChangeText={(value) => handleChange("password", value)}
          error={errors.password}
          editable={!register.isPending}
        />

        <Input
          label="Confirmar Contraseña"
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(value) => handleChange("confirmPassword", value)}
          error={errors.confirmPassword}
          editable={!register.isPending}
        />

        <Button
          label="Crear Cuenta"
          onPress={handleRegister}
          loading={register.isPending}
          disabled={register.isPending}
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
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
