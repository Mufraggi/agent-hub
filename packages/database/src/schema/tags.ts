import { sql } from "drizzle-orm"
import { check, index, integer, pgTable, primaryKey, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { agents } from "./agents"

import { skills } from "./skills"

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 50 }).notNull().unique(),
    category: varchar("category", { length: 50 }),
    usageCount: integer("usage_count").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  (table) => ({
    usageCheck: check(
      "usage_count_check",
      sql`${table.usageCount} >= 0`
    ),
    nameIdx: index("idx_tags_name").on(table.name),
    categoryIdx: index("idx_tags_category").on(table.category)
  })
)

// Agent Tags
export const agentTags = pgTable(
  "agent_tags",
  {
    agentId: uuid("agent_id")
      .references(() => agents.id, { onDelete: "cascade" })
      .notNull(),
    tagId: uuid("tag_id")
      .references(() => tags.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.agentId, table.tagId] })
  })
)

// Skill Tags
export const skillTags = pgTable(
  "skill_tags",
  {
    skillId: uuid("skill_id")
      .references(() => skills.id, { onDelete: "cascade" })
      .notNull(),
    tagId: uuid("tag_id")
      .references(() => tags.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.skillId, table.tagId] }),
    skillIdx: index("idx_skill_tags_skill").on(table.skillId),
    tagIdx: index("idx_skill_tags_tag").on(table.tagId)
  })
)

export type Tag = typeof tags.$inferSelect
export type NewTag = typeof tags.$inferInsert
export type AgentTag = typeof agentTags.$inferSelect
export type NewAgentTag = typeof agentTags.$inferInsert
export type SkillTag = typeof skillTags.$inferSelect
export type NewSkillTag = typeof skillTags.$inferInsert
