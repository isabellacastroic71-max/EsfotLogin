import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase";
import { forgotPasswordSchema } from "@/shared/validation/auth";

export const useForgotPassword = () =>
  useMutation({
    mutationFn: async (email: string): Promise<void> => {
      // Validar con Zod
      const validated = forgotPasswordSchema.parse({ email });

      const { error } = await supabase.auth.resetPasswordForEmail(
        validated.email,
        {
          redirectTo: "exp://localhost:8081/(auth)/reset-password",
        }
      );

      if (error) {
        throw new Error(error.message);
      }
    },
  });
