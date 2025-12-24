import { Schema } from "effect"
import { UserId } from "./UserType.js"

// Branded types for Session
export const SessionId = Schema.String.pipe(Schema.brand("SessionId"))
export type SessionId = typeof SessionId.Type

export const SessionToken = Schema.String.pipe(Schema.brand("SessionToken"))
export type SessionToken = typeof SessionToken.Type

export const IpAddress = Schema.String.pipe(Schema.brand("IpAddress"))
export type IpAddress = typeof IpAddress.Type

export const UserAgent = Schema.String.pipe(Schema.brand("UserAgent"))
export type UserAgent = typeof UserAgent.Type

// Re-export UserId for convenience
export { UserId }
