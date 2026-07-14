import { getAPIBaseURL } from "./config";

const ACCESS_TOKEN_KEY = "deokgil-access-token";
const REFRESH_TOKEN_KEY = "deokgil-refresh-token";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthUser = {
  id: string;
  nickname: string;
  profileImage: string;
  email?: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export function saveAuthTokens(tokens: AuthTokens) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
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
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Fallback text per documented error-list status codes, used only if the
// server response has no JSON body (e.g. proxy/gateway error pages).
const FALLBACK_MESSAGE_BY_STATUS: Record<number, string> = {
  401: "인증 정보가 유효하지 않습니다. 다시 로그인해 주세요.",
  404: "사용자를 찾을 수 없습니다.",
  500: "서버에서 오류가 발생했습니다.",
};

async function request<T>(
  path: string,
  options: { method: "POST" | "DELETE"; body?: unknown; withAuth?: boolean },
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (options.withAuth) {
    const accessToken = getAccessToken();
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  }

  let response: Response;
  try {
    response = await fetch(`${getAPIBaseURL()}${path}`, {
      method: options.method,
      headers,
      body: JSON.stringify(options.body ?? {}),
    });
  } catch {
    throw new ApiError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.", 0);
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : null;

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && "message" in data
        ? String((data as { message?: unknown }).message)
        : "") ||
      FALLBACK_MESSAGE_BY_STATUS[response.status] ||
      "요청을 처리하지 못했습니다.";

    // A 401 means the access token is expired or invalid — drop it so it
    // isn't reused on the next authenticated call.
    if (response.status === 401) clearAuthTokens();

    throw new ApiError(message, response.status);
  }

  return data as T;
}

export function signupWithGoogle(params: {
  authorizationCode: string;
  nickname: string;
  profileImage: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>("/api/v1/auth/signup/google", {
    method: "POST",
    body: params,
  });
}

export function loginWithGoogle(
  authorizationCode: string,
): Promise<AuthResponse> {
  return request<AuthResponse>("/api/v1/auth/login/google", {
    method: "POST",
    body: { authorizationCode },
  });
}

export function logoutRequest(): Promise<{ message: string }> {
  return request<{ message: string }>("/api/v1/auth/logout", {
    method: "POST",
    withAuth: true,
  });
}

export function deleteAccountRequest(): Promise<{ message: string }> {
  return request<{ message: string }>("/api/v1/users/me", {
    method: "DELETE",
    withAuth: true,
  });
}
