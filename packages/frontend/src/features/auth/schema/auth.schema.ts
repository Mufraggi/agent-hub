import { Schema } from "effect"

// =============================================================================
// Branded Types - Value Objects
// =============================================================================

/**
 * Email address with validation
 */
export const Email = Schema.String.pipe(
  Schema.minLength(1, { message: () => "Email is required" }),
  Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: () => "Email address is not valid",
  }),
  Schema.brand("Email")
)
export type Email = typeof Email.Type

/**
 * Strong password with validation rules:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const StrongPassword = Schema.String.pipe(
  Schema.minLength(8, {
    message: () => "Password must be at least 8 characters",
  }),
  Schema.pattern(/[A-Z]/, {
    message: () => "Password must contain at least one uppercase letter",
  }),
  Schema.pattern(/[a-z]/, {
    message: () => "Password must contain at least one lowercase letter",
  }),
  Schema.pattern(/[0-9]/, {
    message: () => "Password must contain at least one number",
  }),
  Schema.pattern(/[^A-Za-z0-9]/, {
    message: () => "Password must contain at least one special character",
  }),
  Schema.brand("StrongPassword")
)
export type StrongPassword = typeof StrongPassword.Type

/**
 * User display name
 */
export const UserName = Schema.String.pipe(
  Schema.minLength(1, { message: () => "Name is required" }),
  Schema.maxLength(100, { message: () => "Name must be less than 100 characters" }),
  Schema.brand("UserName")
)
export type UserName = typeof UserName.Type

/**
 * User ID (from Better Auth)
 */
export const UserId = Schema.String.pipe(
  Schema.minLength(1),
  Schema.brand("UserId")
)
export type UserId = typeof UserId.Type

/**
 * OAuth Provider type
 */
export const OAuthProvider = Schema.Literal("github", "google", "apple")
export type OAuthProvider = typeof OAuthProvider.Type

/**
 * Callback URL after authentication
 */
export const CallbackURL = Schema.String.pipe(
  Schema.startsWith("/", { message: () => "Callback URL must start with /" }),
  Schema.brand("CallbackURL")
)
export type CallbackURL = typeof CallbackURL.Type

// =============================================================================
// Entity Classes
// =============================================================================

/**
 * Authenticated user session
 */
export class AuthUser extends Schema.Class<AuthUser>("AuthUser")({
  id: UserId,
  email: Email,
  name: UserName,
  emailVerified: Schema.Boolean,
  image: Schema.OptionFromNullOr(Schema.String),
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
}) {}

/**
 * Auth session data
 */
export class AuthSession extends Schema.Class<AuthSession>("AuthSession")({
  user: AuthUser,
  expiresAt: Schema.Date,
}) {}
