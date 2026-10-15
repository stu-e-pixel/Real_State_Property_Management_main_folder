import Cookies from "js-cookie";
import type { User, UserModel } from "../typescript/type/auth.types";


const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";
const MODEL_KEY = "model";


const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 7,                    
  secure: true,                  
  sameSite: "strict",            
  path: "/",
};

const ACCESS_TOKEN_OPTIONS: Cookies.CookieAttributes = {
  ...COOKIE_OPTIONS,
  expires: 1,                    
};

const REFRESH_TOKEN_OPTIONS: Cookies.CookieAttributes = {
  ...COOKIE_OPTIONS,
  expires: 7,                    
};

export const tokenStorage = {
  

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