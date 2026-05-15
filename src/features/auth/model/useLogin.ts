import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase";
import { AuthCredentials, AuthResponse } from "@/shared/types/auth";
import { loginSchema } from "@/shared/validation/auth";

export const useLogin = () =>
  useMutation({
    mutationFn: async (credentials: AuthCredentials): Promise<AuthResponse> => {
      // Validar con Zod
      const validated = loginSchema.parse(credentials);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user || !data.session) {
        throw new Error("No session data returned from Supabase");
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email || "",
          user_metadata: data.user.user_metadata,
        },
        session: {
          user: {
            id: data.user.id,
            email: data.user.email || "",
            user_metadata: data.user.user_metadata,
          },
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token || "",
        },
      };
    },
  });