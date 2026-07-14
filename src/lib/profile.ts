export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  image: string;
};

export type UserProfile = {
  nickname: string;
  image: string;
  email: string;
};

const AUTH_USER_KEY = "deokgil-auth-user";
const PROFILE_KEY_PREFIX = "deokgil-profile";

const getStringValue = (
  source: Record<string, unknown>,
  keys: string[],
) => {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
};

export function normalizeAuthenticatedUser(value: unknown): AuthenticatedUser {
  const source =
    typeof value === "object" && value !== null
      ? (value as Record<string, unknown>)
      : {};

  return {
    id: getStringValue(source, ["id", "user_id", "sub"]),
    email: getStringValue(source, ["email", "user_email"]),
    name: getStringValue(source, ["name", "nickname", "display_name"]),
    image: getStringValue(source, [
      "picture",
      "image",
      "avatar",
      "avatar_url",
      "profile_image",
    ]),
  };
}

export function saveAuthenticatedUser(user: AuthenticatedUser) {
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function loadAuthenticatedUser(): AuthenticatedUser | null {
  try {
    const storedValue = window.localStorage.getItem(AUTH_USER_KEY);
    return storedValue ? (JSON.parse(storedValue) as AuthenticatedUser) : null;
  } catch {
    return null;
  }
}

const getProfileKey = (user = loadAuthenticatedUser()) => {
  const userKey = user?.id || user?.email || "guest";
  return `${PROFILE_KEY_PREFIX}:${userKey}`;
};

export function saveUserProfile(profile: UserProfile) {
  window.localStorage.setItem(getProfileKey(), JSON.stringify(profile));
}

export function loadUserProfile(): UserProfile | null {
  try {
    const storedValue = window.localStorage.getItem(getProfileKey());
    return storedValue ? (JSON.parse(storedValue) as UserProfile) : null;
  } catch {
    return null;
  }
}
