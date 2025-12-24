import { Schema } from "effect"

/**
 * Signup form data - raw form values before validation
 */
export class SignupFormData extends Schema.Class<SignupFormData>("SignupFormData")({
  name: Schema.String,
  email: Schema.String,
  password: Schema.String,
}) {}

/**
 * Default values for signup form
 */
export const signupFormDefaults: typeof SignupFormData.Type = {
  name: "",
  email: "",
  password: "",
}
