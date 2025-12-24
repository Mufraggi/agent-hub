import { Schema } from "effect"
import { Email, StrongPassword, UserName, CallbackURL } from "../auth.schema"

/**
 * Sign up request with email/password
 */
export class SignUpEmailRequest extends Schema.Class<SignUpEmailRequest>("SignUpEmailRequest")({
  email: Email,
  password: StrongPassword,
  name: UserName,
  callbackURL: CallbackURL,
}) {}
