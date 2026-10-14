import Cookies from "js-cookie";
import type { UserRole, UserModel } from "../typescript/type/auth.types";

const TOKEN_KEY = "accessToken";
const USER_KEY = "user";
const MODEL_KEY = "model";

interface AuthData {
  accessToken: string | null;
  user: {
    _id: string;
    role: UserRole;
    [key: string]: unknown;
  } | null;
  model: UserModel | null;
}

export const getAuthCookie = (): AuthData => {
  try {
    const accessToken = Cookies.get(TOKEN_KEY) ?? null;
    const userRaw = Cookies.get(USER_KEY);
    const user = userRaw ? JSON.parse(userRaw) : null;
    const model = (Cookies.get(MODEL_KEY) as UserModel | undefined) ?? null;

    return { accessToken, user, model };
  } catch (error) {
    console.error("Failed to read auth cookies:", error);
    return { accessToken: null, user: null, model: null };
  }
};

export const clearAuthSession = (): void => {
  Cookies.remove("accessToken", { path: "/" });
  Cookies.remove("refreshToken", { path: "/" });
  Cookies.remove("user", { path: "/" });
  Cookies.remove("model", { path: "/" });
};

export const setAuthSession = (
  accessToken: string,
  refreshToken: string | undefined,
  user: object,
  model?: UserModel
): void => {
  const opts: Cookies.CookieAttributes = {
    expires: 7,
    secure: true,
    sameSite: "strict",
    path: "/",
  };

  Cookies.set("accessToken", accessToken, opts);
  if (refreshToken) Cookies.set("refreshToken", refreshToken, opts);
  Cookies.set("user", JSON.stringify(user), opts);
  if (model) Cookies.set("model", model, opts);
};