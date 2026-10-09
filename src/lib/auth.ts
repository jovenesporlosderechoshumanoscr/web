import { db } from "@/server/db";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/server/email";
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
		disableSignUp: false,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			await sendPasswordResetEmail({ to: user.email, url })
		},
	},
	emailVerification: {
		sendOnSignUp: true,
		sendOnSignIn: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			await sendVerificationEmail({ to: user.email, url })
		},
	},
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
	plugins: [admin(), tanstackStartCookies()],
  });
