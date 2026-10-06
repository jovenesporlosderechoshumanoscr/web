import { db } from "@/server/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins/admin";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import * as schema from "@/server/db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
	  schema: schema,
    }),
	emailAndPassword: {
		enabled: true,
		disableSignUp: false
	},
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
	plugins: [admin(), tanstackStartCookies()],
  });
