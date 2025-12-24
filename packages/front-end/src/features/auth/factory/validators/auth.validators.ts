import { Schema, Either, Option } from "effect"
import { ArrayFormatter } from "effect/ParseResult"
import { Email, StrongPassword, UserName } from "../../schema"

/**
 * Validates email and returns Option with error message
 * Using Option.Option<string> instead of string | undefined
 */
export const validateEmail = (value: string): Option.Option<string> => {
  const result = Schema.decodeUnknownEither(Email)(value)
  if (Either.isLeft(result)) {
    const errors = ArrayFormatter.formatErrorSync(result.left)
    const firstError = errors[0]
    return firstError ? Option.some(firstError.message) : Option.none()
  }
  return Option.none()
}

/**
 * Validates password and returns Option with error message
 */
export const validatePassword = (value: string): Option.Option<string> => {
  const result = Schema.decodeUnknownEither(StrongPassword)(value)
  if (Either.isLeft(result)) {
    const errors = ArrayFormatter.formatErrorSync(result.left)
    const firstError = errors[0]
    return firstError ? Option.some(firstError.message) : Option.none()
  }
  return Option.none()
}

/**
 * Validates name and returns Option with error message
 */
export const validateName = (value: string): Option.Option<string> => {
  const result = Schema.decodeUnknownEither(UserName)(value)
  if (Either.isLeft(result)) {
    const errors = ArrayFormatter.formatErrorSync(result.left)
    const firstError = errors[0]
    return firstError ? Option.some(firstError.message) : Option.none()
  }
  return Option.none()
}

/**
 * Adapter for TanStack Form validators
 * Converts Option<string> to string | undefined for compatibility
 */
export const toFormValidator =
  (validator: (value: string) => Option.Option<string>) =>
  (value: string): string | null =>
    Option.getOrNull(validator(value))
