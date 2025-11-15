import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export const db = drizzle(env.DB, { schema });

export const DatabaseProviderToken = Symbol("DATABASE_TOKEN");
export type DatabaseProvider = typeof db;
