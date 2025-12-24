import { authClient } from "@/lib/auth/auth-client"
import type { OAuthProvider } from "better-auth"
import { useCallback } from "react"
import type { CallbackURL } from "../../schema/auth.schema"

type SocialSignInOptions = {
  provider: OAuthProvider
  callbackURL: CallbackURL
}

/**
 * Hook for social sign in (OAuth providers)
 */
export const useSocialSignIn = () => {
  const signInWithGitHub = useCallback(async (callbackURL: CallbackURL) => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL
    })
  }, [])

  const signInWithGoogle = useCallback(async (callbackURL: CallbackURL) => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL
    })
  }, [])

  const signInWithProvider = useCallback(
    async ({ callbackURL, provider }: SocialSignInOptions) => {
      await authClient.signIn.social({
        provider,
        callbackURL
      })
    },
    []
  )

  return {
    signInWithGitHub,
    signInWithGoogle,
    signInWithProvider
  }
}
