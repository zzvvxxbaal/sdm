import {
  GoogleAuthProvider,
  OAuthProvider,
  type AuthProvider,
} from "firebase/auth";
import type { AuthProviderId } from "@/types/auth";

/**
 * Modular auth provider registry. New OAuth providers can be added here without
 * touching the rest of the auth flow.
 */

export function createGoogleProvider(): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}

/**
 * Kakao is wired through Firebase as a generic OIDC provider. The provider id is
 * configured in the Firebase console and surfaced via env. When it has not been
 * configured we throw a clear, actionable error instead of failing silently.
 */
export function createKakaoProvider(): AuthProvider {
  const providerId = process.env.NEXT_PUBLIC_KAKAO_OIDC_PROVIDER_ID;
  if (!providerId) {
    throw new Error(
      "Kakao 로그인이 아직 설정되지 않았습니다. 관리자에게 문의해주세요."
    );
  }
  return new OAuthProvider(providerId);
}

export function getProvider(id: AuthProviderId): AuthProvider {
  switch (id) {
    case "google":
      return createGoogleProvider();
    case "kakao":
      return createKakaoProvider();
    default:
      throw new Error(`Unsupported auth provider: ${id}`);
  }
}
