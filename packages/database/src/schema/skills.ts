// src/db/schema/skills.ts
import { relations, sql } from "drizzle-orm"
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

export const skills = pgTable(
  "skills",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    description: text("description"),

    // Le contenu du SKILL.md
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
    downloadsCheck: check("skills_downloads_check", sql`${table.downloadsCount} >= 0`),
    starsCheck: check("skills_stars_check", sql`${table.starsCount} >= 0`),
    createdByIdx: index("idx_skills_created_by").on(table.createdBy),
    isPublicIdx: index("idx_skills_is_public").on(table.isPublic)
  })
)

export const skillsRelations = relations(skills, ({ one, many }) => ({
  creator: one(user, {
    fields: [skills.createdBy],
    references: [user.id]
  }),
  dependencies: many(skillDependencies, { relationName: "skill" }),
  dependents: many(skillDependencies, { relationName: "dependency" })
}))

// Skill Dependencies (un skill peut dépendre d'autres skills)
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

export const skillDependenciesRelations = relations(skillDependencies, ({ one }) => ({
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
}))
