import { Schema } from "effect"

// Branded types for Verification
export const VerificationId = Schema.String.pipe(Schema.brand("VerificationId"))
export type VerificationId = typeof VerificationId.Type

export const VerificationIdentifier = Schema.String.pipe(Schema.brand("VerificationIdentifier"))
export type VerificationIdentifier = typeof VerificationIdentifier.Type

export const VerificationValue = Schema.String.pipe(Schema.brand("VerificationValue"))
export type VerificationValue = typeof VerificationValue.Type
