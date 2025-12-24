import { Schema } from "effect"

/**
 * Login form data - raw form values before validation
 */
export class LoginFormData extends Schema.Class<LoginFormData>("LoginFormData")({
  email: Schema.String,
  password: Schema.String,
}) {}

/**
 * Default values for login form
 */
export const loginFormDefaults: typeof LoginFormData.Type = {
  email: "",
  password: "",
}
