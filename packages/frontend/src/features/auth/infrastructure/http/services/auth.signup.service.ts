import { authClient } from "@/lib/auth/auth-client.js"
import { Effect, Layer } from "effect"
import type { AuthDomainError } from "../../../domain"
import { AuthNetworkError, EmailAlreadyExistsError } from "../../../domain"
import type { SignUpEmailRequest } from "../../../schema/api/auth.signup.schema"

export class AuthSignUpService extends Effect.Service<AuthSignUpService>()(
  "AuthSignUpService",
  {
    effect: Effect.gen(function*() {
      yield* Effect.log("")
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
                callbackURL: request.callbackURL
              },
              {
                onSuccess: () => {
                  // Success is handled by callbackURL redirect
                },
                onError: (ctx) => {
                  throw new Error(ctx.error.message)
                }
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
          }
        }).pipe(Effect.asVoid)

      return { signUpWithEmail } as const
    })
  }
) {
  static InMemory = Layer.succeed(AuthSignUpService, {
    signUpWithEmail: (_request: SignUpEmailRequest) => {
      // Simulate successful signup
      return Effect.void
    }
  } as unknown as AuthSignUpService)
}
