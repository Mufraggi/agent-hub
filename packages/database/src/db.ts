import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"
import * as authSchema from "./schema/auth"
import * as skillsSchema from "./schema/skills"
import * as tagsSchema from "./schema/tags"
import * as subAgentsSchema from "./schema/sub-agents"

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
})

export const db = drizzle(pool, {
  schema: {
    ...authSchema,
    ...skillsSchema,
    ...tagsSchema,
    ...subAgentsSchema
  }
})
