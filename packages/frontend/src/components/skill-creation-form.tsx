import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { AVAILABLE_SKILLS_DATA, AVAILABLE_TAGS, SKILL_TEMPLATE } from "@/features/create/tmp/skill-template"
import { cn } from "@/lib/utils"
import { Check, FileText, Plus, X } from "lucide-react"
import { useId, useState } from "react"
import ReactMarkdown from "react-markdown"

export function SkillCreationForm() {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [skillContent, setSkillContent] = useState("")
  const [selectedDependencies, setSelectedDependencies] = useState<Array<string>>([])
  const [requiredDeps, setRequiredDeps] = useState<Set<string>>(new Set())
  const [selectedTags, setSelectedTags] = useState<Array<string>>([])
  const [isPublic, setIsPublic] = useState(true)
  const [tagInput, setTagInput] = useState("")
  const [openTagPopover, setOpenTagPopover] = useState(false)
  const [openDepPopover, setOpenDepPopover] = useState(false)

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value))
    }
  }

  const loadTemplate = () => {
    setSkillContent(SKILL_TEMPLATE)
  }

  const toggleDependency = (depId: string) => {
    setSelectedDependencies((prev) => (prev.includes(depId) ? prev.filter((id) => id !== depId) : [...prev, depId]))
  }

  const toggleRequired = (depId: string) => {
    setRequiredDeps((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(depId)) {
        newSet.delete(depId)
      } else {
        newSet.add(depId)
      }
      return newSet
    })
  }

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
    setOpenTagPopover(false)
  }

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  const handleSubmit = (isDraft: boolean) => {
    console.log({
      name,
      slug,
      description,
      skillContent,
      dependencies: selectedDependencies,
      requiredDeps: Array.from(requiredDeps),
      tags: selectedTags,
      isPublic,
      isDraft
    })
  }

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="skill-name">Name *</Label>
            <Input
              id={useId()}
              placeholder="TypeScript Best Practices"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="skill-slug">Slug</Label>
            <Input
              id={useId()}
              placeholder="typescript-best-practices"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="skill-description">Description</Label>
            <Textarea
              id={useId()}
              placeholder="What capability does this skill provide?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5"
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* Skill Content */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">SKILL.md Content</h2>
          <Button variant="outline" size="sm" onClick={loadTemplate}>
            <FileText className="w-4 h-4 mr-2" />
            Load Template
          </Button>
        </div>

        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="mt-4">
            <Textarea
              placeholder="# Skill Name..."
              value={skillContent}
              onChange={(e) => setSkillContent(e.target.value)}
              className="font-mono min-h-[400px]"
            />
            <p className="text-sm text-muted-foreground mt-2">{skillContent.length} characters (minimum 10)</p>
          </TabsContent>
          <TabsContent value="preview" className="mt-4">
            <div className="border rounded-lg p-4 min-h-[400px] prose prose-sm max-w-none dark:prose-invert">
              {skillContent ?
                <ReactMarkdown>{skillContent}</ReactMarkdown> :
                <p className="text-muted-foreground">No content to preview</p>}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Dependencies */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Skill Dependencies</h2>
        <p className="text-sm text-muted-foreground mb-4">Select other skills this skill needs</p>

        <Popover open={openDepPopover} onOpenChange={setOpenDepPopover}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Plus className="w-4 h-4 mr-2" />
              Add Dependency
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search skills..." />
              <CommandList>
                <CommandEmpty>No skills found.</CommandEmpty>
                <CommandGroup>
                  {AVAILABLE_SKILLS_DATA.map((skill) => (
                    <CommandItem
                      key={skill.id}
                      value={skill.name}
                      onSelect={() => {
                        toggleDependency(skill.id)
                        setOpenDepPopover(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedDependencies.includes(skill.id) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{skill.name}</div>
                        <div className="text-xs text-muted-foreground">{skill.description}</div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedDependencies.length > 0 && (
          <div className="mt-4 space-y-2">
            {selectedDependencies.map((depId) => {
              const skill = AVAILABLE_SKILLS_DATA.find((s) => s.id === depId)
              if (!skill) return null
              return (
                <div key={depId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{skill.name}</div>
                    <div className="text-sm text-muted-foreground">{skill.category}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`required-${depId}`} className="text-sm">
                        Required
                      </Label>
                      <Switch
                        id={`required-${depId}`}
                        checked={requiredDeps.has(depId)}
                        onCheckedChange={() => toggleRequired(depId)}
                      />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => toggleDependency(depId)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Tags & Visibility */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Tags & Visibility</h2>
        <div className="space-y-4">
          <div>
            <Label>Tags</Label>
            <Popover open={openTagPopover} onOpenChange={setOpenTagPopover}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start mt-1.5 bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tags
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search tags..." />
                  <CommandList>
                    <CommandEmpty>No tags found.</CommandEmpty>
                    <CommandGroup>
                      {AVAILABLE_TAGS.filter((tag) => !selectedTags.includes(tag)).map((tag) => (
                        <CommandItem
                          key={tag}
                          value={tag}
                          onSelect={() => addTag(tag)}
                        >
                          {tag}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="ml-2 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="public-toggle">Public</Label>
              <p className="text-sm text-muted-foreground">Make this skill visible to everyone</p>
            </div>
            <Switch id={useId()} checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 sticky bottom-4 bg-background pt-4 border-t">
        <Button variant="outline" className="flex-1 bg-transparent" onClick={() => handleSubmit(true)}>
          Save Draft
        </Button>
        <Button className="flex-1" onClick={() => handleSubmit(false)}>
          Publish Skill
        </Button>
      </div>
    </div>
  )
}
