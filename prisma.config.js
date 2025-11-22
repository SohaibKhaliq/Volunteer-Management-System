import { defineConfig, env } from "prisma/config";
import 'dotenv/config';

export default defineConfig({
  // schema path if needed:
  // schema: "prisma/schema.prisma",
  
  migrations: {
    path: "prisma/migrations",
  },
  
  datasource: {
    // This is the key Prisma expects for migrations
    url: env("DATABASE_URL"),
    // optional: shadowDatabaseUrl if using shadow DB
  },
  
  generators: {
    client: {
      provider: "prisma-client-js",
    },
  },
});
