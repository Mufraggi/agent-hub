import { Data } from "effect"
import type { Email } from "../schema"

/**
 * Invalid credentials error - wrong email or password
 */
export class InvalidCredentialsError extends Data.TaggedError("InvalidCredentialsError")<{
  readonly email: Email
}> {}

/**
 * Email already exists error - during signup
 */
export class EmailAlreadyExistsError extends Data.TaggedError("EmailAlreadyExistsError")<{
  readonly email: Email
}> {}

/**
 * Email not verified error
 */
export class EmailNotVerifiedError extends Data.TaggedError("EmailNotVerifiedError")<{
  readonly email: Email
}> {}

/**
 * OAuth provider error
 */
export class OAuthProviderError extends Data.TaggedError("OAuthProviderError")<{
  readonly provider: string
  readonly reason: string
}> {}

/**
 * Session expired error
 */
export class SessionExpiredError extends Data.TaggedError("SessionExpiredError")<{
  readonly expiredAt: Date
}> {}

/**
 * Validation error for form fields
 */
export class AuthValidationError extends Data.TaggedError("AuthValidationError")<{
  readonly field: string
  readonly message: string
}> {}

/**
 * Network error during auth request
 */
export class AuthNetworkError extends Data.TaggedError("AuthNetworkError")<{
  readonly cause: unknown
}> {}

/**
 * Union of all auth domain errors
 */
export type AuthDomainError =
  | InvalidCredentialsError
  | EmailAlreadyExistsError
  | EmailNotVerifiedError
  | OAuthProviderError
  | SessionExpiredError
  | AuthValidationError
  | AuthNetworkError
