import { Button } from "@/components/ui/button"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Users,
  Heart,
  Bookmark,
  Search,
  UserPlus,
  Star,
  TrendingUp,
  Share2,
  Sparkles,
  Code,
  Bot,
  Layers,
  Eye,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder"

// =============================================================================
// Types
// =============================================================================

export interface Contribution {
  id: string
  title: string
  description: string
  author: string
  authorEmail: string
  category: string
  tags: string[]
  likes: number
  views: number
  type: "skill" | "architecture" | "prompt"
  createdAt: string
}

// =============================================================================
// Data
// =============================================================================

export const categories = [
  "All",
  "Agent Skills",
  "Architectures",
  "Prompts",
  "Workflows",
  "Integrations",
  "Templates",
]

export const mockContributions: Contribution[] = [
  {
    id: "1",
    title: "Advanced Code Review Skill",
    description:
      "A comprehensive skill file for code review agents. Includes security analysis, performance suggestions, and best practices checking.",
    author: "Sarah Chen",
    authorEmail: "sarah.chen@example.com",
    category: "Agent Skills",
    tags: ["code-review", "security", "best-practices"],
    likes: 342,
    views: 1420,
    type: "skill",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Multi-Agent RAG Architecture",
    description:
      "Complete architecture for building retrieval-augmented generation systems with multiple specialized sub-agents working together.",
    author: "Alex Johnson",
    authorEmail: "alex.j@example.com",
    category: "Architectures",
    tags: ["RAG", "multi-agent", "knowledge-base"],
    likes: 256,
    views: 980,
    type: "architecture",
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    title: "Database Expert Prompt",
    description:
      "Expertly crafted prompt for transforming any LLM into a database specialist. Covers SQL optimization, schema design, and migrations.",
    author: "Emma Wilson",
    authorEmail: "emma.w@example.com",
    category: "Prompts",
    tags: ["database", "SQL", "optimization"],
    likes: 489,
    views: 2030,
    type: "prompt",
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    title: "API Documentation Generator",
    description:
      "Skill file that enables agents to analyze codebases and generate comprehensive API documentation with examples.",
    author: "Mike Rivera",
    authorEmail: "mike.r@example.com",
    category: "Agent Skills",
    tags: ["documentation", "API", "automation"],
    likes: 198,
    views: 760,
    type: "skill",
    createdAt: "2024-01-12",
  },
  {
    id: "5",
    title: "Test-Driven Development Architecture",
    description:
      "Architecture blueprint for agents that follow TDD principles. Includes test generation, implementation, and refactoring workflows.",
    author: "Lisa Zhang",
    authorEmail: "lisa.z@example.com",
    category: "Architectures",
    tags: ["TDD", "testing", "development"],
    likes: 412,
    views: 1870,
    type: "architecture",
    createdAt: "2024-01-11",
  },
  {
    id: "6",
    title: "Research Assistant Prompt",
    description:
      "A versatile prompt that turns your agent into a research assistant capable of synthesizing information from multiple sources.",
    author: "David Park",
    authorEmail: "david.p@example.com",
    category: "Prompts",
    tags: ["research", "summarization", "analysis"],
    likes: 367,
    views: 1340,
    type: "prompt",
    createdAt: "2024-01-10",
  },
]

const featuredContributions = mockContributions.slice(0, 3)
const totalLikes = mockContributions.reduce((acc, c) => acc + c.likes, 0)

const features = [
  {
    icon: Search,
    title: "Explore the Hub",
    description:
      "Powerful search engine to filter the best skills and agent architectures by tags or categories.",
  },
  {
    icon: Share2,
    title: "Contribute",
    description:
      "Publish your own .md files. Share your technical discoveries and help the community build better AI agents.",
  },
  {
    icon: UserPlus,
    title: "Build Your Network",
    description:
      "Like the best tools, save your favorites, and follow the most inspiring developers.",
  },
  {
    icon: Heart,
    title: "Community Curation",
    description:
      "The best contributions rise to the top through community votes and engagement.",
  },
  {
    icon: Bookmark,
    title: "Personal Collections",
    description:
      "Save and organize your favorite skills and architectures for quick access.",
  },
  {
    icon: TrendingUp,
    title: "Trending Discoveries",
    description:
      "Stay up to date with the latest and most popular contributions from the community.",
  },
]

const contentTypes = [
  {
    icon: Bot,
    title: "Agent Skills",
    description:
      "Specialized .md files that define capabilities and behaviors for AI agents to accomplish specific tasks.",
    colorClass: "bg-blue-500/10 text-blue-500",
    dotClass: "bg-blue-500",
    items: [
      "Code analysis & review",
      "Data transformation",
      "Content generation",
      "Task automation",
    ],
  },
  {
    icon: Layers,
    title: "Architectures",
    description:
      "Complete blueprints for building multi-agent systems with well-defined roles and interactions.",
    colorClass: "bg-green-500/10 text-green-500",
    dotClass: "bg-green-500",
    items: [
      "Multi-agent setups",
      "RAG systems",
      "Pipeline designs",
      "Orchestration patterns",
    ],
  },
  {
    icon: Code,
    title: "Prompts & Templates",
    description:
      "Battle-tested prompts and templates that unlock specific capabilities in your AI agents.",
    colorClass: "bg-purple-500/10 text-purple-500",
    dotClass: "bg-purple-500",
    items: [
      "System prompts",
      "Task templates",
      "Few-shot examples",
      "Persona definitions",
    ],
  },
]

