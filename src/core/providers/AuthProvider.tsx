import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/shared/api/supabase";
import { AuthSession, AuthUser } from "@/shared/types/auth";
import * as SecureStore from "expo-secure-store";

interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isSignedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Intentar restaurar sesión desde SecureStore
        const storedSession = await SecureStore.getItemAsync("auth_session");
        
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession);
          setSession(parsedSession);
          setUser(parsedSession.user);
        }

        // Escuchar cambios de autenticación
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            if (event === "SIGNED_IN" && newSession) {
              const sessionData = {
                user: {
                  id: newSession.user.id,
                  email: newSession.user.email || "",
                  user_metadata: newSession.user.user_metadata,
                },
                access_token: newSession.access_token,
                refresh_token: newSession.refresh_token || "",
              };

              setUser(sessionData.user);
              setSession(sessionData);

              // Guardar en SecureStore
              try {
                await SecureStore.setItemAsync(
                  "auth_session",
                  JSON.stringify(sessionData)
                );
              } catch (error) {
                console.error("Error saving session to SecureStore:", error);
              }
            } else if (event === "SIGNED_OUT") {
              setUser(null);
              setSession(null);

              // Limpiar SecureStore
              try {
                await SecureStore.deleteItemAsync("auth_session");
              } catch (error) {
                console.error("Error deleting session from SecureStore:", error);
              }
            }
          }
        );

        return () => {
          authListener?.subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isSignedIn: !!session && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
