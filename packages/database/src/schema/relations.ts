import { relations } from "drizzle-orm"
import { agents } from "./agents"
import { user } from "./auth"
import { agentSkills, skillDependencies, skills } from "./skills"
import { agentTags, skillTags, tags } from "./tags"

// User relations
export const userRelations = relations(user, ({ many }) => ({
  agents: many(agents),
  skills: many(skills)
}))

// Agent relations
export const agentsRelations = relations(agents, ({ one, many }) => ({
  creator: one(user, {
    fields: [agents.createdBy],
    references: [user.id]
  }),
  skills: many(agentSkills),
  tags: many(agentTags)
}))

// Skill relations
export const skillsRelations = relations(skills, ({ one, many }) => ({
  creator: one(user, {
    fields: [skills.createdBy],
    references: [user.id]
  }),
  dependencies: many(skillDependencies, { relationName: "skill" }),
  dependents: many(skillDependencies, { relationName: "dependency" }),
  agents: many(agentSkills),
  tags: many(skillTags)
}))

export const skillDependenciesRelations = relations(
  skillDependencies,
  ({ one }) => ({
    skill: one(skills, {
      fields: [skillDependencies.skillId],
      references: [skills.id],
      relationName: "skill"
    }),
    dependency: one(skills, {
      fields: [skillDependencies.dependsOnSkillId],
      references: [skills.id],
      relationName: "dependency"
    })
  })
)

export const agentSkillsRelations = relations(agentSkills, ({ one }) => ({
  agent: one(agents, {
    fields: [agentSkills.agentId],
    references: [agents.id]
  }),
  skill: one(skills, {
    fields: [agentSkills.skillId],
    references: [skills.id]
  })
}))

// Tag relations
export const tagsRelations = relations(tags, ({ many }) => ({
  agents: many(agentTags),
  skills: many(skillTags)
}))

export const agentTagsRelations = relations(agentTags, ({ one }) => ({
  agent: one(agents, {
    fields: [agentTags.agentId],
    references: [agents.id]
  }),
  tag: one(tags, {
    fields: [agentTags.tagId],
    references: [tags.id]
  })
}))

export const skillTagsRelations = relations(skillTags, ({ one }) => ({
  skill: one(skills, {
    fields: [skillTags.skillId],
    references: [skills.id]
  }),
  tag: one(tags, {
    fields: [skillTags.tagId],
    references: [tags.id]
  })
}))
