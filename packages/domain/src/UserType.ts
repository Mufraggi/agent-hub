import { Schema } from "effect"

// Branded types for User
export const UserId = Schema.String.pipe(Schema.brand("UserId"))
export type UserId = typeof UserId.Type

export const UserName = Schema.String.pipe(Schema.brand("UserName"))
export type UserName = typeof UserName.Type

export const Email = Schema.String.pipe(Schema.brand("Email"))
export type Email = typeof Email.Type

export const ImageUrl = Schema.String.pipe(Schema.brand("ImageUrl"))
export type ImageUrl = typeof ImageUrl.Type
