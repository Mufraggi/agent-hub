import { Match } from "effect"
import type { AuthDomainError } from "./auth.errors"

/**
 * Maps auth domain errors to user-friendly messages
 */
export const mapAuthErrorToMessage = (error: AuthDomainError): string =>
  Match.value(error).pipe(
    Match.tag(
      "InvalidCredentialsError",
      () => "Invalid email or password. Please check your credentials and try again."
    ),
    Match.tag(
      "EmailAlreadyExistsError",
      ({ email }) => `An account with email ${email} already exists. Please sign in or use a different email.`
    ),
    Match.tag("EmailNotVerifiedError", () => "Please verify your email address before signing in."),
    Match.tag("OAuthProviderError", ({ provider, reason }) => `Authentication with ${provider} failed: ${reason}`),
    Match.tag("SessionExpiredError", () => "Your session has expired. Please sign in again."),
    Match.tag("AuthValidationError", ({ field, message }) => `${field}: ${message}`),
    Match.tag("AuthNetworkError", () => "A network error occurred. Please check your connection and try again."),
    Match.exhaustive
  )

/**
 * Maps auth domain errors to toast notification type
 */
export const mapAuthErrorToToastType = (error: AuthDomainError): "error" | "warning" =>
  Match.value(error).pipe(
    Match.tag("InvalidCredentialsError", () => "error" as const),
    Match.tag("EmailAlreadyExistsError", () => "warning" as const),
    Match.tag("EmailNotVerifiedError", () => "warning" as const),
    Match.tag("OAuthProviderError", () => "error" as const),
    Match.tag("SessionExpiredError", () => "warning" as const),
    Match.tag("AuthValidationError", () => "error" as const),
    Match.tag("AuthNetworkError", () => "error" as const),
    Match.exhaustive
  )
