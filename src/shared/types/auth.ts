/**
 * Tipos de autenticación
 * @feature Auth
 */

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
}

export interface AuthSession {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  session: AuthSession | null;
}

export interface ResetPasswordPayload {
  email: string;
}

export interface UpdatePasswordPayload {
  password: string;
  confirmPassword: string;
}

export type AuthError = {
  message: string;
  status?: number;
  code?: string;
}
