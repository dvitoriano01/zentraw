import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// For development/testing purposes, use a mock if DATABASE_URL is not properly configured
let pool: Pool;
let db: any;

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost')) {
  console.warn('⚠️  Using mock database for development/testing - Blender functionality will work but data persistence is disabled');
  
  // Create a mock pool and db for testing
  pool = {} as Pool;
  db = {
    select: () => ({ from: () => ({ where: () => Promise.resolve([]) }) }),
    insert: () => ({ values: () => Promise.resolve({ insertId: 1 }) }),
    update: () => ({ set: () => ({ where: () => Promise.resolve() }) }),
    delete: () => ({ where: () => Promise.resolve() })
  };
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { pool, db };