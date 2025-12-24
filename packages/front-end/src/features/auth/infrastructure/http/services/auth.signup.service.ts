import { Effect, Layer } from "effect"
import { authClient } from "@/lib/auth/auth-client"
import type { SignUpEmailRequest } from "../../../schema"
import {
  EmailAlreadyExistsError,
  AuthNetworkError,
  type AuthDomainError,
} from "../../../domain"

export class AuthSignUpService extends Effect.Service<AuthSignUpService>()(
  "AuthSignUpService",
  {
    effect: Effect.gen(function* () {
      const signUpWithEmail = (
        request: SignUpEmailRequest
      ): Effect.Effect<void, AuthDomainError> =>
        Effect.tryPromise({
          try: () =>
            authClient.signUp.email(
              {
                email: request.email,
                password: request.password,
                name: request.name,
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
                error.message.includes("exists") ||
                error.message.includes("already")
              ) {
                return new EmailAlreadyExistsError({ email: request.email })
              }
            }
            return new AuthNetworkError({ cause: error })
          },
        }).pipe(Effect.asVoid)

      return { signUpWithEmail } as const
    }),
  }
) {
  static InMemory = Layer.succeed(AuthSignUpService, {
    signUpWithEmail: (_request: SignUpEmailRequest) => {
      // Simulate successful signup
      return Effect.void
    },
  } as unknown as AuthSignUpService)
}
