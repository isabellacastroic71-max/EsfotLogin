import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase";

export const useLogout = () =>
  useMutation({
    mutationFn: async (): Promise<void> => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(error.message);
      }
    },
  });
