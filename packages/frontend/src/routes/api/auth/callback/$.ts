import { auth } from "@/lib/auth/auth"
import { createFileRoute } from "@tanstack/react-router"

function handler({ request }: { request: Request }) {
  return auth.handler(request)
}

export const Route = createFileRoute("/api/auth/callback/$")({
  server: {
    handlers: {
      GET: handler,
      POST: handler
    }
  }
})
