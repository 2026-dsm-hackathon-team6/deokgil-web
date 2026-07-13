import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "@/lib/api";
import LoadingScreen from "@/components/layout/LoadingScreen";
import {
  loadUserProfile,
  normalizeAuthenticatedUser,
  saveAuthenticatedUser,
} from "@/lib/profile";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState("Google 계정을 확인하고 있어요.");

  useEffect(() => {
    let isActive = true;

    const completeLogin = async () => {
      try {
        const token = new URLSearchParams(window.location.search).get("token");
        if (!token) throw new Error("로그인 토큰이 없습니다.");

        window.localStorage.setItem("token", token);
        window.localStorage.setItem("isLougOutManual", "false");
        window.history.replaceState({}, "", "/auth/callback");

        const response = await client.auth.me();
        const responseData = response.data as unknown;
        const userData =
          typeof responseData === "object" &&
          responseData !== null &&
          "data" in responseData
            ? (responseData as { data: unknown }).data
            : responseData;
        const user = normalizeAuthenticatedUser(userData);
        saveAuthenticatedUser(user);

        if (!isActive) return;
        navigate(loadUserProfile() ? "/home" : "/profile/setup", {
          replace: true,
        });
      } catch {
        if (!isActive) return;
        setStatusMessage("로그인 정보를 확인하지 못했어요.");
        navigate(
          "/auth/error?msg=Google 로그인 정보를 확인하지 못했습니다.",
          { replace: true },
        );
      }
    };

    void completeLogin();
    return () => {
      isActive = false;
    };
  }, [navigate]);

  return (
    <LoadingScreen
      message={statusMessage}
      description="안전하게 로그인 정보를 불러오고 있어요."
    />
  );
}
