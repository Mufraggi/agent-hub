import { Schema } from "effect"
import { VerificationId, VerificationIdentifier, VerificationValue } from "./VerificationType.js"

// Verification Schema
export const Verification = Schema.Struct({
  id: VerificationId,
  identifier: VerificationIdentifier,
  value: VerificationValue,
  expiresAt: Schema.DateFromSelf,
  createdAt: Schema.DateFromSelf,
  updatedAt: Schema.DateFromSelf
})

export type Verification = typeof Verification.Type

// NewVerification Schema (for insertion)
export const NewVerification = Schema.Struct({
  id: VerificationId,
  identifier: VerificationIdentifier,
  value: VerificationValue,
  expiresAt: Schema.DateFromSelf,
  createdAt: Schema.optional(Schema.DateFromSelf),
  updatedAt: Schema.optional(Schema.DateFromSelf)
})

export type NewVerification = typeof NewVerification.Type
