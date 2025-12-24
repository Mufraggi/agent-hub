import { Email, UserName } from "@template/domain/UserType"
import { Schema } from "effect"
import { CallbackURL, StrongPassword } from "../auth.schema.js"

/**
 * Sign up request with email/password
 */
export class SignUpEmailRequest extends Schema.Class<SignUpEmailRequest>("SignUpEmailRequest")({
  email: Email,
  password: StrongPassword,
  name: UserName,
  callbackURL: CallbackURL
}) {}
