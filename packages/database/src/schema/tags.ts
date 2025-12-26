import { sql } from "drizzle-orm"
import { check, index, integer, pgTable, primaryKey, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 50 }).notNull().unique(),
    usageCount: integer("usage_count").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  (table) => ({
    usageCheck: check("usage_count_check", sql`${table.usageCount} >= 0`),
    nameIdx: index("idx_tags_name").on(table.name)
  })
)

// Skill Tags - FK vers skills ajoutée via relations
export const skillTags = pgTable(
  "skill_tags",
  {
    skillId: uuid("skill_id").notNull(),
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

// Sub-Agent Tags - FK vers subAgents ajoutée via relations
export const subAgentTags = pgTable(
  "sub_agent_tags",
  {
    subAgentId: uuid("sub_agent_id").notNull(),
    tagId: uuid("tag_id")
      .references(() => tags.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.subAgentId, table.tagId] })
  })
)

export type Tag = typeof tags.$inferSelect
export type NewTag = typeof tags.$inferInsert
export type SkillTag = typeof skillTags.$inferSelect
export type NewSkillTag = typeof skillTags.$inferInsert
export type SubAgentTag = typeof subAgentTags.$inferSelect
export type NewSubAgentTag = typeof subAgentTags.$inferInsert
