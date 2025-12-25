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
import { agents } from "./agents"
import { user } from "./auth"

export const skills = pgTable(
  "skills",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    category: varchar("category", { length: 50 }).notNull(),
    description: text("description"),
    content: text("content").notNull(),

    // Metadata
    createdBy: text("created_by")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    isPublic: boolean("is_public").default(false).notNull(),
    version: varchar("version", { length: 20 }).default("1.0.0").notNull(),

    // Stats
    downloadsCount: integer("downloads_count").default(0).notNull(),
    starsCount: integer("stars_count").default(0).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
  },
  (table) => ({
    downloadsCheck: check(
      "skills_downloads_check",
      sql`${table.downloadsCount} >= 0`
    ),
    starsCheck: check(
      "skills_stars_check",
      sql`${table.starsCount} >= 0`
    ),
    createdByIdx: index("idx_skills_created_by").on(table.createdBy),
    isPublicIdx: index("idx_skills_is_public").on(table.isPublic),
    categoryIdx: index("idx_skills_category").on(table.category)
  })
)

// Skill Dependencies (self-referencing)
export const skillDependencies = pgTable(
  "skill_dependencies",
  {
    skillId: uuid("skill_id")
      .references(() => skills.id, { onDelete: "cascade" })
      .notNull(),
    dependsOnSkillId: uuid("depends_on_skill_id")
      .references(() => skills.id, { onDelete: "cascade" })
      .notNull(),
    isRequired: boolean("is_required").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.skillId, table.dependsOnSkillId] }),
    selfRefCheck: check(
      "skill_self_ref_check",
      sql`${table.skillId} != ${table.dependsOnSkillId}`
    ),
    skillIdx: index("idx_skill_deps_skill").on(table.skillId),
    dependsIdx: index("idx_skill_deps_depends").on(table.dependsOnSkillId)
  })
)

// Agent-Skills many-to-many
export const agentSkills = pgTable(
  "agent_skills",
  {
    agentId: uuid("agent_id")
      .references(() => agents.id, { onDelete: "cascade" })
      .notNull(),
    skillId: uuid("skill_id")
      .references(() => skills.id, { onDelete: "cascade" })
      .notNull(),
    loadOrder: integer("load_order").notNull(),
    isRequired: boolean("is_required").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.agentId, table.skillId] }),
    loadOrderCheck: check(
      "load_order_check",
      sql`${table.loadOrder} > 0`
    ),
    agentIdx: index("idx_agent_skills_agent").on(table.agentId),
    skillIdx: index("idx_agent_skills_skill").on(table.skillId)
  })
)

export type Skill = typeof skills.$inferSelect
export type NewSkill = typeof skills.$inferInsert
export type SkillDependency = typeof skillDependencies.$inferSelect
export type NewSkillDependency = typeof skillDependencies.$inferInsert
export type AgentSkill = typeof agentSkills.$inferSelect
export type NewAgentSkill = typeof agentSkills.$inferInsert
