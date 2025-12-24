import { Schema } from "effect"
import { Email, StrongPassword, CallbackURL } from "../auth.schema"

/**
 * Sign in request with email/password
 */
export class SignInEmailRequest extends Schema.Class<SignInEmailRequest>("SignInEmailRequest")({
  email: Email,
  password: StrongPassword,
  callbackURL: CallbackURL,
}) {}

/**
 * Sign in with OAuth provider request
 */
export class SignInSocialRequest extends Schema.Class<SignInSocialRequest>("SignInSocialRequest")({
  provider: Schema.Literal("github", "google", "apple"),
  callbackURL: CallbackURL,
}) {}
