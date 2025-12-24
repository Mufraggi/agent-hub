import { Effect, Layer } from "effect"
import { authClient } from "@/lib/auth/auth-client"
import type { SignInEmailRequest, SignInSocialRequest } from "../../../schema"
import {
  InvalidCredentialsError,
  AuthNetworkError,
  type AuthDomainError,
} from "../../../domain"

export class AuthSignInService extends Effect.Service<AuthSignInService>()(
  "AuthSignInService",
  {
    effect: Effect.gen(function* () {
      const signInWithEmail = (
        request: SignInEmailRequest
      ): Effect.Effect<void, AuthDomainError> =>
        Effect.tryPromise({
          try: () =>
            authClient.signIn.email(
              {
                email: request.email,
                password: request.password,
                callbackURL: request.callbackURL,
              },
              {
                onSuccess: () => {
                  // Success is handled by callbackURL redirect
                },
                onError: (ctx) => {
                  throw new Error(ctx.error.message)
                },
              }
            ),
          catch: (error) => {
            if (error instanceof Error) {
              if (
                error.message.includes("Invalid") ||
                error.message.includes("credentials")
              ) {
                return new InvalidCredentialsError({ email: request.email })
              }
            }
            return new AuthNetworkError({ cause: error })
          },
        }).pipe(Effect.asVoid)

      const signInWithSocial = (
        request: SignInSocialRequest
      ): Effect.Effect<void, AuthDomainError> =>
        Effect.tryPromise({
          try: () =>
            authClient.signIn.social({
              provider: request.provider,
              callbackURL: request.callbackURL,
            }),
          catch: (error) => new AuthNetworkError({ cause: error }),
        }).pipe(Effect.asVoid)

      return { signInWithEmail, signInWithSocial } as const
    }),
  }
) {
  static InMemory = Layer.succeed(AuthSignInService, {
    signInWithEmail: (_request: SignInEmailRequest) => {
      // Simulate successful login
      return Effect.void
    },
    signInWithSocial: (_request: SignInSocialRequest) => {
      // Simulate OAuth redirect
      return Effect.void
    },
  } as unknown as AuthSignInService)
}
