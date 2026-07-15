import { getGoogleClientId } from "./config";

interface GoogleCodeResponse {
  code?: string;
  error?: string;
}

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
}

interface GoogleOAuthError {
  type: string;
}

interface GoogleCodeClient {
  requestCode: () => void;
}

interface GoogleTokenClient {
  requestAccessToken: () => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initCodeClient: (config: {
            client_id: string;
            scope: string;
            ux_mode: "popup";
            callback: (response: GoogleCodeResponse) => void;
            error_callback?: (error: GoogleOAuthError) => void;
          }) => GoogleCodeClient;
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: GoogleTokenResponse) => void;
            error_callback?: (error: GoogleOAuthError) => void;
          }) => GoogleTokenClient;
        };
      };
    };
  }
}

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";
let gisScriptPromise: Promise<void> | null = null;

function loadGoogleIdentityScript(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (gisScriptPromise) return gisScriptPromise;

  gisScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GOOGLE_SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Google Identity Services 로드에 실패했습니다.")),
      );
      if (window.google?.accounts?.oauth2) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Google Identity Services 로드에 실패했습니다."));
    document.head.appendChild(script);
  });

  return gisScriptPromise;
}

function requireClientId(): string {
  const clientId = getGoogleClientId();
  if (!clientId) {
    throw new Error(
      "Google Client ID가 설정되지 않았습니다. VITE_GOOGLE_CLIENT_ID를 확인해 주세요.",
    );
  }
  return clientId;
}

function toErrorMessage(error: GoogleOAuthError): string {
  return error?.type === "popup_closed"
    ? "Google 인증이 취소되었습니다."
    : "Google 인증에 실패했습니다.";
}

/**
 * Runs the OAuth 2.0 authorization code popup flow and returns the code
 * so the backend can exchange it for tokens itself.
 */
export async function requestGoogleAuthorizationCode(): Promise<string> {
  const clientId = requireClientId();
  await loadGoogleIdentityScript();

  if (!window.google?.accounts?.oauth2) {
    throw new Error("Google Identity Services를 불러오지 못했습니다.");
  }

  return new Promise((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initCodeClient({
      client_id: clientId,
      scope: "openid email profile",
      ux_mode: "popup",
      callback: (response) => {
        if (response.code) {
          resolve(response.code);
        } else {
          reject(new Error("Google 인증 코드를 받지 못했습니다."));
        }
      },
      error_callback: (error) => reject(new Error(toErrorMessage(error))),
    });
    client.requestCode();
  });
}

export type GoogleProfilePreview = {
  name: string;
  email: string;
  image: string;
};

/**
 * Fetches the Google account's display name/email/photo URL via a separate
 * implicit token grant. Must be triggered by its own direct user click —
 * the authorization-code popup and this one can't share a single gesture,
 * the browser blocks the second `window.open` either way.
 */
export async function fetchGoogleProfilePreview(): Promise<GoogleProfilePreview> {
  const clientId = requireClientId();
  await loadGoogleIdentityScript();

  if (!window.google?.accounts?.oauth2) {
    throw new Error("Google Identity Services를 불러오지 못했습니다.");
  }

  const accessToken = await new Promise<string>((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "openid email profile",
      callback: (response) => {
        if (response.access_token) {
          resolve(response.access_token);
        } else {
          reject(new Error("Google 프로필 정보를 가져오지 못했습니다."));
        }
      },
      error_callback: (error) => reject(new Error(toErrorMessage(error))),
    });
    client.requestAccessToken();
  });

  const response = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!response.ok) {
    throw new Error("Google 프로필 정보를 가져오지 못했습니다.");
  }
  const data = (await response.json()) as {
    name?: string;
    email?: string;
    picture?: string;
  };

  return {
    name: data.name || "",
    email: data.email || "",
    image: data.picture || "",
  };
}
