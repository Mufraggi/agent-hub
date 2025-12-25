import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"
import * as authSchema from "./schema/auth.js"
import * as agentsSchema from "./schema/agents.js"
import * as skillsSchema from "./schema/skills.js"
import * as tagsSchema from "./schema/tags.js"
import * as relationsSchema from "./schema/relations.js"

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
})

export const db = drizzle(pool, {
  schema: {
    ...authSchema,
    ...agentsSchema,
    ...skillsSchema,
    ...tagsSchema,
    ...relationsSchema
  }
})
