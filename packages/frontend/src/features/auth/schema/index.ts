// Core schema exports
export {
  Email,
  StrongPassword,
  UserName,
  UserId,
  OAuthProvider,
  CallbackURL,
  AuthUser,
  AuthSession,
} from "./auth.schema"
export type {
  Email as EmailType,
  StrongPassword as StrongPasswordType,
  UserName as UserNameType,
  UserId as UserIdType,
  OAuthProvider as OAuthProviderType,
  CallbackURL as CallbackURLType,
} from "./auth.schema"

// Form schema exports
export { LoginFormData, loginFormDefaults } from "./form/login.form.schema"
export { SignupFormData, signupFormDefaults } from "./form/signup.form.schema"

// API schema exports
export { SignInEmailRequest, SignInSocialRequest } from "./api/auth.signin.schema"
export { SignUpEmailRequest } from "./api/auth.signup.schema"
