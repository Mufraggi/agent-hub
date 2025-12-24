import { useMemo } from "react"
import { Avatar, AvatarFallback } from "./avatar"

type AvatarPlaceholderProps = {
  value: string
  size?: number
  className?: string
}

// Generate a consistent color based on the string value
function stringToColor(str: string): string {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-sky-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-fuchsia-500",
    "bg-pink-500",
    "bg-rose-500",
  ]

  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

// Get initials from email or name
function getInitials(value: string): string {
  if (value.includes("@")) {
    // It's an email, use first letter of local part
    return value.split("@")[0].charAt(0).toUpperCase()
  }
  // It's a name, use first letters of first two words
  const words = value.split(" ").filter(Boolean)
  if (words.length >= 2) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
  }
  return value.charAt(0).toUpperCase()
}

export function AvatarPlaceholder({
  value,
  size = 32,
  className = "",
}: AvatarPlaceholderProps) {
  const colorClass = useMemo(() => stringToColor(value), [value])
  const initials = useMemo(() => getInitials(value), [value])

  return (
    <Avatar
      className={className}
      style={{ width: size, height: size }}
    >
      <AvatarFallback
        className={`${colorClass} text-white font-medium`}
        style={{ fontSize: size * 0.4 }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
