import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { ReactNode } from "react";

interface ButtonProps {
  label: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  loading?: boolean;
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1B3A6B",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 48,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});

export const Button = ({
  label,
  onPress,
  disabled = false,
  style,
  loading = false,
}: ButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled || loading}
    style={[styles.button, disabled && styles.buttonDisabled, style]}
  >
    <Text style={styles.text}>{loading ? "Cargando..." : label}</Text>
  </TouchableOpacity>
);