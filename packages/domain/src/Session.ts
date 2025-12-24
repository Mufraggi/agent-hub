import { Schema } from "effect"
import { IpAddress, SessionId, SessionToken, UserAgent, UserId } from "./SessionType.js"

// Session Schema
export const Session = Schema.Struct({
  id: SessionId,
  expiresAt: Schema.DateFromSelf,
  token: SessionToken,
  createdAt: Schema.DateFromSelf,
  updatedAt: Schema.DateFromSelf,
  ipAddress: Schema.NullOr(IpAddress),
  userAgent: Schema.NullOr(UserAgent),
  userId: UserId
})

export type Session = typeof Session.Type

// NewSession Schema (for insertion)
export const NewSession = Schema.Struct({
  id: SessionId,
  expiresAt: Schema.DateFromSelf,
  token: SessionToken,
  userId: UserId,
  createdAt: Schema.optional(Schema.DateFromSelf),
  updatedAt: Schema.optional(Schema.DateFromSelf),
  ipAddress: Schema.optional(Schema.NullOr(IpAddress)),
  userAgent: Schema.optional(Schema.NullOr(UserAgent))
})

export type NewSession = typeof NewSession.Type
