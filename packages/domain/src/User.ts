import { Schema } from "effect"
import { Email, ImageUrl, UserId, UserName } from "./UserType.js"

// User Schema
export const User = Schema.Struct({
  id: UserId,
  name: UserName,
  email: Email,
  emailVerified: Schema.Boolean,
  image: Schema.NullOr(ImageUrl),
  createdAt: Schema.DateFromSelf,
  updatedAt: Schema.DateFromSelf
})

export type User = typeof User.Type

// NewUser Schema (for insertion)
export const NewUser = Schema.Struct({
  id: UserId,
  name: UserName,
  email: Email,
  emailVerified: Schema.optional(Schema.Boolean),
  image: Schema.optional(Schema.NullOr(ImageUrl)),
  createdAt: Schema.optional(Schema.DateFromSelf),
  updatedAt: Schema.optional(Schema.DateFromSelf)
})

export type NewUser = typeof NewUser.Type
