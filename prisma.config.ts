import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// Prefer local developer env when running Prisma CLI locally.
loadEnv({ path: ".env.local" });
// Fallback to .env if .env.local is missing.
loadEnv();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
