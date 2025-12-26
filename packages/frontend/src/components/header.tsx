import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth/auth-client"
import { Link, useNavigate } from "@tanstack/react-router"
import { Plus, Search, User } from "lucide-react"

export default function() {
  const { data: session } = authClient.useSession()
  const navigate = useNavigate()

  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => navigate({ to: "/login" })
      }
    })
  }

  if (!session) {
    return (
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-sm z-50 w-full">
        <div className="flex h-16 items-center justify-between px-6 w-full">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              AI
            </div>
            <span className="font-bold text-xl">Agent Hub</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Connexion</Link>
            </Button>
            <Button asChild>
              <Link to="/sign-up">Inscription</Link>
            </Button>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6 w-full">
        {/* Logo - Left */}
        <div className="flex-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 font-semibold text-xl w-fit"
          >
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              AI
            </div>
            <span className="hidden sm:inline-block">Agent Hub</span>
          </Link>
        </div>

        {/* Search + Partager - Center */}
        <div className="flex items-center gap-2 flex-1 justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher des agents, workflows..."
              className="pl-10 w-full"
            />
          </div>
          <Button asChild className="shrink-0">
            <Link to="/create">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Créer</span>
            </Link>
          </Button>
        </div>

        {/* Actions - Right */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <User className="h-5 w-5" />
              <span className="sr-only">Profil</span>
            </Link>
          </Button>

          <Button variant="ghost" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
