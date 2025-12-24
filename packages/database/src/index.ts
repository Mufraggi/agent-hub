import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as authSchema from "./schema/auth";

const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema: authSchema });

export * from "./schema/auth";
