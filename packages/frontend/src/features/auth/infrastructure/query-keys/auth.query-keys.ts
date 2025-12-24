/**
 * Query keys for auth-related queries
 */
export const authQueryKeys = {
  all: ["auth"] as const,
  session: () => [...authQueryKeys.all, "session"] as const,
  user: () => [...authQueryKeys.all, "user"] as const
}
