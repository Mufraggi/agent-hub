import { Schema } from "effect"
import {
  AccessToken,
  AccountId,
  ExternalAccountId,
  IdToken,
  Password,
  ProviderId,
  RefreshToken,
  Scope,
  UserId
} from "./AccountType.js"

// Account Schema
export const Account = Schema.Struct({
  id: AccountId,
  accountId: ExternalAccountId,
  providerId: ProviderId,
  userId: UserId,
  accessToken: Schema.NullOr(AccessToken),
  refreshToken: Schema.NullOr(RefreshToken),
  idToken: Schema.NullOr(IdToken),
  accessTokenExpiresAt: Schema.NullOr(Schema.DateFromSelf),
  refreshTokenExpiresAt: Schema.NullOr(Schema.DateFromSelf),
  scope: Schema.NullOr(Scope),
  password: Schema.NullOr(Password),
  createdAt: Schema.DateFromSelf,
  updatedAt: Schema.DateFromSelf
})

export type Account = typeof Account.Type

// NewAccount Schema (for insertion)
export const NewAccount = Schema.Struct({
  id: AccountId,
  accountId: ExternalAccountId,
  providerId: ProviderId,
  userId: UserId,
  accessToken: Schema.optional(Schema.NullOr(AccessToken)),
  refreshToken: Schema.optional(Schema.NullOr(RefreshToken)),
  idToken: Schema.optional(Schema.NullOr(IdToken)),
  accessTokenExpiresAt: Schema.optional(Schema.NullOr(Schema.DateFromSelf)),
  refreshTokenExpiresAt: Schema.optional(Schema.NullOr(Schema.DateFromSelf)),
  scope: Schema.optional(Schema.NullOr(Scope)),
  password: Schema.optional(Schema.NullOr(Password)),
  createdAt: Schema.optional(Schema.DateFromSelf),
  updatedAt: Schema.optional(Schema.DateFromSelf)
})

export type NewAccount = typeof NewAccount.Type
