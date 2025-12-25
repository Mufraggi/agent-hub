import { sql } from "drizzle-orm"
import { boolean, check, decimal, index, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { user } from "./auth"

export const agentTypeEnum = ["orchestrator", "worker", "specialist"] as const
export type AgentType = (typeof agentTypeEnum)[number]

export const agents = pgTable(
  "agents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    type: varchar("type", { length: 20 }).notNull(),
    description: text("description"),
    systemPrompt: text("system_prompt").notNull(),
    modelPreference: varchar("model_preference", { length: 50 })
      .default("claude-sonnet-4")
      .notNull(),
    temperature: decimal("temperature", { precision: 3, scale: 2 })
      .default("0.70")
      .notNull(),
    maxTokens: integer("max_tokens").default(4096).notNull(),

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
    typeCheck: check(
      "agent_type_check",
      sql`${table.type} IN ('orchestrator', 'worker', 'specialist')`
    ),
    temperatureCheck: check(
      "temperature_check",
      sql`${table.temperature} >= 0 AND ${table.temperature} <= 2`
    ),
    maxTokensCheck: check(
      "max_tokens_check",
      sql`${table.maxTokens} > 0`
    ),
    downloadsCheck: check(
      "downloads_check",
      sql`${table.downloadsCount} >= 0`
    ),
    forksCheck: check(
      "forks_check",
      sql`${table.forksCount} >= 0`
    ),
    starsCheck: check(
      "stars_check",
      sql`${table.starsCount} >= 0`
    ),
    createdByIdx: index("idx_agents_created_by").on(table.createdBy),
    isPublicIdx: index("idx_agents_is_public").on(table.isPublic),
    typeIdx: index("idx_agents_type").on(table.type)
  })
)

export type Agent = typeof agents.$inferSelect
export type NewAgent = typeof agents.$inferInsert
