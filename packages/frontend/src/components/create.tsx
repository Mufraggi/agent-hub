import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { SkillCreationForm } from "./skill-creation-form"

export default function() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Resource</h1>
          <p className="text-muted-foreground mt-2">Share your skills and sub-agents with the Claude Code community</p>
        </div>

        <Tabs defaultValue="skill" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="skill">Create Skill</TabsTrigger>
            <TabsTrigger value="sub-agent">Create Sub-Agent</TabsTrigger>
          </TabsList>
          <TabsContent value="skill">
            <SkillCreationForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
