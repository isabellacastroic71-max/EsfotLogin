import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase";
import { RegisterInput, registerSchema } from "@/shared/validation/auth";
import { AuthResponse } from "@/shared/types/auth";

interface RegisterPayload extends RegisterInput {
  name: string;
}

export const useRegister = () =>
  useMutation({
    mutationFn: async (payload: RegisterPayload): Promise<AuthResponse> => {
      // Validar con Zod
      const validated = registerSchema.parse(payload);

      const { data, error } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          data: {
            name: validated.name,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error("No user data returned from Supabase");
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email || "",
          user_metadata: data.user.user_metadata,
        },
        session: data.session
          ? {
              user: {
                id: data.user.id,
                email: data.user.email || "",
                user_metadata: data.user.user_metadata,
              },
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token || "",
            }
          : null,
      };
    },
  });
