import Cookies from "js-cookie";
import type { User, UserModel } from "../typescript/type/auth.types";

// Cookie keys
const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";
const MODEL_KEY = "model";

// Cookie options
const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 7,                    // 7 days
  secure: true,                  // HTTPS only (set false for localhost HTTP dev)
  sameSite: "strict",            // CSRF protection
  path: "/",
};

const ACCESS_TOKEN_OPTIONS: Cookies.CookieAttributes = {
  ...COOKIE_OPTIONS,
  expires: 1,                    // Access token: 1 day
};

const REFRESH_TOKEN_OPTIONS: Cookies.CookieAttributes = {
  ...COOKIE_OPTIONS,
  expires: 7,                    // Refresh token: 7 days
};

export const tokenStorage = {
  // =====================================================
  // TOKENS
  // =====================================================

  setTokens: (accessToken: string, refreshToken?: string): void => {
    Cookies.set(TOKEN_KEY, accessToken, ACCESS_TOKEN_OPTIONS);
    if (refreshToken) {
      Cookies.set(REFRESH_TOKEN_KEY, refreshToken, REFRESH_TOKEN_OPTIONS);
    }
  },

  getAccessToken: (): string | null => {
    return Cookies.get(TOKEN_KEY) ?? null;
  },

  getRefreshToken: (): string | null => {
    return Cookies.get(REFRESH_TOKEN_KEY) ?? null;
  },

  // =====================================================
  // USER
  // =====================================================

  setUser: (user: User, model?: UserModel | null): void => {
    Cookies.set(USER_KEY, JSON.stringify(user), COOKIE_OPTIONS);
    if (model) {
      Cookies.set(MODEL_KEY, model, COOKIE_OPTIONS);
    }
  },

  getUser: (): User | null => {
    const user = Cookies.get(USER_KEY);
    if (!user) return null;

    try {
      return JSON.parse(user) as User;
    } catch (error) {
      console.error("Failed to parse user cookie:", error);
      return null;
    }
  },

  getModel: (): UserModel | null => {
    return (Cookies.get(MODEL_KEY) as UserModel | undefined) ?? null;
  },

  // =====================================================
  // CLEAR
  // =====================================================

  clearAll: (): void => {
    Cookies.remove(TOKEN_KEY, { path: "/" });
    Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
    Cookies.remove(USER_KEY, { path: "/" });
    Cookies.remove(MODEL_KEY, { path: "/" });
  },

  isAuthenticated: (): boolean => {
    return !!Cookies.get(TOKEN_KEY);
  },
};