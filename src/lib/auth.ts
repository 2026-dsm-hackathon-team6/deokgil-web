import { getAPIBaseURL } from "./config";

const ACCESS_TOKEN_KEY = "deokgil-access-token";
const REFRESH_TOKEN_KEY = "deokgil-refresh-token";

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
};

export type AuthUser = {
  id: string;
  nickname: string;
  profileImage: string;
  email?: string;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export function saveAuthTokens(tokens: AuthTokens) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  // The server delivers the refresh token as an HttpOnly cookie. Keep this
  // fallback for older environments, but never write an absent token.
  if (tokens.refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  } else {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function getAccessToken(): string | null {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function clearAuthTokens() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// Fallback text per documented error-list status codes, used only if the
// server response has no JSON body (e.g. proxy/gateway error pages).
const FALLBACK_MESSAGE_BY_STATUS: Record<number, string> = {
  401: "인증 정보가 유효하지 않습니다. 다시 로그인해 주세요.",
  404: "사용자를 찾을 수 없습니다.",
  500: "서버에서 오류가 발생했습니다.",
};

export async function apiRequest<T>(
  path: string,
  options: {
    method: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
    withAuth?: boolean;
  },
): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.withAuth) {
    const accessToken = getAccessToken();
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  }

  const REQUEST_TIMEOUT_MS = 15000;
  const timeoutController = new AbortController();
  const timeoutId = window.setTimeout(
    () => timeoutController.abort(),
    REQUEST_TIMEOUT_MS,
  );

  let response: Response;
  try {
    response = await fetch(`${getAPIBaseURL()}${path}`, {
      method: options.method,
      headers,
      ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
      signal: timeoutController.signal,
      credentials: "include",
    });
  } catch (error) {
    const message =
      error instanceof DOMException && error.name === "AbortError"
        ? "서버 응답이 없어요. 네트워크 상태를 확인하고 다시 시도해 주세요."
        : "서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.";
    throw new ApiError(message, 0);
  } finally {
    window.clearTimeout(timeoutId);
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : null;

  if (!response.ok) {
    const body = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
    const message =
      (typeof body.message === "string" ? body.message : "") ||
      FALLBACK_MESSAGE_BY_STATUS[response.status] ||
      "요청을 처리하지 못했습니다.";
    const code = typeof body.code === "string" ? body.code : undefined;

    // A 401 means the access token is expired or invalid — drop it so it
    // isn't reused on the next authenticated call.
    if (response.status === 401) clearAuthTokens();

    throw new ApiError(message, response.status, code);
  }

  return data as T;
}

export function signupWithGoogle(params: {
  authorizationCode: string;
  nickname: string;
  profileImage?: string;
}): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/v1/auth/signup/google", {
    method: "POST",
    body: params,
  });
}

export function loginWithGoogle(
  authorizationCode: string,
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/v1/auth/login/google", {
    method: "POST",
    body: { authorizationCode },
  });
}

export function logoutRequest(): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/api/v1/auth/logout", {
    method: "POST",
    withAuth: true,
  });
}

export const getCsrfToken = () =>
  apiRequest<void>("/api/v1/auth/csrf-token", { method: "GET" });

export const reissueAuthTokens = () =>
  apiRequest<AuthResponse>("/api/v1/auth/reissue", { method: "POST" });

export function deleteAccountRequest(): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/api/v1/users/me", {
    method: "DELETE",
    withAuth: true,
  });
}

export type ProfileImageUpload = {
  uploadUrl: string;
  imageUrl: string;
};

export async function uploadProfileImage(file: File): Promise<string> {
  const upload = await apiRequest<ProfileImageUpload>(
    "/api/v1/users/me/profile-image/presigned-url",
    {
      method: "POST",
      body: { contentType: file.type },
      withAuth: true,
    },
  );

  const response = await fetch(upload.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!response.ok) {
    throw new ApiError("프로필 이미지를 업로드하지 못했습니다.", response.status);
  }
  return upload.imageUrl;
}

export function updateProfile(params: {
  nickname: string;
  profileImage?: string;
}): Promise<AuthUser> {
  return apiRequest<AuthUser>("/api/v1/users/me", {
    method: "PATCH",
    body: params,
    withAuth: true,
  });
}
