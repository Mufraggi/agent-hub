import Create from "@/components/create"
import { authMiddleware } from "@/lib/middleware"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/create")({
  component: RouteComponent,
  server: {
    middleware: [authMiddleware],
  },
})

function RouteComponent() {
  return (
    <main className="flex flex-col items-center justify-center pt-20">
      <Create />
    </main>
  )
}
