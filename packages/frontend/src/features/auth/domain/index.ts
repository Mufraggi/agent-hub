export {
  AuthNetworkError,
  AuthValidationError,
  EmailAlreadyExistsError,
  EmailNotVerifiedError,
  InvalidCredentialsError,
  OAuthProviderError,
  SessionExpiredError
} from "./auth.errors"
export type { AuthDomainError } from "./auth.errors"

export { mapAuthErrorToMessage, mapAuthErrorToToastType } from "./auth.error-mapper"