const footerLinks = {
  platform: [
    { label: "Explore", href: "/" },
    { label: "Trending", href: "/" },
    { label: "Categories", href: "/" },
  ],
  community: [
    { label: "Contributors", href: "/" },
    { label: "Discord", href: "/" },
    { label: "GitHub", href: "/" },
  ],
  resources: [
    { label: "Getting Started", href: "/" },
    { label: "How to Contribute", href: "/" },
    { label: "Best Practices", href: "/" },
  ],
}

// =============================================================================
// Components
// =============================================================================

function HeroSection() {
  return (
    <section className="py-20 md:py-32 px-4">
      <div className="container max-w-5xl mx-auto text-center">
        <Badge className="mb-4" variant="secondary">
          <Users className="h-3 w-3 mr-1" />
          Community Platform
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
          Share and discover
          <span className="text-primary"> developer .md files</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto">
          The community hub where developers share skills, architectures, and prompts
          for building better AI agents. Contribute your discoveries, follow inspiring
          creators, and accelerate your development.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/sign-up">
              <Share2 className="h-4 w-4 mr-2" />
              Share your files
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/sign-up">
              <Search className="h-4 w-4 mr-2" />
              Explore the hub
            </Link>
          </Button>
        </div>

        {/* Visual preview */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-muted/50 rounded-lg p-6 text-left border">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <FileText className="h-5 w-5" />
              <span className="font-medium">code-review-skill.md</span>
              <Badge variant="secondary" className="ml-auto">Skill</Badge>
            </div>
            <div className="bg-background rounded px-4 py-3 font-mono text-sm text-muted-foreground">
              <p className="text-foreground mb-2"># Code Review Skill</p>
              <p className="mb-2">You are an expert code reviewer...</p>
              <p className="text-primary">## Capabilities</p>
              <p>- Security analysis</p>
              <p>- Performance suggestions</p>
              <p className="text-muted-foreground/50">...</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
          <div>
            <p className="text-3xl font-bold">{mockContributions.length * 100}+</p>
            <p className="text-sm text-muted-foreground">Files shared</p>
          </div>
          <div>
            <p className="text-3xl font-bold">2.5K+</p>
            <p className="text-sm text-muted-foreground">Contributors</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{(totalLikes / 100).toFixed(1)}K+</p>
            <p className="text-sm text-muted-foreground">Likes given</p>
          </div>
          <div>
            <p className="text-3xl font-bold">50+</p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The developer experience
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to discover, share, and build a community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContentTypesSection() {
  return (
    <section className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What you can share
          </h2>
          <p className="text-lg text-muted-foreground">
            From simple prompts to complete multi-agent architectures
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {contentTypes.map((type) => (
            <Card key={type.title} className="border-2">
              <CardHeader>
                <div
                  className={`h-12 w-12 ${type.colorClass} rounded-lg flex items-center justify-center mb-2`}
                >
                  <type.icon className="h-6 w-6" />
                </div>
                <CardTitle>{type.title}</CardTitle>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {type.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${type.dotClass}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContributionCard({ contribution }: { contribution: Contribution }) {
  const typeConfig = {
    skill: { icon: Bot, label: "Skill", variant: "default" as const },
    architecture: { icon: Layers, label: "Architecture", variant: "secondary" as const },
    prompt: { icon: Code, label: "Prompt", variant: "outline" as const },
  }
  const config = typeConfig[contribution.type]

  return (
    <Card className="hover:border-primary transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge variant={config.variant}>
            <config.icon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {contribution.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {contribution.likes}
            </span>
          </div>
        </div>
        <CardTitle className="text-xl">{contribution.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {contribution.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-3">
          <AvatarPlaceholder value={contribution.authorEmail} size={32} />
          <div>
            <span className="text-sm font-medium">{contribution.author}</span>
            <p className="text-xs text-muted-foreground">Contributor</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {contribution.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function FeaturedSection() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trending this week
          </h2>
          <p className="text-lg text-muted-foreground">
            Most liked contributions from the community
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {featuredContributions.map((contribution) => (
            <ContributionCard key={contribution.id} contribution={contribution} />
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link to="/">
              <Search className="h-4 w-4 mr-2" />
              Explore all contributions
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="container max-w-4xl mx-auto">
        <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl md:text-4xl mb-4">
              Ready to join the community?
            </CardTitle>
            <CardDescription className="text-lg">
              Share your skills, discover amazing contributions, and connect with
              developers building the future of AI agents.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
            <Button size="lg" asChild>
              <Link to="/sign-up">
                <UserPlus className="h-4 w-4 mr-2" />
                Create an account
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">
                <Star className="h-4 w-4 mr-2" />
                Sign in
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6" />
              <span className="font-bold text-lg">SkillHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              The community platform for developers to share and discover AI agent skills.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerLinks.community.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 SkillHub. Built by developers, for developers.</p>
        </div>
      </div>
    </footer>
  )
}

// =============================================================================
// Route & Main Component
// =============================================================================

export const Route = createFileRoute("/")({ component: HomePage })

function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
        <FeaturesSection />
        <ContentTypesSection />
        <FeaturedSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
