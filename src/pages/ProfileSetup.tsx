import { type ChangeEvent, type FormEvent, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MobileFrame from "@/components/layout/MobileFrame";
import {
  loadAuthenticatedUser,
  loadUserProfile,
  normalizeAuthenticatedUser,
  saveAuthenticatedUser,
  saveUserProfile,
} from "@/lib/profile";
import { saveAuthTokens, signupWithGoogle } from "@/lib/auth";
import { Camera, Check, UserRound } from "lucide-react";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

type GoogleProfilePreview = {
  name: string;
  email: string;
  image: string;
};

export default function ProfileSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const authenticatedUser = loadAuthenticatedUser();
  const savedProfile = loadUserProfile();
  const { googleProfile, authorizationCode } = (location.state as {
    googleProfile?: GoogleProfilePreview;
    authorizationCode?: string;
  } | null) ?? {};
  const isSignupFlow = Boolean(authorizationCode);
  const [nickname, setNickname] = useState(
    savedProfile?.nickname || authenticatedUser?.name || googleProfile?.name || "",
  );
  const [profileImage, setProfileImage] = useState(
    savedProfile?.image || authenticatedUser?.image || googleProfile?.image || "",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("이미지 파일만 선택할 수 있어요.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrorMessage("프로필 이미지는 2MB 이하로 선택해 주세요.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
        setErrorMessage("");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedNickname = nickname.trim();

    if (trimmedNickname.length < 2 || trimmedNickname.length > 12) {
      setErrorMessage("닉네임은 2자 이상 12자 이하로 입력해 주세요.");
      return;
    }

    if (!profileImage) {
      setErrorMessage("프로필 이미지를 선택해 주세요.");
      return;
    }

    if (isSignupFlow && authorizationCode) {
      setIsSubmitting(true);
      try {
        const response = await signupWithGoogle({
          authorizationCode,
          nickname: trimmedNickname,
          profileImage,
        });
        saveAuthTokens(response);
        const user = normalizeAuthenticatedUser(response.user);
        saveAuthenticatedUser(user);
        saveUserProfile({
          nickname: user.name || trimmedNickname,
          image: user.image || profileImage,
          email: user.email || googleProfile?.email || "",
        });
        navigate("/home", { replace: true });
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "회원가입에 실패했어요.",
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    saveUserProfile({
      nickname: trimmedNickname,
      image: profileImage,
      email: authenticatedUser?.email || googleProfile?.email || "",
    });
    navigate("/home", { replace: true });
  };

  return (
    <MobileFrame>
      <form onSubmit={handleSubmit} className="flex h-screen flex-col bg-white">
        <main className="min-h-0 flex-1 overflow-y-auto px-6 pb-28 pt-14">
          <p className="text-[10px] font-extrabold tracking-[0.17em] text-[#22B8AD]">
            PROFILE SETUP
          </p>
          <h1 className="mt-3 text-[30px] font-medium leading-[1.35] tracking-[-0.04em] text-[#0F172A]">
            덕질을 함께할
            <br />
            프로필을 만들어 주세요.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#64748B]">
            덕길이에서 사용할 닉네임과 프로필 이미지를 설정해요.
          </p>

          {googleProfile && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#DCE9E6] bg-[#F5FBFA] px-4 py-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white shadow-sm">
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 0 1-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
                  <path d="M5.84 14.09A6.4 6.4 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84Z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold text-[#0F172A]">
                  Google 계정 정보를 가져왔어요
                </p>
                <p className="mt-0.5 truncate text-[11px] text-[#64748B]">
                  {googleProfile.email}
                </p>
              </div>
              <span className="rounded-full bg-[#DDF8F4] px-2.5 py-1 text-[10px] font-extrabold text-[#138A80]">
                연결 완료
              </span>
            </div>
          )}

          <section className={`${googleProfile ? "mt-8" : "mt-10"} flex flex-col items-center`}>
            {isSignupFlow ? (
              <div className="relative grid h-28 w-28 place-items-center overflow-hidden rounded-full border-2 border-[#7CEEDF] bg-[#F5FBFA] text-[#22B8AD]">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Google 프로필"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={40} strokeWidth={1.5} />
                )}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  aria-label="프로필 이미지 선택"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative grid h-28 w-28 place-items-center overflow-hidden rounded-full border-2 border-dashed border-[#7CEEDF] bg-[#F5FBFA] text-[#22B8AD]"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="선택한 프로필"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound size={40} strokeWidth={1.5} />
                  )}
                  <span className="absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-[#38D9C7] text-[#063F3A]">
                    <Camera size={16} />
                  </span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 text-xs font-extrabold text-[#22B8AD]"
                >
                  이미지 선택
                </button>
              </>
            )}
          </section>

          <label className="mt-10 block">
            <span className="text-xs font-extrabold text-[#0F172A]">닉네임</span>
            <div className="relative mt-2">
              <input
                value={nickname}
                maxLength={12}
                onChange={(event) => {
                  setNickname(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="2~12자로 입력해 주세요"
                className="h-16 w-full rounded-2xl border border-[#DCE9E6] bg-[#F5FBFA] px-4 pr-14 text-sm font-semibold text-[#0F172A] outline-none placeholder:font-normal placeholder:text-[#94A3B8] focus:border-[#38D9C7]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#94A3B8]">
                {nickname.length}/12
              </span>
            </div>
          </label>

          {errorMessage && (
            <p role="alert" className="mt-3 text-xs font-semibold text-[#EF4444]">
              {errorMessage}
            </p>
          )}

          <div className="mt-8 flex items-start gap-2 rounded-xl bg-[#E6FAF7] p-4">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#22B8AD] text-white">
              <Check size={12} />
            </span>
            <p className="text-[11px] leading-relaxed text-[#64748B]">
              닉네임과 이미지는 마이페이지에서 언제든지 변경할 수 있어요.
            </p>
          </div>
        </main>

        <div className="absolute bottom-0 left-0 right-0 bg-white px-6 pb-5 pt-3 safe-bottom">
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-14 w-full rounded-2xl bg-[#38D9C7] text-sm font-extrabold text-[#063F3A] disabled:opacity-60"
          >
            {isSubmitting ? "처리 중..." : "프로필 설정 완료"}
          </button>
        </div>
      </form>
    </MobileFrame>
  );
}
