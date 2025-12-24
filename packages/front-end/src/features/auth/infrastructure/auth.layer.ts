import { Layer } from "effect"
import { AuthSignInService } from "./http/services/auth.signin.service"
import { AuthSignUpService } from "./http/services/auth.signup.service"

/**
 * Production layer with real HTTP services
 */
export const AuthServiceLayer = Layer.mergeAll(
  AuthSignInService.Default,
  AuthSignUpService.Default
)

/**
 * In-memory layer for testing
 */
export const AuthServiceInMemoryLayer = Layer.mergeAll(
  AuthSignInService.InMemory,
  AuthSignUpService.InMemory
)

export type AuthServiceLayer = typeof AuthServiceLayer
