import { Schema } from "effect"
import { UserId } from "./UserType.js"

// Branded types for Account
export const AccountId = Schema.String.pipe(Schema.brand("AccountId"))
export type AccountId = typeof AccountId.Type

export const ExternalAccountId = Schema.String.pipe(Schema.brand("ExternalAccountId"))
export type ExternalAccountId = typeof ExternalAccountId.Type

export const ProviderId = Schema.String.pipe(Schema.brand("ProviderId"))
export type ProviderId = typeof ProviderId.Type

export const AccessToken = Schema.String.pipe(Schema.brand("AccessToken"))
export type AccessToken = typeof AccessToken.Type

export const RefreshToken = Schema.String.pipe(Schema.brand("RefreshToken"))
export type RefreshToken = typeof RefreshToken.Type

export const IdToken = Schema.String.pipe(Schema.brand("IdToken"))
export type IdToken = typeof IdToken.Type

export const Scope = Schema.String.pipe(Schema.brand("Scope"))
export type Scope = typeof Scope.Type

export const Password = Schema.String.pipe(Schema.brand("Password"))
export type Password = typeof Password.Type

// Re-export UserId for convenience
export { UserId }
