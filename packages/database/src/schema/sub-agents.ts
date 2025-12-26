import { sql } from "drizzle-orm"
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar
} from "drizzle-orm/pg-core"
import { user } from "./auth"

// Sub-agents = Agents spécialisés avec leur propre config
export const subAgents = pgTable(
  "sub_agents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    description: text("description"),

    // Configuration YAML front-matter
    model: varchar("model", { length: 50 }).default("claude-sonnet-4").notNull(),
    permissionMode: varchar("permission_mode", { length: 20 }).default("read_write").notNull(),

    // Instructions système (après le front-matter YAML)
    systemInstructions: text("system_instructions").notNull(),

    // Metadata
    createdBy: text("created_by")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    isPublic: boolean("is_public").default(false).notNull(),
    version: varchar("version", { length: 20 }).default("1.0.0").notNull(),

    // Stats
    downloadsCount: integer("downloads_count").default(0).notNull(),
    forksCount: integer("forks_count").default(0).notNull(),
    starsCount: integer("stars_count").default(0).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
  },
  (table) => ({
    permissionCheck: check(
      "permission_mode_check",
      sql`${table.permissionMode} IN ('read_only', 'read_write')`
    ),
    downloadsCheck: check("subagents_downloads_check", sql`${table.downloadsCount} >= 0`),
    forksCheck: check("subagents_forks_check", sql`${table.forksCount} >= 0`),
    starsCheck: check("subagents_stars_check", sql`${table.starsCount} >= 0`),
    createdByIdx: index("idx_subagents_created_by").on(table.createdBy),
    isPublicIdx: index("idx_subagents_is_public").on(table.isPublic)
  })
)

// Sub-Agent Skills (many-to-many) - FK vers skills sera ajoutée après import
export const subAgentSkills = pgTable(
  "sub_agent_skills",
  {
    subAgentId: uuid("sub_agent_id")
      .references(() => subAgents.id, { onDelete: "cascade" })
      .notNull(),
    skillId: uuid("skill_id").notNull(), // FK ajoutée via migration manuelle ou relations
    loadOrder: integer("load_order").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.subAgentId, table.skillId] }),
    loadOrderCheck: check("subagent_skills_load_order_check", sql`${table.loadOrder} > 0`),
    subAgentIdx: index("idx_subagent_skills_subagent").on(table.subAgentId),
    skillIdx: index("idx_subagent_skills_skill").on(table.skillId)
  })
)

export type SubAgent = typeof subAgents.$inferSelect
export type NewSubAgent = typeof subAgents.$inferInsert
export type SubAgentSkill = typeof subAgentSkills.$inferSelect
export type NewSubAgentSkill = typeof subAgentSkills.$inferInsert
