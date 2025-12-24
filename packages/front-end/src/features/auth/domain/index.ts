export {
  InvalidCredentialsError,
  EmailAlreadyExistsError,
  EmailNotVerifiedError,
  OAuthProviderError,
  SessionExpiredError,
  AuthValidationError,
  AuthNetworkError,
} from "./auth.errors"
export type { AuthDomainError } from "./auth.errors"

export { mapAuthErrorToMessage, mapAuthErrorToToastType } from "./auth.error-mapper"
