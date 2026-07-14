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
import { ApiError, saveAuthTokens, signupWithGoogle } from "@/lib/auth";
import { ArrowLeft, Camera, Check, UserRound } from "lucide-react";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

export default function ProfileSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const authenticatedUser = loadAuthenticatedUser();
  const savedProfile = loadUserProfile();
  const { authorizationCode } =
    (location.state as { authorizationCode?: string } | null) ?? {};
  const isSignupFlow = Boolean(authorizationCode);
  const pageTitle = isSignupFlow ? (
    <>
      덕질을 함께할
      <br />
      프로필을 만들어 주세요.
    </>
  ) : (
    <>
      나를 보여줄
      <br />
      프로필을 수정해 주세요.
    </>
  );
  const [nickname, setNickname] = useState(
    savedProfile?.nickname || authenticatedUser?.name || "",
  );
  const [profileImage, setProfileImage] = useState(
    savedProfile?.image || authenticatedUser?.image || "",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

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
        setImageLoadFailed(false);
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
          email: user.email,
        });
        navigate("/home", { replace: true });
      } catch (error) {
        setErrorMessage(error instanceof ApiError &&
          (error.code === "USER_ALREADY_EXISTS" ||
            error.code === "ALREADY_REGISTERED" ||
            error.status === 409)
          ? "이미 가입된 계정이에요. 로그인 화면에서 Google로 로그인해 주세요."
          : error instanceof Error
            ? error.message
            : "회원가입에 실패했어요.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    saveUserProfile({
      nickname: trimmedNickname,
      image: profileImage,
      email: authenticatedUser?.email || "",
    });
    navigate("/home", { replace: true });
  };

  return (
    <MobileFrame>
      <form onSubmit={handleSubmit} className="min-h-dvh bg-white">
        <header className="flex h-16 shrink-0 items-center px-4 pt-2">
          <button
            type="button"
            aria-label="이전 화면으로"
            onClick={() => {
              if (isSignupFlow) {
                navigate("/login", { replace: true });
              } else {
                navigate(-1);
              }
            }}
            className="grid h-10 w-10 place-items-center rounded-full text-[#0F172A] transition-colors hover:bg-[#F5FBFA]"
          >
            <ArrowLeft size={21} />
          </button>
        </header>

        <main className="px-6 pb-6 pt-5">
          <p className="text-[10px] font-extrabold tracking-[0.17em] text-[#22B8AD]">
            {isSignupFlow ? "PROFILE SETUP" : "EDIT PROFILE"}
          </p>
          <h1 className="mt-3 text-[30px] font-medium leading-[1.35] tracking-[-0.04em] text-[#0F172A]">
            {pageTitle}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#64748B]">
            {isSignupFlow
              ? "덕길이에서 사용할 닉네임과 프로필 이미지를 설정해요."
              : "변경한 정보는 저장 후 바로 프로필에 반영돼요."}
          </p>

          <section className="mt-11 flex flex-col items-center">
            <div className="relative h-28 w-28">
              <button
                type="button"
                aria-label="프로필 이미지 선택"
                onClick={() => fileInputRef.current?.click()}
                className="grid h-full w-full place-items-center overflow-hidden rounded-full border-2 border-dashed border-[#7CEEDF] bg-[#F5FBFA] text-[#22B8AD]"
              >
                {profileImage && !imageLoadFailed ? (
                  <img
                    src={profileImage}
                    alt="선택한 프로필"
                    className="h-full w-full object-cover"
                    onError={() => setImageLoadFailed(true)}
                  />
                ) : (
                  <UserRound size={40} strokeWidth={1.5} />
                )}
              </button>
              <button
                type="button"
                aria-label="프로필 이미지 변경"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-[#38D9C7] text-[#063F3A] shadow-sm"
              >
                <Camera size={16} />
              </button>
            </div>
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
              {profileImage ? "프로필 사진 변경" : "프로필 사진 선택"}
            </button>
            <p className="mt-1.5 text-[11px] text-[#94A3B8]">JPG, PNG · 최대 2MB</p>
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

          {isSignupFlow && (
            <div className="mt-8 flex items-start gap-2 rounded-xl bg-[#E6FAF7] p-4">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#22B8AD] text-white">
                <Check size={12} />
              </span>
              <p className="text-[11px] leading-relaxed text-[#64748B]">
                닉네임과 이미지는 마이페이지에서 언제든지 변경할 수 있어요.
              </p>
            </div>
          )}

          <div className="mt-6 pb-8 safe-bottom">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-14 w-full rounded-2xl bg-[#38D9C7] text-sm font-extrabold text-[#063F3A] disabled:opacity-60"
            >
              {isSubmitting
                ? "처리 중..."
                : isSignupFlow
                  ? "프로필 설정 완료"
                  : "변경사항 저장"}
            </button>
          </div>
        </main>
      </form>
    </MobileFrame>
  );
}
